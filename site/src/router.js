
import Router from 'vue-router'
import Forms from './components/Forms'
import Settings from './components/Settings'
import Account from './components/Account'
import Layout from './components/Layout'
import Setup from './components/Setup'
import Authenticate from './components/Authentication/Authenticate'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import Recover from './components/Authentication/Recover'
import Messages from './components/Messages'
import DemoForm from './components/DemoForm'
import Unsubscribe from './components/Unsubscribe'

let router = new Router({
    mode: 'history',
    routes: [

        {
            path: '/app/:website_index/',
            name: 'Home',
            component: Layout,

            children: [
                {

                    path: 'forms',
                    name: 'Forms',
                    component: Forms
                }, {
                    path: 'settings',
                    name: 'Settings',
                    component: Settings
                }, {
                    path: 'account',
                    name: 'Account',
                    component: Account
                }, {
                    path: 'messages',
                    name: 'Messages',
                    component: Messages
                }
            ]

        },
        {
            path: '/setup',
            name: 'Setup',
            component: Setup // todo replace
        },
        {
            path: '/',
            name: 'Home',
            beforeEnter: (to, from, next) => {
                if (process.env.NODE_ENV === 'development') { window.location.href = '/landing.html' } else { window.location.href = '/' }
            }
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
            path: '/app/demo/:endpoint',
            name: 'DemoForm',
            component: DemoForm
        },
        {
            path: '/unsubscribe/:unsubscribeUrl',
            name: 'Unsubscribe',
            component: Unsubscribe
        }

    ]
})

export default router
