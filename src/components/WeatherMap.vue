<template>
	<div class="weather-map">
		<!-- Контролі для введення координат та кнопки -->
		<div class="map-controls q-py-md">
			<div class="row q-gutter-md">
				<q-input v-model.number="lat" label="Широта (lat)" type="number" />
				<q-input v-model.number="lon" label="Довгота (lon)" type="number" />
				<q-btn color="primary" @click="searchByCoords">Пошук</q-btn>
				<q-btn color="secondary" @click="getCurrentLocation">Моє місце</q-btn>
			</div>
		</div>
		
		<!-- Контейнер для карти -->
		<div class="map-container">
			<div ref="mapRef" class="full-height-map"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet' // Імпорт бібліотеки Leaflet для роботи з картою
import 'leaflet/dist/leaflet.css' // Імпорт стилів для Leaflet
import { weatherApiService } from '../services/weather-api'

const emit = defineEmits(['weather-found', 'error']) // Визначаємо пропси для отримання даних про погоду та помилки від батьківського компонента

// Рефи для збереження координат та посилання на контейнер карти
const lat = ref(null)
const lon = ref(null)

const mapRef = ref(null) // Реф для контейнера карти, щоб ініціалізувати Leaflet на цьому елементі
let map = null // Змінна для збереження екземпляра карти
let marker = null // Змінна для збереження маркера, щоб можна було його оновлювати при нових кліках

// Налаштування іконок для Leaflet (щоб вони коректно відображались)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Треба вказати правильні шляхи до іконок, оскільки Leaflet за замовчуванням шукає їх у своїй папці, а ми використовуємо їх через імпорт
delete L.Icon.Default.prototype._getIconUrl // Видаляємо стандартний метод отримання URL іконок, щоб використовувати наші імпортовані
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow
})

// Ініціалізація карти при монтуванні компонента
onMounted(() => {
	// Ініціалізуємо карту
	map = L.map(mapRef.value).setView([50.4501, 30.5234], 6) // Київ як центр
	
	// Додаємо тайли OpenStreetMap
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap contributors'
	}).addTo(map)
	
	// Додаємо обробник кліку по карті для отримання координат
	map.on('click', (e) => {
		// Отримуємо координати кліку та зберігаємо їх у рефах
		const { lat: clickLat, lng: clickLon } = e.latlng
		
		// Округлюємо координати до 4 знаків після коми для кращого вигляду
		lat.value = Number(clickLat.toFixed(4))
		lon.value = Number(clickLon.toFixed(4))
		
		// Оновлюємо позицію маркера на карті
		updateMarker(clickLat, clickLon)

		// Автоматично робимо пошук
		searchByCoords()
	})
})

// Очищення карти при розмонтуванні компонента
onUnmounted(() => {
	if (map) {
		map.remove()
	}
})

// Функція для оновлення позиції маркера на карті
function updateMarker(lati, long) {
	if (marker) {
		marker.setLatLng([lati, long]) // Якщо маркер вже існує, просто оновлюємо його позицію
	} else {
		marker = L.marker([lati, long]).addTo(map) // Якщо маркера ще немає, створюємо новий
	}
}

// Функція для пошуку погоди за координатами
async function searchByCoords() {
	// Валідація: перевіряємо, що користувач ввів координати
	if (lat.value === null || lon.value === null) {
        emit('error', 'Будь ласка, введіть координати')
        return
    }

	try {
		const weatherData = await weatherApiService.getCurrentWeatherByCoords(lat.value, lon.value) // Викликаємо сервіс для отримання погоди по координатах, передаючи введені користувачем значення
		emit('weather-found', weatherData) // Передаємо знайдену погоду в батьківський компонент
	} catch (err) {
		emit('error', err.message) // Передаємо текст помилки в батьківський компонент
	}
}

// Функція для отримання поточного місця користувача
function getCurrentLocation() {
	// Перевіряємо, чи підтримує браузер геолокацію
	if (navigator.geolocation) {
		// Запитуємо координати користувача
		navigator.geolocation.getCurrentPosition(
			(position) => {
				// Отримуємо координати користувача
				const { latitude, longitude } = position.coords
				
				// Округлюємо до 4 знаків після коми для кращого вигляду
				lat.value = Number(latitude.toFixed(4))
				lon.value = Number(longitude.toFixed(4))
				
				// Переміщуємо карту на користувача та встановлюємо більший зум для кращого огляду
				if (map) {
					map.setView([latitude, longitude], 10) // Зум 10 для більш детального перегляду місця користувача
					updateMarker(latitude, longitude) // Оновлюємо позицію маркера на карті, щоб він показував місце користувача
				}
				
				searchByCoords() // Автоматично робимо пошук погоди за координатами користувача після отримання їх геолокації
			},
			(error) => {
				emit('error', 'Не вдалося отримати геолокацію: ' + error.message) // Передаємо текст помилки в батьківський компонент
			}
		)
	} else {
		emit('error', 'Геолокація не підтримується вашим браузером') // Передаємо текст помилки в батьківський компонент
	}
}
</script>

<style scoped>
.weather-map {
	display: flex;
	flex-direction: column;
	height: 50vh; /* Фіксована висота */
	width: 100%;
}

.map-container {
	flex-grow: 1;
	min-height: 300px; /* Мінімальна висота */
}

.full-height-map {
	width: 100%;
	height: 100%;
	z-index: 1;
}
</style>
