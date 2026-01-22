import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import CreateProductPage from './pages/CreateProductPage.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import RestockPage from './pages/RestockPage.vue'

const ADMIN_UID = "PASTE_YOUR_UID_HERE";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/create-product',
        name: 'CreateProduct',
        component: CreateProductPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/restock',
        name: 'Restock',
        component: RestockPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/not-authorized',
        name: 'NotAuthorized',
        component: NotAuthorizedPage
    }
]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Helper to get current user
const GetCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const user = await GetCurrentUser();

    // 🔒 Check if route requires login
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!user) {
            alert("You must be logged in to access this page.");
            next("/login");
            return;
        }
    }

    // 🔐 Check if route is only for your UID
    if (to.matched.some(record => record.meta.onlyMe)) {
        if (!user || user.uid !== ADMIN_UID) {
            alert("You are not allowed to access this page.");
            next("/not-authorized");
            return;
        }
    }

    next();
});

export default router;