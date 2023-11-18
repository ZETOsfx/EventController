<script>
import Bowser from "bowser";
import io from "socket.io-client";
import toast from './components/toasts.vue';
import { computed } from 'vue';

export default {
    components: {
        toast,
    },
    provide()
    {
        return {
            osName: () => this.osName,
            osVersion: () => this.osVersion,
            socket: () => this.socket,
            session: () => this.session,
            browserName: () => this.browserName,
            browserVersion: () => this.browserVersion,
            browserEngineName: () => this.browserEngineName,

            options: (method, body) => this.options(method, body),
            toast: (type, msg) => this.toast(type, msg),
            clickBlock: (flag) => this.clickBlock(flag),
            formNextFocus: (id) => this.formNextFocus(id),
        }
    },
    data()
    {
        return {
            socket: io('ws://' + window.API_URL.substring(7, 24)),

            session: {
                loggedin: computed(() => !!this.$store.state.authentication.user?.name),
                role: computed(() => this.$store.state.authentication.user?.role.role),
                name: computed(() => this.$store.state.authentication.user?.name),
                unread: computed(() => this.$store.state.authentication.user?.unread),
            },

            page: '',
            api_url: '',
            oldBrowserModal: {},

            currentTime: {},
            successMessage: '',
            errorMessage: '',
            infoMessage: '',
            successCallback: {},
            errorCallback: {},
            infoCallback: {},

            osName: {},
            osVersion: {},
            browser: {},
            browserName: {},
            browserVersion: {},
            browserEngineName: {}
        }
    },
    methods: {
        /**
         * Соединение по WebSocket
         */
        connect()
        {
            this.socket = io('ws://' + window.API_URL.substring(7, 24));
            this.socket.emit('socket_auth', this.session.name);

            this.socket.on('note:new', (data) =>
            {
                if (this.page !== 'note') {
                    let user = localStorage.getItem('user');
                    user.unread++;
                    localStorage.removeItem('user');
                    localStorage.setItem('user', user);
                }
            });
        },

        /**
         * Преобразование именования ролей из формата базы данных в пользовательские
         */
        getRole()
        {
            const en_role = ['admin', 'editor', 'moderator', 'manager'];
            const ru_role = ['Администратор', 'Редактор', 'Модератор', 'Менеджер'];
            return ru_role[en_role.indexOf(this.session.role)];
        },

        /**
         * Конфигурация боковой панели
         */
        onLoad()
        {
            const body = document.querySelector('body'),
                sidebar = body.querySelector('nav'),
                toggle = body.querySelector(".toggle"),
                modeSwitch = body.querySelector(".toggle-switch"),
                modeText = body.querySelector(".mode-text");

            toggle.addEventListener("click", () =>
            {
                sidebar.classList.toggle("close");
                if (sidebar.classList.contains("close")) {
                    localStorage.setItem("status", "close");
                } else {
                    localStorage.setItem("status", "open");
                }
            });

            let getStatus = localStorage.getItem("status");
            if (getStatus && getStatus === "open") {
                sidebar.classList.toggle("close");
            }

            function mobile(windowInnerWidth)
            {
                if (windowInnerWidth <= 768) {
                    sidebar.classList.add("mobile");
                } else {
                    sidebar.classList.remove("mobile");
                }
            }

            window.addEventListener('resize', () =>
            {
                mobile(window.innerWidth);
            }, true);


            document.addEventListener("DOMContentLoaded", () =>
            {
                let getMode = localStorage.getItem("mode");
                mobile(window.innerWidth);
                if (sidebar.classList.contains("mobile")) {
                    sidebar.classList.add("close");
                    localStorage.setItem("status", "close");
                }

                if (getMode && getMode === "light") {
                    body.classList.toggle("dark");
                    body.setAttribute("data-bs-theme", "light");
                } else if (getMode && getMode === "dark") {
                    body.setAttribute("data-bs-theme", "dark");
                } else if (window.matchMedia) {
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                        body.classList.toggle("dark");
                        body.setAttribute("data-bs-theme", "light");
                        modeText.innerText = "Светлая тема";
                    } else {
                        modeText.innerText = "Темная тема";
                        body.setAttribute("data-bs-theme", "dark");
                    }
                } else {
                    body.setAttribute("data-bs-theme", "dark");
                }

                modeSwitch.addEventListener("click", () =>
                {
                    body.classList.toggle("dark");

                    if (body.classList.contains("dark")) {
                        modeText.innerText = "Светлая тема";
                        localStorage.setItem("mode", "light");
                        body.setAttribute("data-bs-theme", "light");
                    } else {
                        modeText.innerText = "Темная тема";
                        localStorage.setItem("mode", "dark");
                        body.setAttribute("data-bs-theme", "dark");
                    }
                });
            });
        },

        /**
         * Установка общих Toasts и Modals
         */
        configureModals()
        {
            this.successCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
            this.errorCallback = new bootstrap.Toast(document.getElementById("ToastError"));
            this.infoCallback = new bootstrap.Toast(document.getElementById("ToastInfo"));
        },

        /**
         * Автоматические закрытие боковой панели после выбора на мобильных устройствах
         */
        async closeTab(page = '')
        {
            if (window.innerWidth <= 768 && !document.body.querySelector('nav').classList.contains("close")) {
                document.body.querySelector('nav').classList.add("close");
                localStorage.setItem("status", "close");
            }

            if (this.page === 'moderator' && page !== 'moderator') {
                await fetch('/control/refund', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                    },
                });
                this.socket.emit('end-process', { name: this.session.name });
            }

            this.page = page;
        },

        /**
         * Скрытие боковой панели на необходимых страницах
         */
        getClass()
        {
            if (['Adscast'].includes(this.$route.name)) {
                return 'home cast';
            }
            return 'home';
        },

        /**
         * Действие при выходе пользователя из профиля
         */
        async onLogout()
        {
            this.socket = {};
            await this.closeTab();
        },

        /**
         * Обновление данных сессии из Cookie
         */
        refreshSession()
        {
            if (localStorage.getItem('user')) {
                this.connect();
            }
        },

        /**
         * Определение браузера и ОС пользователя (для репортов и ограничения версий)
         */
        browserDetect()
        {
            this.browser = Bowser.getParser(window.navigator.userAgent);
            this.browserName = this.browser.getBrowserName();
            this.browserVersion = this.browser.getBrowserVersion();
            this.osName = this.browser.getOSName();
            this.osVersion = this.browser.getOSVersion();
            this.browserEngineName = this.browser.getEngineName();

            if ((this.browserName === 'Firefox' && Number(this.browserVersion.split('.')[0]) < 84) ||
                (this.browserName === 'Chrome' && Number(this.browserVersion.split('.')[0]) < 80) ||
                (this.browserName === 'Microsoft Edge' && Number(this.browserVersion.split('.')[0]) < 88) ||
                (this.browserName === 'Opera' && Number(this.browserVersion.split('.')[0]) < 66) ||
                (this.browserName === 'Yandex Browser' && Number(this.browserVersion.split('.')[0]) < 20) ||
                (this.browserName === 'Safari' && Number(this.browserVersion.split('.')[0]) < 14)) {

                this.oldBrowserModal = new bootstrap.Modal(document.getElementById('ErrorCompatibilityModal'));
                this.oldBrowserModal.show();
            }
        },

        /**
         * Клик по заблокированной форме
         *
         * @param blocked Флаг блокировки формы
         */
        async clickBlock(blocked)
        {
            await this.getTime();
            if (blocked) {
                this.toast('error', 'Начните редактирование формы для изменения данного параметра.');
            }
        },

        /**
         * Вывод сообщений пользователю в виде всплывающего окна
         *
         * @param type Тип сообщения [ 'error', 'success', 'info' ]
         * @param message Текст сообщения
         */
        toast(type, message)
        {
            this.getTime();
            switch (type) {
                case 'success':
                    this.successMessage = message;
                    this.successCallback.show();
                    break;
                case 'error':
                    this.errorMessage = message;
                    this.errorCallback.show();
                    break;
                case 'info':
                default:
                    this.infoMessage = message;
                    this.infoCallback.show();
            }
        },

        /**
         * Обертка для установки параметров при отправке запроса
         *
         * @param {*} method Метод запроса
         * @param {*} body Тело запроса
         */
        options(method, body)
        {
            return {
                method: method,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                },
                body: JSON.stringify(body),
            }
        },

        /**
         * Обновление текущего времени
         */
        async getTime()
        {
            let date_ob = new Date();

            let hour = date_ob.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }

            let min = date_ob.getMinutes();
            if (min < 10) {
                min = "0" + min;
            }

            let sec = date_ob.getSeconds();
            if (sec < 10) {
                sec = "0" + sec;
            }

            this.currentTime = hour + ':' + min + ':' + sec;
        },
        formNextFocus(id)
        {
            this.$nextTick(() =>
            {
                document.getElementById(id).focus({ focusVisible: true });
            });
        },
    },

    mounted()
    {
        this.onLoad();
        this.configureModals();
        this.browserDetect();
        this.refreshSession();

        this.emitter.on('refresh', (token) =>
        {
            this.refreshSession();
            if (!this.session.loggedin) {
                this.$router.push('/');
            }
        });

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/pwabuilder-sw.js");
        }
    }
}
</script>

<template>
    <link v-if="this.$route.name !== 'Broadcast'" rel="stylesheet" href="/css/style_new.css">
    <link v-if="this.$route.name === 'Broadcast'" rel="stylesheet" href="/css/style.css">

    <!-- Группировка toasts -->
    <toast :time="currentTime" :successCb="successMessage" :errorCb="errorMessage" :infoCb="infoMessage"></toast>

    <div class="modal fade" id="ErrorCompatibilityModal" data-bs-backdrop="static" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalToggleLabel" style="color:red">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        Ошибка совместимости
                    </h1>
                </div>
                <div class="modal-body">
                    <strong> Ваш браузер: {{ this.browserName }} версии {{ this.browserVersion }} не поддерживается.
                    </strong>
                    <p></p>
                    Для корректной работы в системе необходимо использовать одну из следующих версий браузеров:
                    <ul class="list-group">
                        <li :class="'list-group-item ' + (this.browserName === 'Firefox' ? 'list-group-item-danger' : '')"> Firefox 92 и выше </li>
                        <li :class="'list-group-item ' + (this.browserName === 'Chrome' ? 'list-group-item-danger' : '')"> Chrome 94 и выше </li>
                        <li :class="'list-group-item ' + (this.browserName === 'Microsoft Edge' ? 'list-group-item-danger' : '')"> Edge 94 и выше </li>
                        <li :class="'list-group-item ' + (this.browserName === 'Opera' ? 'list-group-item-danger' : '')">Opera 80 и выше </li>
                        <li :class="'list-group-item ' + (this.browserName === 'Yandex Browser' ? 'list-group-item-danger' : '')"> Yandex 22 и выше </li>
                        <li :class="'list-group-item ' + (this.browserName === 'Safari' ? 'list-group-item-danger' : '')"> Safari 15 и выше </li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <a v-if="this.browserName === 'Firefox'" href="https://www.mozilla.org/ru/firefox/new/" class="btn btn-success">Скачать актуальную версию Firefox</a>
                    <a v-if="this.browserName === 'Chrome'" href="https://www.google.ru/intl/ru/chrome/" class="btn btn-success">Скачать актуальную версию Chrome</a>
                    <a v-if="this.browserName === 'Edge'" href="https://www.microsoft.com/ru-ru/edge/download" class="btn btn-success">Скачать актуальную версию Edge</a>
                    <a v-if="this.browserName === 'Opera'" href="https://www.opera.com/ru/browsers" class="btn btn-success">Скачать актуальную версию Opera</a>
                    <a v-if="this.browserName === 'Safari'" href="https://support.apple.com/ru-ru/HT204416" class="btn btn-success">Обновить Safari</a>
                    <a v-if="this.browserName === 'Yandex Browser'" href="https://browser.yandex.ru/" class="btn btn-success">Обновить Yandex Browser</a>
                </div>
            </div>
        </div>
    </div>
    <body>
        <nav class="sidebar close" v-if="this.$route.name !== 'Broadcast' && this.$route.name !== 'Adscast'">
            <header>
                <div class="image-text">
                    <span class="image">
                        <img src="../public/favicon.ico" alt="" width="0" height="0">
                    </span>
                    <div class="text logo-text">
                        <span v-if="this.session.loggedin && this.session.name" class="name ms-2" style="max-width: 185px;">{{ this.session.name }}</span>
                        <span v-if="!this.session.loggedin || !this.session.name" class="name ms-2" style="max-width: 185px;"> EventController </span>
                        <span v-if="this.session.loggedin && this.session.name" class="profession ms-2" style="max-width: 185px;"> {{ this.getRole() }} </span>
                        <span v-if="!this.session.loggedin || !this.session.name" class="profession ms-2" style="max-width: 185px; font-size: 13px;"> Система отображения </span>
                    </div>
                </div>
                <i class='bx bx-chevron-right toggle'></i>
            </header>
            <div class="menua-bar">
                <div class="menua">
                    <li class="nav-linka">
                        <router-link @click="closeTab('main')" class="position-relative" to="/index">
                            <!-- <a href="/index" class="position-relative"> -->
                            <i class='bx bx-home-alt icon'></i>
                            <span class="text nav-text"> Главная </span>
                            <!-- </a> -->
                        </router-link>
                    </li>
                    <li v-if="this.session.loggedin && ['admin', 'editor', 'moderator'].includes(this.session.role)" class="nav-linka">
                        <router-link @click="closeTab('editor')" class="position-relative" to="/event">
                            <i class='bx bx-edit-alt icon'></i>
                            <span class="text nav-text"> Редактор </span>
                        </router-link>
                    </li>
                    <li class="nav-linka">
                        <router-link @click="closeTab('note')" class="position-relative" to="/note">
                            <i class='bx bx-bell icon'></i>
                            <span v-if="this.session.unread > 0"
                                class="position-absolute top-40 start-30 translate-middle badge rounded-pill bg-danger"
                                style="margin-left:40px"> {{ this.session.unread }}
                            </span>
                            <span class="text nav-text"> Уведомления </span>
                        </router-link>
                    </li>
                    <li v-if="this.session.loggedin && ((this.session.role === 'admin') || (this.session.role === 'moderator'))" class="nav-linka">
                        <router-link @click="closeTab('moderator')" class="position-relative" to="/moder">
                            <i class='bx bx-calendar-check icon'></i>
                            <span class="text nav-text"> Модерация </span>
                        </router-link>
                    </li>
                    <li v-if="this.session.loggedin && this.session.role === 'admin'" class="nav-linka">
                        <router-link @click="closeTab('admin')" class="position-relative" to="/account">
                            <i class='bx bx-wrench icon'></i>
                            <span class="text nav-text"> Управление </span>
                        </router-link>
                    </li>
                    <li v-if="this.session.loggedin && ['admin', 'moderator', 'manager', 'editor'].includes(this.session.role)" class="nav-linka">
                        <router-link @click="closeTab('remote')" class="position-relative" to="/remote">
                            <i class='bx bx-tv icon'></i>
                            <span class="text nav-text"> Пульт </span>
                        </router-link>
                    </li>
                    <li v-if="this.session.loggedin" class="nav-linka">
                        <router-link @click="closeTab('files')" class="position-relative" to="/upload">
                            <i class='bx bx-cloud-upload icon'></i>
                            <span class="text nav-text"> Ресурсы </span>
                        </router-link>
                    </li>
                    <li class="nav-linka">
                        <router-link @click="closeTab('tutor')" class="position-relative" to="/guide">
                            <i class='bx bx-info-circle icon'></i>
                            <span class="text nav-text"> Инструкция </span>
                        </router-link>
                    </li>
                </div>
                <div class="bottom-content">
                    <li v-if="this.session.loggedin" class="nav-linka">
                        <router-link @click="closeTab('bugreport')" to="/bugreport" class="position-relative">
                            <i class='bx bx-bug icon'></i>
                            <span class="text nav-text">Баг репорт</span>
                        </router-link>
                    </li>
                    <li class="nav-linka">
                        <router-link @click="closeTab('cast')" to="/cast" class="position-relative">
                            <i class='bx bx-cast icon'></i>
                            <span class="text nav-text">Просмотр</span>
                        </router-link>
                    </li>
                    <li class="">
                        <router-link @click="onLogout()" v-if="this.session.loggedin && this.session.name"
                            class="position-relative" to="/login">
                            <i class='bx bx-log-out icon'></i>
                            <span class="text nav-text">Выйти</span>
                        </router-link>
                        <router-link @click="closeTab()" v-if="!this.session.loggedin || !this.session.name"
                            class="position-relative" to="/login">
                            <i class='bx bx-log-in icon'></i>
                            <span class="text nav-text">Войти</span>
                        </router-link>
                    </li>
                    <li class="mode">
                        <div class="sun-moon">
                            <i class='bx bx-moon icon moon'></i>
                            <i class='bx bx-sun icon sun'></i>
                        </div>
                        <span class="mode-text text"> Тёмная тема </span>
                        <div class="toggle-switch">
                            <span class="switch"></span>
                        </div>
                    </li>
                </div>
            </div>
        </nav>

        <router-view v-if="this.$route.name === 'Broadcast'" />
        <section :class="getClass()" id="home" v-if="this.$route.name !== 'Broadcast'">
            <router-view />
        </section>
    </body>
</template>