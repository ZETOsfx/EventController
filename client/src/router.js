import { createRouter, createWebHistory } from 'vue-router';
import Admin from './views/Admin.vue';
import AdsCast from './views/AdsCast.vue';
import Login from './views/Auth.vue';
import BugRep from './views/BugReport.vue';
import Cast from './views/Cast.vue';
import Editor from './views/Editor.vue';
import NotFound from './views/Error.vue';
import Uploads from './views/FileUpload.vue';
import Guide from './views/Guide.vue';
import Index from './views/MainPage.vue';
import Manager from './views/Manager.vue';
import Moder from './views/Moder.vue';
import Remote from './views/Remote.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/index' },
        {
            path: '/index',
            name: 'MainPage',
            component: Index,
        },
        {
            path: '/login',
            name: 'SignIn',
            component: Login,
        },
        {
            path: '/guide',
            name: 'Guide',
            component: Guide,
        },
        {
            path: '/event',
            name: 'Editor',
            component: Editor,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moderator', 'admin'],
            },
        },
        {
            path: '/account',
            name: 'Admin',
            component: Admin,
            meta: {
                needsAuth: true,
                roles: ['admin'],
            },
        },
        {
            path: '/moder',
            name: 'Moder',
            component: Moder,
            meta: {
                needsAuth: true,
                roles: ['moderator', 'admin'],
            },
        },
        {
            path: '/note',
            name: 'Manager',
            component: Manager,
        },
        {
            path: '/adscast',
            name: 'Adscast',
            component: AdsCast,
        },
        {
            path: '/remote',
            name: 'Remote',
            component: Remote,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moderator', 'admin', 'manager'],
            },
        },
        {
            path: '/upload',
            name: 'Upload',
            component: Uploads,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moderator', 'admin', 'manager'],
            },
        },
        {
            path: '/bugreport',
            name: 'Bug report',
            component: BugRep,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moderator', 'admin', 'manager'],
            },
        },
        {
            path: '/cast',
            name: 'Broadcast',
            component: Cast,
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: NotFound,
        },
    ],
});

/**
 * Защита маршрутов (доступ только для авторизованных пользователей с соответствующей ролью)
 */
router.beforeEach((to, from, next) => {
    if (!to.meta.needsAuth) {
        return next();
    }
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return next('/login');
    }
    if (to.meta.roles.includes(user.role.role)) {
        return next();
    } else {
        return next('/404');
    }
});
