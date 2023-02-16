import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import BadgeDirective from 'primevue/badgedirective'
import ToastService from 'primevue/toastservice'
import TooltipDirective from 'primevue/tooltip'
import App from './App.vue'
import router from './router'
import locale from './locale'

import './styles'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { locale })
app.use(ConfirmationService)
app.use(ToastService)
app.directive('tooltip', TooltipDirective)
app.directive('badge', BadgeDirective)
app.mount('#app')
