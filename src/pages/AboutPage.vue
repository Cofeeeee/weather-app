<template>
	<q-page class="flex flex-center q-pa-md">
		<q-card class="about-card shadow-2 text-center q-pa-lg">
			<q-card-section>
				<q-icon name="cloud_queue" size="100px" color="primary" class="q-mb-md" />
				
				<div class="text-h4 q-mb-xs">Weather App</div>
				<div class="text-subtitle1 text-primary q-mb-md">Версія 1.0.0</div>
				
				<p class="text-body1 text-grey-8 line-height-1-6">
					Це навчальний додаток для відстеження погоди, <br>
					побудований на прогресивному стеку технологій.
				</p>
			</q-card-section>

			<q-separator inset q-my-md />

				<q-card-section>
					<div class="text-subtitle2 text-grey-7 q-mb-md text-uppercase letter-spacing-1">Технологічний стек:</div>
					<div class="row justify-center q-gutter-sm">
						<q-chip outline color="green-7" icon="bolt">Vue 3 (Composition API)</q-chip>
						<q-chip outline color="blue-8" icon="layers">Quasar Framework</q-chip>
						
						<q-chip outline color="cyan-7" icon="cloud_sync">Axios + OpenWeather API</q-chip>
						<q-chip outline color="orange-9" icon="storage">Pinia Store</q-chip>

						<q-chip outline color="red-7" icon="alt_route">Vue Router</q-chip>
						<q-chip outline color="light-blue-6" icon="palette">Tailwind CSS</q-chip>
						
						<q-chip outline color="deep-purple-6" icon="speed">Vite</q-chip>
					</div>
				</q-card-section>

			<q-card-section class="q-pt-xl">
				<q-btn 
					flat 
					color="primary" 
					icon="arrow_back" 
					label="Повернутися до погоди" 
					to="/" 
				/>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<style scoped>
.about-card {
	width: 100%;
	max-width: 500px;
	border-radius: 24px; /* Робимо м'які кути */
}

.line-height-1-6 {
  	line-height: 1.6;
}

/* Додаємо легку анімацію появи */
.about-card {
 	animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>