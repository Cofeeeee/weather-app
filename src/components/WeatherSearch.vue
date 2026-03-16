<template>
	<div class="weather-search q-pa-md">
		<div class="search-container q-mx-auto">
			<!-- Вкладки для вибору режиму пошуку -->
			<q-tabs
				v-model="searchMode"
				class="text-primary"
				align="justify"
			>
				<q-tab name="city" label="Пошук по місту" />
				<q-tab name="coords" label="Пошук по координатах" />
			</q-tabs>

			<!-- Панель вкладок -->
			<q-tab-panels v-model="searchMode" animated>
				<!-- Пошук по місту -->
				<q-tab-panel name="city">
					<q-input
						v-model.trim="city"
						label="Введіть назву міста"
						@keyup.enter="searchWeather"
						:loading="loading"
						clearable
						outlined
						class="full-width"
					>
						<template v-slot:append>
							<q-btn
								icon="search"
								color="primary"
								round
								flat
								@click="searchWeather"
								:loading="loading"
							/>
						</template>
					</q-input>
				</q-tab-panel>

				<!-- Пошук по координатах -->
				<q-tab-panel name="coords">
					<WeatherMap 
						@weather-found="onCoordsWeatherFound"
						@error="onCoordsError"
					/>
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { weatherApiService } from '../services/weather-api'
import WeatherMap from './WeatherMap.vue'

const emit = defineEmits(['weather-found', 'error']) // Визначаємо пропси для отримання даних про погоду та помилки від батьківського компонента

const searchMode = ref('city') // Режим пошуку: 'city' для пошуку по місту, 'coords' для пошуку по координатах
const city = ref('') // Реф для збереження введеної назви міста, яка буде використовуватись для пошуку погоди
const loading = ref(false) // Реф для відображення індикатора завантаження під час пошуку погоди, щоб користувач бачив, що відбувається процес пошуку

// Обробник для пошуку погоди по місту
async function searchWeather() {
	// Валідація: перевіряємо, що користувач ввів назву міста
	if (!city.value) {
		emit('error', 'Будь ласка, введіть назву міста') // Передаємо текст помилки в батьківський компонент
		return
	}

	// Встановлюємо індикатор завантаження, щоб показати користувачу, що відбувається процес пошуку
	loading.value = true

	try {
		const weatherData = await weatherApiService.getCurrentWeatherByCity(city.value) // Викликаємо сервіс для отримання погоди по назві міста, передаючи введене користувачем значення
		emit('weather-found', weatherData) // Передаємо знайдену погоду в батьківський компонент
		city.value = '' // Очищаємо поле вводу після успішного пошуку
	} catch (err) {
		emit('error', err.message) // Передаємо текст помилки в батьківський компонент
	} finally {
		loading.value = false // Завжди вимикаємо індикатор завантаження після завершення операції
	}
}

// Обробники для пошуку по координатах
function onCoordsWeatherFound(weather) {
  	emit('weather-found', weather) // Передаємо знайдену погоду в батьківський компонент
}

// Обробник помилок для пошуку по координатах
function onCoordsError(errMsg) {
  	emit('error', errMsg) // Передаємо текст помилки в батьківський компонент
}
</script>
<style scoped>
.search-container {
  width: 100%;
  max-width: 615px; /* Робимо поле пошуку вужчим */
}
</style>

