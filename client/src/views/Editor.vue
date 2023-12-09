<script>
import detailModals from '../components/detailModals.vue';

export default {
    inject: ['session', 'socket', 'toast', 'clickBlock', 'formNextFocus', 'request'],
    components: {
        detailModals,
    },
    data()
    {
        return {
            eventList: [],           // Список для событий открываемого шаблона
            editFormS: [],           // Форма редактирования события (Study)
            editFormB: [],           // Перерыв (Break)
            editFormL: [],           // Обед (Lunch)
            customForms: [],         // Список форм редактирования для спец. шаблонов
            composeDetailsModal: {
                programObj: {},
                templateName: '',           // Имя просматриваемого шаблона
                authorName: '',             // Автор этого самого шаблона
                withChanges: false,         // Наличие изменений
                previewEvents: [],          // События данного шаблона
                numberOfEvents: 0,          // Число событий в данном шаблоне
                nameOfCurrentEvent: '',     // Имя открытого на данный момент события внутри шаблона
                numberOfCurrentEvent: 0     // Порядковый номер открытого на данный момент события
            },
            currentModalPage: 0,

            // ----- Canvas data ------
            reserveType: '',
            filter: '',
            sortBy: [ 'none', 'asc' ],
            files: {},
            users: [],
            viewFiles: [],
            typeOfList: '',
            canvas: {},
            filesImg: [],
            filesClip: [],
            dataForm: {},
            dataIndex: {},

            CMP_ID: null,   // ID композиции для обработки
            CMP_NAME: '',   // Заголовок (видно модератору)
            CMP_COMM: '',   // Комментарий (для модератора)
            CMP_EDIT_STARTED: false,
            CMP_DEL_WITHPROGRAMS: false,

            forModal: {
                newType: '',
                withChanges: false,
                name: '',
                index: '',
                comment: ''
            },

            programId: '-',
            newProgramName: '',
            openedProgramId: '',
            programIsOpen: false,

            composeTargetDate: '',
            newComposeName: '',
            composeDescription: '',
            composePrograms: ['-', '-', '-'],
            composeTimes: [],
            composeTargetScreen: '1',
            composeSpecialFlag: false,

            allComposes: [],
            programs: [],          // Список программ для развертывания
            composes: [],
            events: [],            // Список событий программы в нужном порядке

            viewOtherComposes: false, lockMode: false,
            editForm: [],         // Форма редактирования события

            addForm: { name: "", src: "", type: 'image', time: 15, isActive: true },
            addFormCmp: { name: "", src: "", type: 'image', time: 15, isActive: true },

            sendCallback: [],     // Модалка формы отправки
            modalSend: {},
            modalRecall: {},

            prevArrow: '',
            nextArrow: '',

            format: /[`!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/  // Недопустимые в именовании символы
        }
    },
    methods: {
        /**
         * Открыть список файлов для выборки
         */
        openCanvas(form, index, type, inForm = false)
        {
            this.dataForm = form;
            if (inForm) {
                this.dataIndex = -1;
            } else {
                this.dataIndex = index;
            }
            this.typeOfList = type;
            this.canvas.show();
        },

        /**
         * Выбрать файл как используемые событием ресурс
         */
        selectFile(file)
        {
            if (this.dataIndex === -1) {
                this.dataForm.src = file.src;
            } else {
                this.dataForm[this.dataIndex].src = file.src;
            }
            this.canvas.hide();
        },

        /**
         * Поиск в списке файлов
         * @param searchParam Параметры выборки
         * @param sortBy Параметры сортировки
         */
        search(searchParam, sortBy)
        {
            this.filesImg = this.files.img;
            this.filesClip = this.files.mov;

            if (this.typeOfList !== 'filtered') {
                this.reserveType = this.typeOfList;
            }
            if (searchParam === '') {
                this.typeOfList = this.reserveType;
            } else {
                this.typeOfList = 'filtered';
                this.viewFiles = [];

                for (let i in this.filesImg) {
                    if (this.filesImg[i].name.includes(searchParam) || searchParam === '') {
                        this.viewFiles.push(this.filesImg[i]);
                    }
                }
                for (let i in this.filesClip) {
                    if (this.filesClip[i].name.includes(searchParam) || searchParam === '') {
                        this.viewFiles.push(this.filesClip[i]);
                    }
                }
            }

            switch (sortBy[0]) {
                case 'name':
                function sortFuncName(a, b) {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                }
                    this.viewFiles.sort(sortFuncName);
                    this.filesImg.sort(sortFuncName);
                    if (sortBy[0] !== 'none' && sortBy[1] === 'desc') {
                        this.viewFiles.reverse();
                        this.filesImg.reverse();
                    }
                    break;
                case 'date':
                function sortFuncDate(a, b) {
                    if (a.createdAt < b.createdAt) {
                        return -1;
                    }
                    if (a.createdAt > b.createdAt) {
                        return 1;
                    }
                    return 0;
                }
                    this.viewFiles.sort(sortFuncDate);
                    this.filesImg.sort(sortFuncDate);
                    if (sortBy[0] !== 'none' && sortBy[1] === 'desc') {
                        this.viewFiles.reverse();
                        this.filesImg.reverse();
                    }
                    break;
                case 'author':
                    if (sortBy[1] !== '-') {
                        this.viewFiles = this.viewFiles.filter(file => file.author.name === sortBy[1]);
                        this.filesImg = this.filesImg.filter(file => file.author.name === sortBy[1]);
                    }
                    break;
                case 'weight':
                function sortFuncWeight(a, b) {
                    if (a.author.name < b.author.name) {
                        return -1;
                    }
                    if (a.author.name > b.author.name) {
                        return 1;
                    }
                    return 0;
                }
                    this.viewFiles.sort(sortFuncWeight);
                    this.filesImg.sort(sortFuncWeight);
                    if (sortBy[0] !== 'none' && sortBy[1] === 'desc') {
                        this.viewFiles.reverse();
                        this.filesImg.reverse();
                    }
                    break;
                default:
            }
        },

        /**
         * Скрытие текста кнопок модалки просмотра
         * на устройствах с маленьким экраном
         */
        resizeTextEdit()
        {
            if (window.innerWidth > 768) {
                this.prevArrow = 'Предыдущее событие';
                this.nextArrow = 'Следующее событие';
            } else {
                this.prevArrow = '';
                this.nextArrow = '';
            }
        },

        /**
         * Получить список всех шаблонов и композиций
         * @param withModals Флаг определения модальных окон
         */
        async allTmp(withModals = true)
        {
            if (withModals) {
                this.canvas = new bootstrap.Offcanvas('#Canva');
                this.modalRecall = new bootstrap.Modal(document.getElementById('ModalRecall'));
                this.sendDetailWorkdays = new bootstrap.Modal(document.getElementById('detailsWorkdaysModal'));
                this.sendDetailSpecial = new bootstrap.Modal(document.getElementById('detailsSpecialModal'));
                this.sendCallback = new bootstrap.Modal(document.getElementById('SendModerModal'));
                this.saveModal = new bootstrap.Modal(document.getElementById('ModalSave'));
                this.newTmpModal = new bootstrap.Modal(document.getElementById('ModalNameTmp'));
                this.modalSend = new bootstrap.Modal(document.getElementById('ModalSend'));
            }

            let settingData = await this.request('/setting/all', 'GET');
            
            if (settingData.status === 'success') {
                this.programs = settingData.data.programs;
                this.allComposes = settingData.data.composes;

                for (let i in this.allComposes.userComposes) {
                    this.allComposes.userComposes[i].lock = true;
                    this.allComposes.userComposes[i].programsRes = JSON.parse(JSON.stringify(this.allComposes.userComposes[i].programs));
                }
                for (let i in this.allComposes.otherComposes) {
                    this.allComposes.otherComposes[i].lock = true;
                    this.allComposes.otherComposes[i].programsRes = JSON.parse(JSON.stringify(this.allComposes.otherComposes[i].programs));
                }
            }

            this.switchComposesView(false);

            let files = await this.request('/files/img', 'GET');
           
            if (files.status === 'success') {
                files.data.forEach((file) =>
                {
                    if (file.type === 'image') {
                        this.filesImg.push(file);
                    } else {
                        this.filesClip.push(file);
                    }
                });
            }

            this.files = {
                img: this.filesImg,
                mov: this.filesClip,
            }

            let date_ob = new Date();
            let dd = ("0" + date_ob.getDate()).slice(-2);
            let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let yyyy = date_ob.getFullYear();
            let minDate = yyyy + '-' + mm + '-' + dd;
            let maxDate = (Number(yyyy) + 1) + '-' + mm + '-' + dd;

            document.getElementById('startDate').min = minDate;
            document.getElementById('startDate').max = maxDate;
            document.getElementById('startDate').value = minDate;
            this.composeTargetDate = minDate;

            let response = await this.request('/accounts', 'GET');
            this.users = response.data;
        },

        /**
         * Открытие содержимого программы
         * @param id ID программы, которую необходимо открыть
         */
        async getTmp(id)
        {
            if (!id || id === '-') {
                this.toast('error', 'Сначала выберите программу, которую хотите открыть.');
                return;
            }
            for (let i in this.programs) {
                if (this.programs[i].id === id) {
                    this.events = this.programs[i].events;
                    this.composeDetailsModal.programObj =  this.programs[i];
                }
            }
            this.openedProgramId = id;
            this.programIsOpen = true;
            for (let i in this.events) {
                if (!this.editForm[i]) {
                    this.editForm[i] = {};
                }
                this.editForm[i].isDisabled = true;
            }
            this.composeDetailsModal.withChanges = false;
        },

        /**
         * Модальное окно для определения способа создания новой программы
         * @param tmpType
         * @returns {Promise<void>}
         */
        async triggerModal(tmpType)
        {
            this.forModal.newType = tmpType;
            if (tmpType === 'copy' && this.openedProgramId === '') {
                this.toast('error', 'Для создания копии шаблона необходимо открыть шаблон, который нужно скопировать!');
                return;
            }
            this.newTmpModal.show();
        },

        /**
         * Переключение между страницами в режиме предпросмотра
         * @param prevOrNext
         */
        switchPage(prevOrNext)
        {
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
         * Открытие предпросмотра программ
         * @param tmpOrCmp
         * @param cmp
         * @param tmp
         * @returns {Promise<void>}
         */
        async openPreview(tmpOrCmp, cmp = {}, tmp = {})
        {
            if (tmpOrCmp === 'tmp') {
                for (let i in this.programs) {
                    if (this.programs[i].id === this.openedProgramId) {
                        this.composeDetailsModal.templateName = this.programs[i].name;
                        this.composeDetailsModal.authorName = this.session().name;
                    }
                }
                this.composeDetailsModal.previewEvents = this.events;
                this.composeDetailsModal.numberOfEvents = this.events.length;
                this.composeDetailsModal.nameOfCurrentEvent = this.events[0].name;
                this.composeDetailsModal.numberOfCurrentEvent = this.events.length === 0 ? 0 : 1;
            } else {
                this.composeDetailsModal.templateName = tmp.name;
                this.composeDetailsModal.authorName = cmp.author.name;
                this.composeDetailsModal.previewEvents = tmp.events;
                this.composeDetailsModal.numberOfEvents = tmp.events.length;
                this.composeDetailsModal.nameOfCurrentEvent = tmp.events[0].name;
                this.composeDetailsModal.numberOfCurrentEvent = tmp.events.length === 0 ? 0 : 1;
            }
        },

        /**
         * Создать новую программу
         * @param name
         * @param tmpType
         * @param events
         * @returns {Promise<void>}
         */
        async createProgram(name, tmpType, events)
        {
            this.forModal.newType = tmpType;
            if (this.format.test(name)) {
                this.toast('error', 'Имя шаблона не должно содержать специальных символов: \n' + this.format);
                return;
            } else if (name.length > 30) {
                this.toast('error', 'Получено слишком длинное наименование шаблона. \nПроверьте, пожалуйста, правильность введённых данных \nРазрешено символов: 30. Получено: ' + name.length);
                return;
            } else if (name === "") {
                this.toast('error', 'Заполните имя нового шаблона!');
                return;
            } else if (tmpType === 'copy' && this.openedProgramId === '') {
                this.toast('error', 'Для создания копии шаблона необходимо открыть шаблон, который нужно скопировать!');
                return;
            } 

            let response = await this.request('/setting/program','POST', {
                name: name,
                type: tmpType,
                events: events,
            });
            
            if (response.status !== 'success') {
                this.toast('error', 'Шаблон c именем: \"' + name + '\" уже существует. Придумайте другое.');
                return;
            }
            this.programs.push(response.data);
            this.programId = response.data.id;
            this.newProgramName = "";

            await this.getTmp(response.data.id);
            switch (tmpType) {
                case 'copy':
                    this.toast('success', 'Шаблон был успешно скопирован под именем: \"' + name + '\".');
                    break;
                case 'default':
                case 'empty':
                default:
                    this.toast('success', 'Шаблон \"' + name + '\" был успешно создан.');
            }
            this.newTmpModal.hide();
        },

        /**
         * Сохранить изменения, внесенные в программу
         * @returns {Promise<void>}
         */
        async saveProgramChanges()
        {
            if (this.events[0] === undefined) {
                this.events[0] = { name: "empty", src: "empty", type: 0, time: 1, isActive: true }
            }
            let response = await this.request('/setting/program/save', 'POST', {
                id: this.openedProgramId,
                events: this.events,
            });

            if (response.status !== 'success') {
                this.toast('error', 'Произошла ошибка');
                return;
            }
            this.saveModal.hide();
            this.toast('success', 'Изменения сохранены');
            this.composeDetailsModal.withChanges = false;
        },

        /**
         * Удалить программу
         * @param id
         * @returns {Promise<void>}
         */
        async deleteProgram(id)
        {
            if (id === '-') {
                this.toast('error', 'Выберите шаблон, который хотите удалить.');
                return;
            }

            let response = await this.request('/setting/program', 'DELETE', { id });
            if (response.status !== 'success') {
                this.toast('error', 'Данная программа не найдена. Попробуйте перезагрузить страницу.');
                return;
            }
            for (let i in this.programs) {
                if (this.programs[i].id === id) {
                    this.programs.splice(Number(i), 1);
                }
            }
            this.openedProgramId = '';
            this.programIsOpen = false;
            this.programId = '-';
            this.toast('success', 'Программа была удалена.');
        },

        /**
         * Добавить событие внутри программы
         * @returns {Promise<void>}
         */
        async createEvent(form, data, addForm)
        {
            if (!(addForm.name !== "" && (addForm.src !== ""))) {
                this.toast('error', 'Пожалуйста, заполните все поля перед добавлением.');
                return;
            }
            if (addForm.name.length > 50) {
                this.toast('error', 'Получено слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + addForm.name.length);
            } else if (!Number.isFinite(addForm.time) || addForm.time < 0) {
                this.toast('error', 'Получено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
            } else if (this.format.test(addForm.name)) {
                this.toast('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
            } else if (addForm.name.trim() === '') {
                this.toast('error', 'Имя события не должно состоять только из пробелов.');
            } else {
                form.push({ isDisabled: true });
                data.push(addForm);
                this.addForm = { name: "", src: "", type: 'image', time: 15, isActive: true };
                this.addFormCmp = { name: "", src: "", type: 'image', time: 15, isActive: true };
                this.composeDetailsModal.withChanges = true;
            }
        },

        /**
         * Редактирование события
         * @param index
         * @param form
         * @returns {Promise<void>}
         */
        async changeEvent(index, form)
        {
            form[index].isDisabled = false;
        },

        /**
         * Сохранение изменений, внесенных в событие
         * @param index
         * @returns {Promise<void>}
         */
        async saveEventChanges(index)
        {
            if (this.events[index].src === '') {
                this.toast('error', 'Не определен ресурс события. ');
            } else if (this.format.test(this.events[index].name)) {
                this.toast('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
            } else if (this.events[index].name === '') {
                this.toast('error', 'Не определено имя события.');
            } else if (this.events[index].name.trim() === '') {
                this.toast('error', 'Имя события не должно состоять только из пробелов.');
            } else if (this.events[index].time === '') {
                this.toast('error', 'Не определено время.');
            } else if (Number(this.events[index].time) <= 0) {
                this.toast('error', 'Время не может быть отрицательным.');
            } else if (!['image', 'webform', 'video'].includes(this.events[index].type)) {
                this.toast('error', 'System: обнаружена попытка сломать форму. Уведомление о ваших действиях направлено администратору.');
            } else if (this.events[index].name.length > 50) {
                this.toast('error', 'Полученно слишком длинное наименование события. \nРазрешено символов: 50. Получено: ' + this.events[index].name.length);
            } else {
                this.editForm[index].isDisabled = true;
                this.composeDetailsModal.withChanges = true;
            }
        },

        /**
         * Удалить событие из списка программы
         * @param index
         * @param form
         * @param data
         * @param withModal
         * @returns {Promise<void>}
         */
        async deleteEvent(index, form, data, withModal = false)
        {
            form[index].isDisabled = true;
            form[index].isDeleted = true;
            form.splice(index, 1);
            data.splice(index, 1);
            if (withModal) {
                this.composeDetailsModal.withChanges = true;
            }
        },

        /**
         * Проверка на ошибки перед сохранением изменений
         * @returns {Promise<void>}
         */
        async checkIssues()
        {
            for (let form in this.editForm) {
                if (!this.editForm[form].isDisabled) {
                    this.toast('error', 'Невозможно сохранить изменения, пока идет редактирование.');
                    return;
                }
            }
            this.saveModal.show();
        },

        /**
         * Поменять порядок событий внутри программы
         * @param move
         * @param index
         * @param data
         * @param form
         * @param withModal
         * @returns {Promise<void>}
         */
        async moveEvent(move, index, data, form, withModal = false)
        {
            let id1 = index;
            let id2 = null;

            if (move === "down" && id1 !== data.length - 1) {
                id2 = id1++;
            }
            if (move === "up" && id1 !== 0) {
                id2 = id1--;
            }
            if (id2 !== null) {
                this.correctOrder(data, form, [id1, id2])
            }
            if (withModal) {
                this.composeDetailsModal.withChanges = true;
            }
        },

        /**
         * Смена очередности событий (работает вместе с методом: moveEvent)
         * @param arr
         * @param form
         * @param param
         */
        correctOrder(arr, form, param)
        {
            /*
             коррекция  элементов массива по паре индекса
             *    _arr -- массив требующий коррекции
             *   _param -- пара [n1,n2] -- индексы массива для взаимной перестановки
             */
            form[param[1]] = form.splice(param[0], 1, form[param[1]])[0];
            arr[param[1]] = arr.splice(param[0], 1, arr[param[1]])[0];
        },

        /**
         * Собрать новую композицию
         * @param spec Тип композиции
         * @returns {Promise<void>}
         */
        async createCompose(spec)
        {
            if (spec) {
                for (let i in this.composePrograms) {
                    if (this.composePrograms[i] === '-') {
                        this.toast('error', 'При сборке программы особого типа заполните все поля корректно.');
                        return;
                    }
                }
            }

            let response = await this.request('/setting/compose', 'POST', {
                name: this.newComposeName,
                comment: this.composeDescription,
                programsId: this.composePrograms,
                times: this.composeTimes,
                screen: this.composeTargetScreen,
                isSpec: this.composeSpecialFlag
            });
        
            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }
            this.sendCallback.hide();
            let newCmp = response.data;
            newCmp.lock = true;

            await this.allTmp(false);
            this.newComposeName = '';
            this.composeDescription = '';
            this.composePrograms = ['-', '-', '-'];
            this.composeTimes = [];
            this.composeTargetScreen = '1';
            this.toast('success', 'Композиция успешно собрана.');
        },

        /**
         * Смена типа композиции (при создании)
         */
        changeType()
        {
            if (this.composeSpecialFlag) {
                this.composePrograms = ['-', '-', '-'];
                this.composeTimes = [];
            } else {
                this.composePrograms = ['-'];
                this.composeTimes = ['00:00'];
            }
        },

        /**
         * Начало редактирования композиции (кнопка "Редактировать")
         * @param index
         * @returns {Promise<void>}
         */
        async startEditCompose(index)
        {
            if (this.CMP_EDIT_STARTED) {
                this.toast('error', 'Для корректности работы одновременно можно редактировать не более одной программы.');
                return
            } 
            this.CMP_EDIT_STARTED = true;
            this.composes[index].lock = false;
        },

        /**
         * Завершение редактирования композиции без синхронизации с сервером (кнопка "Отменить")
         * @param index
         */
        finishEditCompose(index)
        {
            this.CMP_EDIT_STARTED = false;
            this.composes[index].programs = JSON.parse(JSON.stringify(this.composes[index].programsRes));
            this.composes[index].lock = true;
        },

        /**
         * Сохранить изменения, внесенные в композицию
         * @param cmp
         * @param programs
         * @param eventList
         * @param forDate
         * @returns {Promise<void>}
         */
        async saveComposeChanges(cmp, programs, eventList, forDate)
        {
            let response, replace = [];

            if (!cmp.isSpecial) {
                if (eventList[0] !== undefined) {
                    replace = eventList;
                }
                response = await this.request('/setting/compose/update', 'POST', {
                    id: cmp.id,
                    forDate,
                    programs,
                    eventList: replace,
                    timingList: null,
                });
            } else {
                let tmpFilter = [], timeFilter = [], eventFilter = [];

                for (let i in programs) {
                    tmpFilter.push({
                        id: programs[i].id,
                        name: programs[i].name,
                    });
                    timeFilter.push(programs[i].timeToSwap);
                }

                for (let i in eventList) {
                    eventFilter.push(eventList[i].events);
                }

                response = await this.request('/setting/compose/update', 'POST', {
                    id: cmp.id,
                    forDate,
                    programs: tmpFilter,
                    eventList: eventFilter,
                    timingList: timeFilter,
                });
            }
           
            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }
            this.toast('success', 'Изменения внесены успешно');
            this.sendDetailWorkdays.hide();
            this.CMP_EDIT_STARTED = false;
            cmp.lock = true;
            await this.allTmp(false);
        },

        /**
         * Удалить композицию
         * @param id ID композиции, которую необходимо удалить
         * @param withPrograms Удалить вложенные программы?
         * @returns {Promise<void>}
         */
        async deleteCompose(id, withPrograms)
        {
            if (id === undefined) {
                this.toast('error', 'Произошла ошибка. Пожалуйста, перезагрузите страницу.');
                return;
            }

            let response = await this.request('/setting/compose', 'DELETE', {
                id,
                withPrograms,
            });

            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }
            this.toast('success', 'Скомпонованная программа была успешно удалена.');
            await this.allTmp(false);
            this.CMP_EDIT_STARTED = false;
        },

        /**
         * Отправка композиции на модерацию
         * @param id
         * @param name
         * @param description
         * @returns {Promise<void>}
         */
        async sendCompose(id, name, description)
        {
            let response = await this.request('/setting/compose/send', 'POST', {
                id,
                name,
                description,
                date: this.composeTargetDate,
            });
    
            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }
            this.toast('success', 'Отправлено на утверждение');
            this.modalSend.hide();
            this.CMP_NAME = '';
            this.CMP_COMM = '';
            await this.allTmp(false);
    },

        /**
         * Переключение между просмотром своих / чужих композиций
         */
        switchComposesView(viewOther)
        {
            this.viewOtherComposes = viewOther;
            if (viewOther) {
                this.composes = this.allComposes.otherComposes;
            } else {
                this.composes = this.allComposes.userComposes;
            }
        },

        /**
         * Детальное редактирование программ композиции (кнопка "Просмотр")
         * @param index
         * @param lockMode
         * @returns {Promise<void>}
         */
        async openCompose(index, lockMode)
        {
            this.lockMode = lockMode;
            if (this.eventList.index === index) {
                if (this.eventList.type === false) {
                    this.sendDetailWorkdays.show();
                } else {
                    this.sendDetailSpecial.show();
                }
                return;
            }

            this.eventList = {
                index: index,
                type: this.composes[index].isSpecial,
            };

            if (!this.composes[index].isSpecial) {
                this.editFormS = [];
                this.editFormB = [];
                this.editFormL = [];
                this.eventList.data = {
                    lesson: [],
                    breaktime: [],
                    lunch: [],
                };

                for (let i in this.composes[index].programs[0].events) {
                    if (!this.editFormS[i]) {
                        this.editFormS[i] = {}
                    }
                    this.editFormS[i].isDisabled = true;
                    this.eventList.data.lesson.push(this.composes[index].programs[0].events[i]);
                }
                for (let i in this.composes[index].programs[1].events) {
                    if (!this.editFormB[i]) {
                        this.editFormB[i] = {}
                    }
                    this.editFormB[i].isDisabled = true;
                    this.eventList.data.breaktime.push(this.composes[index].programs[1].events[i]);
                }
                for (let i in this.composes[index].programs[2].events) {
                    if (!this.editFormL[i]) {
                        this.editFormL[i] = {}
                    }
                    this.editFormL[i].isDisabled = true;
                    this.eventList.data.lunch.push(this.composes[index].programs[2].events[i]);
                }
                this.sendDetailWorkdays.show();
            } else {
                this.customForms = [];
                this.eventList.data = [];

                for (let i in this.composes[index].programs) {
                    this.customForms[i] = [];
                    for (let j in this.composes[index].programs[i].events) {
                        if (!this.customForms[i][j]) {
                            this.customForms[i][j] = {};
                            this.customForms[i][j].isDisabled = true;
                        }
                    }
                    this.eventList.data.push(this.composes[index].programs[i]);
                }
                this.sendDetailSpecial.show();
            }
        },

        /**
         * Отозвать композицию из модерации
         * @param id ID композиции
         * @returns {Promise<void>}
         */
        async recall(id)
        {
            let response = await this.request('/setting/compose/recall', 'POST', {
                id: id,
            });
    
            if (response.status !== 'success') {
                this.toast('error', 'Произошла ошибка');
                return;
            }
            await this.allTmp(false);
            this.toast('success', 'Композиция отозвана из модерации');
        }
    },
    async mounted()
    {
        await this.allTmp();
        this.resizeTextEdit();
        window.addEventListener('resize', this.resizeTextEdit, true);
    }
}
</script>

<template>
    <div class="intro">
        <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="Canva" aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Выберите файл</h5>
                <button @click="this.canvas.hide();" type="button" class="btn-close"></button>
            </div>
            <div class="input-group flex-nowrap pt-0 pb-0 ps-3 pe-3">
                <span class="input-group-text" id="addon-wrapping">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                </span>
                <input @keydown.enter="search(filter, sortBy)" v-model="filter" type="text" class="form-control" placeholder="Введите имя файла" aria-describedby="addon-wrapping">
                <button @click="search(filter, sortBy)" class="btn btn-outline-secondary" type="button">Найти</button>
            </div>
            <div class="input-group flex-nowrap pt-2 pb-2 ps-3 pe-3">
                <select v-model="sortBy[0]" class="form-select form-select-sm">
                    <option value="none" @click="sortBy[1] = 'asc'" selected>Без фильтра</option>
                    <option value="name" @click="sortBy[1] = 'asc'">Имя</option>
                    <option value="date" @click="sortBy[1] = 'asc'">Дата</option>
                    <option value="author" @click="sortBy[1] = '-'"> Автор </option>
                    <option value="weight" @click="sortBy[1] = 'asc'">Размер</option>
                </select>
                <select v-if="sortBy[0] !== 'author'" v-model="sortBy[1]" class="form-select form-select-sm">
                    <option value="asc" selected>По возрастанию</option>
                    <option value="desc">По убыванию</option>
                </select>
                <select v-if="sortBy[0] === 'author'" v-model="sortBy[1]" class="form-select form-select-sm">
                    <option value="-" selected>Все</option>
                    <option v-for="(user, index) in users" :value="user.name"> {{ user.name }} </option>
                </select>
            </div>
            <div class="offcanvas-body pt-0">
                <!-- ФИЛЬТР -->
                <div v-if="typeOfList === 'filtered'" class="row row-cols-1 row-cols-sm-2 g-2">
                    <div v-for="file in this.viewFiles">
                        <div class="col">
                            <div class="card h-100">
                                <small class="card-header p-2">
                                    <div class="row justify-content-between align-items-center">
                                        <div class="col-auto align-items-center">
                                            <p class="card-text m-0">
                                                <div class="badge bg-secondary text-wrap align-items-center rounded-pill">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                    </svg>
                                                    {{ file.author.name }}
                                                </div>
                                            </p>
                                        </div>
                                        <div class="col-auto">
                                            <a type="button" class="btn btn-outline-secondary btn-sm me-1" :href="file.src" target="_blank" rel="noopener noreferrer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </a>
                                            <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </small>
                                <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;"  alt="" />
                                <div class="card-body p-2">
                                    <h6 class="card-title mb-1 mt-0 ms-0 me-0">{{ file.name + '.' + file.format }} </h6>
                                    <div class="badge bg-info text-wrap align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                        </svg>
                                        {{ file.weight }}
                                    </div>
                                    <div class="badge bg-secondary text-wrap ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                        </svg>
                                        {{ file.isUnlimited ? 'Бессрочно' : file.expires }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ИЗОБРАЖЕНИЯ -->
                <div v-if="typeOfList === 'image'" class="row row-cols-1 row-cols-sm-2 g-2">
                    <div v-for="(file, index) in filesImg">
                        <div class="col">
                            <div class="card h-100">
                                <small class="card-header p-2">
                                    <div class="row justify-content-between align-items-center">
                                        <div class="col-auto align-items-center">
                                            <p class="card-text m-0">
                                                <div class="badge bg-secondary text-wrap align-items-center rounded-pill">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                    </svg>
                                                    {{ file.author.name }}
                                                </div>
                                            </p>
                                        </div>
                                        <div class="col-auto">
                                            <a type="button" class="btn btn-outline-secondary btn-sm me-1" :href="file.src" target="_blank" rel="noopener noreferrer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </a>
                                            <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </small>
                                <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;"  alt="" />
                                <div class="card-body p-2">
                                    <h6 class="card-title mb-1 mt-0 ms-0 me-0">{{ file.name + '.' + file.format }} </h6>
                                    <div class="badge bg-info text-wrap align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                        </svg>
                                        {{ file.weight }}
                                    </div>
                                    <div class="badge bg-secondary text-wrap ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                        </svg>
                                        {{ file.isUnlimited ? 'Бессрочно' : file.expires }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ВИДЕО -->
                <div v-if="typeOfList === 'video'">
                    <div v-for="(file, index) in filesClip">
                        <div class="col">
                            <div class="card h-100">
                                <small class="card-header p-2">
                                    <div class="row justify-content-between align-items-center">
                                        <div class="col-auto align-items-center">
                                            <p class="card-text m-0">
                                                <div class="badge bg-secondary text-wrap align-items-center rounded-pill">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                    </svg>
                                                    {{ file.author.name }}
                                                </div>
                                            </p>
                                        </div>
                                        <div class="col-auto">
                                            <a type="button" class="btn btn-outline-secondary btn-sm me-1" :href="file.src" target="_blank" rel="noopener noreferrer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </a>
                                            <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </small>
                                <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;"  alt="" />
                                <div class="card-body p-2">
                                    <h6 class="card-title mb-1 mt-0 ms-0 me-0">{{ file.name + '.' + file.format }} </h6>
                                    <div class="badge bg-info text-wrap align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                        </svg>
                                        {{ file.weight }}
                                    </div>
                                    <div class="badge bg-secondary text-wrap ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                        </svg>
                                        {{ file.isUnlimited ? 'Бессрочно' : file.expires }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <detailModals :eventList="eventList" :editFormS="editFormS" :editFormB="editFormB" :editFormL="editFormL"
            :addForm="addFormCmp" :addEventCmp="createEvent" :demoMode="viewOtherComposes || lockMode"
            :delEventCmp="deleteEvent" :moveEventCmp="moveEvent"
            :currentModalPage="currentModalPage" :customForms="customForms" :editEventCmp="changeEvent">
        </detailModals>

        <!-- Modal for Save template -->
        <div class="modal fade" id="ModalSave" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение сохранения</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь сохранить изменения в программе. <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button class="btn btn-success" @click="saveProgramChanges" @keydown.enter="saveProgramChanges">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Delete template -->
        <div class="modal fade" id="ModalDelete" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение удаления</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь удалить данную программу. <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="deleteProgram(programId)" @keydown.enter="deleteProgram(programId)"
                            class="btn btn-danger" data-bs-dismiss="modal">Удалить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Recall template -->
        <div class="modal fade" id="ModalRecall" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение возврата</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь отозвать данную программу из модерации. <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="recall(CMP_ID)" @keydown.enter="recall(CMP_ID)" class="btn btn-warning" data-bs-dismiss="modal">Отозвать</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Delete compose -->
        <div class="modal fade" id="ModalDelcmp" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение удаления</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь удалить программу. <br> Вы уверены?
                    </div>
                    <div class="d-flex w-100 justify-content-start align-items-center gap-3 mt-1">
                        <div class="form-check form-switch mt-1">
                            <input v-model="CMP_DEL_WITHPROGRAMS" class="form-check-input" type="checkbox" role="switch">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Удалить вложенные программы</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="deleteCompose(CMP_ID, CMP_DEL_WITHPROGRAMS)" @keydown.enter="deleteCompose(CMP_ID, CMP_DEL_WITHPROGRAMS)" class="btn btn-danger" data-bs-dismiss="modal">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Send compose -->
        <div class="modal fade" id="ModalSend" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение отправки</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Для отправки на модерацию необходимо заполнить поля для модератора. <br><br> Пожалуйста, заполняйте
                        поля адекватно и корректно, поскольку модератор увидит те данные и информацию, которые вы укажете.
                        <br><br>
                        <form @submit.prevent="sendCompose(CMP_ID, CMP_NAME, CMP_COMM)">
                            <div class="mb-3">
                                <label for="recipient-name" class="col-form-label">Название:</label>
                                <input @keydown.enter="formNextFocus('message-text_desc')" v-model="CMP_NAME" type="text" class="form-control" id="recipient-name" placeholder="Заголовок трансляции" />
                            </div>
                            <div class="mb-3">
                                <label for="message-text" class="col-form-label">Комментарий:</label>
                                <textarea @keydown.enter="sendCompose(CMP_ID, CMP_NAME, CMP_COMM)" v-model="CMP_COMM" class="form-control" id="message-text_desc" placeholder="Не обязательно"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer row justify-content-between">
                        <div class="col-12 col-sm-auto">
                            <input v-model="composeTargetDate" id="startDate" class="form-control" type="date" />
                        </div>
                        <div class="col-12 col-sm-auto">
                            <div class="row gap-1 m-0">
                                <button class="btn btn-secondary col-12 col-sm-auto" data-bs-dismiss="modal">Отмена</button>
                                <button @click="sendCompose(CMP_ID, CMP_NAME, CMP_COMM)" class="btn btn-success col-12 col-sm-auto">Отправить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for compose templates -->
        <div class="modal fade" id="SendModerModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5"> Скомпоновать программу </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Поля "Название" и "Комментарий" служат заметками. <br> Их не будет видеть модератор или кто-либо
                        еще. <br> Здесь можно записать важную для себя информацию. <br> Данная композиция будет доступна
                        только вам. <br><br>
                        <form @submit.prevent="createCompose(composeSpecialFlag)">
                            <div class="mb-3">
                                <label for="recipient-name" class="col-form-label">Название:</label>
                                <input @keydown.enter="formNextFocus('message-text_uniq_super')" v-model="newComposeName" type="text" class="form-control" id="recipient-name" placeholder="Заголовок трансляции" />
                            </div>
                            <div class="mb-3">
                                <label for="message-text" class="col-form-label">Комментарий:</label>
                                <textarea v-model="composeDescription" class="form-control" id="message-text_uniq_super" placeholder="Не обязательно"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <!-- Стандартное расписание -->
                        <div v-if="!composeSpecialFlag" class="d-flex w-100 justify-content-between align-items-center gap-1">
                            Пары:
                            <select v-model="composePrograms[0]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                                <option value="-" selected>- Нет изменений -</option>
                                <option v-for="tmp in programs" :value="tmp.id" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                            </select>
                        </div>
                        <div v-if="!composeSpecialFlag" class="d-flex w-100 justify-content-between align-items-center gap-1">
                            Перерыв:
                            <select v-model="composePrograms[1]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                                <option value="-" selected>- Нет изменений -</option>
                                <option v-for="tmp in programs" :value="tmp.id" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                            </select>
                        </div>
                        <div v-if="!composeSpecialFlag" class="d-flex w-100 justify-content-between align-items-center gap-1">
                            Обед:
                            <select v-model="composePrograms[2]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                                <option value="-" selected>- Нет изменений -</option>
                                <option v-for="tmp in programs" :value="tmp.id" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                            </select>
                        </div>
                        <div v-if="composeSpecialFlag" v-for="(program, index) in composePrograms" class="d-flex w-100 justify-content-between gap-1">
                            <input v-model="composeTimes[index]" type="time" class="form-control form-select-sm">
                            <select v-model="composePrograms[index]" class="form-select form-select-sm" aria-label="Default select example">
                                <option value="-" selected>- Не выбрано -</option>
                                <option v-for="tmp in programs" :value="tmp.id" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                            </select>
                            <button @click="composePrograms.splice(index, 1); this.composeTimes.splice(index, 1);" type="button" class="btn btn-outline-danger btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                </svg>
                            </button>
                        </div>
                        <button v-if="composeSpecialFlag" @click="composePrograms.push('-'); composeTimes.push('00:00');" type="button" class="btn btn-outline-success btn-sm w-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                            </svg>
                            Добавить
                        </button>
<!--                        <div class="d-flex w-100 justify-content-between gap-1">-->
<!--                            <select v-model="composeTargetScreen" class="form-select" aria-label="Default select example">-->
<!--                                <option selected value="1">Кафедра К3 - основной</option>-->
<!--                            </select>-->
<!--                        </div>-->
                        <div class="row w-100 justify-content-between align-items-center">
                            <div class="col form-check form-switch">
                                <input v-model="composeSpecialFlag" @click="changeType()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                <label class="form-check-label" for="flexSwitchCheckDefault">Особое расписание</label>
                            </div>
                            <button type="button" class="btn col btn-outline-secondary" data-bs-dismiss="modal"> Отмена
                            </button>
                            <button @click="createCompose(composeSpecialFlag)" type="button" class="btn col btn-success ms-2">
                                Собрать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for New template name -->
        <div class="modal fade" id="ModalNameTmp" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Создать новый шаблон</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Укажите название шаблона:
                        <div class="ps-0 mt-2 col-12">
                            <input v-if="['empty', 'default'].includes(this.forModal.newType)" v-model="newProgramName"
                                @keydown.enter="createProgram(newProgramName, this.forModal.newType, [])" id="name"
                                name="name" type="text" class="form-control" placeholder="Имя шаблона">
                            <input v-if="this.forModal.newType === 'copy'" v-model="newProgramName"
                                @keydown.enter="createProgram(newProgramName, this.forModal.newType, this.events)" id="name"
                                name="name" type="text" class="form-control" placeholder="Имя шаблона">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button v-if="this.forModal.newType === 'empty'" class="btn btn-success"
                            @click="createProgram(newProgramName, this.forModal.newType, [])">Создать пустой</button>
                        <button v-if="this.forModal.newType === 'default'" class="btn btn-success"
                            @click="createProgram(newProgramName, this.forModal.newType, [])">Создать по умолчанию</button>
                        <button v-if="this.forModal.newType === 'copy'" class="btn btn-success"
                            @click="createProgram(newProgramName, this.forModal.newType, this.events)">Создать
                            копию</button>
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
                            <h4 class="modal-title fs-5"><strong>{{ this.composeDetailsModal.templateName }}</strong> ({{this.composeDetailsModal.authorName }}) </h4>
                        </div>
                        <div class="col-auto m-0">
                            <h5 class="m-0"> <strong> {{ this.composeDetailsModal.numberOfCurrentEvent }}/{{this.composeDetailsModal.numberOfEvents }} </strong> </h5>
                        </div>
                        <div v-if="this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:red">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                </path>
                            </svg>
                            ИЗМЕНЕНИЯ НЕ СОХРАНЕНЫ
                        </div>
                        <div v-if="!this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:green">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z">
                                </path>
                            </svg>
                            ИЗМЕНЕНИЯ СОХРАНЕНЫ
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div v-if="composeDetailsModal.previewEvents[composeDetailsModal.numberOfCurrentEvent - 1] !== undefined"
                        class="modal-body">
                        <img v-if="composeDetailsModal.previewEvents[composeDetailsModal.numberOfCurrentEvent - 1].type === 'image'" :src="composeDetailsModal.previewEvents[composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%;" alt="">
                        <iframe v-if="composeDetailsModal.previewEvents[composeDetailsModal.numberOfCurrentEvent - 1].type === 'webform'" :src="composeDetailsModal.previewEvents[composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%;" alt=""></iframe>
                    </div>
                    <div class="modal-footer row justify-content-center">
                        <div class="col-auto">
                            <button @click="switchPage('prev')" type="button" class="btn btn-outline-success w-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z">
                                    </path>
                                </svg>
                                {{ this.prevArrow }}
                            </button>
                        </div>
                        <div class="col-auto">
                            <button @click="switchPage('next')" type="button"
                                class="btn btn-outline-success col-auto w-100">
                                {{ this.nextArrow }}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div class="col-12 col-lg-auto">
                            <select v-model="this.composeDetailsModal.numberOfCurrentEvent" class="form-select">
                                <option v-for="(event, index) in this.composeDetailsModal.previewEvents" :value="index + 1"> {{ index + 1 }}. {{ event.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h6 class="text mt-4"> Работа с трансляцией </h6>
            <!-- ВКЛАДКИ-->
            <div class="content">
                <ul class="nav nav-pills mb-0" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-templates-tab" data-bs-toggle="pill"
                            data-bs-target="#pills-templates" type="button" role="tab" aria-selected="true">Работа с
                            шаблонами</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-composed-tab" data-bs-toggle="pill" data-bs-target="#pills-composed" type="button" role="tab" aria-selected="false">Скомпонованные программы</button>
                    </li>
                    <!-- КОНЕЦ: Вкладки -->
                </ul>
            </div>
            <!-- СОДЕРЖИМОЕ ВКЛАДОК -->
            <div class="tab-content" id="pills-tabContent">
                <!-- ШАБЛОНЫ -->
                <div class="tab-pane fade show active" id="pills-templates" role="tabpanel"
                    aria-labelledby="pills-templates-tab" tabindex="0">
                    <div class="content">
                        <div class="row ms-0 me-0 mt-0 gx-2 justify-content-between">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-7">
                                <div class="input-group ms-0 me-0 mb-2">
                                    <!-- v-for="tmp in this.programs" -->
                                    <select v-model="programId" class="form-select" id="inputGroupSelect04" @keydown.enter="getTmp(programId)">
                                        <option value="-" selected>- Выберите -</option>
                                        <option v-for="tmp in programs" :value="tmp.id"> {{ tmp.name + (tmp.composeId === null ? '' : ' (исп.)') }} </option>
                                    </select>
                                    <button @click="getTmp(programId)" class="btn btn-success" type="button">Открыть</button>
                                </div>
                            </div>
                            <div v-if="composeDetailsModal.programObj.composeId === null" class="col-12 col-sm-12 col-md-5 col-lg-2">
                                <div class="row mt-0 gx-2">
                                    <!-- Button trigger Delete modal -->
                                    <div class="col-12 mb-2">
                                        <button type="button" class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#ModalDelete">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12 col-md-7 col-lg-3 mb-2">
                                <!-- Button trigger Send modal -->
                                <button type="button" class="btn btn-success w-100" @click="this.sendCallback.show()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stack" viewBox="0 0 16 16">
                                        <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z" />
                                        <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z" />
                                    </svg>
                                    Скомпоновать
                                </button>
                            </div>
                            <div class="row ms-0 me-0 mt-0 gx-2 ps-0 pe-0">
                                <div class="col-12 col-sm-12 col-md col-lg mb-2">
                                    <button @click="triggerModal('empty')" class="btn btn-outline-secondary w-100" type="button">Создать пустой</button>
                                </div>
                                <div class="col-12 col-sm-12 col-md-5 col-lg mb-2">
                                    <button @click="triggerModal('default')" class="btn btn-outline-secondary w-100" type="button">Создать по умолчанию</button>
                                </div>
                                <div class="col-12 col-sm-12 col-md col-lg mb-2">
                                    <button @click="triggerModal('copy')" class="btn btn-outline-secondary w-100" type="button">Создать копию</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="programIsOpen" class="content">
                        <div class="row gx-2 gy-2 align-items-center">
                            <div class="col-12">
                                <div class="row justify-content-start">
                                    <div v-if="composeDetailsModal.withChanges" class="col-auto m-0" style="color:red">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill mb-1" viewBox="0 0 16 16">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                        ИЗМЕНЕНИЯ НЕ СОХРАНЕНЫ
                                    </div>
                                    <div v-if="!composeDetailsModal.withChanges && composeDetailsModal.programObj.composeId === null" class="col-auto m-0" style="color:green">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill mb-1" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                        </svg>
                                        ИЗМЕНЕНИЯ СОХРАНЕНЫ
                                    </div>
                                    <div v-if="!composeDetailsModal.withChanges && composeDetailsModal.programObj.composeId !== null" class="col-auto m-0" style="color:orange">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill mb-1" viewBox="0 0 16 16">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                        ДАННАЯ ПРОГРАММА СКОМПОНОВАНА. ВНЕСТИ ИЗМЕНЕНИЯ ВЫ МОЖЕТЕ НА СООТВЕТСТВУЮЩЕЙ ВКЛАДКЕ.
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-sm-4 col-md-3 col-lg-3">
                                <p class="text_mini">Наименование события</p>
                            </div>

                            <div class="col-12 col-sm-3 col-md-2 col-lg-2">
                                <p class="text_mini">Ссылка на ресурс</p>
                            </div>

                            <div class="col-12 col-sm-2 col-md-2 col-lg-2">
                                <p class="text_mini">Тип ресурса</p>
                            </div>

                            <div class="col-12 col-sm-2 col-md-2 col-lg-1">
                                <p class="text_mini">Время (с.)</p>
                            </div>

                            <!-- Button trigger Save modal -->
                            <div class="col-12 col-sm-12 col-md-3 col-lg-3">
                                <div class="row g-2 mb-2">
                                    <div v-if="this.composeDetailsModal.withChanges" class="col">
                                        <button type="button" class="btn btn-success w-100" @click="checkIssues">Сохранить</button>
                                    </div>
                                    <div class="col">
                                        <button @click="openPreview('tmp')" type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#PreviewModal"> Предпросмотр </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-for="(event, index) in events" class="row gx-2 gy-2 align-items-center p-1">
                            <!-- ИНПУТ НА ИМЯ -->
                            <div v-if="!editForm[index].isDeleted" @click="this.clickBlock(editForm[index].isDisabled)" class="col-12 col-sm-4 col-md-4 col-lg-3">
                                <label class="visually-hidden" for="specificSizeInputName1">Name</label>
                                <input v-model="event.name" class="form-control" id="specificSizeInputName1" placeholder="Имя" :disabled="editForm[index].isDisabled">
                            </div>
                            <!-- ССЫЛКА -->
                            <div v-if="!editForm[index].isDeleted && !editForm[index].isDisabled && event.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <label class="visually-hidden" for="specificSizeInputGroupUsername1">Username</label>
                                <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername1" placeholder="Ссылка">
                            </div>
                            <!-- ФАЙЛ -->
                            <div v-if="!editForm[index].isDeleted && !editForm[index].isDisabled && event.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <div class="hstack gap-1">
                                    <input class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                                    <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                    <button class="btn btn-outline-success" type="button" @click="openCanvas(events[index], -1, event.type, true)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                        </svg>
                                    </button>
                                    <div v-if="event.src.split('--')[1]" class="vr"></div>
                                    <button v-if="event.src.split('--')[1]" @click="event.src = ''" type="button" class="btn btn-outline-danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <!-- ПРОСМОТР -->
                            <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
                            </div>
                            <!-- СЕЛЕКТОР НА ТИП -->
                            <div v-if="!editForm[index].isDeleted" @click="this.clickBlock(editForm[index].isDisabled)" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="editForm[index].isDisabled">
                                    <option value="image">Изображение</option>
                                    <option value="webform">WEB-форма</option>
                                    <option value="video">Видео</option>
                                </select>
                            </div>
                            <!-- ИНПУТ НА ВРЕМЯ -->
                            <div v-if="!editForm[index].isDeleted" @click="this.clickBlock(editForm[index].isDisabled)" class="col-12 col-sm-2 col-md-2 col-lg-1">
                                <label class="visually-hidden" for="specificSizeInputGroupUsername2">Username</label>
                                <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername2" placeholder="Время в сек" :disabled="editForm[index].isDisabled">
                            </div>
                            <!-- КНОПКА РЕДАКТИРОВАТЬ -->
                            <div v-if="!editForm[index].isDeleted && composeDetailsModal.programObj.composeId === null" class="col-auto">
                                <button v-if="!editForm[index].isDeleted && editForm[index].isDisabled" @click="changeEvent(index, editForm)" class="btn btn-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                    </svg>
                                    <!-- Редактировать -->
                                </button>
                                <!-- СОХРАНИТЬ / УДАЛИТЬ -->
                                <template v-if="!editForm[index].isDisabled">
                                    <button @click="saveEventChanges(index)" class="btn btn-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
                                            <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2z" />
                                            <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0zM13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13z" />
                                        </svg>
                                        <!-- Сохранить  -->
                                    </button>
                                    <button @click="deleteEvent(index, editForm, events, true)" class="btn btn-outline-danger ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                        <!-- Удалить  -->
                                    </button>
                                </template>
                            </div>
                            <!-- ВВЕРХ -->
                            <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled && composeDetailsModal.programObj.composeId === null" class="col-auto">
                                <button @click="moveEvent('up', index, events, editForm, true)" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
                            </div>
                            <!-- ВНИЗ -->
                            <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled && composeDetailsModal.programObj.composeId === null" class="col-auto">
                                <button @click="moveEvent('down', index, events, editForm, true)" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
                            </div>
                        </div>
                        <!--ФОРМА ДОБАВЛЕНИЯ-->
                        <div v-if="composeDetailsModal.programObj.composeId === null" class="row gx-2 gy-2 align-items-center p-1">
                            <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                                <label class="visually-hidden" for="specificSizeInputName">Name</label>
                                <input v-model="addForm.name" type="text" class="form-control" id="specificSizeInputName" placeholder="Имя" required>
                            </div>

                            <div v-if="addForm.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <label class="visually-hidden" for="specificSizeInputGroupUsername3">Username</label>
                                <input v-model="addForm.src" type="text" class="form-control" id="specificSizeInputGroupUsername3" placeholder="Ссылка" required>
                            </div>

                            <!-- ФАЙЛ -->
                            <div v-if="addForm.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <div class="hstack gap-1">
                                    <input class="form-control" type="text" :value="addForm.src.split('--')[1]" disabled>
                                    <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                    <button class="btn btn-outline-success" type="button" @click="openCanvas(addForm, -1, addForm.type, true)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                        </svg>
                                    </button>
                                    <div v-if="addForm.src.split('--')[1]" class="vr"></div>
                                    <button v-if="addForm.src.split('--')[1]" @click="addForm.src = ''" type="button" class="btn btn-outline-danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="col-12 col-sm-3 col-md-3 col-lg-2">
                                <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                <select v-model="addForm.type" class="form-select" id="specificSizeSelect">
                                    <option value="image" selected>Изображение</option>
                                    <option value="webform">WEB-форма</option>
                                    <option value="video">Видео</option>
                                </select>
                            </div>
                            <div class="col-12 col-sm-2 col-md-2 col-lg-1">
                                <label class="visually-hidden" for="specificSizeInputGroupUsername">Username</label>
                                <input v-model="addForm.time" type="number" class="form-control" id="specificSizeInputGroupUsername" placeholder="Время в сек" required>
                            </div>
                            <div class="col-auto">
                                <button @click="createEvent(editForm, events, addForm)" type="submit" class="btn btn-success">Добавить</button>
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
                <!-- СКОМПОНОВАННЫЕ ПРОГРАММЫ ТРАНСЛЯЦИИ -->
                <div class="tab-pane fade" id="pills-composed" role="tabpanel" aria-labelledby="pills-composed-tab" tabindex="0">
                    <div class="content">
                        <div class="d-flex w-100 justify-content-start align-items-center gap-3 mt-1">
                            <!-- SWITCH - Просмотр чужих композиций -->
                            <input @click="switchComposesView(false)" type="radio" class="btn-check" name="options-base" id="option5" autocomplete="off" checked>
                            <label class="btn btn-outline-success" for="option5">Ваши композиции</label>
                            <input @click="switchComposesView(true)" type="radio" class="btn-check" name="options-base" id="option6" autocomplete="off">
                            <label class="btn btn-outline-success" for="option6">Композиции других пользователей</label>
                        </div>
                    </div>
                    <div v-if="this.composes.length === 0" class="content"> Нет скомпонованных программ </div>
                    <div v-if="this.composes.length > 0" class="content">
                        <ul class="list-group">
                            <li v-for="(cmp, index) in this.composes" class="list-group-item">
                                <!-- ЗАГОЛОВОК, КОММЕНТ -->
                                <div class="me-auto">
                                    <!--СТАТУС-->
                                    <div class="row">
                                        <div class="col-12 col-sm-9 col-md-10 col-xxl-10">
                                            <div v-show="cmp.status === 'created'" class="badge bg-secondary text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                                </svg>
                                                Создано
                                            </div>
                                            <div v-show="cmp.status === 'sent'" class="badge bg-primary text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                                                </svg>
                                                Отправлено
                                            </div>
                                            <div v-show="cmp.status === 'processing'" class="badge bg-warning text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                                </svg>
                                                В обработке
                                            </div>
                                            <div v-show="cmp.status === 'approved'" class="badge bg-success text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16">
                                                    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                                                </svg>
                                                Утвержено
                                            </div>
                                            <div v-show="cmp.status === 'rejected'" class="badge bg-danger text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                                Отклонено
                                            </div>
                                            <div v-show="cmp.status === 'returned'" class="badge bg-success text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                                </svg>
                                                Возвращено
                                            </div>
                                            <div v-show="cmp.status === 'active'" class="badge bg-info text-wrap align-items-center me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                                                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                                </svg>
                                                Транслируется сейчас
                                            </div>
                                            <div v-show="cmp.message !== null && ['rejected', 'returned', 'approved'].includes(cmp.status)" class="badge bg-secondary text-wrap align-items-center mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-quote" viewBox="0 0 16 16">
                                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                    <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                                                </svg>
                                                {{ cmp.message }}
                                            </div>
                                        </div>
                                        <!--АВТОР-->
                                        <div class="col-12 col-sm-3 col-md-2 col-xxl-2">
                                            <div class="badge rounded-pill bg-secondary text-wrap align-items-center w-100 mt-1 me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                                                </svg>
                                                {{ cmp.author.name }}
                                            </div>
                                        </div>
                                    </div>
                                    <!--ИМЯ КОМПОЗИЦИИ-->
                                    <div class="fw align-items-center">
                                        <strong> {{ cmp.name }} </strong>
                                    </div>
                                    <small class="fw align-items-center"> {{ cmp.comment }} </small>
                                </div>
                                <!-- ЭКРАН, ДАТА -->
                                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                                    <select class="form-select" aria-label="Default select example" :disabled="cmp.lock">
                                        <option selected>Кафедра К3 - основной</option>
                                        <!-- <option value="1">Кафедра К3 - новости</option> -->
                                    </select>
                                    <!-- <input v-logger="cmp.date" id="startDate1" class="form-control" type="date" :value="cmp.date" :disabled="cmp.lock"/> -->
                                </div>
                                <!-- ПАРЫ -->
                                <div v-if="!cmp.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="cmp.programs[0]" @change="eventList = []" class="form-select form-select-sm" :disabled="cmp.lock">
                                                <option selected :value="cmp.programs[0]"> {{ cmp.programs[0].name }}</option>
                                                <option v-for="tmp in programs" :value="tmp" :disabled="tmp.composeId !== null"> {{ tmp.name }}</option>
                                            </select>
                                            <button v-if="!cmp.lock || viewOtherComposes" @click="openPreview('cmp', cmp, cmp.programs[0])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- ПЕРЕРЫВ -->
                                <div v-if="!cmp.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Перерыв: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="cmp.programs[1]" @change="eventList = []" class="form-select form-select-sm" :disabled="cmp.lock">
                                                <option selected :value="cmp.programs[1]"> {{ cmp.programs[1].name }} </option>
                                                <option v-for="tmp in programs" :value="tmp" :disabled="tmp.composeId !== null"> {{ tmp.name }}</option>
                                            </select>
                                            <button v-if="!cmp.lock || viewOtherComposes" @click="openPreview('cmp', cmp, cmp.programs[1])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- ОБЕД -->
                                <div v-if="!cmp.isSpecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Обед: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">
                                            <select v-model="cmp.programs[2]" @change="this.eventList = []" class="form-select form-select-sm" :disabled="cmp.lock">
                                                <option selected :value="cmp.programs[2]"> {{ cmp.programs[2].name }} </option>
                                                <option v-for="tmp in programs" :value="tmp" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                                            </select>
                                            <button v-if="!cmp.lock || viewOtherComposes" @click="openPreview('cmp', cmp, cmp.programs[2])" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- СПЕЦШАБЛОН -->
                                <div v-if="cmp.isSpecial" v-for="(tmp, index) in cmp.programs" class="d-flex w-100 justify-content-between gap-1 mt-1">
                                    <input v-model="cmp.programs[index].timeToSwap" type="time" class="form-control form-select-sm" :disabled="cmp.lock">
                                    <select v-model="cmp.programs[index]" class="form-select form-select-sm" aria-label="Default select example" :disabled="cmp.lock">
                                        <option :value="cmp.programs[index]" selected> {{ cmp.programs[index].name }} </option>
                                        <option v-for="tmp in programs" :value="tmp" :disabled="tmp.composeId !== null"> {{ tmp.name }} </option>
                                    </select>
                                    <!-- УДАЛИТЬ -->
                                    <button v-if="!cmp.lock" @click="cmp.programs.splice(index, 1)" type="button" class="btn btn-outline-danger btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                        </svg>
                                    </button>
                                    <!-- ПРЕДПРОСМОТР -->
                                    <button v-if="!cmp.lock || viewOtherComposes" type="button" @click="openPreview('cmp', cmp, tmp)" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                </div>
                                <!-- ДОБАВИТЬ -->
                                <button v-if="cmp.isSpecial && !cmp.lock" @click="cmp.programs.push({ id: 0, name: '- Выберите -', time_to_swap: '00:00' });" type="button" class="btn btn-outline-success btn-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                    </svg>
                                    Добавить
                                </button>
                                <!-- НИЖНЯЯ СТРОКА ОБРАБОТКИ -->
                                <div class="row w-100 align-items-center g-1 mt-2">
                                    <div class="col-12 col-sm-4 col-md mb-1 form-check form-switch">
                                        <input v-model="cmp.isSpecial" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault26" :disabled="true" />
                                        <label class="form-check-label" for="flexSwitchCheckDefault26"> Особое расписание </label>
                                    </div>
                                    <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                                    <div v-if="cmp.lock && !viewOtherComposes" class="col-12 col-sm-8 col-md-8 col-lg-6 col-xl-5 pe-0">
                                        <div class="row w-100 g-2 pe-0">
                                            <div v-if="['created', 'rejected', 'returned'].includes(cmp.status)" class="col">
                                                <button @click="startEditCompose(index)" class="btn btn-outline-secondary w-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                    </svg>
                                                    Редактировать
                                                </button>
                                            </div>
                                            <div v-if="['created', 'rejected', 'returned'].includes(cmp.status)" class="col pe-0">
                                                <button @click="CMP_ID = cmp.id; CMP_NAME = cmp.name; CMP_COMM = cmp.comment;" class="btn btn-outline-warning w-100" data-bs-toggle="modal" data-bs-target="#ModalSend">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                                    </svg>
                                                    Отправить
                                                </button>
                                            </div>
                                            <div v-if="['sent'].includes(cmp.status)" class="col ps-0 pe-0">
                                                <button @click="CMP_ID = cmp.id" class="btn btn-outline-warning w-100" data-bs-toggle="modal" data-bs-target="#ModalRecall">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99V4Zm1 7.105 4.708-2.897L1 5.383v5.722ZM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1Z"/>
                                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708l-1.25 1.25Z"/>
                                                    </svg>
                                                    Отозвать
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md">
                                        <button @click="finishEditCompose(index)" type="button" class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            Отмена
                                        </button>
                                    </div>
                                    <div v-if="!cmp.lock || viewOtherComposes || !['created', 'rejected', 'returned'].includes(cmp.status)" class="col-12 col-sm-12 col-md pe-0">
                                        <!-- Button trigger Details modal -->
                                        <button v-if="cmp.isSpecial" @click="openCompose(index, (!['created', 'rejected', 'returned'].includes(cmp.status)))" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <button v-if="!cmp.isSpecial" @click="openCompose(index, (!['created', 'rejected', 'returned'].includes(cmp.status)))" type="button" class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                    </div>
                                    <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md ps-1">
                                        <!-- Button trigger Deny modal -->
                                        <button @click="this.CMP_ID = cmp.id;" type="button" class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#ModalDelcmp">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                            Удалить
                                        </button>
                                    </div>
                                    <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md">
                                        <!-- Button trigger Confirm modal -->
                                        <button v-if="cmp.isSpecial" @click="saveComposeChanges(cmp, cmp.programs, this.eventList?.data, cmp.date)" type="button" class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                                                <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z" />
                                            </svg>
                                            Сохранить
                                        </button>
                                        <button v-if="!cmp.isSpecial" @click="saveComposeChanges(cmp, cmp.programs, [this.eventList?.data?.lesson, this.eventList?.data?.breaktime, this.eventList?.data?.lunch], cmp.date)" type="button" class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                                                <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z" />
                                            </svg>
                                            Сохранить
                                        </button>
                                    </div>
                                </div>
                                <!-- КОНЕЦ: Шаблон -->
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>