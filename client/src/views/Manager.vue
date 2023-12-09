<script>
export default {
    inject: ['session', 'socket', 'toast', 'clickBlock', 'request'],
    data() {
        return {
            notes: [],
            noteName: '',
            noteDescription: '',
            noteIsEndless: false,
            noteExpires: '',
            giveNoteOnCast: false,
        };
    },
    methods: {
        async connect() {
            // this.socket().on('note:new', (data) =>
            // {
            //     this.notes = data.ads.concat(this.notes);
            // });
            //
            // this.socket().on('note:del', (data) =>
            // {
            //     let dex;
            //     for (let i in this.notes) {
            //         if (this.notes[i].id === data.id) {
            //             dex = i;
            //         }
            //     }
            //     this.notes.splice(dex, 1);
            // });
        },

        getClass(ad) {
            return {
                'list-group-item list-group-item-info justify-content-between align-items-center': ad.addressedTo === this.session().name && ad.name.includes('отправлен'),
                'list-group-item list-group-item-danger justify-content-between align-items-center': ad.addressedTo === this.session().name && ad.name.includes('отклонен'),
                'list-group-item list-group-item-success justify-content-between align-items-center': ad.addressedTo === this.session().name,
                'list-group-item justify-content-between align-items-center': ad.addressedTo !== this.session().name,
            };
        },

        setCalendar() {
            let date_ob = new Date();
            let dd = ('0' + date_ob.getDate()).slice(-2);
            let mm = ('0' + (date_ob.getMonth() + 1)).slice(-2);
            let yyyy = date_ob.getFullYear();
            let minDate = yyyy + '-' + mm + '-' + dd;
            let maxDate = Number(yyyy) + 1 + '-' + mm + '-' + dd;
            this.noteExpires = minDate;

            document.getElementById('addDate').min = minDate;
            document.getElementById('addDate').max = maxDate;
            document.getElementById('addDate').value = minDate;
        },

        async getAllNotes() {
            let response = await this.request('/notes/' + (this.session().loggedin ? 'read' : 'cast'), 'GET');
            response.status === 'success' ? (this.notes = response.data) : this.toast('error', 'Что-то пошло не так :(');
        },

        clearFlags() {
            this.noteName = '';
            this.noteDescription = '';
            this.noteIsEndless = false;
            this.giveNoteOnCast = false;
        },

        async addNote() {
            if (this.noteName.length > 100) {
                this.toast('error', 'Длина заголовка не должна превышать 100 символов.');
                return;
            }
            if (this.noteDescription.length > 300) {
                this.toast('error', 'Длина сообщения не должна превышать 300 символов.');
                return;
            }

            let response = await this.request('/notes/add', 'POST', {
                name: this.noteName,
                comment: this.noteDescription,
                translate: this.giveNoteOnCast,
                unlimited: this.noteIsEndless,
                time: this.noteExpires,
                addressedTo: null,
            });

            this.clearFlags();
            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }
            this.toast('success', 'Уведомление успешно добавлено.');
            this.notes = [response.data].concat(this.notes);
            // this.socket().emit('new_note', { ads: response.data });
        },

        async delNote(id, index) {
            let response = await this.request('/notes/delete', 'DELETE', { id });
            if (response.status !== 'success') {
                this.toast('error', 'Что-то пошло не так :(');
                return;
            }
            this.notes.splice(index, 1);
            this.toast('success', 'Объявление было успешно удалено.');
            // this.socket().emit('del_note', { id: id });
        },
    },
    async mounted() {
        await this.connect();
        await this.getAllNotes();

        if (['admin', 'moderator', 'manager'].includes(this.session().role)) {
            this.setCalendar();
        }
    },
};
</script>

<template>
    <div class="intro">
        <div class="container">
            <h6 class="text mt-4">Объявления</h6>
            <div v-if="this.session().loggedin" class="content">
                <ul class="nav nav-pills" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-templates-alerts" data-bs-toggle="pill" data-bs-target="#pills-alerts" type="button" role="tab" aria-selected="true">Уведомления</button>
                    </li>
                </ul>
            </div>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-alerts" role="tabpanel" aria-labelledby="pills-templates-alerts" tabindex="0">
                    <div class="p-0 border-0">
                        <div class="content">
                            <div v-if="this.notes.length === 0">На данный момент объявлений нет</div>
                            <ul v-if="this.notes.length > 0" class="list-group">
                                <div v-for="(ad, index) in this.notes">
                                    <li v-if="(this.session().loggedin && (ad.addressedTo === null || ad.addressedTo === this.session().name)) || ad.onBroadcast === true" :class="getClass(ad)">
                                        <div class="m-0">
                                            <div class="row">
                                                <div class="col-12 col-sm-9 col-md-10 col-xxl-10 mb-2">
                                                    <div v-if="ad.onBroadcast" class="badge bg-success text-wrap align-items-center me-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cast" viewBox="0 0 16 16">
                                                            <path d="m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z" />
                                                            <path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z" />
                                                        </svg>
                                                        Отображается на экране
                                                    </div>
                                                    <div v-if="ad.expires !== '9999-01-01'" class="badge bg-secondary text-wrap align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                        </svg>
                                                        {{ ad.expires }}
                                                    </div>
                                                    <div v-if="ad.expires === '9999-01-01'" class="badge bg-secondary text-wrap align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                        </svg>
                                                        Бессрочно
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3 col-md-2 col-xxl-2">
                                                    <div class="badge bg-secondary text-wrap align-items-center rounded-pill w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                        </svg>
                                                        {{ ad.author.name }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="fw col-12 col-sm-9 col-md-10 col-xl-11 align-items-center text-align-center mb-2">
                                                    <div class="row">
                                                        <strong class="col-auto"> {{ ad.name }} </strong>
                                                    </div>
                                                    {{ ad.comment }}
                                                </div>
                                                <div v-if="['admin', 'moderator', 'manager'].includes(this.session().role) || ad.addressedTo === this.session().name" class="col-12 col-sm-3 col-md-2 col-xl-1">
                                                    <span class="badge w-100 p-0" style="position: relative; left: 50%; top: 50%; transform: translate(-50%, -50%)">
                                                        <button name="deleteNote" type="submit" @click="delNote(ad.id, index)" class="btn btn-outline-danger w-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            </ul>
                        </div>
                        <!--ФОРМА ДОБАВЛЕНИЯ-->
                        <div v-if="['admin', 'moderator', 'manager'].includes(session().role)">
                            <div class="content">
                                <div class="mb-3">
                                    <label for="nameIn" class="form-label">Уведомление</label>
                                    <input v-model="noteName" type="text" class="form-control" id="nameIn" name="name" placeholder="Заголовок уведомления" />
                                </div>
                                <div class="mb-3">
                                    <label for="commentIn" class="form-label">Сообщение</label>
                                    <textarea v-model="noteDescription" class="form-control" id="commentIn" name="comment" rows="3" placeholder="Текст уведомления"></textarea>
                                </div>
                                <div class="row m-0 g-2 align-items-center">
                                    <div class="col-12 col-sm-6">
                                        <div class="form-check form-switch">
                                            <input v-model="giveNoteOnCast" name="translate" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                            <label class="form-check-label" for="flexSwitchCheckChecked">Отображать на трансляции</label>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input v-model="noteIsEndless" name="unlimited" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
                                            <label class="form-check-label" for="flexSwitchCheckChecked">Бессрочное объявление</label>
                                        </div>
                                    </div>
                                    <div v-if="!noteIsEndless" class="col-12 col-sm-6 p-0">
                                        <div class="col-12">Актуально до:</div>
                                        <div class="col-12">
                                            <input v-model="noteExpires" name="time" value="" id="addDate" class="col form-control m-0" type="date" style="margin-left: 12px; margin-right: 12px" min="2023-01-26" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-3 mt-1">
                                    <div class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                                        <button @click="addNote()" class="btn btn-success w-100" type="button">Отправить уведомление</button>
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                        <a href="./adscast" class="btn btn-info w-100" type="button"> Просмотр </a>
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
