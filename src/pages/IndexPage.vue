<template>
  <q-page class="flex flex-center column q-pa-lg">
	<div class="full-width q-gutter-y-lg" style="max-width: 615px">
		<div class="text-h4 text-center q-mb-lg">Погода онлайн</div>
		
		<!-- Компонент для пошуку погоди по місту або координатах з використанням Leaflet та OpenWeatherMap API -->
		<WeatherSearch 
			:initial-coords="route.query"
			@weather-found="onWeatherFound" 
			@error="onError" 
		/>
		
		<!-- Компонент для відображення знайденої погоди -->
		<WeatherCard :weather="currentWeather" />
		
		<!-- Повідомлення для користувача, яке залежить від стану додатку -->
		<div 
			v-if="message" 
			class="q-mt-md text-center" 
			:class="errorMsg ? 'text-red' : 'text-grey-7'"
		>
			{{ message }}
		</div>
	</div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import WeatherSearch from 'components/WeatherSearch.vue'
import { weatherApiService } from '../services/weather-api'
import WeatherCard from 'components/WeatherCard.vue'
import { useRoute } from 'vue-router'

const currentWeather = ref(null)
const errorMsg = ref(null)
const route = useRoute()

// Відповідь для користувача, яка залежить від стану додатку
const message = computed(() => {
	// 1. Якщо є помилка — показуємо її
	if (errorMsg.value) return errorMsg.value
	
	// 2. Якщо погода вже знайдена — не показуємо жодного повідомлення
	if (currentWeather.value) return ''
	
	// 3. Стандартне повідомлення для користувача
	return 'Оберіть місто або клацніть на карті, щоб побачити погоду'
})

// Обробник для отримання погоди з дочірнього компонента WeatherSearch
function onWeatherFound(weather) {
	currentWeather.value = { ...weather } // Якщо погода успішно знайдена, очищаємо повідомлення про помилку
	errorMsg.value = null // Очищаємо повідомлення про помилку, якщо погода успішно знайдена
}

// Обробник для отримання помилки з дочірнього компонента WeatherSearch
function onError(err) {
	currentWeather.value = null // Якщо сталася помилка, очищаємо поточну погоду
	errorMsg.value = err // Показуємо текст помилки користувачу
}

async function loadWeatherFromUrl() {
  const { lat, lon, city } = route.query
  
  try {
    if (lat && lon) {
      // Если есть координаты — ищем по ним
      const data = await weatherApiService.getCurrentWeatherByCoords(
        Number(lat), 
        Number(lon)
      )
      onWeatherFound(data)
    } else if (city) {
      // Если есть только имя — ищем по имени
      const data = await weatherApiService.getCurrentWeatherByCity(city)
      onWeatherFound(data)
    }
  } catch (err) {
    onError(err.message || 'Не вдалося завантажити локацію')
  }
}

watch(() => route.query, () => {
  loadWeatherFromUrl()
}, { deep: true })

onMounted(() => {
  loadWeatherFromUrl() // Загружаем погоду при загрузке страницы, если в URL есть параметр ?city
})
</script>
