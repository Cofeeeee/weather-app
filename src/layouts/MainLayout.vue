<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated :class="isDark ? 'bg-dark' : 'bg-primary'">
			<q-toolbar>
				<q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

				<q-toolbar-title> Додаток «Погода» </q-toolbar-title>

				<q-btn 
					flat 
					dense 
					round 
					:icon="isDark ? 'dark_mode' : 'light_mode'"
					@click="toggleDarkMode"
				>
					<q-tooltip>{{ isDark ? 'Увімкнути світло' : 'Увімкнути темряву' }}</q-tooltip>
				</q-btn>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" show-if-above bordered>
			<q-list>
				<q-item-label header> Навігація </q-item-label>

				<EssentialLink 
					v-for="link in navList" 
					:key="link.title" 
					v-bind="link" 
				/>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup>
// --- Імпорти ---

// Бібліотеки
import { ref, onMounted, computed } from 'vue' // Імпорт функції для реактивного стану
import { useQuasar } from 'quasar' // Імпортуємо хук Quasar

// Імпорт компонента для навігаційних посилань
import EssentialLink from 'components/EssentialLink.vue'
import { useFavoritesStore } from '../stores/favorites-store'

// ---

// --- Ініціалізація та Стейт ---

const $q = useQuasar()
const favoritesStore = useFavoritesStore()

// ---

// --- Стейт ---

// Стан бічного меню (відкрито/закрито)
const leftDrawerOpen = ref(false)

// Визначаємо, чи зараз темна тема (реактивно)
const isDark = computed(() => $q.dark.isActive)

// ---

// --- Логіка ---

/**
 * Перемикання темної/світлої теми з автоматичним збереженням
 */
function toggleDarkMode() {
	$q.dark.toggle()
	// Зберігаємо вибір користувача в localStorage
	localStorage.setItem('user-theme', $q.dark.isActive ? 'dark' : 'light')
}

// Функція для перемикання стану бічного меню
function toggleLeftDrawer() {
  	leftDrawerOpen.value = !leftDrawerOpen.value
}

// Завантаження даних при старті
onMounted(() => {
	// Завантажуємо список з пам'яті браузера
  	favoritesStore.loadFromStorage()

	// Відновлюємо тему з пам'яті
	const savedTheme = localStorage.getItem('user-theme')
	if (savedTheme) {
		$q.dark.set(savedTheme === 'dark')
	} else {
		// Або підхоплюємо системну тему Windows/Linux
		$q.dark.set('auto')
	}
})

// Список навігаційних посилань для бічного меню
const navList = [
	{
		title: 'Головна',
		caption: 'Прогноз погоди для вашого міста',
		icon: 'home',
		link: '/'
	},
	{
		title: 'Мої міста',
		caption: 'Список обраних міст',
		icon: 'favorite',
		link: '/favorites'
	},
	{
		title: 'Про проєкт',
		caption: 'Детальніше про цей додаток',
		icon: 'info',
		link: '/about'
	}
]

// ---
</script>
