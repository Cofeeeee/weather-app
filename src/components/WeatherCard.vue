<template>
	<div v-if="weather" class="weather-card q-pa-md q-mt-md">
		<!-- Кнопка для додавання/видалення з обраного -->
		<div class="absolute-top-right q-ma-sm">
			<q-btn
				:icon="isInFavorites ? 'favorite' : 'favorite_border'"
				color="amber"
				size="md"
				round
				flat
				@click="toggleFavorite"
				:title="isInFavorites ? 'Видалити з обраного' : 'Додати до обраного'"
			/>
		</div>

		<!-- Інформація про місто та погоду -->
		<div class="row items-center justify-around no-wrap">
			<div class="col-auto">
				<div class="text-h6 text-weight-light">
					{{ weather.city }}, {{ weather.country }}
				</div>
				<div class="text-h2 text-weight-bold">
					{{ weather.temperature.current }}°C
				</div>
				<div class="text-subtitle1">
					<span>Відчувається {{ weather.temperature.feels_like }}°C</span>
				</div>
			</div>
			<div class="col-auto column items-center">
				<q-icon 
					:name="getWeatherIcon(weather.weather.icon)" 
					size="100px" 
					:style="{ 
						color: getWeatherColor(weather.weather.main),
						// Додаємо тінь для кращої видимості на фоні
						filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))'
					}"
				/>
				<div class="text-subtitle2 text-capitalize text-center">
					{{ weather.weather.description }}
				</div>
			</div>
		</div>

		<q-separator dark class="q-my-lg" />

		<!-- Параметри погоди через v-for -->
		<div class="row q-col-gutter-md">
			<div class="col-6 col-sm-3" v-for="item in weatherParams" :key="item.label">
				<div class="info-item column items-center text-center">
					<!-- Іконка -->
					<q-icon :name="item.icon" size="20px" class="q-mb-xs" />
					<!-- Назва параметра -->
					<span class="text-caption opacity-70">{{ item.label }}</span>
					<!-- Значення параметра -->
					<span class="text-weight-bold">{{ item.value }}</span>
				</div>
			</div>
		</div>

		<q-separator dark class="q-my-lg" />

		<!-- Час сходу та заходу сонця -->
		<div class="row text-caption justify-around">
			<div class="items-center">
				<q-icon :name="WEATHER_PARAM_ICONS.sunrise" size="16px" class="q-mr-sm" />
				Схід: {{ formatTime(weather.sunrise) }}
			</div>
			<div class="items-center">
				<q-icon :name="WEATHER_PARAM_ICONS.sunset" size="16px" class="q-mr-sm" />
				Захід: {{ formatTime(weather.sunset) }}
			</div>
		</div>
	</div>
</template>

<script setup>
// --- Імпорти ---

// Бібліотеки
import { computed } from 'vue' // Імпорт для реактивних обчислюваних властивостей - використовується для визначення, чи поточна погода вже є в обраному та для групування параметрів погоди
import { useQuasar } from 'quasar' // Імпорт для використання Quasar Notify

// Утиліти та константи (іконки та кольори погоди)
import { WEATHER_ICONS, WEATHER_PARAM_ICONS, WEATHER_COLORS } from '../utils/api-config'

// Стор для роботи з обраними містами
import { useFavoritesStore } from '../stores/favorites-store'

// ---

// --- Пропси та еміти ---

// Приймаємо пропс з даними про погоду, який передається з батьківського компонента
const props = defineProps({
	weather: {
		type: Object, // Очікуємо об'єкт з даними про погоду, який передається з батьківського компонента
		default: null // Якщо дані не передані, за замовчуванням буде null, і компонент не відображатиметься
	}
})

// ---

// --- Стори та сервіси ---

const favoritesStore = useFavoritesStore() // Ініціалізуємо стор для роботи з обраними містами, щоб мати можливість додавати та видаляти міста зі списку обраного, а також перевіряти, чи поточна погода вже є в обраному
const $q = useQuasar() // Ініціалізуємо Quasar для використання сповіщень

// ---

// --- Логіка компонента (computed properties) ---

// Визначаємо, чи поточна погода вже є в обраному, для зміни іконки та поведінки кнопки
const isInFavorites = computed(() => {
	// Якщо погода не передана, то вона не може бути в обраному
	if (!props.weather) return false
	return favoritesStore.favorites.some(fav => 
		// Порівнюємо координати з точністю до 2 знаків після коми, щоб уникнути проблем з плаваючою точкою
		fav.coordinates.lat.toFixed(2) === props.weather.coordinates.lat.toFixed(2) &&
		fav.coordinates.lon.toFixed(2) === props.weather.coordinates.lon.toFixed(2)
	)
})

// Групуємо параметри для зручного виводу через v-for
const weatherParams = computed(() => [
	{ label: 'Вологість', value: `${props.weather.humidity}%`, icon: WEATHER_PARAM_ICONS.humidity },
	{ label: 'Вітер', value: `${props.weather.wind.speed} м/с`, icon: WEATHER_PARAM_ICONS.wind },
	{ label: 'Тиск', value: `${props.weather.pressure} гПа`, icon: WEATHER_PARAM_ICONS.pressure },
	{ label: 'Видимість', value: `${props.weather.visibility / 1000} км`, icon: WEATHER_PARAM_ICONS.visibility }
])

// ---

// --- Допоміжні функції ---

// Функція для отримання іконки погоди на основі коду, який повертає API
function getWeatherIcon(iconCode) {
	return WEATHER_ICONS[iconCode] || 'wb_cloudy'
}

// Функція для форматування часу сходу та заходу сонця
function formatTime(timestamp) {
	if (!timestamp) return '—'
	const date = new Date(timestamp * 1000) // Конвертуємо UNIX timestamp в мілісекунди
	return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) // Форматуємо час у вигляді "HH:MM" для української локалі
}

// Функція для отримання кольору на основі основного стану погоди
function getWeatherColor(mainStatus) {
    if (!mainStatus) return '#ffffff'
    const status = mainStatus.toLowerCase()
    
	// Мапінг стану з API на ключі конфіга
	const map = {
		clear: WEATHER_COLORS.clear,
		clouds: WEATHER_COLORS.cloudy,
		rain: WEATHER_COLORS.rain,
		drizzle: WEATHER_COLORS.rain,
		snow: WEATHER_COLORS.snow,
		thunderstorm: WEATHER_COLORS.storm
	}

	return map[status] || WEATHER_COLORS.mist // Повертаємо колір на основі стану або використовуємо Fallback як запасний варіант
}

// Функція для показу сповіщення користувачу
function showNotify(message, color, icon) {
    $q.notify({
        message,
        color,
        icon,
        position: 'bottom-right',
        timeout: 2000
    })
}

// ---

// Функція для додавання або видалення міста з обраного
function toggleFavorite() {
	// Створюємо унікальний ID для міста на основі його координат, округлених до 2 знаків після коми
	const currentId = `${props.weather.coordinates.lat.toFixed(2)}-${props.weather.coordinates.lon.toFixed(2)}`
	
	// Якщо місто вже в обраному, видаляємо його, інакше додаємо
	if (isInFavorites.value) {
		favoritesStore.removeFavorite(currentId)

		// Показуємо сповіщення про видалення з обраного
		showNotify(`Видалено з обраного: ${props.weather.city}`, 'grey-8', 'delete_sweep')
	} else {
		// Створюємо об'єкт міста для збереження в обраному
		const favoriteCity = {
			id: currentId,
			name: props.weather.city,
			country: props.weather.country,
			coordinates: props.weather.coordinates,
			weather: props.weather.weather,
			temperature: props.weather.temperature,
			timestamp: Date.now()
		}

		// Додаємо місто в обране через стор
		favoritesStore.addFavorite(favoriteCity)

		// Показуємо сповіщення про додавання в обране
		showNotify(`Додано в обране: ${props.weather.city}`, 'positive', 'favorite')
	}
}
</script>

<style scoped>
.weather-card {
	position: relative;
	background: linear-gradient(135deg, #74b9ff, #0984e3);
	color: white;
	border-radius: 16px;
	box-shadow: 0 4px 6px rgba(0,0,0,0.3);
	width: 100%;
  	max-width: 500px;
	margin: 0 auto;
}
</style>
