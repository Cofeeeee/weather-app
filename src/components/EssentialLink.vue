<template>
	<q-item 
		clickable 
		:to="props.link" 
	>
		<q-item-section v-if="props.icon" avatar>
			<q-icon :name="props.icon" />
		</q-item-section>

		<q-item-section>
			<q-item-label>{{ props.title }}</q-item-label>
			<q-item-label caption>{{ props.caption }}</q-item-label>
		</q-item-section>
	</q-item>
</template>

<script setup>
// Визначення властивостей компонента
const props = defineProps({
	// Назва посилання (обов'язкове поле)
	title: {
		type: String,
		required: true,
	},

	// Опис посилання (необов'язкове поле)
	caption: {
	type: String,
	default: '',
	},

	// URL або маршрут для навігації (необов'язкове поле, за замовчуванням '#')
	link: {
	type: String,
	default: '#',
	},

	// Іконка для посилання (необов'язкове поле)
	icon: {
	type: String,
	default: '',
	},
})
</script>
