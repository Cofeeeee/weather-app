<template>
	<q-page class="q-pa-lg">
		<div class="text-center q-mb-xl">
			<div class="text-h4">Мої міста</div>
			<p class="text-subtitle2 text-grey-7">Тут будуть ваші збережені локації</p>
		</div>

		<div v-if="favorites.length === 0" class="flex flex-center column q-mt-xl">
			<q-icon name="star_outline" size="100px" color="grey-4" />
			<div class="text-h6 text-grey-5">Список порожній</div>
			<q-btn label="Шукати погоду" color="primary" to="/" class="q-mt-md" flat />
		</div>

		<div v-else class="row q-col-gutter-md justify-center">
			<div 
				v-for="city in favorites" 
				:key="city.id" 
				class="col-12 col-sm-6 col-md-4"
			>
				<q-card class="favorites-card text-white cursor-pointer" @click="viewWeather(city)">
					<q-card-section>
						<div class="row items-center no-wrap">
							<div class="col">
								<div class="text-h6">{{ city.name }}</div>
								<div class="text-subtitle2">{{ city.country }}</div>
							</div>
							<div class="col-auto text-h4">
								{{ city.temperature.current }}°C
							</div>
						</div>
					</q-card-section>

					<q-card-section class="row items-center justify-between">
						<div class="row items-center">
							<q-icon :name="getWeatherIcon(city.weather.icon)" size="30px" class="q-mr-sm" />
							<span class="text-capitalize">{{ city.weather.description }}</span>
						</div>
						<q-btn 
							icon="delete" 
							color="white" 
							flat 
							round 
							size="md" 
							@click.stop="removeCity(city)"
						/>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</q-page>
</template>

<script setup>
// --- Імпорти ---

// Бібліотеки
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Стори
import { useFavoritesStore } from '../stores/favorites-store'

// Утиліти
import { WEATHER_ICONS } from '../utils/api-config'

// ---

// --- Змінні та Стейт ---

const router = useRouter() // Инициализируем роутер
const $q = useQuasar()
const favoritesStore = useFavoritesStore()
const favorites = computed(() => favoritesStore.getAllFavorites) // Отримання списку міст із Pinia стора

// ---

// --- Допоміжні функції ---

/**
 * Отримує відповідну Material іконку за кодом OpenWeatherMap
 * @param {string} iconCode - Код іконки від API
 */
// Функція для іконок (та сама, що в WeatherCard)
function getWeatherIcon(iconCode) {
  	return WEATHER_ICONS[iconCode] || 'wb_cloudy'
}

// ---

// --- Основні функції (Навігація та Дії) ---

function viewWeather(city) {
	router.push({
		path: '/',
		query: { 
			lat: city.coordinates.lat, 
			lon: city.coordinates.lon 
		}
	})
}

// Функція видалення
function removeCity(city) {
	favoritesStore.removeFavorite(city.id)

	$q.notify({
		message: `${city.name} видалено зі списку`,
		color: 'orange-9',
		icon: 'info',
		position: 'top', // Можна змінити позицію для різноманіття
		actions: [{ label: 'ОК', color: 'white' }]
	})
}

// ---
</script>

<style scoped>
.favorites-card {
	background: linear-gradient(135deg, #74b9ff, #0984e3);
	border-radius: 12px;
	transition: transform 0.2s;
}

.favorites-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>