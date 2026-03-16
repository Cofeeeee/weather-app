/**
 * Сервіс для роботи з погодним API OpenWeatherMap
 * Інкапсулює всі HTTP-запити та обробку помилок
 */

import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, validateApiConfig } from '../utils/api-config'

/**
 * Клас сервісу для роботи з погодним API
 */
export class WeatherApiService {
	constructor() {
		// Перевірка конфігурації
		if (!validateApiConfig()) {
			throw new Error('Конфігурація API не налаштована. Перевірте .env файли.')
		}

		this.apiKey = API_CONFIG.key
		this.baseURL = API_CONFIG.baseURL
		this.units = API_CONFIG.units

		// Налаштування axios instance для погодного API
		this.axiosInstance = axios.create({
			baseURL: this.baseURL,
			timeout: 10000, // 10 секунд таймаут
			headers: {
			'Content-Type': 'application/json'
			}
		})
	}

  /**
   * Отримання поточної погоди за назвою міста
   * @param {string} city - Назва міста (наприклад: "Kyiv", "London")
   * @returns {Promise<Object>} Дані про погоду
   */
	async getCurrentWeatherByCity(city) {
		try {
			// Валідація вхідних даних
			if (!city || typeof city !== 'string') {
				throw new Error('Некоректна назва міста')
			}

			const response = await this.axiosInstance.get(API_ENDPOINTS.CURRENT_WEATHER, {
				params: {
					q: city.trim(),
					appid: this.apiKey,
					units: this.units,
					lang: 'uk' // Українська мова для описів
				}
			})

			return this.processWeatherData(response.data)
		} catch (error) {
			throw this.handleError(error, `пошуку погоди для міста: ${city}`)
		}
	}

  /**
   * Отримання поточної погоди за координатами
   * @param {number} lat - Широта
   * @param {number} lon - Довгота
   * @returns {Promise<Object>} Дані про погоду
   */
	async getCurrentWeatherByCoords(lat, lon) {
		try {
			// Валідація вхідних даних
			if (typeof lat !== 'number' || typeof lon !== 'number') {
				throw new Error('Некоректні координати')
			}

			if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
			throw new Error('Координати поза допустимим діапазоном')
			}

			const response = await this.axiosInstance.get(API_ENDPOINTS.CURRENT_WEATHER, {
				params: {
					lat: lat,
					lon: lon,
					appid: this.apiKey,
					units: this.units,
					lang: 'uk'
				}
			})

			return this.processWeatherData(response.data)
		} catch (error) {
			throw this.handleError(error, `пошуку погоди за координатами: ${lat}, ${lon}`)
		}
	}

  /**
   * Обробка та нормалізація даних про погоду
   * @param {Object} data - Сирі дані від API
   * @returns {Object} Оброблені дані
   */
	processWeatherData(data) {
		return {
			// Основна інформація
			city: data.name || 'Невідоме місто',
			country: data.sys?.country || '',
			coordinates: {
				lat: data.coord?.lat,
				lon: data.coord?.lon
			},
			
			// Погодні умови
			weather: {
				main: data.weather?.[0]?.main || 'Unknown',
				description: data.weather?.[0]?.description || 'Невідомо',
				icon: data.weather?.[0]?.icon || '01d',
				iconUrl: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}@2x.png`
			},
			
			// Температура
			temperature: {
				current: Math.round(data.main?.temp || 0),
				feels_like: Math.round(data.main?.feels_like || 0),
				min: Math.round(data.main?.temp_min || 0),
				max: Math.round(data.main?.temp_max || 0)
			},
			
			// Інші параметри
			humidity: data.main?.humidity || 0,
			pressure: data.main?.pressure || 0,
			wind: {
				speed: data.wind?.speed || 0,
				deg: data.wind?.deg || 0
			},
			visibility: data.visibility || 0,
			clouds: data.clouds?.all || 0,
			
			// Часові мітки
			timestamp: data.dt || Date.now() / 1000,
			sunrise: data.sys?.sunrise || 0,
			sunset: data.sys?.sunset || 0,
			
			// Вихідні дані (для налагодження)
			raw: data
		}
	}

  /**
   * Обробка помилок API
   * @param {Error} error - Помилка від axios
   * @param {string} operation - Опис операції для повідомлення про помилку
   * @returns {Error} Оброблена помилка
   */
	handleError(error, operation = '') {
		console.error('Погодна помилка:', error)

		// Помилка мережі або сервер не доступний
		if (!error.response) {
			if (error.request) {
				return new Error(`Немає відповіді від сервера під час ${operation}. Перевірте підключення до Інтернету.`)
			} else {
				return new Error(`Помилка при виконанні запиту ${operation}: ${error.message}`)
			}
		}

		// Помилка від сервера
		const status = error.response.status
		const message = error.response.data?.message || ''

		switch (status) {
			case 400:
				return new Error(`Некоректний запит ${operation}: ${message || 'Перевірте введені дані.'}`)
			
			case 401:
				return new Error('Невірний API ключ. Перевірте налаштування API.')
			
			case 404:
				return new Error(`Місто не знайдено ${operation}. Перевірте правильність написання.`)
			
			case 429:
				return new Error('Перевищено ліміт запитів до API. Спробуйте пізніше.')
			
			case 500:
			case 502:
			case 503:
			case 504:
				return new Error(`Тимчасові проблеми з сервером під час ${operation}. Спробуйте пізніше.`)
			
			default:
				return new Error(`Помилка сервера (${status}) під час ${operation}: ${message || 'Невідома помилка.'}`)
		}
	}
}

// Експорт екземпляра сервісу для зручного використання
export const weatherApiService = new WeatherApiService()

// Експорт для використання в компонентах
export default WeatherApiService
