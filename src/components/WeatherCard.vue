<template>
	<div v-if="weather" class="weather-card q-pa-md q-mt-md">
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
				<q-icon :name="item.icon" size="20px" class="q-mb-xs" />
				<span class="text-caption opacity-70">{{ item.label }}</span>
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
import { computed } from 'vue'
import { WEATHER_ICONS, WEATHER_PARAM_ICONS, WEATHER_COLORS } from '../utils/api-config'

// Приймаємо пропс з даними про погоду, який передається з батьківського компонента
const props = defineProps({
	weather: {
		type: Object, // Очікуємо об'єкт з даними про погоду, який передається з батьківського компонента
		default: null // Якщо дані не передані, за замовчуванням буде null, і компонент не відображатиметься
	}
})

// Групуємо параметри для зручного виводу через v-for
const weatherParams = computed(() => [
	{ label: 'Вологість', value: `${props.weather.humidity}%`, icon: WEATHER_PARAM_ICONS.humidity },
	{ label: 'Вітер', value: `${props.weather.wind.speed} м/с`, icon: WEATHER_PARAM_ICONS.wind },
	{ label: 'Тиск', value: `${props.weather.pressure} гПа`, icon: WEATHER_PARAM_ICONS.pressure },
	{ label: 'Видимість', value: `${props.weather.visibility / 1000} км`, icon: WEATHER_PARAM_ICONS.visibility }
])

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
    if (status === 'clear') return WEATHER_COLORS.clear
    if (status === 'clouds') return WEATHER_COLORS.cloudy
    if (status === 'rain' || status === 'drizzle') return WEATHER_COLORS.rain
    if (status === 'snow') return WEATHER_COLORS.snow
    if (status === 'thunderstorm') return WEATHER_COLORS.storm
    
    return WEATHER_COLORS.mist // Fallback на випадок інших станів
}
</script>

<style scoped>
.weather-card {
	background: linear-gradient(135deg, #74b9ff, #0984e3);
	color: white;
	border-radius: 16px;
	box-shadow: 0 4px 6px rgba(0,0,0,0.3);
	width: 100%;
  	max-width: 500px;
	margin: 0 auto;
}
</style>
