<template>
    <div class="intro">
        <detailModals :eventList="eventList" :editFormS="editFormS" :editFormB="editFormB" :editFormL="editFormL"
            :addForm="addForm" :addEventCmp="addEvent" :saveEventCmp="saveEvent" :delEventCmp="delEvent"
            :moveEventCmp="moveEvent" :templateSave="templateSave" :currentModalPage="currentModalPage"
            :customForms="customForms" :editEventCmp="editEvent"> </detailModals>

        <!-- Modal for Deny -->
        <div class="modal fade" id="denyModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь отклонить "{{ this.forModal.name }}". Вы уверены?
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label"><br> Комментарий бригаде:</label>
                            <textarea v-model="this.forModal.comment" @keyup.enter="buttonReject(this.forModal)"
                                class="form-control" id="message-text"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="buttonReject(this.forModal)" type="button" class="btn btn-danger">Отклонить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Confirm-Active -->
        <div class="modal fade" id="confirmActiveModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalToggleLabel">
                            Выберите действие
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <strong> На мониторе "ИМЯ_МОНИТОРА" уже установлена композиция "ИМЯ_КОМПОЗИЦИИ"</strong>
                        <p></p>
                        Вы собираетесь произвести замену текущей композиции на "ИМЯ".
                        <p></p>
                        Старую композицию стоит:

                        <div class="w-100">
                            <input @click="oldActiveAction = 'return'" type="radio" class="btn-check" name="options"
                                id="queue" autocomplete="off" checked>
                            <label class="mt-1 btn" for="queue">Вернуть редактору</label>
                            <input @click="oldActiveAction = 'queue'" type="radio" class="btn-check" name="options"
                                id="editor" autocomplete="off">
                            <label class="mt-1 btn" for="editor">Вернуть в очередь</label>
                            <input @click="oldActiveAction = 'delete'" type="radio" class="btn-check" name="options"
                                id="delete" autocomplete="off">
                            <label class="mt-1 btn" for="delete">Удалить</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="w-100">
                            <textarea v-if="oldActiveAction === 'return'"
                                class="form-control"> Возвращаю композицию с трансляции.</textarea>
                            <input v-if="oldActiveAction === 'queue'" name="time" value="" id="addDate"
                                class="col form-control mt-1" type="date" />
                            <div v-if="oldActiveAction === 'delete'" style="color:red">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                    </path>
                                </svg>
                                Данное действие отменить будет нельзя
                            </div>
                            <button @click="setActive(this.forModal, oldActiveAction, oldActiveData)"
                                class="w-100 mt-1 btn btn-success">Выполнить</button>
                        </div>
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
                        Вы собираетесь утвердить данное расписание. <br> Вы уверены?
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label"><br> Комментарий бригаде:</label>
                            <textarea @keyup.enter="buttonApprove(this.forModal)" v-model="this.forModal.comment"
                                class="form-control" id="message-text"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="buttonApprove(this.forModal)" type="button"
                            class="btn btn-success">Утвердить</button>
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
                        Вы собираетесь удалить шаблон "{{ this.forModal.name }}" из очереди. Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="deleteFromApproved(this.forModal)" type="button"
                            class="btn btn-danger">Удалить</button>
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
                    <div v-if="!this.forModal.obj.isActive" class="modal-body">
                        Вы собираетесь сохранить изменения в шаблоне "{{ this.forModal.name }}". Вы уверены?
                    </div>
                    <div v-if="this.forModal.obj.isActive" class="modal-body">
                        Вы собираетесь внести изменения на активную трансляцию. Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="saveChangesButton(this.forModal)" type="button"
                            class="btn btn-success">Уверен</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Set Active -->
        <div class="modal fade" id="activeModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь установить шаблон "{{ this.forModal.name }}" на трансляцию. <strong>Текущий активный
                            шаблон будет удалён из системы</strong>. <br><br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click="setActive(this.forModal)" type="button" class="btn btn-success">Уверен</button>
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
                            <h4 class="modal-title fs-5"><strong>{{ this.composeDetailsModal.templateName }}</strong> ({{
                                this.composeDetailsModal.authorName }}) </h4>
                        </div>
                        <div class="col-auto m-0">
                            <h5 class="m-0"> <strong> {{ this.composeDetailsModal.numberOfCurrentEvent }}/{{
                                this.composeDetailsModal.numberOfEvents }} </strong> </h5>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1] !== undefined"
                        class="modal-body">
                        <img v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 0"
                            :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src"
                            style="object-fit: contain; width: 100%; height: 100%;" alt="">
                        <iframe
                            v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 1"
                            :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src"
                            style="object-fit: contain; width: 100%; height: 100%;" alt=""></iframe>
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
                                {{ this.prevarrow }}
                            </button>
                        </div>
                        <div class="col-auto">
                            <input type="checkbox" class="btn-check" id="autoplay-check" autocomplete="off">
                            <label class="btn btn-outline-warning w-100" for="autoplay-check">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-play-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z">
                                    </path>
                                </svg>
                                Автопроигрывание
                            </label>
                        </div>
                        <div class="col-auto">
                            <button @click="switchPage('next')" type="button"
                                class="btn btn-outline-success col-auto w-100">
                                {{ this.nextarrow }}
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
                                <option v-for="(event, index) in this.composeDetailsModal.previewEvents" :value="index + 1">
                                    {{ index + 1 }}. {{ event.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h6 class="text mt-4"> Управление отображением </h6>
            <!-- Подстилка - content -->
            <div class="content">
                <!-- ЗАГОЛОВКИ ВКЛАДОК -->
                <div class="d-flex justify-content-between g-1">
                    <ul class="nav nav-pills" id="pills-tab1" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="pills-request-tab" data-bs-toggle="pill"
                                data-bs-target="#pills-request" type="button" role="tab" aria-selected="true">Запросы на
                                модерирование</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-display-tab" data-bs-toggle="pill"
                                data-bs-target="#pills-display" type="button" role="tab" aria-selected="false">Активное
                                отображение</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pills-queue-tab" data-bs-toggle="pill"
                                data-bs-target="#pills-queue" type="button" role="tab" aria-selected="false">Очередь
                                отображения</button>
                        </li>
                        <!-- КОНЕЦ: Вкладки -->
                    </ul>
                    <button @click="endAllProcesses()" type="button" class="btn btn-outline-danger">Завершить все
                        обработки</button>
                </div>
            </div>
            <div class="content">
                <!-- Содержимое вкладок -->
                <div class="tab-content" id="pills-tabContent1">

                    <!-- ВХОДЯЩИЕ ЗАРОСЫ НА МОДЕРАЦИЮ -->
                    <div class="tab-pane fade show active" id="pills-request" role="tabpanel"
                        aria-labelledby="pills-request-tab" tabindex="0">
                        <div v-if="this.reqList.length === 0"> Необработанных запросов нет </div>
                        <ul v-if="this.reqList.length > 0" class="list-group moder">
                            <li v-for="(req, index) in this.reqList" class="list-group-item">

                                <!-- ШАБЛОН -->
                                <!-- ЗАГОЛОВОК, АВТОР, КОММЕНТАРИЙ -->
                                <div class="me-auto">
                                    <div class="fw align-items-center">
                                        <strong> {{ req.name }} </strong> <small>(отправлено: <i>{{ req.author
                                        }}</i>)</small>
                                    </div>
                                    <small class="fw align-items-center"> {{ req.comment }} </small>
                                </div>
                                <!-- ДАТА, ЭКРАН -->
                                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                                    <select class="form-select" aria-label="Default select example"
                                        :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                        <option selected>Кафедра К3 - основной</option>
                                        <!-- <option value="1">Кафедра К3 - новости</option> -->
                                    </select>
                                    <input v-model="req.date" id="startDate1" class="form-control" type="date"
                                        :value="req.date"
                                        :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)" />
                                </div>

                                <!-- ТЕЛО ШАБЛОНА ДЛЯ СТАНДАРТНОГО ТИПА -->
                                <!-- 1. ПАРЫ -->
                                <div v-if="!req.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="req.lesson"
                                                @change="this.eventList = []; req.lesson_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                                <option selected :value="req.lesson"> {{ req.lesson }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.lesson_change !== true"
                                                @click="openPreview('req', req.id, { name: req.lesson }, req.isspecial, 'lesson')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.lesson_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>
                                <!-- 2. ПЕРЕРЫВ -->
                                <div v-if="!req.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Перерыв: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="req.breaktime"
                                                @change="this.eventList = []; req.breaktime_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                                <option selected :value="req.breaktime"> {{ req.breaktime }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.breaktime_change !== true"
                                                @click="openPreview('req', req.id, { name: req.breaktime }, req.isspecial, 'breaktime')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.breaktime_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>
                                <!-- 3. ОБЕД -->
                                <div v-if="!req.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Обед: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="req.lunch"
                                                @change="this.eventList = []; req.lunch_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                                <option selected :value="req.lunch"> {{ req.lunch }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.lunch_change !== true"
                                                @click="openPreview('req', req.id, { name: req.lunch }, req.isspecial, 'lunch')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && req.lunch_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>

                                <!-- ТЕЛО ШАБЛОНА ОСОБОГО ТИПА -->
                                <div v-if="req.isspecial" v-for="(tmp, dex) in req.eventList"
                                    class="d-flex w-100 justify-content-between gap-1 mt-1">
                                    <input v-model="req.eventList[dex].time_to_swap" type="time"
                                        class="form-control form-select-sm"
                                        :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                    <select v-model="req.eventList[dex].name"
                                        @change="req.eventList[dex].has_change = true;" class="form-select form-select-sm"
                                        aria-label="Default select example"
                                        :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)">
                                        <option :value="req.eventList[dex].name" selected> {{ req.eventList[dex].name }}
                                        </option>
                                        <option v-for="tmp in templatesToReplace" :value="tmp.name"> {{ tmp.name }} ( by: {{
                                            tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                                    </select>
                                    <!-- УДАЛИТЬ -->
                                    <button
                                        v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)"
                                        @click="req.eventList.splice(dex, 1)" type="button"
                                        class="btn btn-outline-danger btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path
                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z">
                                            </path>
                                        </svg>
                                    </button>
                                    <!-- ПРЕДПРОСМОТР -->
                                    <button
                                        v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && tmp.has_change !== true"
                                        type="button"
                                        @click="openPreview('req', req.id, tmp, req.isspecial, req.eventList[dex].time_to_swap)"
                                        data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path
                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                    <!-- МИНУС ГЛАЗ -->
                                    <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name) && tmp.has_change === true"
                                        tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                        class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                        data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-eye-slash" viewBox="0 0 16 16">
                                            <path
                                                d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                            </path>
                                            <path
                                                d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                            </path>
                                            <path
                                                d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                <button
                                    v-if="req.isspecial && !(!this.reqList[index].isStartedProcess || req.whoAccept !== this.session().name)"
                                    @click="addField(req.eventList)" type="button"
                                    class="btn btn-outline-success btn-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z">
                                        </path>
                                    </svg>
                                    Добавить
                                </button>

                                <div class="row w-100 align-items-center g-1 mt-2">
                                    <div class="col-12 col-sm-6 col-md mb-1 form-check form-switch">
                                        <input v-model="req.isspecial" @click="templateSave()" class="form-check-input"
                                            type="checkbox" role="switch" id="flexSwitchCheckDefault26"
                                            :disabled="!(req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.session().name))" />
                                        <label class="form-check-label" for="flexSwitchCheckDefault26"> Особое расписание
                                        </label>
                                    </div>

                                    <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                                    <div v-if="!req.isStartedProcess" class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                                        <button @click="startProcessing(req, 'req')"
                                            class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path
                                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fill-rule="evenodd"
                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                            Обработать
                                        </button>
                                    </div>

                                    <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="endProcessing(req, 'req')" type="button"
                                            class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                                <path
                                                    d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            Отмена
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Details modal -->
                                        <button v-if="req.isspecial" @click="openDetails(req, req.eventList)" type="button"
                                            class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <button v-if="!req.isspecial"
                                            @click="openDetails(req, [req.lesson, req.breaktime, req.lunch])" type="button"
                                            class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Deny modal -->
                                        <button @click="triggerModal('deny', req, index)" type="button"
                                            class="btn btn-outline-danger w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                                <path
                                                    d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
                                            </svg>
                                            Отклонить
                                        </button>
                                    </div>
                                    <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <!-- Button trigger Confirm modal -->
                                        <button @click="triggerModal('confirm', req, index)" type="button"
                                            class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                            </svg>
                                            Утвердить
                                        </button>
                                    </div>

                                    <div v-if="req.isStartedProcess && req.whoAccept !== this.session().name"
                                        class="col text-end">
                                        Событие находится в обработке у: <i> "{{ req.whoAccept }}" </i>
                                    </div>
                                </div>
                                <!-- КОНЕЦ: Шаблон -->
                            </li>
                        </ul>
                        <!-- КОНЕЦ: Входящие запросы на модерацю -->
                    </div>

                    <!-- АКТИВНОЕ ОТОБРАЖЕНИЕ (ЧТО ИГРАЕТ СЕГОДНЯ) -->
                    <div class="tab-pane fade" id="pills-display" role="tabpanel" aria-labelledby="pills-display-tab"
                        tabindex="0">
                        <div v-if="this.activeTmp.length === 0"> Нет активной программы трансляции </div>
                        <div v-if="this.activeTmp.length > 0" v-for="(screen, index) in this.activeTmp" class="row g-3">
                            <!-- ПЛАШКА -->
                            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-3 mb-sm-0 g-3">
                                <div class="card h-100">

                                    <!-- ЭКРАН -->
                                    <div class="card-header">
                                        <h5 class="card-title m-0">Кафедра К3 - основной</h5>
                                    </div>

                                    <div class="card-body">
                                        <!-- ЛАБЕЛ СУТАНДАРДЭ -->
                                        <div v-if="!screen.isspecial" class="progress" role="progressbar" aria-valuemin="0"
                                            aria-valuemax="100">
                                            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated"
                                                id="progress_workdays"> </div>
                                        </div>
                                        <div v-if="!screen.isspecial"
                                            class="d-flex w-100 justify-content-between align-items-center">
                                            <div id="time_workdays"></div>
                                            <div id="nameInfo_workdays"></div>
                                        </div>
                                        <!-- ЛАБЭЛ СУПЭШШИАЛ -->
                                        <div v-if="screen.isspecial" class="progress" role="progressbar" aria-valuemin="0"
                                            aria-valuemax="100">
                                            <div class="progress-bar progress-bar-striped bg-success progress-bar-animated"
                                                id="progress_specdays"> </div>
                                        </div>
                                        <div v-if="screen.isspecial"
                                            class="d-flex w-100 justify-content-between align-items-center">
                                            <div id="time_specdays"></div>
                                            <div id="nameInfo_specdays"></div>
                                        </div>

                                        <ul class="list-group display mt-1">
                                            <!-- Шаблон -->
                                            <li class="list-group-item">
                                                <!-- СУТАНДАРДЭ ТЭМУПУЛИТЭ -->
                                                <!-- 1. ПАРЫ -->
                                                <div v-if="!screen.isspecial"
                                                    class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0"> Пары: </div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">

                                                            <select v-model="screen.lesson"
                                                                @change="this.eventList = []; screen.lesson_change = true;"
                                                                class="form-select form-select-sm me-1"
                                                                :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)">
                                                                <option selected :value="screen.lesson"> {{ screen.lesson }}
                                                                </option>
                                                                <option v-for="tmp in this.templatesToReplace"
                                                                    :value="tmp.name"> {{ tmp.name }} ( by: {{ tmp.author }}
                                                                    ) - upd: {{ tmp.last_modify }} </option>
                                                            </select>

                                                            <button
                                                                v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.lesson_change !== true"
                                                                @click="openPreview('act', screen.id, { name: screen.lesson }, screen.isspecial, 'lesson')"
                                                                type="button" data-bs-toggle="modal"
                                                                data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-fill"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path
                                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>

                                                            <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.lesson_change === true"
                                                                tabindex="0" role="button" data-bs-toggle="popover"
                                                                data-bs-trigger="focus" class="btn btn-outline-info btn-sm"
                                                                data-bs-title="ВНИМАНИЕ!"
                                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-slash"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                                    </path>
                                                                    <path
                                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                                    </path>
                                                                    <path
                                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                                    </path>
                                                                </svg>
                                                            </a>

                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 2. ПЕРЕРЫВ -->
                                                <div v-if="!screen.isspecial"
                                                    class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0"> Перерыв: </div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">

                                                            <select v-model="screen.breaktime"
                                                                @change="this.eventList = []; screen.breaktime_change = true;"
                                                                class="form-select form-select-sm me-1"
                                                                :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)">
                                                                <option selected :value="screen.breaktime"> {{
                                                                    screen.breaktime }} </option>
                                                                <option v-for="tmp in this.templatesToReplace"
                                                                    :value="tmp.name"> {{ tmp.name }} ( by: {{ tmp.author }}
                                                                    ) - upd: {{ tmp.last_modify }} </option>
                                                            </select>

                                                            <button
                                                                v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.breaktime_change !== true"
                                                                @click="openPreview('act', screen.id, { name: screen.breaktime }, screen.isspecial, 'breaktime')"
                                                                type="button" data-bs-toggle="modal"
                                                                data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-fill"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path
                                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>

                                                            <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.breaktime_change === true"
                                                                tabindex="0" role="button" data-bs-toggle="popover"
                                                                data-bs-trigger="focus" class="btn btn-outline-info btn-sm"
                                                                data-bs-title="ВНИМАНИЕ!"
                                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-slash"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                                    </path>
                                                                    <path
                                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                                    </path>
                                                                    <path
                                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                                    </path>
                                                                </svg>
                                                            </a>

                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- 3. ОБЕД -->
                                                <div v-if="!screen.isspecial"
                                                    class="row w-100 align-items-center mt-1 ms-0 me-0">
                                                    <div class="col-12 col-sm-5 col-md-4 p-0"> Обед: </div>
                                                    <div class="col-12 col-sm-7 col-md-8 p-0">
                                                        <div class="d-flex w-100">

                                                            <select v-model="screen.lunch"
                                                                @change="this.eventList = []; screen.lunch_change = true;"
                                                                class="form-select form-select-sm me-1"
                                                                :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)">
                                                                <option selected :value="screen.lunch"> {{ screen.lunch }}
                                                                </option>
                                                                <option v-for="tmp in this.templatesToReplace"
                                                                    :value="tmp.name"> {{ tmp.name }} ( by: {{ tmp.author }}
                                                                    ) - upd: {{ tmp.last_modify }} </option>
                                                            </select>

                                                            <button
                                                                v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.lunch_change !== true"
                                                                @click="openPreview('act', screen.id, { name: screen.lunch }, screen.isspecial, 'lunch')"
                                                                type="button" data-bs-toggle="modal"
                                                                data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-fill"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path
                                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </button>

                                                            <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && screen.lunch_change === true"
                                                                tabindex="0" role="button" data-bs-toggle="popover"
                                                                data-bs-trigger="focus" class="btn btn-outline-info btn-sm"
                                                                data-bs-title="ВНИМАНИЕ!"
                                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                                                    height="16" fill="currentColor" class="bi bi-eye-slash"
                                                                    viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                                    </path>
                                                                    <path
                                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                                    </path>
                                                                    <path
                                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                                    </path>
                                                                </svg>
                                                            </a>

                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- СУПЭШШИАЛ ТЭМУПУЛИТЭ -->
                                                <div v-if="screen.isspecial" v-for="(tmp, dex) in screen.eventList"
                                                    class="d-flex w-100 justify-content-between gap-1 mt-1">
                                                    <input v-model="screen.eventList[dex].time_to_swap" type="time"
                                                        class="form-control form-select-sm"
                                                        :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)">
                                                    <select v-model="screen.eventList[dex].name"
                                                        @change="screen.eventList[dex].has_change = true;"
                                                        class="form-select form-select-sm"
                                                        aria-label="Default select example"
                                                        :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)">
                                                        <option :value="screen.eventList[dex].name" selected> {{
                                                            screen.eventList[dex].name }} </option>
                                                        <option v-for="tmp in templatesToReplace" :value="tmp.name"> {{
                                                            tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify
    }} </option>
                                                    </select>
                                                    <!-- УДАЛИТЬ -->
                                                    <button
                                                        v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)"
                                                        @click="screen.eventList.splice(dex, 1)" type="button"
                                                        class="btn btn-outline-danger btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path
                                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z">
                                                            </path>
                                                        </svg>
                                                    </button>
                                                    <!-- ПРЕДПРОСМОТР -->
                                                    <button
                                                        v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && tmp.has_change !== true"
                                                        type="button"
                                                        @click="openPreview('act', screen.id, tmp, screen.isspecial, screen.eventList[dex].time_to_swap)"
                                                        data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                        class="btn btn-info btn-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                            <path
                                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                        </svg>
                                                    </button>
                                                    <!-- МИНУС ГЛАЗ -->
                                                    <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name) && tmp.has_change === true"
                                                        tabindex="0" role="button" data-bs-toggle="popover"
                                                        data-bs-trigger="focus" class="btn btn-outline-info btn-sm"
                                                        data-bs-title="ВНИМАНИЕ!"
                                                        data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                            <path
                                                                d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                            </path>
                                                            <path
                                                                d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                            </path>
                                                            <path
                                                                d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                            </path>
                                                        </svg>
                                                    </a>
                                                </div>
                                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                                <button
                                                    v-if="screen.isspecial && !(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.session().name)"
                                                    @click="addField(screen.eventList)" type="button"
                                                    class="btn btn-outline-success btn-sm mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd"
                                                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z">
                                                        </path>
                                                    </svg>
                                                    Добавить
                                                </button>

                                                <div
                                                    class="d-flex w-100 justify-content-between align-items-center gap-1 mt-2">
                                                    <div class="form-check form-switch">
                                                        <input v-model="screen.isspecial" @click="templateSave()"
                                                            class="form-check-input" type="checkbox" role="switch"
                                                            id="flexSwitchCheckDefault1" :disabled="true" />
                                                        <label class="form-check-label" for="flexSwitchCheckDefault1">
                                                            Особое расписание </label>
                                                    </div>
                                                </div>
                                                <!-- КОНЕЦ: Шаблон -->
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="card-footer text-end">
                                        <button v-if="!screen.isStartedProcess" @click="startProcessing(screen, 'act')"
                                            type="button" class="btn btn-outline-success mb-1">Редактировать</button>
                                        <!-- Button trigger Delete follow modal -->
                                        <!-- <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteFollowModal"> Не отслеживать</button> -->
                                        <div v-if="screen.isStartedProcess && (this.userProcess === screen.name || screen.whoAccept === this.session().name)"
                                            class="row justify-content-end me-1">
                                            <button @click="endProcessing(screen, 'act')" type="button"
                                                class="btn btn-outline-secondary col-auto me-1 mb-1"> Отмена </button>
                                            <!-- Button trigger Details modal -->
                                            <button v-if="screen.isspecial" @click="openDetails(screen, screen.eventList)"
                                                type="button"
                                                class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button>
                                            <button v-if="!screen.isspecial"
                                                @click="openDetails(screen, [screen.lesson, screen.breaktime, screen.lunch])"
                                                type="button"
                                                class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button>
                                            <!-- Button trigger Confirm modal -->
                                            <button @click="triggerModal('save', screen, index)" type="button"
                                                class="btn btn-success col-auto me-1 mb-1"> Сохранить </button>
                                        </div>
                                        <div v-if="screen.isStartedProcess && screen.whoAccept !== this.session().name">
                                            Ведется обработка: <i> "{{ screen.whoAccept }}" </i>
                                        </div>
                                    </div>
                                </div>
                                <!-- КОНЕЦ: ПЛАШКА -->
                            </div>
                            <!-- КОНЕЦ ЦИКЛА ЭКРАНОВ -->
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
                    <div class="tab-pane fade" id="pills-queue" role="tabpanel" aria-labelledby="pills-queue-tab"
                        tabindex="0">
                        <div v-if="this.acceptedList.length === 0"> Очередь на трансляцию пуста </div>
                        <ul v-if="this.acceptedList.length > 0" class="list-group moder">
                            <li v-for="(acc, index) in this.acceptedList" class="list-group-item">
                                <!-- ШАБЛОН -->
                                <!-- ИМЯ, АВТОР, КОММЕНТАРИЙ -->
                                <div class="me-auto">
                                    <div class="fw align-items-center">
                                        <strong>{{ acc.name }}</strong> <small>(Отправил: <i>{{ acc.author }}</i>, принял:
                                            <i>{{ acc.whoAccept }}</i>)</small>
                                    </div>
                                    <small class="fw align-items-center"> {{ acc.comment }} </small>
                                </div>
                                <!-- ЭКРАН, ДАТА УСТАНОВКИ -->
                                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                                    <select class="form-select" aria-label="Default select example"
                                        :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                        <option selected>Кафедра К3 - основной</option>
                                        <!-- <option value="1">Кафедра К3 - новости</option> -->
                                    </select>
                                    <input v-model="acc.date" id="startDate3" class="form-control" type="date"
                                        :value="acc.date"
                                        :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)" />
                                </div>

                                <!-- 1. ПАРЫ -->
                                <div v-if="!acc.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="acc.lesson"
                                                @change="this.eventList = []; acc.lesson_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                                <option selected :value="acc.lesson"> {{ acc.lesson }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.lesson_change !== true"
                                                @click="openPreview('acc', acc.id, { name: acc.lesson }, acc.isspecial, 'lesson')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.lesson_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>
                                <!-- 2. ПЕРЕРЫВ -->
                                <div v-if="!acc.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Перерыв: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="acc.breaktime"
                                                @change="this.eventList = []; acc.breaktime_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                                <option selected :value="acc.breaktime"> {{ acc.breaktime }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.breaktime_change !== true"
                                                @click="openPreview('acc', acc.id, { name: acc.breaktime }, acc.isspecial, 'breaktime')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.breaktime_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>
                                <!-- 3. ОБЕД -->
                                <div v-if="!acc.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                                    <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Обед: </div>
                                    <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                                        <div class="d-flex w-100">

                                            <select v-model="acc.lunch"
                                                @change="this.eventList = []; acc.lunch_change = true;"
                                                class="form-select form-select-sm me-1"
                                                :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                                <option selected :value="acc.lunch"> {{ acc.lunch }} </option>
                                                <option v-for="tmp in this.templatesToReplace" :value="tmp.name"> {{
                                                    tmp.name }} ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }}
                                                </option>
                                            </select>

                                            <button
                                                v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.lunch_change !== true"
                                                @click="openPreview('acc', acc.id, { name: acc.lunch }, acc.isspecial, 'lunch')"
                                                type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal"
                                                class="btn btn-info btn-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path
                                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>
                                            </button>

                                            <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && acc.lunch_change === true"
                                                tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                                class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                                data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                                    </path>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                                    </path>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                                    </path>
                                                </svg>
                                            </a>

                                        </div>
                                    </div>
                                </div>

                                <!-- СПЕЦТИП -->
                                <div v-if="acc.isspecial" v-for="(tmp, dex) in acc.eventList"
                                    class="d-flex w-100 justify-content-between gap-1 mt-1">
                                    <input v-model="acc.eventList[dex].time_to_swap" type="time"
                                        class="form-control form-select-sm"
                                        :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                    <select v-model="acc.eventList[dex].name"
                                        @change="acc.eventList[dex].has_change = true;" class="form-select form-select-sm"
                                        aria-label="Default select example"
                                        :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)">
                                        <option :value="acc.eventList[dex].name" selected> {{ acc.eventList[dex].name }}
                                        </option>
                                        <option v-for="tmp in templatesToReplace" :value="tmp.name"> {{ tmp.name }} ( by: {{
                                            tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                                    </select>
                                    <!-- УДАЛИТЬ -->
                                    <button
                                        v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)"
                                        @click="acc.eventList.splice(dex, 1)" type="button"
                                        class="btn btn-outline-danger btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path
                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z">
                                            </path>
                                        </svg>
                                    </button>
                                    <!-- ПРЕДПРОСМОТР -->
                                    <button
                                        v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && tmp.has_change !== true"
                                        type="button" @click="openPreview('req', acc.id, tmp)" data-bs-toggle="modal"
                                        data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path
                                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </button>
                                    <!-- МИНУС ГЛАЗ -->
                                    <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name) && tmp.has_change === true"
                                        tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus"
                                        class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!"
                                        data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-eye-slash" viewBox="0 0 16 16">
                                            <path
                                                d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z">
                                            </path>
                                            <path
                                                d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z">
                                            </path>
                                            <path
                                                d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                                <button
                                    v-if="acc.isspecial && !(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.session().name)"
                                    @click="addField(acc.eventList)" type="button"
                                    class="btn btn-outline-success btn-sm mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z">
                                        </path>
                                    </svg>
                                    Добавить
                                </button>

                                <!-- ОБЩАЯ ПАНЕЛЬ -->
                                <div class="row w-100 align-items-center g-1 mt-2">
                                    <div class="col-12 col-sm-12 col-md mb-1 form-check form-switch">
                                        <input v-model="acc.isspecial" @click="templateSave()" class="form-check-input"
                                            type="checkbox" role="switch" id="flexSwitchCheckDefault"
                                            :disabled="!(acc.isStartedProcess && (this.userProcess === acc.name || acc.whoAccept === this.session().name))" />
                                        <label class="form-check-label" for="flexSwitchCheckDefault"> Особое расписание
                                        </label>
                                    </div>

                                    <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                                    <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                        <button @click="startProcessing(acc, 'acc')"
                                            class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path
                                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fill-rule="evenodd"
                                                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                            Обработать
                                        </button>
                                    </div>

                                    <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                        <!-- Button trigger SetActive modal -->
                                        <button @click="triggerModal('active', acc, index)" type="button"
                                            class="btn btn-outline-warning w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                                                <path
                                                    d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                            </svg>
                                            Играть сейчас
                                        </button>
                                    </div>

                                    <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="endProcessing(acc, 'acc')" type="button"
                                            class="btn btn-outline-secondary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                                <path
                                                    d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                            Отменить
                                        </button>
                                        <!-- Button trigger Details modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <button v-if="acc.isspecial" @click="openDetails(acc, acc.eventList)" type="button"
                                            class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <button v-if="!acc.isspecial"
                                            @click="openDetails(acc, [acc.lesson, acc.breaktime, acc.lunch])" type="button"
                                            class="btn btn-outline-info w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>
                                            Просмотр
                                        </button>
                                        <!-- Button trigger Deny modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="triggerModal('delete', acc, index)" type="button"
                                            class="btn btn-outline-danger w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                <path
                                                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                            Удалить
                                        </button>
                                        <!-- Button trigger Confirm modal -->
                                    </div>
                                    <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.session().name)"
                                        class="col-12 col-sm-12 col-md mb-1">
                                        <button @click="triggerModal('save', acc, index)" type="button"
                                            class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z" />
                                            </svg>
                                            Применить
                                        </button>
                                    </div>
                                    <div v-if="acc.isStartedProcess && acc.whoAccept !== this.session().name"
                                        class="col text-end">
                                        Событие находится в обработке у: <i> "{{ acc.whoAccept }}" </i>
                                    </div>

                                    <!-- КОНЕЦ: Шаблон -->
                                </div>
                            </li>
                        </ul>
                        <!-- КОНЕЦ: Очередь на отображение -->
                    </div>

                    <!-- КОНЕЦ: Содержимое вкладок -->
                </div>
                <!-- КОНЕЦ: Подстилка - content -->
            </div>
            <!-- КОНЕЦ: container -->
        </div>
    </div>
</template>

<script>
import detailModals from '../components/detailModals.vue';

export default {
    inject: ['session', 'socket', 'options', 'toast', 'clickBlock'],
    components: {
        detailModals,
    },
    data()
    {
        return {
            prevarrow: '', nextarrow: '', customForms: [], currentModalPage: 0,

            composeDetailsModal: {
                templateName: '',           // Name of tmp watch this time
                authorName: '',             // Author of watching tmp
                withChanges: false,         // Cutrrent template has changes? (True or False)
                previewEvents: [],          // Events of current template
                numberOfEvents: 0,          // Number of events into current template
                nameOfCurrentEvent: '',     // Name of opened template
                numberOfCurrentEvent: 0     // Number of event from opened template
            },

            allFormList: [],        // All package data for moder (heap data)
            acceptedList: [],       // Accepted events <Request form>
            reqList: [],            // Request list fro moderator <Request form>
            activeTmp: [],          // Active tamplates play now <Template form>
            templatesToReplace: [], // Templates for replace for corrections 

            eventList: [],          // List of events opened template 
            // Form for add new events
            addForm: { name: "", src: "", type: 0, time: 15, isActive: true },

            editFormS: [],           // Edit event form (Study)
            editFormB: [],           // Breaktime 
            editFormL: [],           // Lunch

            userProcess: '',        // Name of request / program, processin this user at now 

            forModal: {
                withChanges: false,
                upd_less: [],
                upd_break: [],
                upd_lunch: [],
                upd_tmp_list: [],
                name: '',     // NOT NULL
                obj: {},      // NOT NULL
                index: '',
                comment: '',
            },

            sendDetailWorkdays: '',
            sendDetailSpecial: '',
            denyModal: '',
            confirmModal: '',
            deleteModal: '',
            saveModal: '',

            confirmActiveModal: '',
            oldActiveAction: '',
            oldActiveData: {},

            actModal: '',
            format: /[`!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/
        }
    },
    methods: {
        connect()
        {
            this.socket().on('process:start', (data) =>
            {
                if (data.list === "req") {
                    for (let i in this.reqList) {
                        if (this.reqList[i].name === data.process) {
                            this.reqList[i].isStartedProcess = true;
                            this.reqList[i].inProcessing = true;
                            this.reqList[i].whoAccept = data.user;
                        }
                    }
                } else if (data.list === "act") {
                    for (let i in this.activeTmp) {
                        if (this.activeTmp[i].name === data.process) {
                            this.activeTmp[i].isStartedProcess = true;
                            this.activeTmp[i].inProcessing = true;
                            this.activeTmp[i].whoAccept = data.user;
                        }
                    }
                } else if (data.list === "acc") {
                    for (let i in this.acceptedList) {
                        if (this.acceptedList[i].name === data.process) {
                            this.acceptedList[i].isStartedProcess = true;
                            this.acceptedList[i].inProcessing = true;
                            this.acceptedList[i].whoAccept = data.user;
                        }
                    }
                } else {
                    this.toast('error', 'Ошибка идентификации локации новой обработки.');
                }
            });

            this.socket().on('process:end', async (data) =>
            {
                if (!data.name) {
                    this.toast('error', 'Ошибка идентификации обрабатывающего пользователя.');
                    return;
                }

                for (let i in this.reqList) {
                    if (this.reqList[i].isStartedProcess && this.reqList[i].whoAccept === data.name) {
                        this.reqList[i].isStartedProcess = false;
                        this.reqList[i].inProcessing = false;
                    }
                }
                for (let i in this.activeTmp) {
                    if (this.activeTmp[i].isStartedProcess && this.activeTmp[i].whoAccept === data.name) {
                        this.activeTmp[i].isStartedProcess = false;
                        this.activeTmp[i].inProcessing = false;
                    }
                }
                for (let i in this.acceptedList) {
                    if (this.acceptedList[i].isStartedProcess && this.acceptedList[i].whoAccept === data.name) {
                        this.acceptedList[i].isStartedProcess = false;
                        this.acceptedList[i].inProcessing = false;
                    }
                }
            });

            this.socket().on('process:confirm', async (data) =>
            {
                let response = await fetch(`/moder/requests`, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                    })
                });
                this.allFormList = (await response.json());

                if (data.list === 'req') {
                    for (let i in this.allFormList) {
                        if (this.allFormList[i].name === data.process) {
                            this.acceptedList.push(this.allFormList[i]);
                        }
                    }
                    for (let i in this.reqList) {
                        if (this.reqList[i].name === data.process) {
                            this.reqList.splice(Number(i), 1);
                        }
                    }
                } else if (data.list === 'acc') {
                    let tmp;
                    for (let i in this.allFormList) {
                        if (this.allFormList[i].name === data.process) {
                            tmp = this.allFormList[i];
                        }
                    }
                    for (let i in this.acceptedList) {
                        if (this.acceptedList[i].name === data.process) {
                            this.acceptedList[i] = tmp;
                        }
                    }
                } else if (data.list === 'act') {
                    let tmp;
                    for (let i in this.allFormList) {
                        if (this.allFormList[i].name === data.process) {
                            tmp = this.allFormList[i];
                        }
                    }
                    for (let i in this.activeTmp) {
                        if (this.activeTmp[i].name === data.process) {
                            this.activeTmp[i] = tmp;
                        }
                    }
                } else {
                    this.toast('error', 'Ошибка идентификации локации обновленных данных.');
                }
            });

            this.socket().on('process:deny', (data) =>
            {
                if (data.list === 'req') {
                    for (let i in this.reqList) {
                        if (this.reqList[i].name === data.process) {
                            this.reqList.splice(Number(i), 1);
                        }
                    }
                } else if (data.list === 'acc') {
                    for (let i in this.acceptedList) {
                        if (this.acceptedList[i].name === data.process) {
                            this.acceptedList.splice(Number(i), 1);
                        }
                    }
                } else {
                    this.toast('success', 'Не удалось определить действие.')
                }
            });

            this.socket().on('request:new', async (data) =>
            {
                await this.getTime();
                let response = await fetch(`/moder/requests`, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                    })
                });
                this.allFormList = await response.json();

                for (let i in this.allFormList) {
                    if (this.allFormList[i].name === data.request) {
                        this.reqList.push(this.allFormList[i]);
                    }
                }

                this.toast('info', 'Редактор: ' + data.name + ' только что прислал запрос на модерацию: "' + data.request + '".');
            });

            this.socket().on('active:upd', async (data) =>
            {
                for (let i in this.acceptedList) {
                    if (this.acceptedList[i].name === data.name) {
                        this.activeTmp = [];
                        this.activeTmp.push(this.acceptedList[i]);
                        this.acceptedList.splice(Number(i), 1);
                    }
                }
                this.ProgressBar(this.activeTmp);
            });
        },

        // Start vizualize progress bar 
        ProgressBar(active)
        {
            let Lessons = [
                [30000, 31200, 'Перерыв'],                                    // Перерыв, с 8:20
                [31200, 36900, '1-ая пара'],                                  // 1ая пара, с 8:40
                [36900, 37500, 'Перерыв'],                                    // Перерыв, с 10:15
                [37500, 43200, '2-ая пара'],                                  // 2ая пара, с 10:25
                [43200, 46200, 'Обед'],                                       // Обед, С 12:00
                [46200, 51900, '3-ая пара'],                                  // 3ая пара, с 12:50
                [51900, 52500, 'Перерыв'],                                    // Перерыв, с 14:25
                [52500, 58200, '4-ая пара'],                                  // 4ая пара, с 14:35
                [58200, 58800, 'Перерыв'],                                    // Перерыв, с 16:10
                [58800, 64500, '5-ая пара'],                                  // 5ая пара, с 16:20
            ];
            let Special = [                                                 // Особое расписание
                [28800, 64800, 'Особое расписание'],                          // с 8:00 до 18:00
            ];

            function getPercent(curSec, bSpecial)
            {
                let percent;
                if (!bSpecial) {                                              // Если БУДНИ
                    for (let i in Lessons) {                                    // Бежим по заданным промежуткам
                        if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) {  // Проверяем, в каком промежутке находимся
                            let during = Lessons[i][1] - Lessons[i][0];             // Высчитываем продолжительность промежутка (1)
                            let fromStart = Lessons[i][1] - curSec;                 // Сколько прошло с начала в промежутке (2)
                            percent = 100 - (fromStart * 100) / during;             // Делим (2) на (1) и узнаём проценты
                            return percent;                                         // Возвращаем посчитанный %
                        }
                    }
                } else {                                                      // Если СПЕЦИАЛЬНОЕ РАСПИСАНИЕ
                    if (curSec >= Special[0][0] && curSec < Special[0][1]) {    // Проверяем, в каком промежутке находимся
                        let during = Special[0][1] - Special[0][0];               // Высчитываем продолжительность промежутка (1)
                        let fromStart = Special[0][1] - curSec;                   // Сколько прошло с начала в промежутке (2)
                        percent = 100 - (fromStart * 100) / during;               // Делим (2) на (1) и узнаём проценты
                        return percent;                                           // Возвращаем посчитанный %
                    }
                }                                                             // После 17:55 и до 8:20 - Свободное время,
                return 100;                                                   // играет шаблон "Обед"
            }

            function getName(curSec, bSpecial)
            {                            // Узнать имя в зависимости от расписания
                if (!bSpecial) {                                              // Если БУДНИ
                    for (let i in Lessons) {                                    // Проверяем, в каком промежутке находимся
                        if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) {  // Если попадаем в один из заданных промежутков
                            return Lessons[i][2];                                   // Возвращаем наименование промежутка
                        }
                    }
                    return 'Свободное время';                                   // Иначе возвращаем "Свободное время"
                } else return 'Особое расписание';                            // Если СПЕЦИАЛЬНОЕ РАСПИСАНИЕ
            }                                                               // возвращаем "Особое расписание"

            function WhatTime()
            {                                           // Узнать время в секундах с начала дня
                let today = new Date();                                       // Получить текущее время и вернуть значение в секнудах
                return (today.getHours() * 60 + today.getMinutes()) * 60 + today.getSeconds();
            }

            function checkTime(i)
            {                                         // Преобразовать время к презентабельному виду
                if (i < 10) { i = '0' + i; }                                  // Если < 10 то добавить перед цифрой "0" для красоты
                return i;
            }

            function startTime(active)
            {
                let today = new Date();
                let actualTime = checkTime(today.getHours()) + ':' + checkTime(today.getMinutes()) + ':' + checkTime(today.getSeconds());


                for (let i in active) {
                    if (!active[i].isspecial) {
                        // Будни
                        document.getElementById('time_workdays').innerHTML = actualTime;
                        document.getElementById('progress_workdays').style['width'] = getPercent(WhatTime(), false) + '%';
                    } else {
                        // Специальное расписание
                        document.getElementById('time_specdays').innerHTML = actualTime;
                        document.getElementById('progress_specdays').style['width'] = getPercent(WhatTime(), true) + '%';
                    }
                }

                setTimeout(async function () { startTime(active); }, 1000);
            }

            startTime(this.activeTmp);

            async function refreshAt(hours, minutes, seconds, active)
            {
                let now = new Date();
                let then = new Date();

                if (now.getHours() > hours ||
                    (now.getHours() === hours && now.getMinutes() > minutes) ||
                    (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() >= seconds)
                ) {
                    then.setDate(now.getDate() + 1);
                }
                then.setHours(hours); then.setMinutes(minutes); then.setSeconds(seconds);
                // Установка тайм-аута до следующего вызова
                let timeout = then.getTime() - now.getTime();
                setTimeout(async function ()
                {
                    // Подстановка надписи в элемент при обновлении надписи
                    for (let i in active) {
                        if (!active[i].isspecial) {
                            document.getElementById('nameInfo_workdays').innerHTML = getName(WhatTime(), false);
                        } else {
                            document.getElementById('nameInfo_specdays').innerHTML = getName(WhatTime(), true);
                        }
                    }

                }, timeout);
            }
            // Проверка времени для обновления надписи ПЕРЕДЕЛАТЬ
            refreshAt(8, 20, 3, this.activeTmp); refreshAt(8, 40, 3, this.activeTmp); refreshAt(10, 15, 3, this.activeTmp); refreshAt(10, 25, 3, this.activeTmp);
            refreshAt(12, 0, 3, this.activeTmp); refreshAt(12, 50, 3, this.activeTmp); refreshAt(14, 25, 3, this.activeTmp); refreshAt(14, 35, 3, this.activeTmp);
            refreshAt(16, 10, 3, this.activeTmp); refreshAt(16, 20, 3, this.activeTmp); refreshAt(17, 55, 3, this.activeTmp);

            // Подстановка надписи в элемент при загрузке страницы
            setTimeout(async function ()
            {
                for (let i in active) {
                    if (!active[i].isspecial) {
                        document.getElementById('nameInfo_workdays').innerHTML = getName(WhatTime(), false);
                    } else {
                        document.getElementById('nameInfo_specdays').innerHTML = getName(WhatTime(), true);
                    }
                }
            }, 1000);

            return true;
        },

        async getRequests()
        {
            this.sendDetailWorkdays = new bootstrap.Modal(document.getElementById('detailsWorkdaysModal'));
            this.sendDetailSpecial = new bootstrap.Modal(document.getElementById('detailsSpecialModal'));
            this.denyModal = new bootstrap.Modal(document.getElementById('denyModal'));
            this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            this.confirmActiveModal = new bootstrap.Modal(document.getElementById('confirmActiveModal'));
            this.saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
            this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            this.actModal = new bootstrap.Modal(document.getElementById('activeModal'));
            this.fullscreenModal = new bootstrap.Modal(document.getElementById('PreviewModal'));

            this.succCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
            this.errCallback = new bootstrap.Toast(document.getElementById("ToastError"));
            this.infoCallback = new bootstrap.Toast(document.getElementById("ToastInfo"));

            let response = await fetch(`/moder/requests`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                })
            });
            // Вся информация о запросах в системе
            this.allFormList = (await response.json());     // [ { ... , isAccess: true }, { ... , isAccess: false }, ... ]

            for (let i in this.allFormList) {
                if (this.allFormList[i].isspecial === false) {
                    this.allFormList[i].lesson_res = JSON.parse(JSON.stringify(this.allFormList[i].lesson));
                    this.allFormList[i].breaktime_res = JSON.parse(JSON.stringify(this.allFormList[i].breaktime));
                    this.allFormList[i].lunch_res = JSON.parse(JSON.stringify(this.allFormList[i].lunch));
                } else {
                    this.allFormList[i].eventList_res = JSON.parse(JSON.stringify(this.allFormList[i].eventList));
                }

                if (this.allFormList[i].isActive) {
                    this.activeTmp.push(this.allFormList[i]);
                    continue;
                }
                if (this.allFormList[i].isAccepted === true) {
                    this.acceptedList.push(this.allFormList[i]);
                } else {
                    this.reqList.push(this.allFormList[i]);
                }
            }

            for (let i in this.reqList) {
                if (this.reqList[i].inProcessing) {
                    this.reqList[i].isStartedProcess = true;
                    if (this.reqList[i].whoAccept === this.session().name) {
                        this.userProcess = this.reqList[i].name;
                    }
                }
            }
        },

        async switchProcess(name)
        {
            await fetch(`/moder/switchprocess`, this.options('PATCH', { name: name }));
        },

        async startProcessing(obj, list)
        {
            await this.getTime();
            if (this.userProcess === '' && !obj.isStartedProcess) {
                const data = {
                    list: list,
                    process: obj.name,
                    user: this.session().name
                }

                this.socket().emit('new-process', data);

                let templates = await fetch(` /moder/alltmp`, this.options('PATCH', { name: obj.name }));
                this.templatesToReplace = (await templates.json());

                obj.isStartedProcess = true;
                obj.whoAccept = this.session().name;
                let name = obj.name;
                await this.switchProcess(name);
                this.userProcess = name;

                document.querySelectorAll('[data-bs-toggle="popover"]')
                    .forEach(popover =>
                    {
                        new bootstrap.Popover(popover)
                    });
            } else {
                this.toast('error', 'Вы можете обрабатывать максимум одно событие! Сначала завершите текущую обработку.');
            }
        },

        async endProcessing(obj, list)
        {
            obj.isStartedProcess = false;
            let name = obj.name;
            await this.switchProcess(name);

            this.clearUserProcessData();

            if (obj.isspecial === false) {
                obj.lesson_change = false;
                obj.breaktime_change = false;
                obj.lunch_change = false;

                obj.lesson = obj.lesson_res;
                obj.breaktime = obj.breaktime_res;
                obj.lunch = obj.lunch_res;
            } else {
                obj.eventList = {};
                obj.eventList = JSON.parse(JSON.stringify(obj.eventList_res));
            }

            const data = {
                list: list,
                process: obj.name,
                name: this.session().name
            }

            this.socket().emit('end-process', data);
        },

        async triggerModal(type, obj, index)
        {
            this.userProcess = obj.name;
            this.forModal.name = obj.name;
            this.forModal.obj = obj;
            this.forModal.index = index;

            switch (type) {
                case 'confirm':
                    this.forModal.comment = 'Утверждаю.';
                    this.confirmModal.show();
                    break;
                case 'deny':
                    this.forModal.comment = 'Исправить ошибки.';
                    this.denyModal.show();
                    break;
                case 'delete':
                    this.deleteModal.show();
                    break;
                case 'save':
                    this.saveModal.show();
                    break;
                case 'active':
                    this.actModal.show();
                    break;
                default:
                    this.toast('error', 'Администратору направлен отчет о ваших действиях.');
            }
        },

        async buttonApprove(struct)
        {
            if (this.userProcess !== '') {
                if (struct.obj.isspecial) {
                    struct.obj.breaktime = struct.obj.lesson;
                    struct.obj.lunch = struct.obj.lesson;
                }
                let response;
                if (this.forModal.withChanges) {
                    response = await fetch(`/moder/access`, this.options('PATCH', {
                        has_changes: struct.withChanges,
                        obj_req: struct.obj,
                        comment: struct.comment,
                        upd_less: struct.upd_less,
                        upd_lunch: struct.upd_lunch,
                        upd_break: struct.upd_break,
                        upd_tmp_list: struct.upd_tmp_list
                    }));
                } else {
                    response = await fetch(`/moder/access`, this.options('PATCH', {
                        obj_req: struct.obj,
                        comment: struct.comment
                    }));
                }
                response = await response.json();

                if (response.status === 'success') {
                    this.reqList[struct.index].isStartedProcess = false;
                    this.reqList[struct.index].isAccepted = true;
                    this.acceptedList.push(this.reqList[struct.index]);
                    this.reqList.splice(struct.index, 1);

                    this.toast('success', 'Запрос "' + struct.name + '" был успешно утвержден.');
                    this.confirmModal.hide();

                    const data = {
                        list: 'req',
                        process: struct.name,
                        user: this.session().name
                    }
                    this.socket().emit('con-process', data);

                    let newDate = new Date();
                    let DAY = (newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate();
                    let MONTH = (Number(Number(newDate.getMonth()) + 1) < 10) ? '0' + Number(Number(newDate.getMonth()) + 1) : Number(Number(newDate.getMonth()) + 1);
                    let YEAR = newDate.getFullYear();

                    if (struct.obj.date === YEAR + '-' + MONTH + '-' + DAY) {
                        this.confirmActiveModal.show();
                    } else {
                        this.clearUserProcessData();
                    }
                } else {
                    this.toast('error', 'Уже существует утвержденное событие на этот день.');
                }
            } else {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
            }
        },

        async buttonReject(struct)
        {
            if (this.userProcess !== '') {
                // let response =
                await fetch(`/moder/deny`, this.options('PUT', { name: struct.name, comment: struct.comment }));
                this.reqList.splice(struct.index, 1);

                const data = {
                    list: 'req',
                    process: struct.name,
                    user: this.session().name
                }
                this.socket().emit('del-process', data);

                this.toast('success', 'Запрос "' + struct.name + '" был успешно отклонен.');
                this.denyModal.hide();
                this.clearUserProcessData();

            } else {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
            }
        },

        async deleteFromApproved(struct)
        {
            if (this.userProcess !== '') {
                // let response =
                await fetch(`/moder/deny`, this.options('PUT', { name: struct.name, comment: struct.comment }));
                this.acceptedList.splice(struct.index, 1);

                const data = {
                    list: 'acc',
                    process: struct.name,
                    user: this.session().name
                }
                this.socket().emit('del-process', data);
                this.toast('success', 'Запрос "' + struct.name + '" был успешно удален.');
                this.deleteModal.hide();
                this.clearUserProcessData();
            } else {
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
            }
        },

        async saveChangesButton(struct)
        {
            if (this.userProcess !== '') {
                if (struct.obj.isspecial) {
                    struct.obj.breaktime = struct.obj.lesson;
                    struct.obj.lunch = struct.obj.lesson;
                }
                if (struct.withChanges) {
                    await fetch(`/moder/access`, this.options('PATCH', {
                        has_changes: struct.withChanges,
                        obj_req: struct.obj,
                        comment: struct.comment,
                        upd_less: struct.upd_less,
                        upd_lunch: struct.upd_lunch,
                        upd_break: struct.upd_break,
                        upd_tmp_list: struct.upd_tmp_list
                    }));
                } else {
                    await fetch(`/moder/access`, this.options('PATCH', {
                        obj_req: struct.obj,
                        comment: struct.comment
                    }));
                }

                if (!struct.obj.isActive) {
                    this.toast('success', 'В запрос "' + struct.name + '" успешно внесены изменения.');

                    const data = {
                        list: 'acc',
                        process: struct.name,
                        user: this.session().name
                    }
                    this.socket().emit('con-process', data);
                    this.acceptedList[struct.index].isStartedProcess = false;
                } else {
                    this.toast('success', 'В активную трансляцию успешно внесены изменения.');
                    const data = {
                        list: 'act',
                        process: struct.name,
                        user: this.session().name
                    }
                    this.socket().emit('con-process', data);
                    this.socket().emit('upd-active', { name: struct.name });

                    this.activeTmp[struct.index].isStartedProcess = false;
                }

                this.saveModal.hide();
                this.clearUserProcessData();

            } else
                this.toast('error', 'Некорректный параметр. Начните обработку корректно.');
        },

        async openDetails(obj, tmpList)
        {
            if (!this.forModal.withChanges) {
                let response = await fetch(`/moder/details`, this.options('PATCH', { id: obj.id, tmpList }));
                this.eventList = (await response.json());
            }

            this.currentModalPage = 0;

            if (this.eventList.type === false) {
                this.editFormS = [];
                this.editFormB = [];
                this.editFormL = [];

                if (this.eventList.data.lesson !== '-') {
                    for (let i in this.eventList.data.lesson) {
                        if (!this.editFormS[i]) this.editFormS[i] = {}
                        this.editFormS[i].isDisabled = true;
                    }
                }
                if (this.eventList.data.breaktime !== 'lesson') {
                    for (let i in this.eventList.data.breaktime) {
                        if (!this.editFormB[i]) this.editFormB[i] = {}
                        this.editFormB[i].isDisabled = true;
                    }
                }
                if (this.eventList.data.lunch !== 'lesson' && this.eventList.data.lunch !== 'breaktime') {
                    for (let i in this.eventList.data.lunch) {
                        if (!this.editFormL[i]) this.editFormL[i] = {}
                        this.editFormL[i].isDisabled = true;
                    }
                }
                this.sendDetailWorkdays.show();
            } else {
                this.customForms = [];

                for (let i in this.eventList.data) {
                    this.customForms[i] = [];

                    for (let j in this.eventList.data[i].events) {
                        if (!this.customForms[i][j])
                            this.customForms[i][j] = {};
                        this.customForms[i][j].isDisabled = true;
                    }
                }
                this.sendDetailSpecial.show();
            }
        },

        async templateSave()
        {
            this.forModal.withChanges = true;
            if (this.eventList.type === true) {
                this.forModal.upd_tmp_list = this.eventList.data;
            } else {
                this.forModal.upd_less = this.eventList.data.lesson;
                this.forModal.upd_break = this.eventList.data.breaktime;
                this.forModal.upd_lunch = this.eventList.data.lunch;
            }
        },

        /**
         * Установка утвержденного запроса активным
         * 
         * @param modalStruct Структура для модального окна
         * @param action Действие над старым активным запросом
         * @param actonObject Дополнительные данные для действия
         */
        async setActive(modalStruct, action, actionObject)
        {
            if (!modalStruct.obj.isAccepted || !action) {
                this.toast('error', 'Невозможно установить не утвержденный запрос.');
                return;
            }

            let response = await fetch('/control/active', this.options('POST', {
                name: req.name
            }));

            response = await response.json();

            if (response.cb !== 'success') {
                this.errorMessage = response.message;
                this.errCallback.show();
                return;
            }

            this.activeTmp = [];
            this.acceptedList[req.index].isActive = true;
            this.activeTmp.push(this.acceptedList[req.index]);
            this.acceptedList.splice(req.index, 1);

            this.socket().emit('upd-active', { name: req.name });

            this.toast('success', 'Запрос "' + req.name + '" был успешно установлен на воспроизведение.');
            this.actModal.hide();
            this.userProcess = '';

            setTimeout(this.ProgressBar(this.activeTmp), 1000);
        },

        addField(list)
        {
            list.push({
                id: 0,
                name: '- Выберите -',
                time_to_swap: '00:00'
            });
        },

        clearUserProcessData()
        {
            this.userProcess = '';
            this.forModal.withChanges = false;
            this.forModal.upd_less = [];
            this.forModal.upd_break = [];
            this.forModal.upd_lunch = [];
            this.forModal.upd_tmp_list = [];
        },

        async addEvent(form, data)
        {
            if (!(this.addForm.name !== "" && (this.addForm.src !== ""))) {
                this.toast('error', 'Пожалуйста, заполните все поля перед добавлением.');
                return;
            }

            if (this.addForm.name.length > 50) {
                this.toast('error', 'Полученно слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + this.addForm.name.length);
            } else if (!Number.isFinite(this.addForm.time) || this.addForm.time < 0) {
                this.toast('error', 'Полчено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
            } else if (this.format.test(this.addForm.name)) {
                this.toast('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
            } else {
                form.push({ isDisabled: true });
                data.push(this.addForm);
                this.addForm = { name: "", src: "", type: 0, time: 15, isActive: true }
            }
        },

        async delEvent(index, form, data)
        {
            form[index].isDisabled = true;
            form.splice(index, 1);
            data.splice(index, 1);
        },

        async editEvent(index, form)
        {
            form[index].isDisabled = false;
        },

        async saveEvent(index, form)
        {
            form[index].isDisabled = true;
        },

        async moveEvent(move, index, data)
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
                this.correctArr(data, [id1, id2]);
            }
        },

        correctArr(_arr, _param)
        {
            /*
                коррекция  элементов массива по паре индекса
                *    _arr -- массив требующий коррекции
                *   _param -- пара [n1,n2] -- индексы массива для взаимной  перестановки
            */
            _arr[_param[1]] = _arr.splice(_param[0], 1, _arr[_param[1]])[0]
        },

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

        async endAllProcesses()
        {
            await fetch('/control/refund', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                },
            });

            this.socket().emit('end-process', { name: this.session().name });

            for (let i in this.reqList) {
                if (this.reqList[i].isStartedProcess && this.reqList[i].name === this.userProcess) {
                    this.reqList[i].isStartedProcess = false;
                    this.reqList[i].inProcessing = false;
                }
            }
            for (let i in this.activeTmp) {
                if (this.activeTmp[i].isStartedProcess && this.activeTmp[i].name === this.userProcess) {
                    this.activeTmp[i].isStartedProcess = false;
                    this.activeTmp[i].inProcessing = false;
                }
            }
            for (let i in this.acceptedList) {
                if (this.acceptedList[i].isStartedProcess && this.acceptedList[i].name === this.userProcess) {
                    this.acceptedList[i].isStartedProcess = false;
                    this.acceptedList[i].inProcessing = false;
                }
            }
            this.clearUserProcessData();
            this.toast('success', 'Все обработки успешно завершены.');
        },

        // Preview of program template
        /**
         * from - list of compose (acc/req/act)
         * id_req - request's id
         * special - parameter 'isspecial' from composes
         * tmp - object of template from compose
        */
        async openPreview(from, id_req, tmp, special, timeOrStep)
        {
            // Предпросмор на странице запросов
            this.composeDetailsModal.templateName = tmp.name;
            for (let i in this.templatesToReplace)
                if (this.templatesToReplace[i].name === tmp.name) {
                    this.composeDetailsModal.authorName = this.templatesToReplace[i].author;
                    break;
                }

            let response = await fetch('/moder/preview', this.options('PATCH', {
                from, id: id_req, timeOrStep, special
            }));
            response = await response.json();

            if (response.cb === 'error') {
                this.toast('error', response.msg);
                return;
            }

            this.composeDetailsModal.previewEvents = response.events;
            this.composeDetailsModal.numberOfEvents = response.events.length;
            this.composeDetailsModal.nameOfCurrentEvent = response.events[0].name;
            this.composeDetailsModal.numberOfCurrentEvent = response.events.length === 0 ? 0 : 1;

            this.fullscreenModal.show();
        },

        resizeTextEdit()
        {
            if (window.innerWidth > 768) {
                this.prevarrow = 'Предыдущее событие';
                this.nextarrow = 'Следующее событие';
            } else {
                this.prevarrow = '';
                this.nextarrow = '';
            }
        },
    },

    mounted()
    {
        this.connect();
        this.getRequests();
        this.resizeTextEdit();
        this.ProgressBar(this.activeTmp);

        window.addEventListener('beforeunload', async (event) =>
        {
            await fetch('/control/refund', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                },
            });

            this.socket().emit('end-process', { name: this.session().name });

            event.preventDefault();
            event.returnValue = '';
        });
    }
}
</script>