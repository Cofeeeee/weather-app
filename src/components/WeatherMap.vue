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
// --- Імпорти ---

// Бібліотеки
import { ref, onMounted, onUnmounted, watch } from 'vue' // Імпорт реактивних рефів та життєвих циклів компонента
import { useRouter } from 'vue-router' // Імпорт роутера для оновлення URL з координатами
import L from 'leaflet' // Імпорт бібліотеки Leaflet для роботи з картою

// Імпорт стилів для Leaflet
import 'leaflet/dist/leaflet.css'

// Імпорт іконок Leaflet для маркера на карті (фікс для Vite та інших збирачів, які не можуть знайти ці файли автоматично)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Імпорт сервісу для отримання погоди по координатах
import { weatherApiService } from '../services/weather-api'

// ---

// --- Пропси та еміти ---

// Пропси для отримання початкових координат від батьківського компонента, щоб можна було відразу показати погоду для цих координат при завантаженні компонента
const props = defineProps({
    initialLocation: Object
})

// Еміти для передачі знайденої погоди та помилок назад батьківському компоненту, щоб він міг їх обробити та показати користувачу
const emit = defineEmits(['weather-found', 'error'])

// ---

// --- Змінні та Стейт ---

// Ініціалізуємо роутер для синхронізації координат з URL
const router = useRouter()

// Рефи для збереження координат та посилання на контейнер карти
const lat = ref(null)
const lon = ref(null)
const mapRef = ref(null) // Реф для контейнера карти, щоб ініціалізувати Leaflet на цьому елементі

// Змінні для збереження екземпляра карти та маркера
let map = null // Щоб мати до нього доступ в різних функціях компонента
let marker = null // Щоб можна було його оновлювати при нових кліках

// ---

// --- Налаштування іконок для Leaflet ---

// Треба вказати правильні шляхи до іконок, оскільки Leaflet за замовчуванням шукає їх у своїй папці, а ми використовуємо їх через імпорт
delete L.Icon.Default.prototype._getIconUrl // Видаляємо стандартний метод отримання URL іконок, щоб використовувати наші імпортовані
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow
})

// ---

// Ініціалізація карти при монтуванні компонента
onMounted(() => {
	// Ініціалізуємо карту
	initMap()

	// Якщо при завантаженні компонента вже є координати
	if (props.initialLocation?.lat && props.initialLocation?.lon) {
		// Застосовуємо ці координати та встановлюємо зум 10 для більш детального перегляду
		applyLocation(props.initialLocation.lat, props.initialLocation.lon, 10)

		// Робимо пошук погоди за цими координатами, щоб одразу показати користувачу погоду для цієї точки, якщо вона була передана через пропси
        searchByCoords()
    }
})

// Очищення карти при розмонтуванні компонента
onUnmounted(() => {
	if (map) {
		map.remove() // Видаляємо карту та всі її обробники, щоб уникнути витоків пам'яті та некоректної роботи при повторному монтуванні компонента
	}
})

// --- Watchers ---

// Слідкуємо за змінами в пропсах з координатами
watch(() => props.initialLocation, (newLoc) => {
	// Якщо отримали нові координати через пропси
    if (newLoc?.lat && newLoc?.lon) {
        applyLocation(newLoc.lat, newLoc.lon) // Оновлюємо координати та позицію маркера на карті, щоб відобразити нову точку, якщо пропси змінилися після початкового завантаження компонента (наприклад, при переході з іншої сторінки з координатами)
    }
}, { deep: true })

// ---

// --- Допоміжні функції ---

function initMap() {
	// Ініціалізуємо карту
	map = L.map(mapRef.value).setView([50.4501, 30.5234], 6) // Київ як центр
	
	// Додаємо тайли OpenStreetMap до карти - це безкоштовний та відкритий сервіс карт, який не вимагає API ключа
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap contributors' // Атрибуція для OpenStreetMap - важливо для дотримання ліцензії
	}).addTo(map)
    
    map.on('click', (e) => {
        const { lat: clickLat, lng: clickLon } = e.latlng
        applyLocation(clickLat, clickLon)
        searchByCoords()
    })
}

// Функція для застосування координат до карти та маркера, а також для оновлення URL з новими координатами
function applyLocation(latitude, longitude, zoom = null) {
	// Використовуємо Number для конвертації в числовий тип, оскільки пропси можуть приходити як строки
    const nLat = Number(latitude)
    const nLon = Number(longitude)
    
	// Округлюємо до 4 знаків після коми для кращого вигляду в інпутах
    lat.value = Number(nLat.toFixed(4))
    lon.value = Number(nLon.toFixed(4))
    
	// Оновлюємо позицію маркера на карті та центр карти на нові координати
    updateMarker(nLat, nLon)
    
	// Якщо передано параметр zoom, то встановлюємо зум на нову точку, інакше просто пануємо карту до неї, залишаючи поточний зум
    if (map) {
        if (zoom) map.setView([nLat, nLon], zoom)
        else map.panTo([nLat, nLon])
    }
}

// Функція для оновлення позиції маркера на карті
function updateMarker(lati, long) {
	if (marker) {
		marker.setLatLng([lati, long]) // Якщо маркер вже існує, просто оновлюємо його позицію
	} else {
		marker = L.marker([lati, long]).addTo(map) // Якщо маркера ще немає, створюємо новий
	}
}

// ---

// --- Основні функції (API та Геолокація) ---

// Функція для пошуку погоди за координатами
async function searchByCoords() {
	// Валідація: перевіряємо, що користувач ввів координати
	if (lat.value === null || lon.value === null) {
        emit('error', 'Будь ласка, введіть координати')
        return
    }

	try {
		// Викликаємо сервіс для отримання погоди по координатах, передаючи введені користувачем значення
		const weatherData = await weatherApiService.getCurrentWeatherByCoords(lat.value, lon.value)
		
		// Оновлюємо URL з новими координатами, щоб користувач міг поділитися посиланням на цю точку або повернутися до неї пізніше, а також щоб при перезавантаженні сторінки погода для цієї точки завантажувалась автоматично
		router.replace({
			query: { 
				lat: lat.value, 
				lon: lon.value 
			}
		})
		
		// Передаємо знайдену погоду в батьківський компонент
		emit('weather-found', weatherData)
	} catch (err) {
		// Передаємо текст помилки в батьківський компонент
		emit('error', err.message)
	}
}

// Функція для отримання поточного місця користувача
function getCurrentLocation() {
	// Перевіряємо, чи підтримує браузер геолокацію
	if (navigator.geolocation) {
		// Запитуємо координати користувача
		navigator.geolocation.getCurrentPosition(
			// Успішне отримання координат
			(position) => {
				// Отримуємо координати користувача
				const { latitude, longitude } = position.coords
				
				// Застосовуємо ці координати та встановлюємо зум 10 для більш детального перегляду, щоб користувач одразу бачив свою точку на карті
				applyLocation(latitude, longitude, 10)
				
				// Автоматично робимо пошук погоди за координатами користувача після отримання їх геолокації, щоб одразу показати користувачу погоду для його місця
				searchByCoords()
			},
			(error) => {
				// Передаємо текст помилки в батьківський компонент
				emit('error', 'Не вдалося отримати геолокацію: ' + error.message)
			}
		)
	} else {
		// Передаємо текст помилки в батьківський компонент
		emit('error', 'Геолокація не підтримується вашим браузером')
	}
}

// ---
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
