import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import LoginPage from './pages/LoginPage.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfilePage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    }
]

// Create the router instance
const router = createRouter({
    history: createWebHistory(), // use history mode for cleaner URLs
    routes
})


// function to check if user is authenticated
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


//  this code runs before each route change
router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record => record.meta.requiresAuth)))     {; // check if route requires auth
        if (await GetCurrentUser()) { //If logged in, navigation continues.
            next();
        } else { //alert user that you need to be logged in and redirect to login page.
            alert("You must be logged in to access this page.");
            next("/login");
        }
    } else { // if auth is not required, navigation continues.
        next();
    }
});
export default router