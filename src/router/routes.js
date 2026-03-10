const routes = [
  {
	// Головний маршрут, який відповідає за корінь сайту:
    path: '/',
	// Використовуємо головний макет для всіх сторінок, які будуть вкладеними в нього:
    component: () => import('layouts/MainLayout.vue'),
	// Вкладені сторінки, які будуть відображатися в <router-view> головного макета:
    children: [
		// Це наша головна сторінка, яка буде відображатися за замовчуванням при переході на корінь сайту:
		{ 
			path: '', 
			component: () => import('pages/IndexPage.vue') 
		},

		// Додаткові сторінки, які ми можемо відкрити через навігацію:
		{
			path: '/favorites',
			component: () => import('pages/FavoritesPage.vue')
		},
		{
			path: '/about',
			component: () => import('pages/AboutPage.vue')
		}
	],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
