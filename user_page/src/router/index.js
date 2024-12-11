import { createRouter, createWebHistory } from 'vue-router'
import RouteForm from '../views/RouteForm.vue'
import dashboard from '../views/dashboard.vue'
import Routes from '../views/routes.vue'

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/',
            name:RouteForm,
            component:RouteForm
        },
        {
            path:'/dashboard',
            name:'dashboard',
            component:dashboard,
          },
          {
            path:'/routes',
            name:'Routes',
            component:Routes
          },
    ]
})

export default router