/**
 * Pinia стор для керування списком обраних міст
 * Забезпечує збереження даних у localStorage
 */

// --- Імпорти ---

import { defineStore } from 'pinia'

// ---

export const useFavoritesStore = defineStore('favorites', {
	// --- Стейт (Дані) ---
	state: () => ({
		favorites: [] // Масив об'єктів обраних міст
	}),

	// --- Геттери (Отримання даних) ---
	getters: {
		/**
         * Повертає повний список обраних міст
         * @param {Object} state 
         */
		getAllFavorites: (state) => state.favorites,
		
		/**
         * Перевіряє, чи вже є місто в обраному за його ID
         * @param {Object} state 
         * @returns {Function} Функція для перевірки по ID
         */
		isFavorite: (state) => (cityId) => {
			return state.favorites.some(city => city.id === cityId)
		}
	},

	// --- Екшни (Дії та Логіка) ---

	actions: {
		/**
         * Завантажує список обраних міст із пам'яті браузера
         */
		loadFromStorage() {
			try {
                const saved = localStorage.getItem('weather_favorites')
                if (saved) {
                    this.favorites = JSON.parse(saved)
                }
            } catch (error) {
                console.error('Помилка завантаження з localStorage:', error)
                this.favorites = []
            }
		},

		/**
         * Зберігає поточний стан списку в пам'ять браузера
         */
		saveToStorage() {
			localStorage.setItem('weather_favorites', JSON.stringify(this.favorites))
		},

		/**
         * Додає нове місто на початок списку (якщо його там ще немає)
         * @param {Object} cityData - Дані про погоду в місті
         */
		addFavorite(cityData) {
			// Перевірка на дублікат
			const exists = this.favorites.some(city => city.id === cityData.id)
			if (!exists) {
				// Додаємо на початок, щоб останнє додане було першим у списку
				this.favorites.unshift(cityData)
				this.saveToStorage()
			}
		},

		/**
         * Видаляє місто зі списку за його ID
         * @param {number|string} id - Унікальний ID міста
         */
		removeFavorite(id) {
			this.favorites = this.favorites.filter(fav => fav.id !== id)
			this.saveToStorage()
		},

		/**
         * Повне очищення списку обраного
         */
		clearAll() {
			this.favorites = []
			this.saveToStorage()
		}
	}
})
