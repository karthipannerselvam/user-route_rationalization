import { createRouter, createWebHistory } from 'vue-router'
import RouteForm from '../views/RouteForm.vue'

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/',
            name:RouteForm,
            component:RouteForm
        }
    ]
})

export default router