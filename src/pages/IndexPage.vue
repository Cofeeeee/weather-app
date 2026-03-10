<template>
  <q-page class="column flex-center">
	<div class="text-h4"> Вітаємо у додатку «Погода»! </div>
	<p class="text-subtitle2"> Виберіть місто, щоб побачити прогноз погоди. </p>

	<q-input>
		<template v-slot:append>
			<q-btn flat icon="search" aria-label="Search" />
		</template>
	</q-input>
  </q-page>
</template>

<script setup>
//
</script>
