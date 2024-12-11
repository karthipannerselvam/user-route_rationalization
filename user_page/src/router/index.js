import { createRouter, createWebHistory } from 'vue-router'
import RouteForm from '../views/RouteForm.vue'
import dashboard from '../views/dashboard.vue'
import aboutus from '../views/aboutus.vue'

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
            path:'/aboutus',
            name:'aboutus',
            component:aboutus,
          },
    ]
})

export default router