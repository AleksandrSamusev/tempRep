import { createRouter, createWebHistory } from 'vue-router';
import UsersView from "@/views/UsersView.vue";
import BrandsView from "@/views/BrandsView.vue";
import RunsView from "@/views/RunsView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/users',
            name: 'users',
            component: UsersView,
        },
        {
            path: '/brands',
            name: 'brands',
            component: BrandsView,
        },
        {
            path: '/runs',
            name: 'runs',
            component: RunsView,
        }
    ],
});

export default router;