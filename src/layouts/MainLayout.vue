<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
			<q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

			<q-toolbar-title> Додаток «Погода» </q-toolbar-title>

			<q-btn flat dense round icon="wb_sunny" aria-label="Home" to="/" />
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
// Імпорт функції для реактивного стану
import { ref } from 'vue'
// Імпорт компонента для навігаційних посилань
import EssentialLink from 'components/EssentialLink.vue'

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

// Стан бічного меню (відкрито/закрито)
const leftDrawerOpen = ref(false)

// Функція для перемикання стану бічного меню
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
