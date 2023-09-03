<template>
	<link v-if="this.$route.name !== 'Broadcast'" rel="stylesheet" href="/css/style_new.css">
	<link v-if="this.$route.name === 'Broadcast'" rel="stylesheet" href="/css/style.css">

	<div class="modal fade" id="ErrorCompatibilityModal" data-bs-backdrop="static" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
			<h1 class="modal-title fs-5" id="exampleModalToggleLabel" style="color:red">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
					<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
					</path>
				</svg>
				Ошибка совместимости
			</h1>
			</div>
			<div class="modal-body">
			<strong> Ваш браузер: {{ this.browserName }} версии {{ this.browserVersion }} не поддерживается. </strong>
			<p></p>
				Для корректной работы в системе необходимо использовать одну из следующих версий браузеров:
			<ul class="list-group">
				<li :class="'list-group-item ' + (this.browserName === 'Firefox' ? 'list-group-item-danger' : '')"> Firefox 92 и выше </li>
				<li :class="'list-group-item ' + (this.browserName === 'Chrome' ? 'list-group-item-danger' : '')"> Chrome 94 и выше </li>
				<li :class="'list-group-item ' + (this.browserName === 'Microsoft Edge' ? 'list-group-item-danger' : '')"> Edge 94 и выше </li>
				<li :class="'list-group-item ' + (this.browserName === 'Opera' ? 'list-group-item-danger' : '')"> Opera 80 и выше </li>
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
					<img src="/public/favicon.ico" alt="" width="0" height="0">
				</span>
				<div class="text logo-text">
					<span v-if="this.session.loggedin && this.session.name" class="name ms-2" style="max-width: 185px;">{{ this.session.name }}</span>
					<span v-if="!this.session.loggedin || !this.session.name" class="name ms-2" style="max-width: 185px;"> EditorService </span>

					<span v-if="this.session.loggedin && this.session.name" class="profession ms-2" style="max-width: 185px;"> {{ this.getRole() }} </span>
					<span v-if="!this.session.loggedin || !this.session.name" class="profession ms-2" style="max-width: 185px; font-size: 13px;"> Система отображения </span>
				</div>
				</div>
				<i class='bx bx-chevron-right toggle'></i>
			</header>

			<div class="menua-bar">
				<div class="menua">
					<li class="nav-linka">
						<router-link @click="closeTab(); moderCheck('index')" class="position-relative" to="/index">
							<!-- <a href="/index" class="position-relative"> -->
							<i class='bx bx-home-alt icon'></i>
							<span class="text nav-text">Главная</span>
							<!-- </a> -->
						</router-link>
					</li>

					<li v-if="this.session.loggedin && ['admin', 'editor', 'moder'].includes(this.session.role)" class="nav-linka">
						<router-link @click="closeTab(); moderCheck('editor')" class="position-relative" to="/event">
							<i class='bx bx-edit-alt icon'></i>
							<span class="text nav-text">Редактор</span>
						</router-link>
					</li>

					<li class="nav-linka">
						<router-link @click="closeTab(); moderCheck('note')" class="position-relative" to="/note">
							<i class='bx bx-bell icon'></i>
							<span v-if="this.session.noread > 0" class="position-absolute top-40 start-30 translate-middle badge rounded-pill bg-danger" style="margin-left:40px"> {{ this.session.noread }} </span>
							<span class="text nav-text">Уведомления</span>
						</router-link>
					</li>

					<li v-if="this.session.loggedin && ((this.session.role === 'admin') || (this.session.role === 'moder'))" class="nav-linka">
						<router-link @click="closeTab(); moderCheck('moder')" class="position-relative" to="/moder">
							<i class='bx bx-calendar-check icon'></i>
							<span class="text nav-text">Модерация</span>
						</router-link>
					</li>

					<li v-if="this.session.loggedin && this.session.role === 'admin'" class="nav-linka">
						<router-link @click="closeTab(); moderCheck('admin')" class="position-relative" to="/account">
							<i class='bx bx-wrench icon'></i>
							<span class="text nav-text">Управление</span>
						</router-link>
					</li>

					<li v-if="this.session.loggedin && ['admin', 'moder', 'adsender', 'editor'].includes(this.session.role)" class="nav-linka">
						<router-link @click="closeTab()" class="position-relative" to="/remote">
						<i class='bx bx-tv icon'></i>
						<span class="text nav-text">Пульт</span>
						</router-link>
					</li>

					<li v-if="this.session.loggedin" class="nav-linka">
						<router-link @click="closeTab()" class="position-relative" to="/upload">
						<i class='bx bx-cloud-upload icon'></i>
						<span class="text nav-text">Ресурсы</span>
						</router-link>
					</li>


					<li class="nav-linka">
						<router-link @click="closeTab(); moderCheck('guide')" class="position-relative" to="/guide">
						<i class='bx bx-info-circle icon'></i>
						<span class="text nav-text">Инструкция</span>
						</router-link>
					</li>

					<!-- <li class="nav-linka">
						<a href="http://rstring.mgul.ac.ru:40000/" class="position-relative">
						<i class='bx bx-music icon'></i>
						<span class="text nav-text">Заказ музыки</span>
						</a>
					</li>

					<li class="nav-link">
						<a href="http://rstring.mgul.ac.ru:3000/" class="position-relative">
						<i class='bx bx-terminal icon'></i>
						<span class="text nav-text">Бегущая строка</span>
						</a>
					</li> -->
				</div>

				<div class="bottom-content">
					<li v-if="this.session.loggedin" class="nav-linka">
						<router-link @click="closeTab(); moderCheck('bugreport')" to="/bugreport" class="position-relative">
						<i class='bx bx-bug icon'></i>
						<span class="text nav-text">Баг репорт</span>
						</router-link>
					</li>

					<li class="nav-linka">
						<router-link @click="closeTab(); moderCheck('cast')" to="/cast" class="position-relative">
						<i class='bx bx-cast icon'></i>
						<span class="text nav-text">Просмотр</span>
						</router-link>
					</li>

					<li class="">
						<router-link @click="onLogout(); moderCheck('auth')" v-if="this.session.loggedin && this.session.name" class="position-relative" to="/login">
							<i class='bx bx-log-out icon'></i>
							<span  class="text nav-text">Выйти</span>
						</router-link>
						<router-link @click="closeTab(); moderCheck('auth')" v-if="!this.session.loggedin || !this.session.name" class="position-relative" to="/login">
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
			<router-view/>
		</section>
	</body>
</template>

<script>
import Bowser from "bowser"; 
import io from "socket.io-client";
import { computed } from 'vue';

export default {
	provide() {
	  	return {
			osName: () => this.osName,
			osVersion: () => this.osVersion,
			getSocket: () => this.socket,
			getSession: () => this.session,
			browserName: () => this.browserName,
			browserVersion: () => this.browserVersion,
			browserEngineName: () => this.browserEngineName
		}
	},
	data() {
		return {
			socket: io('ws://' + window.API_URL.substring(7, 24)),	

			session: {
				loggedin: 	 computed(() => !!this.$store.state.authentication.user?.name),
				role: 		 computed(() => this.$store.state.authentication.user?.role),
				name: 		 computed(() => this.$store.state.authentication.user?.name),
				noread: 	 computed(() => this.$store.state.authentication.user?.noread),
			},		

			page: '',
			api_url: '',
			oldBrowserModal: {},	// Модалка устаревших браузеров

				// USER's DATA
			osName: {},	
			osVersion: {},
			browser: {},		
		  	browserName: {},
		  	browserVersion: {},
			browserEngineName: {}
		}
	},
	methods: {	
			// WS connection
		connect() {
			this.socket = io('ws://' + window.API_URL.substring(7, 24));
			this.socket.emit('socket_auth', this.session.name);

			this.socket.on('note:new', (data) => {
				if (this.page !== 'note') {
					let user = localStorage.getItem('user');
					user.noread++;
					localStorage.removeItem('user');
					localStorage.setItem('user', user);
				}
			});
		},
			// Convert role to write form
		getRole() {
			const en_role = ['admin', 		  'editor',   'moder', 	   'adsender'];
			const ru_role = ['Администратор', 'Редактор', 'Модератор', 'Менеджер'];
			return ru_role[en_role.indexOf(this.session.role)];
		},
			// Sidebar & states options
		onLoad() {
			const 	body = document.querySelector('body'),
					sidebar = body.querySelector('nav'),
					toggle = body.querySelector(".toggle"),
					modeSwitch = body.querySelector(".toggle-switch"),
					modeText = body.querySelector(".mode-text");

			toggle.addEventListener("click" , () => {
				sidebar.classList.toggle("close");
				if (sidebar.classList.contains("close")) 
					localStorage.setItem("status", "close");
				else
					localStorage.setItem("status", "open");
			});

			let getStatus = localStorage.getItem("status");
			if (getStatus && getStatus === "open") 
				sidebar.classList.toggle("close"); 

			function mobile(windowInnerWidth) {
				if (windowInnerWidth <= 768) 
					sidebar.classList.add("mobile");
				else 
					sidebar.classList.remove("mobile");
			}

			window.addEventListener('resize', () => {
				mobile(window.innerWidth);
			}, true);


			document.addEventListener("DOMContentLoaded", () => {
				let getMode = localStorage.getItem("mode");
				mobile(window.innerWidth);
				if (sidebar.classList.contains("mobile")) {
					sidebar.classList.add("close");
					localStorage.setItem("status", "close");
				}

				if (getMode && getMode === "light") {
					body.classList.toggle("dark");
					body.setAttribute("data-bs-theme", "light");
				} else if (getMode && getMode === "dark") 
					body.setAttribute("data-bs-theme", "dark");
				else if (window.matchMedia) {
				// Check if the dark-mode Media-Query matches
					if (window.matchMedia('(prefers-color-scheme: light)').matches) {
						// localStorage.setItem("mode", "light");
						body.classList.toggle("dark");
						// var home = document.getElementById("home");
						body.setAttribute("data-bs-theme", "light");
						modeText.innerText = "Светлая тема";
					} else {
						// localStorage.setItem("mode", "dark");
						modeText.innerText = "Темная тема";
						// var home = document.getElementById("home");
						body.setAttribute("data-bs-theme", "dark");
					}
				} else // Default (when Media-Queries are not supported)
					body.setAttribute("data-bs-theme", "dark");

				modeSwitch.addEventListener("click" , () => {
					body.classList.toggle("dark");

					if (body.classList.contains("dark")) {
						modeText.innerText = "Светлая тема";
						localStorage.setItem("mode", "light");
						// var home = document.getElementById("home");
						body.setAttribute("data-bs-theme", "light");
					} else {
						modeText.innerText = "Темная тема";
						localStorage.setItem("mode", "dark");
						// var home = document.getElementById("home");
						body.setAttribute("data-bs-theme", "dark");
					}
				});
			});
		},
			// On mobile devices tab closer
		async closeTab() {
			if (window.innerWidth <= 768 && !document.body.querySelector('nav').classList.contains("close")) {
				document.body.querySelector('nav').classList.add("close");
				localStorage.setItem("status", "close");
			}
		},
			// Class for hide sidebar 
		getClass() {
			if (this.$route.name === 'Adscast') 
				return 'home cast';
			return 'home';
		},
			// fetch axios params 
		options(method, body) {
			return {
				method: method,
				headers: {
					'Content-type': 'application/json; charset=UTF-8', // Indicates the content
					'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
				},
				body: JSON.stringify(body),
			}
		},
			// Do something where user Logging out
	  	async onLogout() {
			this.socket = {};
			await this.closeTab();
		},
			// Update store & properties with session data from cookies
	  	refreshSession() {
			if (localStorage.getItem('user')) 
				this.connect();
		},
			// Detection user's browser & OS 
	  	browserDetect() {
			this.browser = Bowser.getParser(window.navigator.userAgent);
			this.browserName = this.browser.getBrowserName();
			this.browserVersion = this.browser.getBrowserVersion(); 
			this.osName = this.browser.getOSName();
			this.osVersion = this.browser.getOSVersion();
			this.browserEngineName = this.browser.getEngineName();

			if ((this.browserName === 'Firefox' && Number(this.browserVersion.split('.')[0]) < 84) ||
				(this.browserName === 'Chrome'  && Number(this.browserVersion.split('.')[0]) < 80) ||
				(this.browserName === 'Microsoft Edge'    && Number(this.browserVersion.split('.')[0]) < 88) ||
				(this.browserName === 'Opera'   && Number(this.browserVersion.split('.')[0]) < 66) ||
				(this.browserName === 'Yandex Browser'   && Number(this.browserVersion.split('.')[0]) < 20) ||
				(this.browserName === 'Safari'  && Number(this.browserVersion.split('.')[0]) < 14))
			{
			  this.oldBrowserModal = new bootstrap.Modal(document.getElementById('ErrorCompatibilityModal'));
			  this.oldBrowserModal.show();
			}
		},
			// Auto close processing where moder leave page
		async moderAutoCloseProcessing() {
			await fetch(`/moder/endprocess`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
				},
				body: JSON.stringify({ name: this.session.name }),
			});
			this.socket.emit('end-process', { name: this.session.name });
		},
		async moderCheck(page) {
			if (this.page === 'moder' && page !== 'moder') 
				await this.moderAutoCloseProcessing();
			this.page = page;
		}
	},
  	mounted() {
		this.onLoad();	
		this.browserDetect();
		this.refreshSession();	

		this.emitter.on('refresh', (token) => {
			this.refreshSession();
			if (!this.session.loggedin) 
				this.$router.push('/');
		});

			// SPA service worker 
		if ("serviceWorker" in navigator) 
			navigator.serviceWorker.register("/pwabuilder-sw.js");
  	}
}
</script>