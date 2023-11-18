<script>
export default {
    props: ['eventList', 'editFormS', 'editFormB', 'editFormL', 'addForm',
        'editEventCmp', 'addEventCmp', 'delEventCmp', 'demoMode',
        'moveEventCmp', 'currentModalPage', 'customForms'],
    data()
    {
        return {
            typeOfList: 'image',

            reserveType: '',
            filter: '',
            viewFiles: [],  // Список файлов, отображаемых по фильтруемым параметрам

            canvas: {},     // Объект-канвас
            filesImg: [],    // Список изображений
            filesClip: [],   // Список видеофайлов

            dataForm: {},   //
            dataIndex: {},  //
        }
    },
    methods: {
        async onLoad()
        {
            this.canvas = new bootstrap.Offcanvas('#Testoffc');

            let files = await fetch(`/files/img`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                })
            });
            files = await files.json();

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
        },

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

        selectFile(file)
        {
            if (this.dataIndex === -1) {
                this.dataForm.src = file.src;
            } else {
                this.dataForm[this.dataIndex].src = file.src;
            }
            this.canvas.hide();
        },

        clearFile(file)
        {
            file.src = '';
        },

        search(searchParam)
        {
            if (searchParam === '') {
                this.typeOfList = this.reserveType;
                return;
            }
            if (this.typeOfList !== 'filtered') {
                this.reserveType = this.typeOfList;
            }
            this.typeOfList = 'filtered';
            this.viewFiles = [];

            for (let i in this.filesImg) {
                if (this.filesImg[i].name.includes(searchParam)) {
                    this.viewFiles.push(this.filesImg[i]);
                }
            }
            for (let i in this.filesClip) {
                if (this.filesClip[i].name.includes(searchParam)) {
                    this.viewFiles.push(this.filesClip[i]);
                }
            }
        },

        async saveEventCmp(index, form)
        {
            form[index].isDisabled = true;
        },
    },
    mounted()
    {
        this.onLoad();
    }
}
</script>

<template>
    <!-- Выбор файла как используемого ресурса -->
    <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="Testoffc" aria-labelledby="staticBackdropLabel">
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
            <input @keydown.enter="this.search(this.filter)" v-model="this.filter" type="text" class="form-control" placeholder="Введите имя файла" aria-describedby="addon-wrapping">
            <button @click="this.search(this.filter)" class="btn btn-outline-secondary" type="button">Найти</button>
        </div>
        <div class="input-group flex-nowrap pt-2 pb-2 ps-3 pe-3">
            <select class="form-select form-select-sm">
                <option value="0" selected>Имя</option>
                <option value="1">Дата</option>
                <option value="2">Автор</option>
            </select>
            <select class="form-select form-select-sm">
                <option value="0" selected>Возрастание</option>
                <option value="1">Убывание</option>
            </select>
        </div>
        <div class="offcanvas-body pt-0">
            <!-- ФИЛЬТР -->
            <div v-if="typeOfList === 'filtered'">
                <div v-for="file in this.viewFiles">
                    <div class="card mb-2">
                        <small class="card-header">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-auto align-items-center">
                                    <p class="card-text m-0"> {{ file.author.name }}
                                        <small class="text-body-secondary ms-1"> {{ file.isUnlimited ? 'Бессрочно' : file.expires }} </small>
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-outline-secondary btn-sm me-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                    </button>
                                    <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                        Выбрать
                                    </button>
                                </div>
                            </div>
                        </small>
                        <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;"  alt="" />
                        <div class="card-body">
                            <h6 class="card-title m-0">{{ file.name + '.' + file.format }}
                                <small class="text-body-secondary ms-1"> ({{ file.weight }}) </small>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ИЗОБРАЖЕНИЯ -->
            <div v-if="typeOfList === 'image'">
                <div v-for="(file, index) in filesImg">
                    <div class="card mb-2">
                        <small class="card-header">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-auto align-items-center">
                                    <p class="card-text m-0"> {{ file.author.name }}
                                        <small class="text-body-secondary ms-1"> {{ file.isUnlimited ? 'Бессрочно' : file.expires }} </small>
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-outline-secondary btn-sm me-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                    </button>
                                    <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                        Выбрать
                                    </button>
                                </div>
                            </div>
                        </small>
                        <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;" alt="" />
                        <div class="card-body">
                            <h6 class="card-title m-0">{{ file.name + '.' + file.format }}
                                <small class="text-body-secondary ms-1"> ({{ file.weight }}) </small>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ВИДЕО -->
            <div v-if="typeOfList === 'video'">
                <div v-for="(file, index) in filesClip">
                    <div class="card mb-2">
                        <small class="card-header">
                            <div class="row justify-content-between align-items-center">
                                <div class="col-auto align-items-center">
                                    <p class="card-text m-0"> {{ file.author.name }}
                                        <small class="text-body-secondary ms-1"> {{ file.expires }} </small>
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-outline-secondary btn-sm me-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
                                        </svg>
                                        <button type="button" class="btn btn-success btn-sm">
                                            Выбрать
                                        </button>
                                    </button>
                                </div>
                            </div>
                        </small>
                        <img src="https://i.ytimg.com/vi/MdTuact6xmY/maxresdefault.jpg" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;" alt="" />
                        <div class="card-body">
                            <h6 class="card-title m-0"> bmstu.jpg
                                <small class="text-body-secondary ms-1"> (954 kb) </small>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Details (WORKDAYS) -->
    <div class="modal fade" id="detailsWorkdaysModal" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Просмотр формы</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Вкладки -->
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <!-- Пары -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-lesson-tab" data-bs-toggle="pill" data-bs-target="#pills-lesson" type="button" role="tab" aria-selected="true">Пары</button>
                        </li>
                        <!-- Перерыв -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-break-tab" data-bs-toggle="pill" data-bs-target="#pills-break" type="button" role="tab" aria-selected="false">Перерыв</button>
                        </li>
                        <!-- Обед -->
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-dinner-tab" data-bs-toggle="pill" data-bs-target="#pills-dinner" type="button" role="tab" aria-selected="false">Обед</button>
                        </li>
                    </ul>
                    <!-- Содержимое вкладок -->
                    <div v-if="eventList.data" class="tab-content" id="pills-tabContent">
                        <!-- Пары -->
                        <div class="tab-pane fade show active" id="pills-lesson" role="tabpanel" tabindex="0">
                            <div v-if="eventList.data.lesson === '-'">
                                В последовательности на пары изменений нет.
                            </div>
                            <div v-if="eventList.data.lesson !== '-'">
                                <div v-for="(event, index) in eventList.data.lesson" class="row gx-2 gy-2 align-items-center p-1">
                                    <!-- ИМЯ СОБЫТИЯ -->
                                    <div v-if="!editFormS[index].isDeleted" class="col-12 col-sm-4 col-md-4 col-lg-3">
                                        <label class="visually-hidden" for="specificSizeInputName1">Name</label>
                                        <input v-model="event.name" type="text" class="form-control" id="specificSizeInputName1" placeholder="Имя" :disabled="editFormS[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОРМА - ТО ВСТАВЛЯЕМ ССЫЛКУ -->
                                    <div v-if="!editFormS[index].isDeleted && !editFormS[index].isDisabled && event.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername1">Username</label>
                                        <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername1" placeholder="Ссылка" :disabled="editFormS[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОТО/ВИДЕО - ТО ВЫБИРАЕМ ФАЙЛ -->
                                    <div v-if="!editFormS[index].isDeleted && !editFormS[index].isDisabled && event.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <div class="hstack gap-1">
                                            <input class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                                            <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                            <button class="btn btn-outline-success" type="button" @click="openCanvas(eventList.data.lesson, index, event.type)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                                </svg>
                                            </button>
                                            <div v-if="event.src.split('--')[1]" class="vr"></div>
                                            <button v-if="event.src.split('--')[1]" @click="clearFile(event)" type="button" class="btn btn-outline-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- КОГДА МЫ НЕ РЕДАКТИРУЕМ - КНОПКА ПРОСМОТРА -->
                                    <div v-if="!editFormS[index].isDeleted && editFormS[index].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
                                    </div>
                                    <!-- ВЫБОР ТИПА СОБЫТИЯ -->
                                    <div v-if="!editFormS[index].isDeleted" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                        <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="editFormS[index].isDisabled">
                                            <option value="image"> Изображение </option>
                                            <option value="webform"> WEB-форма </option>
                                            <option value="video"> Видео </option>
                                        </select>
                                    </div>
                                    <div v-if="!editFormS[index].isDeleted" class="col-12 col-sm-2 col-md-2 col-lg-1">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername2">Username</label>
                                        <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername2" placeholder="Время в сек" :disabled="editFormS[index].isDisabled">
                                    </div>
                                    <div v-if="!editFormS[index].isDeleted && !demoMode" class="col-auto">
                                        <button v-if="!editFormS[index].isDeleted && editFormS[index].isDisabled" @click="editEventCmp(index, editFormS)" class="btn btn-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                            <!-- Редактировать -->
                                        </button>
                                        <template v-if="!editFormS[index].isDisabled">
                                            <button @click="saveEventCmp(index, editFormS)" class="btn btn-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
                                                    <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2z" />
                                                    <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0zM13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13z" />
                                                </svg>
                                                <!-- Сохранить  -->
                                            </button>
                                            <button @click="delEventCmp(index, editFormS, eventList.data.lesson)" class="btn btn-outline-danger ms-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                                <!-- Удалить  -->
                                            </button>
                                        </template>
                                    </div>
                                    <div v-if="!editFormS[index].isDeleted && editFormS[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('up', index, eventList.data.lesson, editFormS)" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
                                    </div>
                                    <div v-if="!editFormS[index].isDeleted && editFormS[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('down', index, eventList.data.lesson, editFormS)" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
                                    </div>
                                </div>
                                <!--ФОРМА ДОБАВЛЕНИЯ!!!!!!!!!-->
                                <div v-if="!demoMode" class="row gx-2 gy-2 align-items-center p-1">
                                    <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                                        <label class="visually-hidden" for="specificSizeInputNameOfLol">Name</label>
                                        <input v-model="addForm.name" type="text" class="form-control" id="specificSizeInputNameOfLol" placeholder="Имя" required>
                                    </div>
                                    <!-- ССЫЛКА -->
                                    <div v-if="addForm.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeInputGroupUserDebi4">Username</label>
                                        <input v-model="addForm.src" type="text" class="form-control" id="specificSizeInputGroupUserDebi4" placeholder="Ссылка" required>
                                    </div>
                                    <!-- ФАЙЛ -->
                                    <div v-if="addForm.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <div class="hstack gap-1">
                                            <input id="InputFileLessonAddForm" class="form-control" type="text" :value="addForm.src.split('--')[1]" disabled>
                                            <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                            <button class="btn btn-outline-success" type="button" @click="openCanvas(addForm, -1, addForm.type, true)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                                </svg>
                                            </button>
                                            <div v-if="addForm.src.split('--')[1]" class="vr"></div>
                                            <button v-if="addForm.src.split('--')[1]" @click="clearFile(addForm)" type="button" class="btn btn-outline-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                        <select v-model="addForm.type" class="form-select" id="specificSizeSelect">
                                            <option value="image" selected> Изображение </option>
                                            <option value="webform"> WEB-форма </option>
                                            <option value="video"> Видео </option>
                                        </select>
                                    </div>
                                    <div class="col-12 col-sm-2 col-md-2 col-lg-1">
                                        <label class="visually-hidden" for="specificSizeInputGroupUserkek"> Username </label>
                                        <input v-model="addForm.time" type="number" class="form-control" id="specificSizeInputGroupUserkek" placeholder="Время в сек" required>
                                    </div>
                                    <div class="col-auto">
                                        <button @click="addEventCmp(editFormS, eventList.data.lesson, addForm)" type="submit" class="btn btn-success"> Добавить </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Перерыв -->
                        <div class="tab-pane fade show" id="pills-break" role="tabpanel" tabindex="0">
                            <div v-if="eventList.data.breaktime === 'lesson'">
                                На этот пункт установлен шаблон, аналогичный представленному во вкладке "Пары".
                            </div>
                            <div v-if="eventList.data.breaktime !== 'lesson'">
                                <div v-for="(event, index) in eventList.data.breaktime" class="row gx-2 gy-2 align-items-center p-1">
                                    <!-- ИМЯ СОБЫТИЯ -->
                                    <div v-if="!editFormB[index].isDeleted" class="col-12 col-sm-4 col-md-4 col-lg-3">
                                        <label class="visually-hidden" for="specificSizeInputName1">Name</label>
                                        <input v-model="event.name" type="text" class="form-control" id="specificSizeInputName1" placeholder="Имя" :disabled="editFormB[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОРМА - ТО ВСТАВЛЯЕМ ССЫЛКУ -->
                                    <div v-if="!editFormB[index].isDeleted && !editFormB[index].isDisabled && event.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername1">Username</label>
                                        <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername1" placeholder="Ссылка" :disabled="editFormB[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОТО/ВИДЕО - ТО ВЫБИРАЕМ ФАЙЛ -->
                                    <div v-if="!editFormB[index].isDeleted && !editFormB[index].isDisabled && event.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <div class="hstack gap-1">
                                            <input id="InputFileBreaktime" class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                                            <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                            <button class="btn btn-outline-success" type="button" @click="openCanvas(eventList.data.breaktime, index, event.type)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                                </svg>
                                            </button>
                                            <div v-if="event.src.split('--')[1]" class="vr"></div>
                                            <button v-if="event.src.split('--')[1]" @click="clearFile(event)" type="button" class="btn btn-outline-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- КОГДА МЫ НЕ РЕДАКТИРУЕМ - КНОПКА ПРОСМОТРА -->
                                    <div v-if="!editFormB[index].isDeleted && editFormB[index].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
                                    </div>
                                    <!-- ВЫБОР ТИПА СОБЫТИЯ -->
                                    <div v-if="!editFormB[index].isDeleted" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                        <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="editFormB[index].isDisabled">
                                            <option value="image"> Изображение </option>
                                            <option value="webform"> WEB-форма </option>
                                            <option value="video"> Видео </option>
                                        </select>
                                    </div>
                                    <div v-if="!editFormB[index].isDeleted" class="col-12 col-sm-2 col-md-2 col-lg-1">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername2">Username</label>
                                        <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername2" placeholder="Время в сек" :disabled="editFormB[index].isDisabled">
                                    </div>
                                    <div v-if="!editFormB[index].isDeleted && !demoMode" class="col-auto">
                                        <button v-if="!editFormB[index].isDeleted && editFormB[index].isDisabled" @click="editEventCmp(index, editFormB)" class="btn btn-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                            <!-- Редактировать -->
                                        </button>
                                        <template v-if="!editFormB[index].isDisabled">
                                            <button @click="saveEventCmp(index, editFormB)" class="btn btn-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
                                                    <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2z" />
                                                    <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0zM13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13z" />
                                                </svg>
                                                <!-- Сохранить  -->
                                            </button>
                                            <button @click="delEventCmp(index, editFormB, eventList.data.breaktime)" class="btn btn-outline-danger ms-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                                <!-- Удалить  -->
                                            </button>
                                        </template>
                                    </div>
                                    <div v-if="!editFormB[index].isDeleted && editFormB[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('up', index, eventList.data.breaktime, editFormB)" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
                                    </div>
                                    <div v-if="!editFormB[index].isDeleted && editFormB[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('down', index, eventList.data.breaktime, editFormB)" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
                                    </div>
                                </div>
                            </div>
                            <!--ФОРМА ДОБАВЛЕНИЯ!!!!!!!!!-->
                            <div v-if="eventList.data.breaktime !== 'lesson' && !demoMode" class="row gx-2 gy-2 align-items-center p-1">
                                <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                                    <label class="visually-hidden" for="specificSizeInputNameOfLol">Name</label>
                                    <input v-model="addForm.name" type="text" class="form-control" id="specificSizeInputNameOfLol" placeholder="Имя" required>
                                </div>
                                <!-- ССЫЛКА -->
                                <div v-if="addForm.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <label class="visually-hidden" for="specificSizeInputGroupUserDebi4">Username</label>
                                    <input v-model="addForm.src" type="text" class="form-control"
                                        id="specificSizeInputGroupUserDebi4" placeholder="Ссылка" required>
                                </div>
                                <!-- ФАЙЛ -->
                                <div v-if="addForm.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <div class="hstack gap-1">
                                        <input id="InputFileBreaktimeAddForm" class="form-control" type="text" :value="addForm.src.split('--')[1]" disabled>
                                        <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                        <button class="btn btn-outline-success" type="button" @click="openCanvas(addForm, -1, addForm.type, true)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                            </svg>
                                        </button>
                                        <div v-if="addForm.src.split('--')[1]" class="vr"></div>
                                        <button v-if="addForm.src.split('--')[1]" @click="clearFile(addForm)" type="button" class="btn btn-outline-danger">
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
                                    <label class="visually-hidden" for="specificSizeInputGroupUserkek">Username</label>
                                    <input v-model="addForm.time" type="number" class="form-control"
                                        id="specificSizeInputGroupUserkek" placeholder="Время в сек" required>
                                </div>
                                <div class="col-auto">
                                    <button @click="addEventCmp(editFormB, eventList.data.breaktime, addForm)" type="submit" class="btn btn-success">Добавить</button>
                                </div>
                            </div>
                        </div>
                        <!-- Обед -->
                        <div class="tab-pane fade show" id="pills-dinner" role="tabpanel" tabindex="0">
                            <div v-if="eventList.data.lunch === 'lesson'">
                                На этот пункт установлен шаблон, аналогичный представленному во вкладке "Пары".
                            </div>
                            <div v-if="eventList.data.lunch === 'breaktime'">
                                На этот пункт установлен шаблон, аналогичный представленному во вкладке "Перерыв".
                            </div>
                            <div v-if="eventList.data.lunch !== 'lesson' && eventList.data.lunch !== 'breaktime'">
                                <div v-for="(event, index) in eventList.data.lunch" class="row gx-2 gy-2 align-items-center p-1">
                                    <!-- ИМЯ СОБЫТИЯ -->
                                    <div v-if="!editFormL[index].isDeleted" class="col-12 col-sm-4 col-md-4 col-lg-3">
                                        <label class="visually-hidden" for="specificSizeInputName1">Name</label>
                                        <input v-model="event.name" type="text" class="form-control" id="specificSizeInputName1" placeholder="Имя" :disabled="editFormL[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОРМА - ТО ВСТАВЛЯЕМ ССЫЛКУ -->
                                    <div v-if="!editFormL[index].isDeleted && !editFormL[index].isDisabled && event.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername1">Username</label>
                                        <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername1" placeholder="Ссылка" :disabled="editFormL[index].isDisabled">
                                    </div>
                                    <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОТО/ВИДЕО - ТО ВЫБИРАЕМ ФАЙЛ -->
                                    <div v-if="!editFormL[index].isDeleted && !editFormL[index].isDisabled && event.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <div class="hstack gap-1">
                                            <input class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                                            <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                            <button class="btn btn-outline-success" type="button" @click="openCanvas(eventList.data.lunch, index, event.type)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                                </svg>
                                            </button>
                                            <div v-if="event.src.split('--')[1]" class="vr"></div>
                                            <button v-if="event.src.split('--')[1]" @click="clearFile(event)" type="button" class="btn btn-outline-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- КОГДА МЫ НЕ РЕДАКТИРУЕМ - КНОПКА ПРОСМОТРА -->
                                    <div v-if="!editFormL[index].isDeleted && editFormL[index].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
                                    </div>
                                    <!-- ВЫБОР ТИПА СОБЫТИЯ -->
                                    <div v-if="!editFormL[index].isDeleted" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                        <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                        <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="editFormL[index].isDisabled">
                                            <option value="image">Изображение</option>
                                            <option value="webform">WEB-форма</option>
                                            <option value="video">Видео</option>
                                        </select>
                                    </div>
                                    <div v-if="!editFormL[index].isDeleted" class="col-12 col-sm-2 col-md-2 col-lg-1">
                                        <label class="visually-hidden" for="specificSizeInputGroupUsername2">Username</label>
                                        <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername2" placeholder="Время в сек" :disabled="editFormL[index].isDisabled">
                                    </div>
                                    <div v-if="!editFormL[index].isDeleted && !demoMode" class="col-auto">
                                        <button v-if="!editFormL[index].isDeleted && editFormL[index].isDisabled" @click="editEventCmp(index, editFormL)" class="btn btn-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                            <!-- Редактировать -->
                                        </button>
                                        <template v-if="!editFormL[index].isDisabled">
                                            <button @click="saveEventCmp(index, editFormL)" class="btn btn-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
                                                    <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2z" />
                                                    <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0zM13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13z" />
                                                </svg>
                                                <!-- Сохранить  -->
                                            </button>
                                            <button @click="delEventCmp(index, editFormL, eventList.data.lunch)" class="btn btn-outline-danger ms-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                                <!-- Удалить  -->
                                            </button>
                                        </template>
                                    </div>
                                    <div v-if="!editFormL[index].isDeleted && editFormL[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('up', index, eventList.data.lunch, editFormL)" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
                                    </div>
                                    <div v-if="!editFormL[index].isDeleted && editFormL[index].isDisabled && !demoMode" class="col-auto">
                                        <button @click="moveEventCmp('down', index, eventList.data.lunch, editFormL)" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
                                    </div>
                                </div>
                            </div>
                            <!--ФОРМА ДОБАВЛЕНИЯ!!!!!!!!!-->
                            <div v-if="eventList.data.lunch !== 'lesson' && eventList.data.lunch !== 'breaktime' && !demoMode"
                                class="row gx-2 gy-2 align-items-center p-1">
                                <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                                    <label class="visually-hidden" for="specificSizeInputNameOfLol">Name</label>
                                    <input v-model="addForm.name" type="text" class="form-control"
                                        id="specificSizeInputNameOfLol" placeholder="Имя" required>
                                </div>
                                <!-- ССЫЛКА -->
                                <div v-if="addForm.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <label class="visually-hidden" for="specificSizeInputGroupUserDebi4">Username</label>
                                    <input v-model="addForm.src" type="text" class="form-control" id="specificSizeInputGroupUserDebi4" placeholder="Ссылка" required>
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
                                        <button v-if="addForm.src.split('--')[1]" @click="clearFile(addForm)" type="button" class="btn btn-outline-danger">
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
                                    <label class="visually-hidden" for="specificSizeInputGroupUserkek">Username</label>
                                    <input v-model="addForm.time" type="number" class="form-control" id="specificSizeInputGroupUserkek" placeholder="Время в сек" required>
                                </div>
                                <div class="col-auto">
                                    <button @click="addEventCmp(editFormL, eventList.data.lunch, addForm)" type="submit" class="btn btn-success">Добавить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!demoMode" class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">Сохранить</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Details (SPECIAL) -->
    <div class="modal fade" id="detailsSpecialModal" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel1">Просмотр формы</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <ul v-if="eventList.data !== undefined" class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li v-for="(tmp, index) in eventList.data" class="nav-item" role="presentation">
                            <button @click="currentModalPage = index" :class="'nav-link ' + (index === currentModalPage ? 'active' : '')" :id="'#id-' + tmp.id" data-bs-toggle="pill" :data-bs-target="'#pillsid-' + tmp.id" type="button" role="tab" :aria-selected="index === 0">{{ tmp.name }}</button>
                        </li>
                    </ul>
                    <div v-if="eventList.data !== undefined" class="tab-content" id="pills-tabContent">
                        <div v-for="(template, index) in eventList.data" :class="'tab-pane fade show ' + (index === currentModalPage ? 'active' : '')" :id="'#pillsid-' + template.id" role="tabpanel" :tabindex="index">
                            <div v-for="(event, dex) in eventList.data[index].events" class="row gx-2 gy-2 align-items-center p-1">
                                <!-- ИМЯ СОБЫТИЯ -->
                                <div v-if="!customForms[index][dex].isDeleted" class="col-12 col-sm-4 col-md-4 col-lg-3">
                                    <label class="visually-hidden" for="specificSizeInputName132">Name</label>
                                    <input v-model="event.name" type="text" class="form-control" id="specificSizeInputName132" placeholder="Имя" :disabled="customForms[index][dex].isDisabled">
                                </div>
                                <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОРМА - ТО ВСТАВЛЯЕМ ССЫЛКУ -->
                                <div v-if="!customForms[index][dex].isDeleted && !customForms[index][dex].isDisabled && event.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <label class="visually-hidden" for="specificSizeInputGroupUsername135">Username</label>
                                    <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername135" placeholder="Ссылка" :disabled="customForms[index][dex].isDisabled">
                                </div>
                                <!-- ПРИ РЕДАКТИРОВАНИИ ЕСЛИ ФОТО/ВИДЕО - ТО ВЫБИРАЕМ ФАЙЛ -->
                                <div v-if="!customForms[index][dex].isDeleted && !customForms[index][dex].isDisabled && event.type !== 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <div class="hstack gap-1">
                                        <input class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                                        <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                                        <button class="btn btn-outline-success" type="button" @click="openCanvas(eventList.data[index].events, dex, event.type)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                                                <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                                            </svg>
                                        </button>
                                        <div v-if="event.src.split('--')[1]" class="vr"></div>
                                        <button v-if="event.src.split('--')[1]" @click="clearFile(event)" type="button" class="btn btn-outline-danger">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <!-- КОГДА МЫ НЕ РЕДАКТИРУЕМ - КНОПКА ПРОСМОТРА -->
                                <div v-if="!customForms[index][dex].isDeleted && customForms[index][dex].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
                                </div>
                                <div v-if="!customForms[index][dex].isDeleted" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                                    <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="customForms[index][dex].isDisabled">
                                        <option value="image">Изображение</option>
                                        <option value="webform">WEB-форма</option>
                                        <option value="video">Видео</option>
                                    </select>
                                </div>
                                <div v-if="!customForms[index][dex].isDeleted" class="col-12 col-sm-2 col-md-2 col-lg-1">
                                    <label class="visually-hidden" for="specificSizeInputGroupUsername88005553535">Username</label>
                                    <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername88005553535" placeholder="Время в сек" :disabled="customForms[index][dex].isDisabled">
                                </div>
                                <div v-if="!customForms[index][dex].isDeleted && !demoMode" class="col-auto">
                                    <button v-if="!customForms[index][dex].isDeleted && customForms[index][dex].isDisabled" @click="editEventCmp(dex, customForms[index])" class="btn btn-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                        </svg>
                                        <!-- Редактировать -->
                                    </button>
                                    <template v-if="!customForms[index][dex].isDisabled">
                                        <button @click="saveEventCmp(dex, customForms[index])" class="btn btn-secondary">
                                            Сохранить </button>
                                        <button @click="delEventCmp(dex, customForms[index], eventList.data[index].events)" class="btn btn-outline-danger ms-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                            Удалить
                                        </button>
                                    </template>
                                </div>
                                <div v-if="!customForms[index][dex].isDeleted && customForms[index][dex].isDisabled && !demoMode" class="col-auto">
                                    <button @click="moveEventCmp('up', dex, eventList.data[index].events, customForms[index])" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
                                </div>
                                <div v-if="!customForms[index][dex].isDeleted && customForms[index][dex].isDisabled && !demoMode" class="col-auto">
                                    <button @click="moveEventCmp('down', dex, eventList.data[index].events, customForms[index])" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
                                </div>
                            </div>
                            <!-- ФОРМА ДОБАВЛЕНИЯ -->
                            <div v-if="!demoMode" class="row gx-2 gy-2 align-items-center p-1">
                                <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                                    <label class="visually-hidden" for="specificSizeInputNameOfAkatsuki">Name</label>
                                    <input v-model="addForm.name" type="text" class="form-control" id="specificSizeInputNameOfAkatsuki" placeholder="Имя" required>
                                </div>
                                <!-- ССЫЛКА -->
                                <div v-if="addForm.type === 'webform'" class="col-12 col-sm-3 col-md-3 col-lg-2">
                                    <label class="visually-hidden" for="specificSizeInputGroupUSA">Username</label>
                                    <input v-model="addForm.src" type="text" class="form-control" id="specificSizeInputGroupUSA" placeholder="Ссылка" required>
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
                                        <button v-if="addForm.src.split('--')[1]" @click="clearFile(addForm)" type="button" class="btn btn-outline-danger">
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
                                    <label class="visually-hidden" for="specificSizeInputGroupUserAss">Username</label>
                                    <input v-model="addForm.time" type="number" class="form-control" id="specificSizeInputGroupUserAss" placeholder="Время в сек" required>
                                </div>
                                <div class="col-auto">
                                    <button @click="addEventCmp(customForms[index], eventList.data[index].events, addForm)" type="submit" class="btn btn-success">Добавить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!demoMode" class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>