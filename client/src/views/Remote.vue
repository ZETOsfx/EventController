<template>
    <div class="intro">
        <!-- Тосты -->
		<toast :time="currentTime" :successCb="successMessage" :errorCb="errorMessage" :infoCb="infoMessage"></toast>

        <div class="container">
            <h6 class="text mt-4"> Пульт управления </h6>
            <div class="content">
                <div class="row">
                    <div class="col-sm-12 col-lg-6 mb-3">
                        <div class="card h-100">
                        <div class="card-header">
                            <h5 class="card-title m-0"> Кафедра Ка3 - Основной</h5>
                        </div>
                        <div v-if="!connected" class="card-body">
                            <div class="row align-items-center">
                                <div v-if="!err" class="spinner-border text-success col-auto ms-3 mt-1 mb-1" role="status"> </div>
                                <h5 v-if="!err" class="col-auto m-0">Подключение</h5>
                                <div v-if="err" class="spinner-grow text-warning col-auto ms-3 mt-1 mb-1" role="status"> </div>
                                <h5 v-if="err" class="col-auto m-0">Ошибка подключения</h5>
                            </div>
                        </div>
                        <div v-if="connected" class="card-body">
                            <div class="row w-100 align-items-center"> 
                            <div class="col-4">
                                <strong> Питание: </strong>
                            </div>
                            <div class="col-4">
                                {{ this.respActive }}
                            </div>
                            <div class="col-4">
                                <button @click="setActive" type="button" class="btn btn-outline-danger w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
                                    <path d="M7.5 1v7h1V1h-1z"/>
                                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                                    </svg>
                                    {{ this.active === 'Вкл.' ? 'Выключить' : 'Включить' }}
                                </button>
                            </div>
                            </div>
                            <div class="row w-100 align-items-center mt-2"> 
                            <div class="col-4">
                                <strong> Беззвучный: </strong>
                            </div>
                            <div class="col-4">
                                {{ this.respMute ? 'Без звука' : 'Со звуком' }}
                            </div>
                            <div class="col-4">
                                <input @click="setMute" v-model="mute" type="checkbox" class="btn-check" id="btn-muted" autocomplete="off" :disabled="this.respActive === 'Выкл.'">
                                <label class="btn btn-outline-warning w-100" for="btn-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
                                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                        {{ !this.respMute ? 'Без звука' : 'Со звуком' }}
                                </label>
                            </div>
                            </div>
                            <div class="row w-100 align-items-center mt-2"> 
                            <div class="col-4">
                                <strong> Вход: </strong>
                            </div>
                            <div class="col-4">
                                {{ this.portType[this.portIndex.indexOf(Number(this.respInputPort))] }}
                            </div>
                            <div class="col-4">
                                <select @change="setPort" v-model="inputPort" class="form-select form-select-sm" aria-label=".form-select-sm example" :disabled="this.respActive === 'Выкл.'">
                                    <!-- ПРОСТАВЛЕНО ПО ДОКУМЕНТАЦИИ -->
                                    <option value="1" selected>VGA</option>  
                                    <option value="2">RGB/HV</option>
                                    <option value="3">DVI</option>
                                    <option value="5">VIDEO1</option>
                                    <option value="7">S-VIDEO</option>
                                    <option value="15">DisplayPort</option>
                                    <option value="17">HDMI</option>
                                </select>
                            </div>
                            </div>
                            <div class="row w-100 align-items-center mt-2"> 
                            <div class="col-4">
                                <strong> Громкость: </strong>
                            </div>
                            <div class="col-4">
                                {{ respSound }}/100
                            </div>
                            <div class="col-4">
                                <label for="customRange2" class="form-label">Задать: {{ sound }}/100 </label>
                                <input @change="setVolume" v-model="sound" type="range" class="form-range" min="0" max="100" id="customRange2" :disabled="this.respActive === 'Выкл.'">
                            </div>
                            </div>
                            <div class="row w-100 align-items-center mt-2"> 
                            <div class="col-4">
                                <strong> Блокировки клавиш и
                                ИК: </strong>
                            </div>
                            <div class="col-4">
                                {{ this.respBlockButton ? 'Заблокировано' : 'Разблокировано' }}
                            </div>
                            <div class="col-4">
                                <button @click="setBlockButtons" type="checkbox" class="btn btn-outline-success w-100" :disabled="this.respActive === 'Выкл.'">
                                    {{ this.blockButton ? 'Выключить' : 'Включить' }}
                                </button>
                            </div>
                            </div>

                            <div class="row w-100 align-items-center mt-4"> 
                                <div class="col-6">
                                    <strong> Название модели:  </strong>
                                </div>
                                <div class="col-6">
                                    {{ respProductName }}
                                </div>
                            </div>
                            <div class="row w-100 align-items-center"> 
                                <div class="col-6">
                                    <strong> Серийный номер:  </strong>
                                </div>
                                <div class="col-6">
                                    {{ respSerialNumber }}
                                </div>
                            </div>
                            <div class="row w-100 align-items-center"> 
                                <div class="col-6">
                                    <strong> Состояния датчика температуры: </strong>
                                </div>
                                <div class="col-6">
                                    Работает
                                </div>
                            </div>
                            <div class="row w-100 align-items-center"> 
                                <div class="col-6">
                                    <strong> Температура: </strong>
                                </div>
                                <div class="col-6">
                                    {{ respTempSensor }}
                                </div>
                            </div>
                            <div class="row w-100 align-items-center"> 
                                <div class="col-6">
                                    <strong> Статус ошибки: </strong>
                                </div>
                                <div class="col-6">
                                    Вентилятор охлаждения -3 неисправность: 82h
                                </div>
                            </div>
                        </div>
                        <!-- <div class="card-footer text-end">
                            <div class="d-flex w-100 justify-content-end align-items-center">
                            <button type="button" class="btn btn-outline-success">
                                Применить настройки
                            </button>
                            </div>
                        </div> -->
                        </div>
                    <!-- КОНЕЦ: ПЛАШКА ДЛЯ 3х ШАБЛОНОВ -->
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import toast from '../components/toasts.vue';

export default {
    inject: ['getSocket', 'getSession'],
    components: {
        toast
    },
    data() {
        return {
            err: false,

            portIndex: [1, 2, 3, 5, 6, 7, 10, 12, 13, 14, 15, 17],
            portType: ['VGA', 'RGB/HV', 'DVI', 'VIDEO1', 'VIDEO2', 'S-VIDEO', 
                    'TV', 'DVD/HD1', 'OPTION', 'DVD/HD2', 'DisplayPort', 'HDMI'],

            connected: false,
            succCallback: [],     // Колбек - успешно
            errCallback: [],      // Колбек - ошибка 
            infoCallback: [],
            successMessage: null, // Текст успешной операции
            errorMessage: null,   // Текст ошибки
            infoMessage: null,
            currentTime: null,

            socket: {},
            session: {},
            
            active: 'Выкл.',
            sound:    0,      // sound level
            mute: false,      // muted
            blockButton: false,
            inputPort: 17,    // port connection from source

            respActive: 'Выкл.', 
            respSound: 0, 
            respMute: false, 
            respBlockButton: false,
            respInputPort: '',

            respProductName: '',
            respSerialNumber: '',
            respTempSensor: '',
        }
    },
    methods: {
            // update timer to send cb
        async getTime() {
            // Дата - время коллбека
            let date_ob = new Date();
            let hour = date_ob.getHours();
            if (hour < 10) hour = "0" + hour;
            let min = date_ob.getMinutes();
            if (min < 10) min = "0" + min;
            let sec = date_ob.getSeconds();
            if (sec < 10) sec = "0" + sec;
            this.currentTime = hour + ':' + min + ':' + sec;
        },
            // Запрос конкетного параметра состояния с сервера "ПЛАТА"
        getValue(room, oid) {
            if (typeof room !== 'string') 
                room = room.toString();

            console.log(`Get ${oid} from TV in ${room}`)
            this.socket.to(room).emit('getParam', { room, oid });
        },
            // Отправить команду на сервер "ПЛАТА"
        setValue(room, oid, value) {
            if (typeof room !== 'string') 
                room = room.toString();

            console.log(`Set ${oid} = ${value} TV in ${room}`)
            this.socket.emit('setParam', { room, oid, value });
        },
            // Получить все параметры состояния сразу
        getTelemetry(room) {
            if (typeof room !== 'string') 
                room = room.toString();
            console.log(`Get telemetry from TV in ${room}`)
            this.socket.emit('getTelemetry', { room });
        },
            // Получение корневого сокета и поддержка параметров сессии
        connect() {
            this.session = this.getSession();
            this.socket = this.getSocket();

                // Получение ответа от сервера "ПЛАТА"
            this.socket.on('remote:update', (data) => {
                var enc = new TextDecoder("utf-8");
                    // Определение параметра-источника ответа
                switch(data.type) {
                    case 'telemetry': 
                        this.respActive = data.value.pdmPowerRequestedState === 7 ? 'Выкл.' : (data.value.pdmPowerRequestedState === 8) ? 'Ожид.' : 'Вкл.';
                        this.active = this.respActive;

                        this.respSound = Number(data.value.pdmAudioVolume);
                        this.sound = this.respSound;

                        this.respProductName  = enc.decode(data.value.pdmGeneralProductName);
                        this.respSerialNumber = enc.decode(data.value.pdmGeneralSerialNumber);
                        this.respTempSensor   = Number(data.value.pdmTempSensorTemp) / 10;

                        this.respMute = data.value.pdmAudioMute === 2 ? false : true;
                        this.mute = this.respMute;

                        this.respBlockButton = data.value.pdmButtonEnabled === 1 ? false : true;
                        this.blockButton = this.respBlockButton;

                        this.respInputPort = data.value.pdmDisplaySetInputSource;
                        this.inputPort = this.respInputPort;
                        
                        this.connected = true;
                        break;
                    case 'pdmAudioMute':
                        if (data.value && this.mute) {
                            // Замучен
                            this.respMute = true;
                        } else { 
                            // Размучен
                            this.respMute = false;
                        }
                        break;
                    case 'pdmPowerRequestedState':
                        if (data.value === 7) {
                            // Выключен 
                            this.respActive = 'Выкл.';
                        } else if (data.value === 8) {
                            // Включен
                            this.respActive = 'Ожид.';
                        } else {
                            this.respActive = 'Вкл.';
                        }
                        break;
                    case 'pdmDisplaySetInputSource':
                        this.respInputPort = data.value.toString();
                        this.inputPort = data.value.toString();
                        break;
                    case 'pdmAudioVolume':
                        this.respSound = data.value;
                        this.sound = this.respSound;
                        break;
                    case 'pdmButtonEnabled':
                        if (data.value === 1) {
                            // Разблокирован (1)
                            this.respBlockButton = false;
                        } else {
                            // Заблокирован (2)
                            this.respBlockButton = true;
                        }
                        break;
                    default:
                        this.err = true;
                }
            }); 

            this.getTelemetry(446);
        },

            // Замутить / Размутить звук
        setMute() {
            if (this.mute) 
                this.setValue(446, 'pdmAudioMute', 2);
            else 
                this.setValue(446, 'pdmAudioMute', 1);

            this.mute = !this.mute;
            // Блок формы до получения ответа
        },

            // Включить / Выключить монитор
        setActive() {
            if (this.respActive === 'Вкл.') {
                this.setValue(446, 'pdmPowerRequestedState', 7);
                this.active = 'Выкл.';
            } else {
                this.setValue(446, 'pdmPowerRequestedState', 11);
                this.active = 'Вкл.';
            }
            // Блок формы до получения ответа
        },

            // Смена порта подключения источника
        setPort() {
            this.$nextTick(() => {
                this.setValue(446, 'pdmDisplaySetInputSource', Number(this.inputPort));
                // Блок формы до получения ответа
            });
        },
            // Задать громкость
        setVolume() {
            this.setValue(446, 'pdmAudioVolume', Number(this.sound));
            this.mute = false;
            this.respMute = false;
        },
            // Включить / Выключить блокировку кнопок и ИК
        setBlockButtons() {
            if (this.blockButton)
                this.setValue(446, 'pdmButtonEnabled', 1);
            else
                this.setValue(446, 'pdmButtonEnabled', 2);

            this.blockButton = !this.blockButton;
        },

            // Упрощенный вариант отправки коротких сообщений (toasts)
        sayToUser(type, message) {
            this.getTime();
            switch (type) {
                case 'success':
                    this.successMessage = message;
                    this.succCallback.show();
                    break;
                case 'error':
                default:
                    this.errorMessage = message;
                    this.errCallback.show();
            }
        }
    },
    mounted() {
        this.succCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
        this.errCallback = new bootstrap.Toast(document.getElementById("ToastError"));

        this.connect();
    }
}
</script>