/**
 * Тести для погодного сервісу
 */

import { WeatherApiService } from '../weather-api'

// Тестовий екземпляр
const weatherService = new WeatherApiService()

// Тест 1: Перевірка пошуку по місту
async function testCitySearch() {
  try {
    console.log('🔍 Тест 1: Пошук погоди по місту...')
    const data = await weatherService.getCurrentWeatherByCity('Kyiv')
    console.log('✅ Успішно:', data)
    return true
  } catch (error) {
    console.error('❌ Помилка:', error.message)
    return false
  }
}

// Тест 2: Перевірка пошуку по координатах
async function testCoordsSearch() {
  try {
    console.log('🔍 Тест 2: Пошук погоди по координатах...')
    const data = await weatherService.getCurrentWeatherByCoords(50.4501, 30.5234) // Київ
    console.log('✅ Успішно:', data)
    return true
  } catch (error) {
    console.error('❌ Помилка:', error.message)
    return false
  }
}

// Тест 3: Перевірка обробки помилок
async function testErrorHandling() {
  try {
    console.log('🔍 Тест 3: Перевірка обробки помилок...')
    await weatherService.getCurrentWeatherByCity('NonExistentCity123')
    console.error('❌ Помилка: Місто не повинно бути знайдено')
    return false
  } catch (error) {
    console.log('✅ Помилка оброблена коректно:', error.message)
    return true
  }
}

// Запуск всіх тестів
async function runAllTests() {
  console.log('🚀 Запуск тестів погодного сервісу...\n')
  
  const results = await Promise.all([
    testCitySearch(),
    testCoordsSearch(),
    testErrorHandling()
  ])
  
  const passed = results.filter(Boolean).length
  const total = results.length
  
  console.log(`\n📊 Результати: ${passed}/${total} тестів пройдено`)
  
  if (passed === total) {
    console.log('🎉 Всі тести успішні! Сервіс готовий до використання.')
  } else {
    console.log('⚠️  Деякі тести не пройдено. Перевірте налаштування.')
  }
  
  return passed === total
}

// Автоматичний запуск тестів у development режимі
if (import.meta.env.DEV) {
  runAllTests()
}
