<template>
    <div class="intro">
		<toast :time="currentTime" :successCb="successMessage" :errorCb="errorMessage" :infoCb="infoMessage"></toast>

        <div class="container">
            <h6 class="text mt-4"> Объявления </h6>

			<div v-if="this.session.loggedin" class="content">
				<!-- Вкладки -->
				<ul class="nav nav-pills" id="pills-tab" role="tablist">
					<li class="nav-item" role="presentation">
						<button class="nav-link active" id="pills-templates-alerts" data-bs-toggle="pill" data-bs-target="#pills-alerts" type="button" role="tab" aria-selected="true">Уведомления</button>
					</li>
				</ul>
			</div>
			
			<!-- Содержимое вкладок -->
			<div class="tab-content" id="pills-tabContent">
				<div class="tab-pane fade show active" id="pills-alerts" role="tabpanel" aria-labelledby="pills-templates-alerts" tabindex="0"> 
					<div class="p-0 m-1 border-0">
						<div class="content">
							<!-- Example Code -->
							<div v-if="this.notes.length === 0"> На данный момент объявлений нет </div>
							<ul v-if="this.notes.length > 0" class="list-group">
								<div v-for="(ad, index) in this.notes">
									<li v-if="(this.session.loggedin && (ad.personal === null || ad.personal === this.session.name)) || ad.translate === true" :class="getClass(ad)">
										<div class="ms-1 me-1 row">
											<div class="fw col-12 col-md-10 col-xl-11 align-items-center text-align-center mb-2">
												<div class="row">
													<div v-if="ad.translate" class="col-auto"> ★ </div>
													<strong class="col-auto"> {{ ad.name }} </strong>
													<small class="col-auto">
														<div class="row justify-content-start">
															<div v-if="ad.timeOfLife === '9999-01-01'" class="col-auto">
																Актуально: бессрочно;
															</div>
															<div v-if="ad.timeOfLife !== '9999-01-01'" class="col-auto">
																Актуально до: {{ ad.timeOfLife }};
															</div>
															<i class="col-auto"> {{ ad.author }} </i>
														</div>
													</small>
												</div>	
												{{ ad.comment }}
											</div>
										
											<div v-if="['admin', 'moder', 'adsender'].includes(this.session.role) || ad.personal === this.session.name" class="col-12 col-md-2 col-xl-1">
												<span class="badge w-100 p-0" style="position: relative; left: 50%; top: 50%; transform: translate(-50%, -50%);">
													<button name="deleteNote" type="submit" @click="delNote(ad.id, index)" class="btn btn-outline-danger w-100" >
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
															<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
															</svg>
															<!-- Удалить -->
														</button>
												</span>
											</div>
											
										</div>
									</li>
								</div>
							</ul>
						</div>
						
						<div v-if="['admin', 'moder', 'adsender'].includes(this.session.role)">
							<div class="content">
								<div class="mb-3">
								<label for="nameIn" class="form-label">Уведомление</label>
								<input v-model="this.ad_name" type="text" class="form-control" id="nameIn" name="name" placeholder="Заголовок уведомления"/>
								</div>
								<div class="mb-3">
									<label for="commentIn" class="form-label">Сообщение</label>
									<textarea v-model="this.ad_comment" class="form-control" id="commentIn" name="comment" rows="3" placeholder="Текст уведомления"></textarea>
								</div>
								<div class="row m-0 g-2 align-items-center">
									<div class="col-12 col-md-4 form-check form-switch">
										<input v-model="this.ad_translate" name="translate" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
										<label class="form-check-label" for="flexSwitchCheckChecked">
											Отображать на трансляции
										</label>
									</div>
									<div class="col-12 col-md-4 form-check form-switch">
										<input v-model="this.ad_endless" name="unlimited" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"/>
										<label class="form-check-label" for="flexSwitchCheckChecked">Бессрочное объявление</label>
									</div> 
									<div v-if="!ad_endless" class="col-12 col-md-4 p-0">
										<div class="col-12"> Актуально до: </div>
										<div class="col-12">  
											<input v-model="this.ad_actual" name="time" value="" id="addDate" class="col form-control m-0" type="date" style="margin-left: 12px; margin-right: 12px" min="2023-01-26" max="2024-01-30"/>
										</div>
									</div>
								</div>
								<div class="row g-3 mt-1">
									<div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
										<button @click="this.addNote()" class="btn btn-success w-100" type="button">
											Отправить уведомление
										</button>
									</div>
									<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
										<a href="./adscast" class="btn btn-info w-100" type="button">
											Просмотр
										</a>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
        </div>
    </div>
</template>

<script> 
import toast from '../components/toasts.vue';

export default {
  	inject: ['getSession', 'getSocket'],
	components: { toast },
	data() {
		return {
			socket: {},
			session: this.getSession(),
			notes: [],
			ad_name: '',
			ad_comment: '',
			ad_endless: false,
			ad_actual: '',
			ad_translate: false,
			ad_time: '',

			succCallback: [],     // Колбек - успешно
			errCallback: [],      // Колбек - ошибка

			successMessage: null, // Текст успешной операции
			errorMessage: null,   // Текст ошибки
			infoMessage: null,

			currentTime: null,
		}
	},
	methods: {
		connect() {
			this.succCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
			this.errCallback = new bootstrap.Toast(document.getElementById("ToastError"));

			this.socket = this.getSocket();

			this.socket.on('note:new', (data) => {
				this.notes = data.ads.concat(this.notes);
            });

			this.socket.on('note:del', (data) => {
				let dex;
				for (let i in this.notes) 
					if (this.notes[i].id === data.id) 
						dex = i;
					
				this.notes.splice(dex, 1);
            });
		},
		getClass(ad) {
			return {
				'list-group-item list-group-item-info justify-content-between align-items-center':     ad.personal === this.session.name && ad.name === 'Запрос отправлен',
				'list-group-item list-group-item-danger justify-content-between align-items-center':   ad.personal === this.session.name && ad.name === 'Запрос отклонён',
				'list-group-item list-group-item-success justify-content-between align-items-center':  ad.personal === this.session.name,
				'list-group-item justify-content-between align-items-center':                          ad.personal !== this.session.name,
			}
		},
		  // На, переворачивай
		setCalendar() {
			let date_ob = new Date();
			let dd = ("0" + date_ob.getDate()).slice(-2);
			let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
			let yyyy = date_ob.getFullYear();
			let minDate = yyyy + '-' + mm + '-' + dd;
			let maxDate = (Number(yyyy) + 1) + '-' + mm + '-' + dd;
			this.ad_actual = minDate;

			document.getElementById('addDate').min = minDate;
			document.getElementById('addDate').max = maxDate;
			document.getElementById('addDate').value = minDate;
		},
		  // Получить время
		async getTime() {
			// Дата - время callback
			let date_ob = new Date();
			let hour = date_ob.getHours();
			if (hour < 10) hour = "0" + hour;
			let min = date_ob.getMinutes();
			if (min < 10) min = "0" + min;
			let sec = date_ob.getSeconds();
			if (sec < 10) sec = "0" + sec;
			this.currentTime = hour + ':' + min + ':' + sec;
		},
		  // Получение всех уведомлений
		async getNotes() {
			let response;
			if (this.session.loggedin)
				response = await fetch(`/note/getall`, {
					method: 'GET',
					// THIS IS IMPORTANT
					headers: new Headers({
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'sameSite' : ' None; Secure',
						'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
					}) 
				});
			else 
				response = await fetch(` /note/public`, {
					method: 'GET',
					// THIS IS IMPORTANT
					headers: new Headers({
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}) 
				});
			this.notes = await response.json();
		},
		clearFlags() {
				// Сброс флагов
			this.ad_name = '';
			this.ad_comment = '';
			this.ad_endless = false;
			this.ad_time = '';
			this.ad_translate = false;
		},
			// Новое уведомление
		async addNote() {
			await this.getTime();
			if (this.ad_name.length > 100) {
				this.errorMessage = 'Длина заголовка не должна превышать 100 символов.';
				this.errCallback.show();
				return;
			}

			let response = await fetch(`/note`, this.options('PATCH', {
				name: this.ad_name,
				comment: this.ad_comment,
				translate: this.ad_translate,
				unlimited: this.ad_endless,
				time: this.ad_actual
			}));
			let obj = (await response.json());

			this.clearFlags();
		
			if (obj.callback === 'success') {
				this.successMessage = obj.message;
				this.succCallback.show();
				this.notes = obj.ads.concat(this.notes);

					// EMIT FOR ALL USERS
				this.socket.emit('new_note', { ads: obj.ads });

			} else {
				this.errorMessage = obj.message;
				this.errCallback.show();
			}
		},
			// Удалить объявление
		async delNote(id, index) {
			await this.getTime();
	
			await fetch(`/note`, this.options('DELETE', { id }));
			this.notes.splice(index, 1);

			this.successMessage = 'Объявление было успешно удалено.';
			this.succCallback.show();

			this.socket.emit('del_note', { id });
		},

		options(method, body) {
			return {
				method: method,
				headers: {
					'Content-type': 'application/json; charset=UTF-8', // Indicates the content
					'sameSite' : ' None; Secure',
					'x-access-token' : JSON.parse(localStorage.getItem('user'))?.token || 'none',
				},
				body: JSON.stringify(body),
			}
		},
	},
	  // Действие при загрузке страницы
	async mounted() {
		this.connect();
		await this.getNotes();
		if (['admin', 'moder', 'adsender'].includes(this.session.role))
		  	this.setCalendar();
	}
}

</script>