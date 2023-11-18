<script>
export default {
    inject: ['session', 'socket', 'toast', 'options', 'browserName', 'browserVersion', 'osName', 'osVersion', 'browserEngineName'],
    data() {
        return {
            short: '',
            description: '',
        };
    },
    methods: {
        connect() {
            // this.socket.on('note:new', (data) => {
            //     this.session.noread++;
            // });
        },
        async sendReport() {
            if (this.short === '' || this.description === '') {
                this.toast('error', 'Необходимо заполнить все поля для сообщения об ошибке');
                return;
            }

            let response = await fetch(
                '/report',
                this.options('POST', {
                    short: this.short,
                    description: this.description,
                    browserData: this.browserName() + ' ' + this.browserVersion() + ' (' + this.browserEngineName() + ')',
                    osData: this.osName() + ' ' + this.osVersion(),
                })
            );
            response = await response.json();

            if (response.status !== 'success') {
                this.toast('error', response.data);
                return;
            }

            this.toast('success', response.data);
            this.short = '';
            this.description = '';
        },
    },
    mounted() {
        this.connect();
    },
};
</script>

<template>
    <div class="intro">
        <!-- Modal Report Confirm -->
        <div class="modal fade" id="ReportSend" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подверждение отправки репорта</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <strong>Внимание!</strong> <br />
                        Отправляя данное сообщение об ошибке, вы соглашаетесь предоставить нам следующие данные: <br />
                        <p class="mb-0 ms-4">1. Используемый вами браузер, его версия и движок</p>
                        <p class="mb-0 ms-4">2. Используемая вами ОС и ее версия</p>
                        <br />
                        Перечисленная выше информация будет автоматически отправлена вместе с вашими комментариями.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" @click="sendReport()" data-bs-dismiss="modal" class="btn btn-success">Отправить баг-репорт</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <h6 class="text mt-4">Обратная связь</h6>
            <div class="content">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="row">
                            <div class="col-12">
                                <input type="text" @keyup.enter="send" v-model="this.short" class="form-control" placeholder="Краткое описание" />
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-12">
                                <textarea class="form-control" @keyup.enter="send" v-model="this.description" placeholder="Подробное изложение ваших действий" id="ReportTextarea" style="height: 150px"></textarea>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-12">
                                <button type="button" class="btn btn-success mb-0 w-100" data-bs-toggle="modal" data-bs-target="#ReportSend">Сообщить о проблеме</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mt-2">
                        "В случае обнаружения какой-либо ошибки в работе системы постарайтесь как можно точнее описать действия для ее воспроизведения. <br />
                        Это поможет нам гораздо быстрее устранить неполадки." <br />
                        <br />
                        <i>
                            C уважением, <br />
                            Команда EventController
                        </i>
                        <p></p>
                        <strong>Ваш браузер</strong>: {{ this.browserName() }} {{ this.browserVersion() }} ({{ this.browserEngineName() }})<br />
                        <strong>Ваша ОС</strong>: {{ this.osName() }} {{ this.osVersion() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
