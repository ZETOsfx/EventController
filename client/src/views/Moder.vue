<script>
import detailModals from '../components/detailModals.vue';

export default {
    inject: ['session', 'socket', 'toast', 'clickBlock', 'request'],
    components: {
        detailModals,
    },
    data() {
        return {
            prevArrow: '',
            nextArrow: '',
            currentModalPage: 0,

            composeDetailsModal: {
                templateName: '', // Name of tmp watch this time
                authorName: '', // Author of watching tmp
                previewEvents: [], // Events of current template
                numberOfEvents: 0, // Number of events into current template
                nameOfCurrentEvent: '', // Name of opened template
                numberOfCurrentEvent: 0, // Number of event from opened template
            },

            allRequests: [],
            approvedRequests: [],
            waitingRequests: [],
            activeRequests: [],
            templatesToReplace: [],

            userProcess: '',
            eventList: [],
            addForm: { name: '', src: '', type: 'image', time: 15, isActive: true },

            editFormS: [],
            editFormB: [],
            editFormL: [],
            customForms: [],
            forModal: {
                hasActiveOnMonitor: false,
                actionData: 'Возвращаю',
                activeAction: 'return',
                id: '',
                obj: {},
                index: '',
                comment: '',
            },

            sendDetailWorkdays: '',
            sendDetailSpecial: '',
            denyModal: '',
            confirmModal: '',
            deleteModal: '',
            saveModal: '',
            actModal: '',
            activeClearModal: '',

            format: /[`!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/,
        };
    },
    methods: {
        /**
         * Подключение к слушателю событий
         */
        connect() {
            this.socket().on('process:start', data => {
                switch (data.list) {
                    case 'req':
                        for (let i in this.waitingRequests) {
                            if (this.waitingRequests[i].name === data.process) {
                                this.waitingRequests[i].isStartedProcess = true;
                                this.waitingRequests[i].inProcessing = true;
                                this.waitingRequests[i].changer = data.user;
                            }
                        }
                        break;
                    case 'act':
                        for (let i in this.activeRequests) {
                            if (this.activeRequests[i].name === data.process) {
                                this.activeRequests[i].isStartedProcess = true;
                                this.activeRequests[i].inProcessing = true;
                                this.activeRequests[i].changer = data.user;
                            }
                        }
                        break;
                    case 'acc':
                        for (let i in this.approvedRequests) {
                            if (this.approvedRequests[i].name === data.process) {
                                this.approvedRequests[i].isStartedProcess = true;
                                this.approvedRequests[i].inProcessing = true;
                                this.approvedRequests[i].changer = data.user;
                            }
                        }
                        break;
                    default:
                        this.toast('error', 'Ошибка идентификации локации новой обработки.');
                }
            });

            this.socket().on('process:end', async data => {
                if (!data.name) {
                    this.toast('error', 'Ошибка идентификации обрабатывающего пользователя.');
                    return;
                }
                for (let i in this.waitingRequests) {
                    if (this.waitingRequests[i].isStartedProcess && this.waitingRequests[i].changer === data.name) {
                        this.waitingRequests[i].isStartedProcess = false;
                        this.waitingRequests[i].inProcessing = false;
                    }
                }
                for (let i in this.activeRequests) {
                    if (this.activeRequests[i].isStartedProcess && this.activeRequests[i].changer === data.name) {
                        this.activeRequests[i].isStartedProcess = false;
                        this.activeRequests[i].inProcessing = false;
                    }
                }
                for (let i in this.approvedRequests) {
                    if (this.approvedRequests[i].isStartedProcess && this.approvedRequests[i].changer === data.name) {
                        this.approvedRequests[i].isStartedProcess = false;
                        this.approvedRequests[i].inProcessing = false;
                    }
                }
            });

            this.socket().on('process:confirm', async data => {
                let response = await this.request('/control', 'GET');

                if (response.status !== 'success') {
                    this.toast('error', 'Пожалуйста, перезагрузите страницу');
                    return;
                }

                this.allRequests = response.data;
                if (data.list === 'req') {
                    for (let i in this.allRequests) {
                        if (this.allRequests[i].name === data.process) {
                            this.approvedRequests.push(this.allRequests[i]);
                        }
                    }
                    for (let i in this.waitingRequests) {
                        if (this.waitingRequests[i].name === data.process) {
                            this.waitingRequests.splice(Number(i), 1);
                        }
                    }
                } else if (data.list === 'acc') {
                    let tmp;
                    for (let i in this.allRequests) {
                        if (this.allRequests[i].name === data.process) {
                            tmp = this.allRequests[i];
                        }
                    }
                    for (let i in this.approvedRequests) {
                        if (this.approvedRequests[i].name === data.process) {
                            this.approvedRequests[i] = tmp;
                        }
                    }
                } else if (data.list === 'act') {
                    let tmp;
                    for (let i in this.allRequests) {
                        if (this.allRequests[i].name === data.process) {
                            tmp = this.allRequests[i];
                        }
                    }
                    for (let i in this.activeRequests) {
                        if (this.activeRequests[i].name === data.process) {
                            this.activeRequests[i] = tmp;
                        }
                    }
                } else {
                    this.toast('error', 'Ошибка идентификации локации обновленных данных.');
                }
            });

            this.socket().on('process:deny', data => {
                if (data.list === 'req') {
                    for (let i in this.waitingRequests) {
                        if (this.waitingRequests[i].name === data.process) {
                            this.waitingRequests.splice(Number(i), 1);
                        }
                    }
                } else if (data.list === 'acc') {
                    for (let i in this.approvedRequests) {
                        if (this.approvedRequests[i].name === data.process) {
                            this.approvedRequests.splice(Number(i), 1);
                        }
                    }
                } else {
                    this.toast('success', 'Не удалось определить действие.');
                }
            });

            this.socket().on('request:new', async data => {
                let response = await this.request('/control', 'GET');

                if (response.status !== 'success') {
                    this.toast('error', 'Пожалуйста, перезагрузите страницу');
                    return;
                }
                this.allRequests = response.data;

                for (let i in this.allRequests) {
                    if (this.allRequests[i].name === data.request) {
                        this.waitingRequests.push(this.allRequests[i]);
                    }
                }
                this.toast('info', 'Редактор: ' + data.name + ' только что прислал запрос на модерацию: "' + data.request + '".');
            });

            this.socket().on('active:upd', async data => {
                for (let i in this.approvedRequests) {
                    if (this.approvedRequests[i].name === data.name) {
                        this.activeRequests = [];
                        this.activeRequests.push(this.approvedRequests[i]);
                        this.approvedRequests.splice(Number(i), 1);
                    }
                }
                this.ProgressBar(this.activeRequests);
            });
        },

        /**
         * Запуск Progress bar
         * @param active
         * @returns {boolean}
         */
        ProgressBar(active) {
            let Lessons = [
                [30000, 31200, 'Перерыв'], // Перерыв, с 8:20
                [31200, 36900, '1-ая пара'], // 1ая пара, с 8:40
                [36900, 37500, 'Перерыв'], // Перерыв, с 10:15
                [37500, 43200, '2-ая пара'], // 2ая пара, с 10:25
                [43200, 46200, 'Обед'], // Обед, С 12:00
                [46200, 51900, '3-ая пара'], // 3ая пара, с 12:50
                [51900, 52500, 'Перерыв'], // Перерыв, с 14:25
                [52500, 58200, '4-ая пара'], // 4ая пара, с 14:35
                [58200, 58800, 'Перерыв'], // Перерыв, с 16:10
                [58800, 64500, '5-ая пара'], // 5ая пара, с 16:20
            ];
            let Special = [
                // Особое расписание
                [28800, 64800, 'Особое расписание'], // с 8:00 до 18:00
            ];

            function getPercent(curSec, bSpecial) {
                let percent;
                if (!bSpecial) {
                    // Если БУДНИ
                    for (let i in Lessons) {
                        // Бежим по заданным промежуткам
                        if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) {
                            // Проверяем, в каком промежутке находимся
                            let during = Lessons[i][1] - Lessons[i][0]; // Высчитываем продолжительность промежутка (1)
                            let fromStart = Lessons[i][1] - curSec; // Сколько прошло с начала в промежутке (2)
                            percent = 100 - (fromStart * 100) / during; // Делим (2) на (1) и узнаём проценты
                            return percent; // Возвращаем посчитанный %
                        }
                    }
                } else {
                    // Если СПЕЦИАЛЬНОЕ РАСПИСАНИЕ
                    if (curSec >= Special[0][0] && curSec < Special[0][1]) {
                        // Проверяем, в каком промежутке находимся
                        let during = Special[0][1] - Special[0][0]; // Высчитываем продолжительность промежутка (1)
                        let fromStart = Special[0][1] - curSec; // Сколько прошло с начала в промежутке (2)
                        percent = 100 - (fromStart * 100) / during; // Делим (2) на (1) и узнаём проценты
                        return percent; // Возвращаем посчитанный %
                    }
                } // После 17:55 и до 8:20 - Свободное время,
                return 100; // играет шаблон "Обед"
            }

            function getName(curSec, bSpecial) {
                // Узнать имя в зависимости от расписания
                if (!bSpecial) {
                    // Если БУДНИ
                    for (let i in Lessons) {
                        // Проверяем, в каком промежутке находимся
                        if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) {
                            // Если попадаем в один из заданных промежутков
                            return Lessons[i][2]; // Возвращаем наименование промежутка
                        }
                    }
                    return 'Свободное время'; // Иначе возвращаем "Свободное время"
                } else return 'Особое расписание'; // Если СПЕЦИАЛЬНОЕ РАСПИСАНИЕ
            } // возвращаем "Особое расписание"

            function WhatTime() {
                // Узнать время в секундах с начала дня
                let today = new Date(); // Получить текущее время и вернуть значение в секнудах
                return (today.getHours() * 60 + today.getMinutes()) * 60 + today.getSeconds();
            }

            function checkTime(i) {
                // Преобразовать время к презентабельному виду
                if (i < 10) {
                    i = '0' + i;
                } // Если < 10 то добавить перед цифрой "0" для красоты
                return i;
            }

            function startTime(active) {
                let today = new Date();
                let actualTime = checkTime(today.getHours()) + ':' + checkTime(today.getMinutes()) + ':' + checkTime(today.getSeconds());

                for (let i in active) {
                    if (!active[i].compose.isSpecial) {
                        // Будни
                        document.getElementById('time_workdays').innerHTML = actualTime;
                        document.getElementById('progress_workdays').style['width'] = getPercent(WhatTime(), false) + '%';
                    } else {
                        // Специальное расписание
                        document.getElementById('time_specdays').innerHTML = actualTime;
                        document.getElementById('progress_specdays').style['width'] = getPercent(WhatTime(), true) + '%';
                    }
                }

                setTimeout(async function () {
                    startTime(active);
                }, 1000);
            }

            startTime(this.activeRequests);

            async function refreshAt(hours, minutes, seconds, active) {
                let now = new Date();
                let then = new Date();

                if (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes) || (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() >= seconds)) {
                    then.setDate(now.getDate() + 1);
                }
                then.setHours(hours);
                then.setMinutes(minutes);
                then.setSeconds(seconds);
                // Установка тайм-аута до следующего вызова
                let timeout = then.getTime() - now.getTime();
                setTimeout(async function () {
                    // Подстановка надписи в элемент при обновлении надписи
                    for (let i in active) {
                        if (!active[i].compose.isSpecial) {
                            document.getElementById('nameInfo_workdays').innerHTML = getName(WhatTime(), false);
                        } else {
                            document.getElementById('nameInfo_specdays').innerHTML = getName(WhatTime(), true);
                        }
                    }
                }, timeout);
            }
            // Проверка времени для обновления надписи ПЕРЕДЕЛАТЬ
            refreshAt(8, 20, 3, this.activeRequests);
            refreshAt(8, 40, 3, this.activeRequests);
            refreshAt(10, 15, 3, this.activeRequests);
            refreshAt(10, 25, 3, this.activeRequests);
            refreshAt(12, 0, 3, this.activeRequests);
            refreshAt(12, 50, 3, this.activeRequests);
            refreshAt(14, 25, 3, this.activeRequests);
            refreshAt(14, 35, 3, this.activeRequests);
            refreshAt(16, 10, 3, this.activeRequests);
            refreshAt(16, 20, 3, this.activeRequests);
            refreshAt(17, 55, 3, this.activeRequests);

            // Подстановка надписи в элемент при загрузке страницы
            setTimeout(async function () {
                for (let i in active) {
                    if (!active[i].compose.isSpecial) {
                        document.getElementById('nameInfo_workdays').innerHTML = getName(WhatTime(), false);
                    } else {
                        document.getElementById('nameInfo_specdays').innerHTML = getName(WhatTime(), true);
                    }
                }
            }, 1000);

            return true;
        },

        /**
         * Получить список всех запросов и распределить по разделам
         * с учетом текущих обработок
         *
         * @returns {Promise<void>}
         */
        async getRequests(withModals = true) {
            if (withModals) {
                this.sendDetailWorkdays = new bootstrap.Modal(document.getElementById('detailsWorkdaysModal'));
                this.sendDetailSpecial = new bootstrap.Modal(document.getElementById('detailsSpecialModal'));
                this.denyModal = new bootstrap.Modal(document.getElementById('denyModal'));
                this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
                this.saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
                this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                this.actModal = new bootstrap.Modal(document.getElementById('activeModal'));
                this.fullscreenModal = new bootstrap.Modal(document.getElementById('PreviewModal'));
                this.activeClearModal = new bootstrap.Modal(document.getElementById('ActiveClearModal'));
            }

            let response = await this.request('/control', 'GET');
            if (response.status !== 'success') {
                this.toast('error', 'Ошибка получения списка запросов');
                return;
            }
            this.allRequests = response.data;
            for (let i in this.allRequests) {
                this.allRequests[i].compose.programsRes = JSON.parse(JSON.stringify(this.allRequests[i].compose.programs));
                if (this.allRequests[i].isActive) {
                    this.activeRequests.push(this.allRequests[i]);
                    continue;
                }
                if (this.allRequests[i].isAccepted) {
                    this.approvedRequests.push(this.allRequests[i]);
                } else {
                    this.waitingRequests.push(this.allRequests[i]);
                }
            }
            for (let i in this.waitingRequests) {
                if (this.waitingRequests[i].inProcessing) {
                    this.waitingRequests[i].isStartedProcess = true;
                    if (this.waitingRequests[i].changer === this.session().name) {
                        this.userProcess = this.waitingRequests[i].id;
                    }
                }
            }

            let tmp = await this.request('/setting/all', 'GET');
            if (response.status !== 'success') {
                this.toast('error', 'Что-то пошло не так :(');
                return;
            }
            this.templatesToReplace = tmp.data.programs;
            this.userProcess = '';

            this.ProgressBar(this.activeRequests);
        },

        /**
         * Взятие запроса в обработку
         * @param obj
         * @param list
         * @returns {Promise<void>}
         */
        async startProcessing(obj, list) {
            if (this.userProcess !== '' && !obj.isStartedProcess) {
                this.toast('error', 'Вы можете обрабатывать максимум одно событие! Сначала завершите текущую обработку.');
                return;
            }

            let toggle = await this.request('/control/toggle', 'POST', {
                id: obj.id,
                inProcessing: true,
            });

            if (toggle.status !== 'success') {
                this.toast('error', 'Ошибка взятия в обработку');
                return;
            }

            obj.isStartedProcess = true;
            obj.changer = this.session().name;
            this.userProcess = obj.id;

            // this.socket().emit('new-process', {
            //     list: list,
            //     process: obj.name,
            //     user: this.session().name,
            // });

            document.querySelectorAll('[data-bs-toggle="popover"]').forEach(popover => {
                new bootstrap.Popover(popover);
            });
        },

        /**
         * Отмена обработки запроса
         * @param obj
         * @param list
         * @returns {Promise<void>}
         */
        async endProcessing(obj, list) {
            let toggle = await this.request('/control/toggle', 'POST', {
                id: obj.id,
                inProcessing: false,
            });

            if (toggle.status !== 'success') {
                this.toast('error', 'Ошибка отмены процесса обработки');
                return;
            }

            obj.isStartedProcess = false;
            this.userProcess = '';
            obj.compose.programs = JSON.parse(JSON.stringify(obj.compose.programsRes));

            // this.socket().emit('end-process', {
            //     list: list,
            //     process: obj.name,
            //     name: this.session().name
            // });
        },

        /**
         * Заполнение слотов перед открытием модальных окон
         * @param type
         * @param obj
         * @param index
         * @returns {Promise<void>}
         */
        async triggerModal(type, obj, index) {
            this.userProcess = obj.id;
            this.forModal.id = obj.id;
            this.forModal.obj = obj;
            this.forModal.index = index;

            switch (type) {
                case 'confirm':
                    this.forModal.comment = 'Утверждаю';
                    this.confirmModal.show();
                    break;
                case 'deny':
                    this.forModal.comment = 'Исправить ошибки';
                    this.denyModal.show();
                    break;
                case 'delete':
                    this.forModal.comment = 'Возвращаю';
                    this.deleteModal.show();
                    break;
                case 'save':
                    this.saveModal.show();
                    break;
                case 'active':
                    this.forModal.hasActiveOnMonitor = this.checkActive(obj.compose.screen);
                    this.actModal.show();
                    break;
                case 'active-clear':
                    this.forModal.id = null;
                    this.activeClearModal.show();
                    break;
                default:
                    this.toast('error', 'Администратору направлен отчет о ваших действиях');
            }
        },

        /**
         * Утвердить запрос
         * @returns {Promise<void>}
         */
        async buttonApprove(req, events) {
            if (this.userProcess === '') {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
                return;
            }

            let operation;
            if (events[0] !== undefined) {
                let tmpFilter = [],
                    timeFilter = [],
                    eventFilter = [];
                let programs = req.compose.programs;

                for (let i in programs) {
                    tmpFilter.push({
                        id: programs[i].id,
                        name: programs[i].name,
                    });
                    timeFilter.push(programs[i].timeToSwap);
                }
                for (let i in events) {
                    eventFilter.push(events[i].events);
                }

                operation = {
                    approved: this.forModal.comment,
                    changed: {
                        forDate: req.compose.date,
                        programs: req.compose.isSpecial ? tmpFilter : req.compose.programs,
                        eventList: req.compose.isSpecial ? eventFilter : events,
                        timingList: req.compose.isSpecial ? timeFilter : null,
                    },
                };
            } else {
                operation = {
                    approved: this.forModal.comment,
                };
            }

            let response = await this.request('/control/update', 'POST', {
                id: this.userProcess,
                operation: operation,
            });

            if (response.status !== 'success') {
                this.toast('error', 'Уже существует утвержденное событие на этот день.');
                return;
            }
            this.toast('success', 'Запрос был успешно утвержден.');
            this.confirmModal.hide();

            this.waitingRequests[this.forModal.index].isStartedProcess = false;
            this.waitingRequests[this.forModal.index].isAccepted = true;
            this.waitingRequests[this.forModal.index].approved = this.session().name;
            this.approvedRequests.push(this.waitingRequests[this.forModal.index]);
            this.waitingRequests.splice(this.forModal.index, 1);
            this.userProcess = '';

            // this.socket().emit('con-process', {
            //     list: 'req',
            //     process: struct.name,
            //     user: this.session().name
            // });
        },

        /**
         * Отклонить запрос
         * @returns {Promise<void>}
         */
        async buttonReject(list) {
            if (this.userProcess === '') {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно');
                return;
            }

            let response = await this.request('/control/update', 'POST', {
                id: this.userProcess,
                operation: {
                    rejected: this.forModal.comment,
                },
            });
            if (response.status !== 'success') {
                this.toast('error', 'Произошла ошибка');
                return;
            }

            switch (list) {
                case 'request':
                    this.waitingRequests.splice(this.forModal.index, 1);
                    this.toast('success', 'Запрос был успешно отклонен.');
                    this.denyModal.hide();

                    // this.socket().emit('del-process', {
                    //     list: 'req',
                    //     process: struct.name,
                    //     user: this.session().name
                    // });
                    break;
                case 'approved':
                    this.approvedRequests.splice(this.forModal.index, 1);
                    this.toast('success', 'Композиция "' + this.forModal.name + '" была успешно удалена');
                    this.deleteModal.hide();

                    // this.socket().emit('del-process', {
                    //     list: 'acc',
                    //     process: this.forModal.name,
                    //     user: this.session().name
                    // });
                    break;
                default:
                    this.toast('error', 'Непонятная операция');
            }
            this.userProcess = '';
        },

        /**
         * Сохранить изменения, внесенные в запрос
         * @returns {Promise<void>}
         */
        async saveChangesButton(req, events) {
            if (this.userProcess === '') {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
                return;
            }

            if (!events) {
                this.toast('error', 'Нельзя оставлять композицию пустой!');
                return;
            }

            let tmpFilter = [],
                timeFilter = [],
                eventFilter = [];
            let programs = req.compose.programs;

            for (let i in programs) {
                tmpFilter.push({
                    id: programs[i].id,
                    name: programs[i].name,
                });
                timeFilter.push(programs[i].timeToSwap);
            }
            for (let i in events) {
                eventFilter.push(events[i].events);
            }

            let response = await this.request('/control/update', 'POST', {
                id: this.userProcess,
                operation: {
                    changed: {
                        forDate: req.compose.date,
                        programs: req.compose.isSpecial ? tmpFilter : req.compose.programs,
                        eventList: req.compose.isSpecial ? eventFilter : events,
                        timingList: req.compose.isSpecial ? timeFilter : null,
                    },
                },
            });

            if (response.status !== 'success') {
                this.toast('error', 'Произошла ошибка');
                return;
            }

            // this.socket().emit('con-process', {
            //     list: this.forModal.obj.isActive ? 'act' : 'acc',
            //     process: this.forModal.name,
            //     user: this.session().name
            // });

            if (!this.forModal.obj.isActive) {
                this.toast('success', 'В запрос "' + this.forModal.name + '" успешно внесены изменения.');
            } else {
                this.toast('success', 'В активную трансляцию успешно внесены изменения.');
                // this.socket().emit('upd-active', {
                //     name: this.forModal.name
                // });
            }

            this.activeRequests[this.forModal.index].isStartedProcess = false;
            this.userProcess = '';
            this.saveModal.hide();
        },

        /**
         * Подробный просмотр композиций
         * @returns {Promise<void>}
         */
        async openDetails(request) {
            if (this.eventList.id === request.id) {
                if (this.eventList.type === false) {
                    this.sendDetailWorkdays.show();
                } else {
                    this.sendDetailSpecial.show();
                }
                return;
            }

            this.eventList = {
                id: request.id,
                type: request.compose.isSpecial,
            };

            if (!request.compose.isSpecial) {
                this.editFormS = [];
                this.editFormB = [];
                this.editFormL = [];
                this.eventList.data = {
                    lesson: [],
                    breaktime: [],
                    lunch: [],
                };

                for (let i in request.compose.programs[0].events) {
                    if (!this.editFormS[i]) {
                        this.editFormS[i] = {};
                    }
                    this.editFormS[i].isDisabled = true;
                    this.eventList.data.lesson.push(request.compose.programs[0].events[i]);
                }
                for (let i in request.compose.programs[1].events) {
                    if (!this.editFormB[i]) {
                        this.editFormB[i] = {};
                    }
                    this.editFormB[i].isDisabled = true;
                    this.eventList.data.breaktime.push(request.compose.programs[1].events[i]);
                }
                for (let i in request.compose.programs[2].events) {
                    if (!this.editFormL[i]) {
                        this.editFormL[i] = {};
                    }
                    this.editFormL[i].isDisabled = true;
                    this.eventList.data.lunch.push(request.compose.programs[2].events[i]);
                }
                this.sendDetailWorkdays.show();
            } else {
                this.customForms = [];
                this.eventList.data = [];

                for (let i in request.compose.programs) {
                    this.customForms[i] = [];
                    for (let j in request.compose.programs[i].events) {
                        if (!this.customForms[i][j]) {
                            this.customForms[i][j] = {};
                            this.customForms[i][j].isDisabled = true;
                        }
                    }
                    this.eventList.data.push(request.compose.programs[i]);
                }
                this.sendDetailSpecial.show();
            }
        },

        /**
         * Установка утвержденного запроса активным
         */
        async setActive() {
            if (!this.forModal.obj.isAccepted || !this.forModal.activeAction) {
                this.toast('error', 'Невозможно установить не утвержденный запрос.');
                return;
            }

            let response = await this.request('/control/active', 'POST', {
                id: this.forModal.id,
                action: {
                    type: this.forModal.activeAction,
                    with: this.forModal.actionData,
                },
            });

            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }

            this.allRequests = [];
            this.approvedRequests = [];
            this.waitingRequests = [];
            this.activeRequests = [];
            this.templatesToReplace = [];

            await this.getRequests(false);
            this.actModal.hide();
            this.activeClearModal.hide();
            this.toast('success', 'Трансляция обновлена');
            this.userProcess = '';

            // this.socket().emit('upd-active', {
            //     name: this.forModal.name,
            // });

            // setTimeout(this.ProgressBar(this.activeRequests), 1000);
        },

        /**
         * Добавить дополнительное поле в композицию спец. типа
         * @param list
         */
        addField(list) {
            list.push({
                id: 0,
                name: '- Выберите -',
                time_to_swap: '00:00',
            });
        },

        async addEvent(form, data) {
            if (!(this.addForm.name !== '' && this.addForm.src !== '')) {
                this.toast('error', 'Пожалуйста, заполните все поля перед добавлением.');
                return;
            }

            if (this.addForm.name.length > 50) {
                this.toast('error', 'Получено слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + this.addForm.name.length);
            } else if (!Number.isFinite(this.addForm.time) || this.addForm.time < 0) {
                this.toast('error', 'Получено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
            } else if (this.format.test(this.addForm.name)) {
                this.toast('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
            } else {
                form.push({ isDisabled: true });
                data.push(this.addForm);
                this.addForm = { name: '', src: '', type: 'image', time: 15, isActive: true };
            }
        },

        async delEvent(index, form, data) {
            form[index].isDisabled = true;
            form.splice(index, 1);
            data.splice(index, 1);
        },

        async editEvent(index, form) {
            form[index].isDisabled = false;
        },

        async moveEvent(move, index, data) {
            let id1 = index;
            let id2 = null;

            if (move === 'down' && id1 !== data.length - 1) {
                id2 = id1++;
            }
            if (move === 'up' && id1 !== 0) {
                id2 = id1--;
            }
            if (id2 !== null) {
                this.correctArr(data, [id1, id2]);
            }
        },

        correctArr(_arr, _param) {
            /*
             коррекция  элементов массива по паре индекса
             *    _arr -- массив требующий коррекции
             *   _param -- пара [n1,n2] -- индексы массива для взаимной  перестановки
             */
            _arr[_param[1]] = _arr.splice(_param[0], 1, _arr[_param[1]])[0];
        },

        /**
         * Завершить все обработки пользователя
         * @returns {Promise<void>}
         */
        async endAllProcesses() {
            let response = await this.request('/control/refund', 'POST', {});

            if (response.status !== 'success') {
                this.toast('error', 'Произошла ошибка. Перезагрузите страницу');
                return;
            }

            this.allRequests = [];
            this.approvedRequests = [];
            this.waitingRequests = [];
            this.activeRequests = [];
            this.templatesToReplace = [];

            await this.getRequests(false);
            this.toast('success', 'Все обработки успешно завершены.');
            // this.socket().emit('end-process', { name: this.session().name });
        },

        /**
         * Открыть предпросмотр конкретной программы внутри композиции
         * @param req Запрос
         * @param tmp Программа внутри композиции запроса
         * @returns {Promise<void>}
         */
        async openPreview(req, tmp) {
            this.composeDetailsModal.templateName = tmp.name;
            this.composeDetailsModal.authorName = req.compose.author.name;
            this.composeDetailsModal.previewEvents = tmp.events;
            this.composeDetailsModal.numberOfEvents = tmp.events.length;
            this.composeDetailsModal.nameOfCurrentEvent = tmp.events[0].name;
            this.composeDetailsModal.numberOfCurrentEvent = tmp.events.length === 0 ? 0 : 1;
            this.fullscreenModal.show();
        },

        /** Сокрытие надписей кнопок просмотра для малых экранов */
        resizeTextEdit() {
            if (window.innerWidth > 768) {
                this.prevArrow = 'Предыдущее событие';
                this.nextArrow = 'Следующее событие';
            } else {
                this.prevArrow = '';
                this.nextArrow = '';
            }
        },

        /**
         * Переключение между страницами при просмотре
         * @param prevOrNext
         */
        switchPage(prevOrNext) {
            if (prevOrNext === 'next') {
                if (this.composeDetailsModal.numberOfCurrentEvent < this.composeDetailsModal.numberOfEvents) {
                    this.composeDetailsModal.numberOfCurrentEvent += 1;
                }
            } else {
                if (this.composeDetailsModal.numberOfCurrentEvent > 1) {
                    this.composeDetailsModal.numberOfCurrentEvent -= 1;
                }
            }
        },

        /**
         * Проверка наличия активной трансляции
         * @param targetScreen Монитор, на котором проверяем
         * @returns {boolean}
         */
        checkActive(targetScreen) {
            let flag = false;
            for (let i in this.activeRequests) {
                if (this.activeRequests[i].compose.screen === targetScreen) {
                    flag = true;
                }
            }
            return flag;
        },
    },
    mounted() {
        this.connect();
        this.getRequests();
        this.resizeTextEdit();

        window.addEventListener('beforeunload', async event => {
            await fetch('/control/refund', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                },
            });
            // this.socket().emit('end-process', {
            //     name: this.session().name
            // });
            event.preventDefault();
            event.returnValue = '';
        });
    },
};
</script>

<template>
    <div class="intro">
        <detailModals :eventList="eventList" :editFormS="editFormS" :editFormB="editFormB" :editFormL="editFormL" :addForm="addForm" :addEventCmp="addEvent" :delEventCmp="delEvent" :moveEventCmp="moveEvent" :demoMode="false" :currentModalPage="currentModalPage" :customForms="customForms" :editEventCmp="editEvent"> </detailModals>

        <!-- Modal for Deny -->
        <div class="modal fade" id="denyModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь отклонить запрос. Вы уверены?
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label"
                                ><br />
                                Комментарий бригаде:</label
                            >
                            <textarea v-model="this.forModal.comment" @keyup.enter="buttonReject('request')" class="form-control" id="message-text"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="buttonReject('request')" type="button" class="btn btn-danger">Отклонить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Confirm -->
        <div class="modal fade" id="confirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabella">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь утвердить данное расписание. <br />
                        Вы уверены?
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label"
                                ><br />
                                Комментарий бригаде:</label
                            >
                            <textarea @keyup.enter="buttonApprove(forModal.obj, forModal.obj.compose.isSpecial ? eventList?.data : [eventList?.data?.lesson, eventList?.data?.breaktime, eventList?.data?.lunch])" v-model="this.forModal.comment" class="form-control" id="message-text"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="buttonApprove(forModal.obj, forModal.obj.compose.isSpecial ? eventList?.data : [eventList?.data?.lesson, eventList?.data?.breaktime, eventList?.data?.lunch])" type="button" class="btn btn-success">Утвердить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal ActiveClear -->
        <div class="modal fade" id="ActiveClearModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Выберите действие</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <strong> На целевом мониторе идет трансляция </strong>
                        <p></p>
                        Вы собираетесь очистить трансляцию на данном мониторе.
                        <p></p>
                        Установленную композицию стоит:
                        <div class="row w-100 align-items-center g-1 mt-2">
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'return';
                                        forModal.actionData = 'Возвращаю композицию с трансляции.';
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="queue"
                                    autocomplete="off"
                                    checked
                                />
                                <label class="w-100 btn btn-outline-success" for="queue">Вернуть редактору</label>
                            </div>
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'queue';
                                        forModal.actionData = new Date();
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="editor"
                                    autocomplete="off"
                                />
                                <label class="w-100 btn btn-outline-secondary" for="editor">Вернуть в очередь</label>
                            </div>
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'delete';
                                        forModal.actionData = {};
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="delete"
                                    autocomplete="off"
                                />
                                <label class="w-100 btn btn-outline-danger" for="delete"> Удалить композицию </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="w-100">
                            <textarea v-if="forModal.activeAction === 'return'" v-model="forModal.actionData" class="form-control"></textarea>
                            <input v-if="forModal.activeAction === 'queue'" v-model="forModal.actionData" name="time" value="" id="addDate" class="col form-control mt-1" type="date" />
                            <div v-if="forModal.activeAction === 'delete'" style="color: red">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                </svg>
                                Данное действие отменить будет нельзя
                            </div>
                            <div class="row w-100 align-items-center g-1 mt-2">
                                <div class="col-12 col-sm-6">
                                    <button class="w-100 mt-1 btn btn-outline-secondary" data-bs-dismiss="modal">Оставить в очереди</button>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <a @click="setActive()" class="w-100 mt-1 btn btn-success"> Выполнить </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Delete -->
        <div class="modal fade" id="deleteModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь удалить шаблон из очереди. Он будет возвращен редактору. Вы уверены?
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label"
                                ><br />
                                Комментарий бригаде:</label
                            >
                            <textarea v-model="this.forModal.comment" @keyup.enter="buttonReject('approved')" class="form-control" id="message-text"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="buttonReject('approved')" type="button" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Save -->
        <div class="modal fade" id="saveModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div v-if="!this.forModal.obj.isActive" class="modal-body">Вы собираетесь сохранить изменения. Вы уверены?</div>
                    <div v-if="this.forModal.obj.isActive" class="modal-body">Вы собираетесь внести изменения на активную трансляцию. Вы уверены?</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="saveChangesButton(forModal.obj, forModal.obj.compose.isSpecial ? eventList?.data : [eventList?.data?.lesson, eventList?.data?.breaktime, eventList?.data?.lunch])" type="button" class="btn btn-success">Уверен</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Set Active -->
        <div class="modal fade" id="activeModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">
                            {{ forModal.hasActiveOnMonitor ? 'Выберите действие' : 'Подтвердите действие' }}
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="forModal.hasActiveOnMonitor" class="modal-body">
                        <strong> На целевом мониторе уже идет трансляция </strong>
                        <p></p>
                        Вы собираетесь произвести замену текущей композиции.
                        <p></p>
                        Старую композицию стоит:
                        <div class="row w-100 align-items-center g-1 mt-2">
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'return';
                                        forModal.actionData = 'Возвращаю композицию с трансляции.';
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="queue"
                                    autocomplete="off"
                                    checked
                                />
                                <label class="w-100 btn btn-outline-success" for="queue">Вернуть редактору</label>
                            </div>
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'queue';
                                        forModal.actionData = new Date();
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="editor"
                                    autocomplete="off"
                                />
                                <label class="w-100 btn btn-outline-secondary" for="editor">Вернуть в очередь</label>
                            </div>
                            <div class="col-12 col-sm-4">
                                <input
                                    @click="
                                        forModal.activeAction = 'delete';
                                        forModal.actionData = {};
                                    "
                                    type="radio"
                                    class="btn-check"
                                    name="options"
                                    id="delete"
                                    autocomplete="off"
                                />
                                <label class="w-100 btn btn-outline-danger" for="delete"> Удалить композицию </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="!forModal.hasActiveOnMonitor" class="modal-body">
                        Вы собираетесь установить выбранную композицию на трансляцию.
                        <p>Вам необходимо подтвердить данную операцию.</p>
                    </div>
                    <div class="modal-footer">
                        <div class="w-100">
                            <textarea v-if="forModal.hasActiveOnMonitor && forModal.activeAction === 'return'" v-model="forModal.actionData" class="form-control"></textarea>
                            <input v-if="forModal.hasActiveOnMonitor && forModal.activeAction === 'queue'" v-model="forModal.actionData" name="time" value="" id="addDate" class="col form-control mt-1" type="date" />
                            <div v-if="forModal.hasActiveOnMonitor && forModal.activeAction === 'delete'" style="color: red">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                </svg>
                                Данное действие отменить будет нельзя
                            </div>
                            <div class="row w-100 align-items-center g-1 mt-2">
                                <div class="col-12 col-sm-6">
                                    <button class="w-100 mt-1 btn btn-outline-secondary" data-bs-dismiss="modal">Оставить в очереди</button>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <a @click="setActive()" class="w-100 mt-1 btn btn-success"> Выполнить </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Full Screen Preview Modal -->
        <div class="modal fade" id="PreviewModal" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header row justify-content-between align-items-center">
                        <div class="col-auto m-0">
                            <h4 class="modal-title fs-5">
                                <strong>{{ this.composeDetailsModal.templateName }}</strong> ({{ this.composeDetailsModal.authorName }})
                            </h4>
                        </div>
                        <div class="col-auto m-0">
                            <h5 class="m-0">
                                <strong> {{ this.composeDetailsModal.numberOfCurrentEvent }}/{{ this.composeDetailsModal.numberOfEvents }} </strong>
                            </h5>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1] !== undefined" class="modal-body">
                        <img v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 'image'" :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%" alt="" />
                        <iframe v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 'webform'" :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%" alt=""></iframe>
                    </div>
                    <div class="modal-footer row justify-content-center">
                        <div class="col-auto">
                            <button @click="switchPage('prev')" type="button" class="btn btn-outline-success w-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"></path>
                                </svg>
                                {{ this.prevArrow }}
                            </button>
                        </div>
                        <div class="col-auto">
                            <button @click="switchPage('next')" type="button" class="btn btn-outline-success col-auto w-100">
                                {{ this.nextArrow }}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="col-12 col-lg-auto">
                            <select v-model="this.composeDetailsModal.numberOfCurrentEvent" class="form-select">
                                <option v-for="(event, index) in this.composeDetailsModal.previewEvents" :value="index + 1">{{ index + 1 }}. {{ event.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h6 class="text mt-4">Управление отображением</h6>
            <!-- Подстилка - content -->
            <div class="content">
                <!-- ЗАГОЛОВКИ ВКЛАДОК -->
                <div class="d-flex justify-content-between g-1">
                    <ul class="nav nav-pills" id="pills-tab1" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-request-tab" data-bs-toggle="pill" data-bs-target="#pills-request" type="button" role="tab" aria-selected="true">Запросы на модерирование</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-display-tab" data-bs-toggle="pill" data-bs-target="#pills-display" type="button" role="tab" aria-selected="false">Активное отображение</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-queue-tab" data-bs-toggle="pill" data-bs-target="#pills-queue" type="button" role="tab" aria-selected="false">Очередь отображения</button>
                        </li>
                    </ul>
                    <button v-show="userProcess !== ''" @click="endAllProcesses()" type="button" class="btn btn-outline-danger">Завершить обработку</button>
                </div>
            </div>
            <div class="content">
                <!-- Содержимое вкладок -->
                <div class="tab-content" id="pills-tabContent1">
                    <!-- ВХОДЯЩИЕ ЗАРОСЫ НА МОДЕРАЦИЮ -->
                    <div class="tab-pane fade show active" id="pills-request" role="tabpanel" aria-labelledby="pills-request-tab" tabindex="0">
                        <div v-if="waitingRequests.length === 0">Необработанных запросов нет</div>
                        <ul v-if="waitingRequests.length > 0" class="list-group moder">
                            <!-- ШАБЛОН -->
                            <li v-for="(req, index) in waitingRequests" class="list-group-item">
                                <!-- ЗАГОЛОВОК, АВТОР, КОММЕНТАРИЙ -->
                                <div class="me-auto">
                                    <div class="row">
                                        <div class="col-12 col-sm-9 col-md-10 col-xxl-10">
                                            <div class="fw align-items-center">
                                                <strong> {{ req.compose.name }} </strong>
                                            </div>
                                            <small class="fw align-items-center"> {{ req.compose.comment }} </small>
                                        </div>
                                        <div class="col-12 col-sm-3 col-md-2 col-xxl-2">
                                            <div class="badge bg-secondary text-wrap align-items-center rounded-pill w-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                </svg>
                                                {{ req.compose.author.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- ДАТА, ЭКРАН -->
                                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                                    <select class="form-select" aria-label="Default select example" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name">
                                        <option selected>Кафедра К3 - основной</option>
                                        <!-- <option value="1">Кафедра К3 - новости</option> -->
                                    </select>
                                    <input v-model="req.compose.date" id="startDate1" class="form-control" type="date" :value="req.compose.date" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name" />
                                </div>
                                <!-- ТЕЛО ШАБЛОНА ДЛЯ СТАНДАРТНОГО ТИПА -->
                                <!-- 1. ПАРЫ -->
                                <div v-if="!req.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Пары:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="req.compose.programs[0]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name">
                                                <option selected :value="req.compose.programs[0]">{{ req.compose.programs[0].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="waitingRequests[index].isStartedProcess && req.changer === session().name" @click="openPreview(req, req.compose.programs[0])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 2. ПЕРЕРЫВ -->
                                <div v-if="!req.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Перерыв:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="req.compose.programs[1]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name">
                                                <option selected :value="req.compose.programs[1]">{{ req.compose.programs[1].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="waitingRequests[index].isStartedProcess && req.changer !== session().name" @click="openPreview(req, req.compose.programs[1])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 3. ОБЕД -->
                                <div v-if="!req.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Обед:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="req.compose.programs[2]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name">
                                                <option selected :value="req.compose.programs[2]">{{ req.compose.programs[2].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="waitingRequests[index].isStartedProcess && req.changer === session().name" @click="openPreview(req, req.compose.programs[2])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- СПЕЦ. ШАБЛОН -->
                                <div v-if="req.compose.isSpecial" v-for="(tmp, dex) in req.compose.programs" class="d-flex w-100 justify-content-between gap-1 mt-1">
                                    <input v-model="req.compose.programs[dex].timeToSwap" type="time" class="form-control form-select-sm" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name" />
                                    <select v-model="req.compose.programs[dex]" class="form-select form-select-sm" aria-label="Default select example" :disabled="!waitingRequests[index].isStartedProcess || req.changer !== session().name">
                                        <option :value="req.compose.programs[dex]" selected>{{ req.compose.programs[dex].name }}</option>
                                        <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                    </select>
                                    <!-- УДАЛИТЬ -->
                                    <button v-if="waitingRequests[index].isStartedProcess && req.changer === session().name" @click="req.eventList.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </button>
                                    <!-- ПРЕДПРОСМОТР -->
                                    <button v-if="waitingRequests[index].isStartedProcess && req.changer === session().name" type="button" @click="openPreview(req, req.compose.programs[dex])" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                </div>
                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                <button v-if="req.compose.isSpecial && waitingRequests[index].isStartedProcess && req.changer === session().name" @click="addField(req.compose.programs)" type="button" class="btn btn-outline-success btn-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                    </svg>
                                    Добавить
                                </button>
                                <div class="row w-100 align-items-center g-1 mt-2">
                                    <div class="col-12 col-sm-6 col-md mb-1 form-check form-switch">
                                        <input v-model="req.compose.isSpecial" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault26" :disabled="!(req.isStartedProcess && (userProcess === req.id || req.changer === session().name))" />
                                        <label class="form-check-label" for="flexSwitchCheckDefault26"> Особое расписание </label>
                                    </div>
                                    <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                                    <div v-if="!req.isStartedProcess" class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                                        <button @click="startProcessing(req, 'req')" class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                            Обработать
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (userProcess === req.id || req.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="endProcessing(req, 'req')" type="button" class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            Отмена
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (userProcess === req.id || req.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Details modal -->
                                        <button v-if="req.compose.isSpecial" @click="openDetails(req)" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <button v-if="!req.compose.isSpecial" @click="openDetails(req)" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (userProcess === req.id || req.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Deny modal -->
                                        <button @click="triggerModal('deny', req, index)" type="button" class="btn btn-outline-danger w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                                <path
                                                    d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"
                                                />
                                            </svg>
                                            Отклонить
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (userProcess === req.id || req.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Confirm modal -->
                                        <button @click="triggerModal('confirm', req, index)" type="button" class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                            </svg>
                                            Утвердить
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && req.changer !== session().name" class="col text-end">
                                        Запрос находится в обработке у: <i> "{{ req.changer }}" </i>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- АКТИВНОЕ ОТОБРАЖЕНИЕ (ЧТО ИГРАЕТ СЕГОДНЯ) -->
                    <div class="tab-pane fade" id="pills-display" role="tabpanel" aria-labelledby="pills-display-tab" tabindex="0">
                        <div v-if="activeRequests.length === 0">Нет активной программы трансляции</div>
                        <div v-if="activeRequests.length > 0" v-for="(screen, index) in activeRequests" class="row g-3">
                            <!-- ПЛАШКА -->
                            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-3 mb-sm-0 g-3">
                                <div class="card h-100">
                                    <!-- ЭКРАН -->
                                    <div class="card-header p-0">
                                        <div class="row justify-content-between me-3 ms-3 mt-2 mb-2">
                                            <strong class="card-title mb-0 col-auto p-0">Кафедра К3 - основной</strong>
                                            <button @click="triggerModal('active-clear', screen, index)" type="button" class="btn-close col-auto p-0 mt-1" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                    </div>
                                    <div class="card-body pt-2">
                                        <div class="me-auto">
                                            <div class="row mb-2">
                                                <div class="col-6 pe-1">
                                                    <div class="badge bg-secondary text-wrap align-items-center w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                        </svg>
                                                        {{ screen.compose.author.name }}
                                                    </div>
                                                </div>
                                                <div class="col-6 ps-1">
                                                    <div class="badge bg-secondary text-wrap align-items-center w-100">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
                                                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                                                            <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                                                        </svg>
                                                        {{ screen.compose.name }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- ЛАБЕЛ СУТАНДАРДЭ -->
                                        <div v-if="!screen.compose.isSpecial" class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" id="progress_workdays"></div>
                                        </div>
                                        <div v-if="!screen.compose.isSpecial" class="d-flex w-100 justify-content-between align-items-center">
                                            <div id="time_workdays"></div>
                                            <div id="nameInfo_workdays"></div>
                                        </div>
                                        <!-- ЛАБЭЛ СУПЭШШИАЛ -->
                                        <div v-if="screen.compose.isSpecial" class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" id="progress_specdays"></div>
                                        </div>
                                        <div v-if="screen.compose.isSpecial" class="d-flex w-100 justify-content-between align-items-center">
                                            <div id="time_specdays"></div>
                                            <div id="nameInfo_specdays"></div>
                                        </div>
                                        <ul class="list-group display mt-1">
                                            <!-- Шаблон -->
                                            <li class="list-group-item">
                                                <!-- СУТАНДАРДЭ ТЭМУПУЛИТЭ -->
                                                <!-- 1. ПАРЫ -->
                                                <div v-if="!screen.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0">Пары:</div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">
                                                            <select v-model="screen.compose.programs[0]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!activeRequests[index].isStartedProcess || screen.changer !== session().name">
                                                                <option selected :value="screen.compose.programs[0]">{{ screen.compose.programs[0].name }}</option>
                                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                                            </select>
                                                            <button v-if="activeRequests[index].isStartedProcess && screen.changer === this.session().name" @click="openPreview(screen, screen.compose.programs[0])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 2. ПЕРЕРЫВ -->
                                                <div v-if="!screen.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0">Перерыв:</div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">
                                                            <select v-model="screen.compose.programs[1]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!activeRequests[index].isStartedProcess || screen.changer !== session().name">
                                                                <option selected :value="screen.compose.programs[1]">{{ screen.compose.programs[1].name }}</option>
                                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                                            </select>
                                                            <button v-if="activeRequests[index].isStartedProcess && screen.changer === session().name" @click="openPreview(screen, screen.compose.programs[1])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 3. ОБЕД -->
                                                <div v-if="!screen.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0">Обед:</div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">
                                                            <select v-model="screen.compose.programs[2]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!activeRequests[index].isStartedProcess || screen.changer !== session().name">
                                                                <option selected :value="screen.compose.programs[2]">{{ screen.compose.programs[2].name }}</option>
                                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                                            </select>
                                                            <button v-if="activeRequests[index].isStartedProcess && screen.changer === session().name" @click="openPreview(screen, screen.compose.programs[2])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- СУПЭШШИАЛ ТЭМУПУЛИТЭ -->
                                                <div v-if="screen.compose.isSpecial" v-for="(tmp, dex) in screen.compose.programs" class="d-flex w-100 justify-content-between gap-1 mt-1">
                                                    <input v-model="screen.compose.programs[dex].timeToSwap" type="time" class="form-control form-select-sm" :disabled="!activeRequests[index].isStartedProcess || screen.changer !== session().name" />
                                                    <select v-model="screen.compose.programs[dex]" class="form-select form-select-sm" aria-label="Default select example" :disabled="!activeRequests[index].isStartedProcess || screen.changer !== session().name">
                                                        <option :value="screen.compose.programs[dex]" selected>{{ screen.compose.programs[dex].name }}</option>
                                                        <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                                    </select>
                                                    <!-- УДАЛИТЬ -->
                                                    <button v-if="activeRequests[index].isStartedProcess && screen.changer === session().name" @click="screen.compose.programs.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                        </svg>
                                                    </button>
                                                    <!-- ПРЕДПРОСМОТР -->
                                                    <button v-if="activeRequests[index].isStartedProcess && screen.changer === session().name" type="button" @click="openPreview(screen, screen.compose.programs[dex])" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                                <button v-if="screen.compose.isSpecial && activeRequests[index].isStartedProcess && screen.changer === session().name" @click="addField(screen.compose.programs)" type="button" class="btn btn-outline-success btn-sm mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                    </svg>
                                                    Добавить
                                                </button>
                                                <div class="d-flex w-100 justify-content-between align-items-center gap-1 mt-2">
                                                    <div class="form-check form-switch">
                                                        <input v-model="screen.compose.isSpecial" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault1" :disabled="true" />
                                                        <label class="form-check-label" for="flexSwitchCheckDefault1"> Особое расписание </label>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="card-footer text-end">
                                        <button v-if="!screen.isStartedProcess" @click="startProcessing(screen, 'act')" type="button" class="btn btn-outline-success mb-1">Редактировать</button>
                                        <!-- Button trigger Delete follow modal -->
                                        <!-- <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteFollowModal"> Не отслеживать</button> -->
                                        <div v-if="screen.isStartedProcess && (userProcess === screen.id || screen.changer === session().name)" class="row justify-content-end me-1">
                                            <button @click="endProcessing(screen, 'act')" type="button" class="btn btn-outline-secondary col-auto me-1 mb-1">Отмена</button>
                                            <!-- Button trigger Details modal -->
                                            <button v-if="screen.compose.isSpecial" @click="openDetails(screen)" type="button" class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button>
                                            <button v-if="!screen.compose.isSpecial" @click="openDetails(screen)" type="button" class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button>
                                            <!-- Button trigger Confirm modal -->
                                            <button @click="triggerModal('save', screen, index)" type="button" class="btn btn-success col-auto me-1 mb-1">Сохранить</button>
                                        </div>
                                        <div v-if="screen.isStartedProcess && screen.changer !== session().name">
                                            Ведется обработка: <i> "{{ screen.changer }}" </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="d-flex w-auto justify-content-start align-items-center gap-1 mt-2">
                        <select class="form-select w-auto">
                            <option selected>- Выберите -</option>
                            <option value="1">Хол актового</option>
                            <option value="2">Что-то ещё</option>
                        </select>
                        <div>
                            <button type="button" class="btn btn-success">Добавить к ослеживанию</button>
                        </div>
                        </div> -->
                        <!-- КОНЕЦ: Что СЕЙЧАС отображается на экранах -->
                    </div>

                    <!-- ОЧЕРЕДЬ ШАБЛОНОВ НА ОТОБРАЖЕНИЕ (УЖЕ УТВЕРЖДЕННЫЕ)  -->
                    <div class="tab-pane fade" id="pills-queue" role="tabpanel" aria-labelledby="pills-queue-tab" tabindex="0">
                        <div v-if="approvedRequests.length === 0">Очередь на трансляцию пуста</div>
                        <ul v-if="approvedRequests.length > 0" class="list-group moder">
                            <li v-for="(acc, index) in approvedRequests" class="list-group-item">
                                <!-- ШАБЛОН -->
                                <!-- ИМЯ, АВТОР, КОММЕНТАРИЙ -->
                                <div class="me-auto">
                                    <div class="row">
                                        <div class="col-12 col-sm-9 col-md-10 col-xxl-10">
                                            <div class="badge bg-success text-wrap align-items-center rounded-pill">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16">
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                                                    <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                                                </svg>
                                                {{ acc.approved }}
                                            </div>
                                            <div class="fw align-items-center">
                                                <strong> {{ acc.compose.name }} </strong>
                                            </div>
                                            <small class="fw align-items-center"> {{ acc.compose.comment }} </small>
                                        </div>
                                        <div class="col-12 col-sm-3 col-md-2 col-xxl-2">
                                            <div class="badge bg-secondary text-wrap align-items-center rounded-pill w-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                </svg>
                                                {{ acc.compose.author.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- ЭКРАН, ДАТА УСТАНОВКИ -->
                                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                                    <select class="form-select" aria-label="Default select example" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name">
                                        <option selected>Кафедра К3 - основной</option>
                                        <!-- <option value="1">Кафедра К3 - новости</option> -->
                                    </select>
                                    <input v-model="acc.compose.date" id="startDate3" class="form-control" type="date" :value="acc.compose.date" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name" />
                                </div>
                                <!-- 1. ПАРЫ -->
                                <div v-if="!acc.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Пары:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="acc.compose.programs[0]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name">
                                                <option selected :value="acc.compose.programs[0]">{{ acc.compose.programs[0].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="approvedRequests[index].isStartedProcess && acc.changer === session().name" @click="openPreview(acc, acc.compose.programs[0])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 2. ПЕРЕРЫВ -->
                                <div v-if="!acc.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Перерыв:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="acc.compose.programs[1]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name">
                                                <option selected :value="acc.compose.programs[1]">{{ acc.compose.programs[1].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="approvedRequests[index].isStartedProcess && acc.changer === session().name" @click="openPreview(acc, acc.compose.programs[1])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 3. ОБЕД -->
                                <div v-if="!acc.compose.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0">Обед:</div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="acc.compose.programs[2]" @change="eventList = []" class="form-select form-select-sm me-1" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name">
                                                <option selected :value="acc.compose.programs[2]">{{ acc.compose.programs[2].name }}</option>
                                                <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                            </select>
                                            <button v-if="approvedRequests[index].isStartedProcess && acc.changer === session().name" @click="openPreview(acc, acc.compose.programs[2])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- СПЕЦТИП -->
                                <div v-if="acc.compose.isSpecial" v-for="(tmp, dex) in acc.compose.programs" class="d-flex w-100 justify-content-between gap-1 mt-1">
                                    <input v-model="acc.compose.programs[dex].timeToSwap" type="time" class="form-control form-select-sm" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name" />
                                    <select v-model="acc.compose.programs[dex]" class="form-select form-select-sm" aria-label="Default select example" :disabled="!approvedRequests[index].isStartedProcess || acc.changer !== session().name">
                                        <option :value="acc.compose.programs[dex]" selected>{{ acc.compose.programs[dex].name }}</option>
                                        <option v-for="tmp in templatesToReplace" :value="tmp">{{ tmp.name }}</option>
                                    </select>
                                    <!-- УДАЛИТЬ -->
                                    <button v-if="approvedRequests[index].isStartedProcess && acc.changer === session().name" @click="acc.eventList.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </button>
                                    <!-- ПРЕДПРОСМОТР -->
                                    <button v-if="approvedRequests[index].isStartedProcess && acc.changer === session().name" type="button" @click="openPreview(acc, acc.compose.programs[dex])" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                </div>
                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                <button v-if="acc.compose.isSpecial && approvedRequests[index].isStartedProcess && acc.changer === session().name" @click="addField(acc.compose.programs)" type="button" class="btn btn-outline-success btn-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                                    </svg>
                                    Добавить
                                </button>
                                <!-- ОБЩАЯ ПАНЕЛЬ -->
                                <div class="row w-100 align-items-center g-1 mt-2">
                                    <div class="col-12 col-sm-12 col-md mb-1 form-check form-switch">
                                        <input v-model="acc.compose.isSpecial" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" :disabled="!(acc.isStartedProcess && (userProcess === acc.id || acc.changer === session().name))" />
                                        <label class="form-check-label" for="flexSwitchCheckDefault"> Особое расписание </label>
                                    </div>
                                    <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                                    <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                        <button @click="startProcessing(acc, 'acc')" class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                            Обработать
                                        </button>
                                    </div>
                                    <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                        <!-- Button trigger SetActive modal -->
                                        <button @click="triggerModal('active', acc, index)" type="button" class="btn btn-outline-warning w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                                                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                            </svg>
                                            Играть сейчас
                                        </button>
                                    </div>
                                    <div v-if="acc.isStartedProcess && (userProcess === acc.id || acc?.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="endProcessing(acc, 'acc')" type="button" class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            Отменить
                                        </button>
                                        <!-- Button trigger Details modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (userProcess === acc.id || acc?.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <button v-if="acc.compose.isSpecial" @click="openDetails(acc)" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <button v-if="!acc.compose.isSpecial" @click="openDetails(acc)" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <!-- Button trigger Deny modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (userProcess === acc.id || acc?.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="triggerModal('delete', acc, index)" type="button" class="btn btn-outline-danger w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                            Удалить
                                        </button>
                                        <!-- Button trigger Confirm modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (userProcess === acc.id || acc?.changer === session().name)" class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="triggerModal('save', acc, index)" type="button" class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                                                <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z" />
                                            </svg>
                                            Применить
                                        </button>
                                    </div>
                                    <div v-if="acc.isStartedProcess && acc.changer !== session().name" class="col text-end">
                                        Композиция находится в обработке у: <i> "{{ acc.changer }}" </i>
                                    </div>
                                    <!-- КОНЕЦ: Шаблон -->
                                </div>
                            </li>
                        </ul>
                        <!-- КОНЕЦ: Очередь на отображение -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
