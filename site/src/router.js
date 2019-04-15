import Vue from 'vue'
import Router from 'vue-router'
import Forms from './components/Forms'
import Settings from './components/Settings'
import Layout from './components/Layout'
import Setup from './components/Setup'
import LandingPage from './components/LandingPage'
import Authenticate from './components/Authentication/Authenticate'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import Recover from './components/Authentication/Recover'
import Messages from './components/Messages'
import DemoForm from "./components/DemoForm";


Vue.use(Router);


let router = new Router({
    mode: 'history',
    routes: [

        {
            path: '/app',
            name: 'Home',
            component: Layout,
            children: [{

                path: '/app/forms',
                name: 'Forms',
                component: Forms
            }, {
                path: '/app/settings/:website_index',
                name: 'Settings',
                component: Settings
            }, {
                path: '/app/messages',
                name: 'Messages',
                component: Messages
            }
            ]


        },
        {
            path: '/setup',
            name: 'Setup',
            component: Setup //todo replace
        },
        {
            path: '/',
            name: 'Landing Page',
            component: LandingPage
        },
        {
            path: '/auth',
            name: 'Authentication',
            component: Authenticate,
            children: [
                {
                    path: '/auth/login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: '/auth/register',
                    name: 'Register',
                    component: Register
                },
                {
                    path: '/auth/recover',
                    name: 'Recover',
                    component: Recover
                }
            ]
        },
        {
            path:'/app/demo/:endpoint',
            name:'DemoForm',
            component:DemoForm
        }

    ]
});




export default router;