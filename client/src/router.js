import { createRouter, createWebHistory } from "vue-router";
import Editor   from './views/Editor.vue';
import Moders   from './views/Moder.vue';
import Manager  from './views/Manager.vue';
import AdsCast  from './views/AdsCast.vue';
import Admins   from './views/Admin.vue';
import Uploads  from './views/FileUpload.vue';
import Index    from './views/MainPage.vue';
import Guide    from './views/Guide.vue';
import Login    from './views/Auth.vue';
import NotFound from './views/Error.vue';
import Cast     from './views/Cast.vue';
import BugRep   from './views/BugReport.vue';
import Remote   from './views/Remote.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {   path: '/', redirect: '/index' },
        {
            path: '/index',
            name: 'MainPage',
            component: Index
        },
        {
            path: '/login',
            name: 'SignIn',
            component: Login
        },
        {
            path: '/guide',
            name: 'Guide',
            component: Guide
        },
        {
            path: '/event',
            name: 'Editor',
            component: Editor,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moder', 'admin']
            }
        },
        {
            path: '/account',
            name: 'Admin',
            component: Admins,
            meta: {
                needsAuth: true,
                roles: ['admin']
            }
        },
        {
            path: '/moder',
            name: 'Moder',
            component: Moders,
            meta: {
                needsAuth: true,
                roles: ['moder', 'admin']
            }
        },
        {
            path: '/note',
            name: 'Manager',
            component: Manager,
        },
        {
            path: '/adscast',
            name: 'Adscast',
            component: AdsCast
        },
        {
            path: '/remote',
            name: 'Remote',
            component: Remote
        },
        {
            path: '/upload',
            name: 'Upload',
            component: Uploads,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moder', 'admin', 'adsender']
            }
        },
        {
            path: '/bugreport',
            name: 'Bug report',
            component: BugRep,
            meta: {
                needsAuth: true,
                roles: ['editor', 'moder', 'admin', 'adsender']
            }
        },
        {
            path: '/cast',
            name: 'Broadcast',
            component: Cast
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: NotFound
        }
    ]
});

    // Route protect
router.beforeEach((to, from, next) => {
    if (to.meta.needsAuth) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user)
            if (to.meta.roles.includes(user.role)) 
                return next();
            else 
                return next('/404');
        else
            return next('/login');
    }
    return next();
}); 