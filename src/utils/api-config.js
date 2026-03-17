/**
 * Конфігурація погодного API
 * Використовує змінні оточення з fallback значеннями
 */

// Основна конфігурація API
export const API_CONFIG = {
	// API ключ (обов'язковий)
	key: import.meta.env.VITE_API_KEY,

	// Базова URL API
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.openweathermap.org/data/2.5',

	// Одиниці вимірювання: metric (Цельсій), imperial (Фаренгейт), standard (Кельвін)
	units: import.meta.env.VITE_API_UNITS || 'metric'
}

// Константи для типів запитів (ендпоінти)
export const API_ENDPOINTS = {
	CURRENT_WEATHER: '/weather',      // Поточна погода
	FORECAST: '/forecast',            // Прогноз (якщо знадобиться)
	AIR_POLLUTION: '/air_pollution'   // Забруднення повітря (якщо знадобиться)
}

// --- Візуалізація (Іконки та Кольори) ---

// Мапінг погодних іконок OpenWeatherMap на Material Icons
export const WEATHER_ICONS = {
	// Ясно
	'01d': 'wb_sunny',        // clear sky (day)
	'01n': 'brightness_2',    // clear sky (night)

	// Мало хмар
	'02d': 'wb_cloudy',       // few clouds (day)
	'02n': 'wb_cloudy',       // few clouds (night)

	// Розсіяні хмари
	'03d': 'cloud',           // scattered clouds (day)
	'03n': 'cloud',           // scattered clouds (night)

	// Розбиті хмари
	'04d': 'cloud_queue',     // broken clouds (day)
	'04n': 'cloud_queue',     // broken clouds (night)

	// Дощ
	'09d': 'grain',           // shower rain (day)
	'09n': 'grain',           // shower rain (night)
	'10d': 'umbrella',        // rain (day)
	'10n': 'umbrella',        // rain (night)

	// Гроза
	'11d': 'flash_on',        // thunderstorm (day)
	'11n': 'flash_on',        // thunderstorm (night)

	// Сніг
	'13d': 'ac_unit',         // snow (day)
	'13n': 'ac_unit',         // snow (night)

	// Туман
	'50d': 'visibility',      // mist (day)
	'50n': 'visibility'       // mist (night)
}

// Іконки для параметрів погоди
export const WEATHER_PARAM_ICONS = {
	humidity: 'water_drop',
	pressure: 'speed', 
	wind: 'air',
	visibility: 'visibility',
	clouds: 'cloud_queue',
	sunrise: 'wb_sunny',
	sunset: 'nightlight_round', // або 'brightness_3'
}

// Кольорова палітра для станів погоди
export const WEATHER_COLORS = {
	clear: '#f1c40f',         // Ясно - синій f1c40f - жовтий 4a90e2 - оригінал
	cloudy: '#a0a0a0',        // Хмарно - сірий
	rain: '#3498db',          // Дощ - блакитний
	snow: '#ecf0f1',          // Сніг – білий
	storm: '#2c3e50',         // Гроза - темно-сірий
	mist: '#bdc3c7'           // Туман - світло-сірий
}

// ---

// --- Валідація та Логіка ---

/**
 * Перевіряє коректність налаштування API перед запуском запитів
 * @returns {boolean} Результат валідації
 */
// Функція для валідації конфігурації API
export const validateApiConfig = () => {
	// Перевіряємо, чи встановлено API ключ
	if (!API_CONFIG.key || API_CONFIG.key === 'your-api-key-here') {
		console.warn('⚠️  Попередження: API ключ не налаштовано. Перевірте .env файли.')
		return false
	}

	// Перевіряємо, чи встановлено базовий URL
	if (!API_CONFIG.baseURL) {
		console.warn('⚠️  Попередження: Базовий URL API не налаштовано.')
		return false
	}

	return true
}

// ---

// Виконуємо валідацію при імпорті цього модуля
export default API_CONFIG
