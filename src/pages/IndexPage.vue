<template>
  <q-page class="flex flex-center column q-pa-lg">
	<div class="full-width q-gutter-y-lg" style="max-width: 615px">
		<div class="text-h4 text-center q-mb-lg">Погода онлайн</div>
		
		<!-- Компонент для пошуку погоди по місту або координатах з використанням Leaflet та OpenWeatherMap API -->
		<WeatherSearch 
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
import { ref, computed } from 'vue'
import WeatherSearch from 'components/WeatherSearch.vue'
import WeatherCard from 'components/WeatherCard.vue'

const currentWeather = ref(null)
const errorMsg = ref(null)

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
	currentWeather.value = weather // Якщо погода успішно знайдена, очищаємо повідомлення про помилку
	errorMsg.value = null // Очищаємо повідомлення про помилку, якщо погода успішно знайдена
}

// Обробник для отримання помилки з дочірнього компонента WeatherSearch
function onError(err) {
	currentWeather.value = null // Якщо сталася помилка, очищаємо поточну погоду
	errorMsg.value = err // Показуємо текст помилки користувачу
}
</script>
