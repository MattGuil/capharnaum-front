import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
	components,
	directives,
	theme: {
		defaultTheme: 'light',
	},
	locale: {
		locale: 'fr-FR',
	},
	defaults: {
		global: {
			font: {
				family: 'Segoe UI'
			},
		},
	},
})