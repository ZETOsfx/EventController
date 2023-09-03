<template>
  <div class="intro">
    <!-- Группировка toasts -->
    <toast :time="currentTime" :successCb="successMessage" :errorCb="errorMessage" :infoCb="infoMessage"></toast>

    <!--ГРУППИРОВКА - МОДАЛКИ-->
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
              <textarea v-model="this.forModal.comment" @keyup.enter="buttonDeny(this.forModal)" class="form-control" id="message-text"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button @click="buttonDeny(this.forModal)" type="button" class="btn btn-danger">Отклонить</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Confirm-Active -->
    <div class="modal fade" id="dobivModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabela">Подтверждение</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Вы утвердили шаблон на сегодня. <br> Желаете сразу установить его на трансляцию?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Не стоит</button>
            <button @click="setActive(this.forModal, true)" type="button" class="btn btn-success" data-bs-dismiss="modal">Установить</button>
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
              <textarea @keyup.enter="buttonAccess(this.forModal)" v-model="this.forModal.comment" class="form-control" id="message-text"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button @click="buttonAccess(this.forModal)" type="button" class="btn btn-success">Утвердить</button>
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
            <button @click="buttonDelete(this.forModal)" type="button" class="btn btn-danger">Удалить</button>
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
            <button @click="buttonSave(this.forModal)" type="button" class="btn btn-success">Уверен</button>
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
            Вы собираетесь установить шаблон "{{ this.forModal.name }}" на трансляцию. <strong>Текущий активный шаблон будет удалён из системы</strong>. <br><br> Вы уверены?
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
                    <h4 class="modal-title fs-5"><strong>{{ this.composeDetailsModal.templateName }}</strong> ({{ this.composeDetailsModal.authorName }}) </h4>
                  </div>
                  <div class="col-auto m-0">
                    <h5 class="m-0"> <strong> {{ this.composeDetailsModal.numberOfCurrentEvent }}/{{ this.composeDetailsModal.numberOfEvents }} </strong> </h5>
                  </div>
                  <div class="col-auto">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div> 
                </div>
                <div v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1] !== undefined" class="modal-body">
                    <img v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 0" :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%;" alt="">
                    <iframe v-if="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].type === 1" :src="this.composeDetailsModal.previewEvents[this.composeDetailsModal.numberOfCurrentEvent - 1].src" style="object-fit: contain; width: 100%; height: 100%;" alt=""></iframe>
                </div>
                <div class="modal-footer row justify-content-center">
                  <div class="col-auto">
                    <button @click="switchPage('prev')" type="button" class="btn btn-outline-success w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"></path>
                      </svg>
                      {{ this.prevarrow }}
                    </button>
                  </div>
                  <div class="col-auto">
                    <input type="checkbox" class="btn-check" id="autoplay-check" autocomplete="off">
                    <label class="btn btn-outline-warning w-100" for="autoplay-check">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                      </svg>
                      Автопроигрывание
                    </label>
                  </div>
                  <div class="col-auto">
                    <button @click="switchPage('next')" type="button" class="btn btn-outline-success col-auto w-100">
                    {{ this.nextarrow }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path>
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
      <h6 class="text mt-4"> Управление отображением </h6>
      <!-- Подстилка - content -->
      <div class="content">

        <!-- ЗАГОЛОВКИ ВКЛАДОК -->
        <div class="d-flex justify-content-between g-1">
          <ul class="nav nav-pills" id="pills-tab1" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="pills-request-tab" data-bs-toggle="pill" data-bs-target="#pills-request" type="button" role="tab" aria-selected="true">Запросы на модерирование</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-display-tab" data-bs-toggle="pill" data-bs-target="#pills-display" type="button" role="tab"  aria-selected="false">Активное отображение</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="pills-queue-tab" data-bs-toggle="pill" data-bs-target="#pills-queue" type="button" role="tab" aria-selected="false">Очередь отображения</button>
            </li>
            <!-- КОНЕЦ: Вкладки -->
          </ul>
          <button @click="endAllProcesses()" type="button" class="btn btn-outline-danger">Завершить все обработки</button>
        </div>
      </div>
      <div class="content">
        <!-- Содержимое вкладок -->
        <div class="tab-content" id="pills-tabContent1">

          <!-- ВХОДЯЩИЕ ЗАРОСЫ НА МОДЕРАЦИЮ -->
          <div class="tab-pane fade show active" id="pills-request" role="tabpanel" aria-labelledby="pills-request-tab" tabindex="0">
            <div v-if="this.reqList.length === 0"> Необработанных запросов нет </div>
            <ul v-if="this.reqList.length > 0" class="list-group moder">
              <li v-for="(req, index) in this.reqList" class="list-group-item">

                <!-- ШАБЛОН -->
                <!-- ЗАГОЛОВОК, АВТОР, КОММЕНТАРИЙ -->
                <div class="me-auto">
                  <div class="fw align-items-center">
                    <strong> {{ req.name }} </strong> <small>(отправлено: <i>{{ req.author }}</i>)</small>
                  </div>
                  <small class="fw align-items-center"> {{ req.comment }} </small>
                </div>
                <!-- ДАТА, ЭКРАН -->
                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                  <select class="form-select" aria-label="Default select example" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                    <option selected>Кафедра К3 - основной</option>
                    <!-- <option value="1">Кафедра К3 - новости</option> -->
                  </select>
                  <input v-model="req.date" id="startDate1" class="form-control" type="date" :value="req.date" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)"/>
                </div>

                <!-- ТЕЛО ШАБЛОНА ДЛЯ СТАНДАРТНОГО ТИПА -->
                <!-- 1. ПАРЫ -->
                <div v-if="!req.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                  <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                  <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                    <div class="d-flex w-100">
                      
                      <select v-model="req.lesson" @change="this.eventList = []; req.lesson_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                        <option selected :value="req.lesson"> {{ req.lesson }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>

                      <button v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.lesson_change !== true" @click="openPreview('req', req.id, { name: req.lesson }, req.isspecial, 'lesson')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>
                      
                      <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.lesson_change === true"  tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
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

                      <select  v-model="req.breaktime" @change="this.eventList = []; req.breaktime_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                        <option selected :value="req.breaktime"> {{ req.breaktime }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>

                      <button v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.breaktime_change !== true" @click="openPreview('req', req.id, { name: req.breaktime }, req.isspecial, 'breaktime')"  type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>

                      <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.breaktime_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
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

                      <select  v-model="req.lunch" @change="this.eventList = []; req.lunch_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                        <option selected :value="req.lunch"> {{ req.lunch }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>
                      
                      <button v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.lunch_change !== true" @click="openPreview('req', req.id, { name: req.lunch }, req.isspecial, 'lunch')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>

                      <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && req.lunch_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                        </svg>
                      </a>

                    </div>
                  </div>
                </div>

                <!-- ТЕЛО ШАБЛОНА ОСОБОГО ТИПА -->
                <div v-if="req.isspecial" v-for="(tmp, dex) in req.eventList" class="d-flex w-100 justify-content-between gap-1 mt-1">
                  <input v-model="req.eventList[dex].time_to_swap" type="time" class="form-control form-select-sm" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                  <select v-model="req.eventList[dex].name" @change="req.eventList[dex].has_change = true;" class="form-select form-select-sm" aria-label="Default select example" :disabled="(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)">
                    <option :value="req.eventList[dex].name" selected> {{ req.eventList[dex].name }} </option>
                    <option v-for="tmp in templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                  </select>
                  <!-- УДАЛИТЬ -->
                  <button v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)" @click="req.eventList.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                    </svg>
                  </button>
                  <!-- ПРЕДПРОСМОТР -->
                  <button v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && tmp.has_change !== true" type="button" @click="openPreview('req', req.id, tmp, req.isspecial, req.eventList[dex].time_to_swap)" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                  </button>
                  <!-- МИНУС ГЛАЗ -->
                  <a v-if="!(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name) && tmp.has_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                    </svg>
                  </a>
                </div>
                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                <button v-if="req.isspecial && !(!this.reqList[index].isStartedProcess || req.whoAccept !== this.username.name)" @click="addToAss(req.eventList)" type="button" class="btn btn-outline-success btn-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                  </svg>
                  Добавить
                </button>

                <div class="row w-100 align-items-center g-1 mt-2">
                  <div class="col-12 col-sm-6 col-md mb-1 form-check form-switch">
                    <input v-model="req.isspecial" @click="templateSave()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault26" :disabled="!(req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.username.name))"/>
                    <label class="form-check-label" for="flexSwitchCheckDefault26"> Особое расписание </label>
                  </div>

                  <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                  <div v-if="!req.isStartedProcess" class="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                    <button  @click="startProcess(req, 'req')" class="btn btn-outline-secondary w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                      </svg>
                      Обработать 
                    </button>
                  </div>

                  <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.username.name)" class="col-12 col-sm-12 col-md mb-1">
                    <button @click="endProcess(req, 'req')" type="button" class="btn btn-outline-secondary w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                      Отмена 
                    </button>
                  </div>
                  <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.username.name)" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Details modal -->
                    <button v-if="req.isspecial" @click="buttonOpen(req, req.eventList)"  type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                    <button v-if="!req.isspecial" @click="buttonOpen(req, [req.lesson, req.breaktime, req.lunch])"  type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                  </div>
                  <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.username.name)" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Deny modal -->
                    <button @click="triggerModal('deny', req, index)" type="button" class="btn btn-outline-danger w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                        <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                      </svg>
                      Отклонить
                    </button>
                  </div>
                  <div v-if="req.isStartedProcess && (this.userProcess === req.name || req.whoAccept === this.username.name)" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Confirm modal -->
                    <button @click="triggerModal('confirm', req, index)" type="button" class="btn btn-success w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                      </svg>
                      Утвердить 
                    </button>
                  </div>

                  <div v-if="req.isStartedProcess && req.whoAccept !== this.username.name" class="col text-end">
                    Событие находится в обработке у: <i> "{{ req.whoAccept }}" </i>
                  </div>
                </div>
                <!-- КОНЕЦ: Шаблон -->
              </li>
            </ul>
            <!-- КОНЕЦ: Входящие запросы на модерацю -->
          </div>

          <!-- АКТИВНОЕ ОТОБРАЖЕНИЕ (ЧТО ИГРАЕТ СЕГОДНЯ) -->
          <div class="tab-pane fade" id="pills-display" role="tabpanel" aria-labelledby="pills-display-tab" tabindex="0">
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
                      <div v-if="!screen.isspecial" class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" id="progress_workdays"> </div>
                      </div>
                      <div v-if="!screen.isspecial" class="d-flex w-100 justify-content-between align-items-center">
                          <div id="time_workdays"></div>
                          <div id="nameInfo_workdays"></div>
                      </div>
                      <!-- ЛАБЭЛ СУПЭШШИАЛ -->
                      <div v-if="screen.isspecial" class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" id="progress_specdays"> </div>
                      </div>
                      <div v-if="screen.isspecial" class="d-flex w-100 justify-content-between align-items-center">
                          <div id="time_specdays"></div>
                          <div id="nameInfo_specdays"></div>
                      </div>

                      <ul class="list-group display mt-1">
                        <!-- Шаблон -->
                        <li class="list-group-item">
                            <!-- СУТАНДАРДЭ ТЭМУПУЛИТЭ -->
                            <!-- 1. ПАРЫ -->
                            <div v-if="!screen.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                              <div class="col-12 col-sm-5 col-md-4 p-0"> Пары: </div>
                              <div class="col-12 col-sm-7 col-md-8 p-0">
                                <div class="d-flex w-100">
                                  
                                  <select v-model="screen.lesson" @change="this.eventList = []; screen.lesson_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)">
                                    <option selected :value="screen.lesson"> {{ screen.lesson }} </option>
                                    <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                                  </select>

                                  <button v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.lesson_change !== true" @click="openPreview('act', screen.id, { name: screen.lesson }, screen.isspecial, 'lesson')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                    </svg>
                                  </button>
                                  
                                  <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.lesson_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                                    </svg>
                                  </a>
                                
                                </div>
                              </div>
                            </div>
                            <!-- 2. ПЕРЕРЫВ -->
                            <div v-if="!screen.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                              <div class="col-12 col-sm-5 col-md-4 p-0"> Перерыв: </div>
                              <div class="col-12 col-sm-7 col-md-8 p-0">
                                <div class="d-flex w-100">

                                  <select  v-model="screen.breaktime" @change="this.eventList = []; screen.breaktime_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)">
                                    <option selected :value="screen.breaktime"> {{ screen.breaktime }} </option>
                                    <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                                  </select>

                                  <button v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.breaktime_change !== true" @click="openPreview('act', screen.id, { name: screen.breaktime }, screen.isspecial, 'breaktime')"  type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                    </svg>
                                  </button>

                                  <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.breaktime_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                                    </svg>
                                  </a>

                                </div>
                              </div>
                            </div>
                            <!-- 3. ОБЕД -->
                            <div v-if="!screen.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                              <div class="col-12 col-sm-5 col-md-4 p-0"> Обед: </div>
                              <div class="col-12 col-sm-7 col-md-8 p-0">
                                <div class="d-flex w-100">

                                  <select  v-model="screen.lunch" @change="this.eventList = []; screen.lunch_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)">
                                    <option selected :value="screen.lunch"> {{ screen.lunch }} </option>
                                    <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                                  </select>
                                  
                                  <button v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.lunch_change !== true" @click="openPreview('act', screen.id, { name: screen.lunch }, screen.isspecial, 'lunch')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                    </svg>
                                  </button>

                                  <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && screen.lunch_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                                    </svg>
                                  </a>

                                </div>
                              </div>
                            </div>

                            <!-- СУПЭШШИАЛ ТЭМУПУЛИТЭ -->
                            <div v-if="screen.isspecial" v-for="(tmp, dex) in screen.eventList" class="d-flex w-100 justify-content-between gap-1 mt-1">
                              <input v-model="screen.eventList[dex].time_to_swap" type="time" class="form-control form-select-sm" :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)">
                              <select v-model="screen.eventList[dex].name" @change="screen.eventList[dex].has_change = true;" class="form-select form-select-sm" aria-label="Default select example" :disabled="(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)">
                                <option :value="screen.eventList[dex].name" selected> {{ screen.eventList[dex].name }} </option>
                                <option v-for="tmp in templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                              </select>
                              <!-- УДАЛИТЬ -->
                              <button v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)" @click="screen.eventList.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                </svg>
                              </button>
                              <!-- ПРЕДПРОСМОТР -->
                              <button v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && tmp.has_change !== true" type="button" @click="openPreview('act', screen.id, tmp, screen.isspecial, screen.eventList[dex].time_to_swap)" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                </svg>
                              </button>
                              <!-- МИНУС ГЛАЗ -->
                              <a v-if="!(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name) && tmp.has_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                                </svg>
                              </a>
                            </div>
                            <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                            <button v-if="screen.isspecial && !(!this.activeTmp[index].isStartedProcess || screen.whoAccept !== this.username.name)" @click="addToAss(screen.eventList)" type="button" class="btn btn-outline-success btn-sm mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                              </svg>
                              Добавить
                            </button>

                            <div class="d-flex w-100 justify-content-between align-items-center gap-1 mt-2">
                                <div class="form-check form-switch">
                                    <input v-model="screen.isspecial" @click="templateSave()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault1" :disabled="true"/>
                                    <label class="form-check-label" for="flexSwitchCheckDefault1"> Особое расписание </label>
                                </div>
                            </div>
                        <!-- КОНЕЦ: Шаблон -->
                        </li>
                      </ul>
                    </div>
                    <div class="card-footer text-end">
                      <button v-if="!screen.isStartedProcess" @click="startProcess(screen, 'act')" type="button" class="btn btn-outline-success mb-1">Редактировать</button>
                      <!-- Button trigger Delete follow modal -->
                      <!-- <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteFollowModal"> Не отслеживать</button> -->
                      <div v-if="screen.isStartedProcess && (this.userProcess === screen.name || screen.whoAccept === this.username.name)" class="row justify-content-end me-1">
                        <button @click="endProcess(screen, 'act')" type="button" class="btn btn-outline-secondary col-auto me-1 mb-1"> Отмена </button>
                        <!-- Button trigger Details modal -->
                        <button v-if="screen.isspecial" @click="buttonOpen(screen, screen.eventList)"  type="button" class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button> 
                        <button v-if="!screen.isspecial" @click="buttonOpen(screen, [screen.lesson, screen.breaktime, screen.lunch])"  type="button" class="btn btn-outline-info col-auto me-1 mb-1">Просмотр</button> 
                        <!-- Button trigger Confirm modal -->
                        <button @click="triggerModal('save', screen, index)" type="button" class="btn btn-success col-auto me-1 mb-1"> Сохранить </button>
                      </div>
                      <div v-if="screen.isStartedProcess && screen.whoAccept !== this.username.name">
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
          <div class="tab-pane fade" id="pills-queue" role="tabpanel" aria-labelledby="pills-queue-tab" tabindex="0">
            <div v-if="this.acceptedList.length === 0"> Очередь на трансляцию пуста </div>
            <ul v-if="this.acceptedList.length > 0" class="list-group moder">
              <li v-for="(acc, index) in this.acceptedList" class="list-group-item">
                <!-- ШАБЛОН -->
                <!-- ИМЯ, АВТОР, КОММЕНТАРИЙ -->
                <div class="me-auto">
                  <div class="fw align-items-center">
                    <strong>{{ acc.name }}</strong> <small>(Отправил: <i>{{ acc.author }}</i>,  принял: <i>{{ acc.whoAccept }}</i>)</small>
                  </div>
                  <small class="fw align-items-center"> {{ acc.comment }} </small>
                </div>
                <!-- ЭКРАН, ДАТА УСТАНОВКИ -->
                <div class="d-flex w-100 justify-content-between gap-1 mt-2">
                  <select class="form-select" aria-label="Default select example" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                    <option selected>Кафедра К3 - основной</option>
                    <!-- <option value="1">Кафедра К3 - новости</option> -->
                  </select>
                  <input v-model="acc.date" id="startDate3" class="form-control" type="date" :value="acc.date" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)"/>
                </div>

                <!-- 1. ПАРЫ -->
                <div v-if="!acc.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                  <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                  <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                    <div class="d-flex w-100">
                      
                      <select v-model="acc.lesson" @change="this.eventList = []; acc.lesson_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                        <option selected :value="acc.lesson"> {{ acc.lesson }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>

                      <button v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.lesson_change !== true" @click="openPreview('acc', acc.id, { name: acc.lesson }, acc.isspecial, 'lesson')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>
                      
                      <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.lesson_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
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

                      <select  v-model="acc.breaktime" @change="this.eventList = []; acc.breaktime_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                        <option selected :value="acc.breaktime"> {{ acc.breaktime }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>

                      <button v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.breaktime_change !== true" @click="openPreview('acc', acc.id, { name: acc.breaktime }, acc.isspecial, 'breaktime')"  type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>

                      <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.breaktime_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
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

                      <select  v-model="acc.lunch" @change="this.eventList = []; acc.lunch_change = true;" class="form-select form-select-sm me-1" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                        <option selected :value="acc.lunch"> {{ acc.lunch }} </option>
                        <option v-for="tmp in this.templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>
                      
                      <button v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.lunch_change !== true" @click="openPreview('acc', acc.id, { name: acc.lunch }, acc.isspecial, 'lunch')" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>

                      <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && acc.lunch_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                        </svg>
                      </a>

                    </div>
                  </div>
                </div>

                <!-- СПЕЦТИП -->
                <div v-if="acc.isspecial" v-for="(tmp, dex) in acc.eventList" class="d-flex w-100 justify-content-between gap-1 mt-1">
                  <input v-model="acc.eventList[dex].time_to_swap" type="time" class="form-control form-select-sm" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                  <select v-model="acc.eventList[dex].name" @change="acc.eventList[dex].has_change = true;" class="form-select form-select-sm" aria-label="Default select example" :disabled="(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)">
                    <option :value="acc.eventList[dex].name" selected> {{ acc.eventList[dex].name }} </option>
                    <option v-for="tmp in templatesToReplace" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                  </select>
                  <!-- УДАЛИТЬ -->
                  <button v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)" @click="acc.eventList.splice(dex, 1)" type="button" class="btn btn-outline-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                    </svg>
                  </button>
                  <!-- ПРЕДПРОСМОТР -->
                  <button v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && tmp.has_change !== true" type="button" @click="openPreview('req', acc.id, tmp)" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                  </button>
                  <!-- МИНУС ГЛАЗ -->
                  <a v-if="!(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name) && tmp.has_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                    </svg>
                  </a>
                </div>
                <!-- КНОПКА "ДОБАВИТЬ" ВНУТРИ ШАБЛОНОВ ОСОБОГО ТИПА -->
                <button v-if="acc.isspecial && !(!this.acceptedList[index].isStartedProcess || acc.whoAccept !== this.username.name)" @click="addToAss(acc.eventList)" type="button" class="btn btn-outline-success btn-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                  </svg>
                  Добавить
                </button>

                <!-- ОБЩАЯ ПАНЕЛЬ -->
                <div class="row w-100 align-items-center g-1 mt-2">
                  <div class="col-12 col-sm-12 col-md mb-1 form-check form-switch">
                    <input v-model="acc.isspecial" @click="templateSave()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" :disabled="!(acc.isStartedProcess && (this.userProcess === acc.name || acc.whoAccept === this.username.name))"/>
                    <label class="form-check-label" for="flexSwitchCheckDefault"> Особое расписание </label>
                  </div>

                  <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                  <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <button @click="startProcess(acc, 'acc')" class="btn btn-outline-secondary w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                      </svg>
                      Обработать 
                    </button>
                  </div>

                  <div v-if="!acc.isStartedProcess" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <!-- Button trigger SetActive modal -->
                    <button @click="triggerModal('active', acc, index)" type="button" class="btn btn-outline-warning w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                      </svg>
                      Играть сейчас 
                    </button> 
                  </div>

                  <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.username.name)"  class="col-12 col-sm-12 col-md mb-1">
                    <button @click="endProcess(acc, 'acc')" type="button" class="btn btn-outline-secondary w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                      Отменить 
                    </button>
                    <!-- Button trigger Details modal -->
                  </div>
                  <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.username.name)"  class="col-12 col-sm-12 col-md mb-1">
                    <button v-if="acc.isspecial" @click="buttonOpen(acc, acc.eventList)" type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                    <button v-if="!acc.isspecial" @click="buttonOpen(acc, [acc.lesson, acc.breaktime, acc.lunch])" type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                    <!-- Button trigger Deny modal -->
                  </div>
                  <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.username.name)"  class="col-12 col-sm-12 col-md mb-1">
                    <button @click="triggerModal('delete', acc, index)" type="button" class="btn btn-outline-danger w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                      </svg>
                      Удалить 
                    </button>
                    <!-- Button trigger Confirm modal -->
                  </div>
                  <div v-if="acc.isStartedProcess && (this.userProcess === acc.name || acc?.whoAccept === this.username.name)"  class="col-12 col-sm-12 col-md mb-1">
                    <button @click="triggerModal('save', acc, index)" type="button" class="btn btn-success w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                        <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z"/>
                      </svg>
                      Применить 
                    </button>
                  </div>
                  <div v-if="acc.isStartedProcess && acc.whoAccept !== this.username.name" class="col text-end">
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

    <!-- КОНЕЦ: intro -->
  </div>
</template>

<script>
import toast from '../components/toasts.vue';
import detailModals from '../components/detailModals.vue';

export default {
  inject: ['getSession', 'getSocket'],
  components: {
    toast,
    detailModals,
  },
  data() {
    return {
      socket: {},
        // FULLSCREEN PREVIEW MODAL PROPS
      prevarrow: '',  nextarrow: '',  customForms: [],  currentModalPage: 0,
        // DATA FROM COMPOSE DETAILS
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

      succCallback: [],       // Callback - access :D
      errCallback: [],        // Callback - error  :(

      successMessage: null,   // Message of access callback
      infoMessage: null,      // Message of info callback
      errorMessage: null,     // Message of error callback
          
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
        // --- MODALKAS ---
      sendDetailWorkdays: '',
      sendDetailSpecial: '',
      denyModal: '',
      confirmModal: '',
      deleteModal: '',
      saveModal: '',
      dobivModal: '', 
      actModal: '',

      currentTime: null,      // Current time (for watch via toast)
      username: this.getSession(),
      format: /[`!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/
    }
  },
  methods: {
    connect() {
      this.socket = this.getSocket();
      
        // Another moderator started processing 
      this.socket.on('process:start', (data) => {
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
        } else 
          console.log('error');
      });
        // Another moderator was end processing
      this.socket.on('process:end', async (data) => {
        if (!data.name) { console.log('error'); return; }

        for (let i in this.reqList) 
          if (this.reqList[i].isStartedProcess && this.reqList[i].whoAccept === data.name) {
            this.reqList[i].isStartedProcess = false;
            this.reqList[i].inProcessing = false;
          }
        for (let i in this.activeTmp) 
          if (this.activeTmp[i].isStartedProcess && this.activeTmp[i].whoAccept === data.name) {
            this.activeTmp[i].isStartedProcess = false;
            this.activeTmp[i].inProcessing = false;
          }        
        for (let i in this.acceptedList) 
          if (this.acceptedList[i].isStartedProcess && this.acceptedList[i].whoAccept === data.name) {
            this.acceptedList[i].isStartedProcess = false;
            this.acceptedList[i].inProcessing = false;
          }
      });
        // Request was accepted by another moderator
      this.socket.on('process:confirm', async (data) => {
          // New data - уже с пометкой прерванной обработки
        let response = await fetch(`/moder/requests`, {
          method: 'GET',
            // THIS IS IMPORTANT
          headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
          })
        });
        this.allFormList = (await response.json());    

          // Утверждение 
        if (data.list === 'req') {
          for (let i in this.allFormList) 
            if (this.allFormList[i].name === data.process) 
              this.acceptedList.push(this.allFormList[i]);

          for (let i in this.reqList) 
            if (this.reqList[i].name === data.process) 
              this.reqList.splice(Number(i), 1);
          // ОБРАБОТКА ПРЕРВАНА С НОВЫМИ ДАННЫМИ
            
          // Сохранение
        } else if (data.list === 'acc') {
          let tmp; 

          for (let i in this.allFormList) 
            if (this.allFormList[i].name === data.process) 
              tmp = this.allFormList[i];

          for (let i in this.acceptedList) 
            if (this.acceptedList[i].name === data.process) 
              this.acceptedList[i] = tmp;
          // ОБРАБОТКА ПРЕРВАНА С НОВЫМИ ДАННЫМИ

        } else if (data.list === 'act') {
          let tmp; 

          for (let i in this.allFormList) 
            if (this.allFormList[i].name === data.process) 
              tmp = this.allFormList[i];

          for (let i in this.activeTmp) 
            if (this.activeTmp[i].name === data.process) 
              this.activeTmp[i] = tmp;
          // ОБРАБОТКА ПРЕРВАНА С НОВЫМИ ДАННЫМИ

        } else 
          console.log('error');
      });
        // Reduest wat denied / deleted by another moderator
      this.socket.on('process:deny', (data) => {
          // Отклонение 
        if (data.list === 'req') {
          for (let i in this.reqList) 
            if (this.reqList[i].name === data.process) 
              this.reqList.splice(Number(i), 1);

          // Удаление из утвержденных
        } else if (data.list === 'acc') {
          for (let i in this.acceptedList) 
            if (this.acceptedList[i].name === data.process) 
              this.acceptedList.splice(Number(i), 1);

        } else 
          console.log('error');
      });
        // Add new request realtime
      this.socket.on('request:new', async (data) => {
        await this.getTime();
        let response = await fetch(`/moder/requests`, {
          method: 'GET',
          headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
          })
        });
        this.allFormList = (await response.json());    

        for (let i in this.allFormList) 
          if (this.allFormList[i].name === data.request) 
            this.reqList.push(this.allFormList[i]);

        this.infoMessage = 'Редактор: ' + data.name + ' только что прислал запрос на модерацию: "' + data.request + '".';
        this.infoCallback.show();
      });
        // Another moderator or admin changed active cast
      this.socket.on('active:upd', async (data) => {
        
        for (let i in this.acceptedList) 
          if (this.acceptedList[i].name === data.name) {
            this.activeTmp = [];
            this.activeTmp.push(this.acceptedList[i]);
            this.acceptedList.splice(Number(i), 1);
          }

        await this.ProgressBar(this.activeTmp);
      });
    },
      // Start vizualize progress bar 
    ProgressBar(active) {
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

      function getPercent(curSec, bSpecial) {
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

      function getName(curSec, bSpecial) {                            // Узнать имя в зависимости от расписания
        if (!bSpecial) {                                              // Если БУДНИ
          for (let i in Lessons) {                                    // Проверяем, в каком промежутке находимся
            if (curSec >= Lessons[i][0] && curSec < Lessons[i][1]) {  // Если попадаем в один из заданных промежутков
              return Lessons[i][2];                                   // Возвращаем наименование промежутка
            }
          }
          return 'Свободное время';                                   // Иначе возвращаем "Свободное время"
        } else return 'Особое расписание';                            // Если СПЕЦИАЛЬНОЕ РАСПИСАНИЕ
      }                                                               // возвращаем "Особое расписание"

      function WhatTime() {                                           // Узнать время в секундах с начала дня
        let today = new Date();                                       // Получить текущее время и вернуть значение в секнудах
        return  (today.getHours() * 60 + today.getMinutes()) * 60 + today.getSeconds();
      }

      function checkTime(i) {                                         // Преобразовать время к презентабельному виду
        if (i < 10) { i = '0' + i; }                                  // Если < 10 то добавить перед цифрой "0" для красоты
        return i;
      }

      function startTime(active) {
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

      async function refreshAt(hours, minutes, seconds, active) {
        let now = new Date();
        let then = new Date();

        if ( now.getHours() > hours ||
            (now.getHours() === hours && now.getMinutes() > minutes) ||
            (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() >= seconds)
        ) {
          then.setDate(now.getDate() + 1);
        }
        then.setHours(hours); then.setMinutes(minutes); then.setSeconds(seconds);
          // Установка тайм-аута до следующего вызова
        let timeout = then.getTime() - now.getTime();
        setTimeout(async function () {
            // Подстановка надписи в элемент при обновлении надписи

            for (let i in active) {
              if (!active[i].isspecial) {
                document.getElementById('nameInfo_workdays').innerHTML = getName(WhatTime(),false);
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
      setTimeout(async function () {
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
      // Updete time property for sent into toast
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
      // Updated data 
    async getRequests() {
      this.sendDetailWorkdays = new bootstrap.Modal(document.getElementById('detailsWorkdaysModal'));
      this.sendDetailSpecial = new bootstrap.Modal(document.getElementById('detailsSpecialModal'));
      this.denyModal = new bootstrap.Modal(document.getElementById('denyModal'));
      this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
      this.dobivModal = new bootstrap.Modal(document.getElementById('dobivModal'));
      this.saveModal = new bootstrap.Modal(document.getElementById('saveModal'));
      this.deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      this.actModal = new bootstrap.Modal(document.getElementById('activeModal'));
      this.fullscreenModal = new bootstrap.Modal(document.getElementById('PreviewModal'));

      this.succCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
      this.errCallback = new bootstrap.Toast(document.getElementById("ToastError"));
      this.infoCallback = new bootstrap.Toast(document.getElementById("ToastInfo"));

      let response = await fetch(`/moder/requests`, {
        method: 'GET',
          // THIS IS IMPORTANT
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
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
          if (this.reqList[i].whoAccept === this.username.name) {
            this.userProcess = this.reqList[i].name;
          }
        }
      }
    },
      // Switch processig where started or ended processing 
    async switchProcess(name) {
      await fetch(`/moder/switchprocess`, this.options('PATCH', { name: name }));
      // this.reqList[name].whoAccept = (await response.json()).whoAccept;
    },
      // Start processing (update data & emit)
    async startProcess(obj, list) {
      await this.getTime();
      if (this.userProcess === '' && !obj.isStartedProcess) {
        const data = {
          list: list,
          process: obj.name,
          user: this.username.name
        }
          // Update processing data send to all moderators
        this.socket.emit('new-process', data);

          // User's templates + templates from current request sended by editor
        let templates = await fetch(` /moder/alltmp`, this.options('PATCH', { name: obj.name })) ;
        this.templatesToReplace = (await templates.json());

        obj.isStartedProcess = true;
        obj.whoAccept = this.username.name;
        let name = obj.name;
        await this.switchProcess(name);
        this.userProcess = name;

        document.querySelectorAll('[data-bs-toggle="popover"]')
          .forEach(popover => {
            new bootstrap.Popover(popover)
          });

      } else {
          // Processing already stardet
		    this.sayToUser('error', 'Вы можете обрабатывать максимум одно событие! Сначала завершите текущую обработку.');
      }
    },
      // Завершить процесс обработки
    async endProcess(obj, list) {
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
        name: this.username.name
      }
        // Обновление данных об обработках у других модераторов
      this.socket.emit('end-process', data);
    },
      // Загрить модалку
    async triggerModal(type, obj, index) {
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
          // Угрозы
      }
    },
      //  Утверждение расписания
    async buttonAccess(struct) {
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
        let message = (await response.json());
        if (message.message !== 'errdate') {
          this.reqList[struct.index].isStartedProcess = false;
          this.reqList[struct.index].isAccepted = true;
          this.acceptedList.push(this.reqList[struct.index]);
          this.reqList.splice(struct.index, 1);

          this.sayToUser('success', 'Запрос "' + struct.name + '" был успешно утвержден.');
          this.confirmModal.hide();

          const data = {
            list: 'req',
            process: struct.name,
            user: this.username.name
          }
          this.socket.emit('con-process', data);

          let newDate = new Date();
          let DAY = (newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate();
          let MONTH = (Number(Number(newDate.getMonth()) + 1) < 10) ? '0' + Number(Number(newDate.getMonth()) + 1) : Number(Number(newDate.getMonth()) + 1);
          let YEAR = newDate.getFullYear();

          if (struct.obj.date === YEAR + '-' + MONTH + '-' + DAY) this.dobivModal.show();
          else this.clearUserProcessData();
        } else
          this.sayToUser('error', 'Уже существует утвержденное событие на этот день.');
      } else
		    this.sayToUser('error', 'Некорректный параметр. Начните обработку корректно.');
    },
      // Отклонение расписания
    async buttonDeny(struct) {
      if (this.userProcess !== '') {
        // let response =
            await fetch(`/moder/deny`, this.options('PUT', { name: struct.name, comment: struct.comment }));
        this.reqList.splice(struct.index, 1);

        const data = {
          list: 'req',
          process: struct.name,
          user: this.username.name
        }
        this.socket.emit('del-process', data);

		this.sayToUser('success', 'Запрос "' + struct.name + '" был успешно отклонен.');
        this.denyModal.hide();
		this.clearUserProcessData();

      } else
		this.sayToUser('error', 'Некорректный параметр. Начните обработку корректно.');
    },
      // Удаление шаблона трансляции из очереди
    async buttonDelete(struct) {
      if (this.userProcess !== '') {
        // let response =
        await fetch(`/moder/deny`, this.options('PUT', { name: struct.name, comment: struct.comment }));
        this.acceptedList.splice(struct.index, 1);

        const data = {
          list: 'acc',
          process: struct.name,
          user: this.username.name
        }
        this.socket.emit('del-process', data);
		this.sayToUser('success', 'Запрос "' + struct.name + '" был успешно удален.');
        this.deleteModal.hide();
		this.clearUserProcessData();

      } else
		this.sayToUser('error', 'Некорректный параметр. Начните обработку корректно.');
    },
      // Сохранение изменений в шаблоне на очереди или в активном
    async buttonSave(struct) {
      if (this.userProcess !== '') {
        if (struct.obj.isspecial) {
          struct.obj.breaktime = struct.obj.lesson;
          struct.obj.lunch = struct.obj.lesson;
        }
          // Сохранение изменний - Утверждение - Редактирование активной трансляции
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
		      this.sayToUser('success', 'В запрос "' + struct.name + '" успешно внесены изменения.');

          const data = {
            list: 'acc',
            process: struct.name,
            user: this.username.name
          }
          this.socket.emit('con-process', data);
          this.acceptedList[struct.index].isStartedProcess = false;

        } else {
		      
          this.sayToUser('success', 'В активную трансляцию успешно внесены изменения.');
          const data = {
            list: 'act',
            process: struct.name,
            user: this.username.name
          }
          this.socket.emit('con-process', data);
          this.socket.emit('upd-active', { name: struct.name });

          this.activeTmp[struct.index].isStartedProcess = false;
        }

        this.saveModal.hide();
		    this.clearUserProcessData();

      } else
		    this.sayToUser('error', 'Некорректный параметр. Начните обработку корректно.');
    },
      // Details - ОТКРЫТЬ СОДЕРЖИМОЕ ШАБЛОНА (СПИСКИ СОБЫТИЙ)
    async buttonOpen(obj, tmpList) {
      if (!this.forModal.withChanges) {
        let response = await fetch(`/moder/details`, this.options('PATCH', { id: obj.id, tmpList }));
        this.eventList = (await response.json());
      }

      this.currentModalPage = 0;
      
      if (this.eventList.type === false) {
        this.editFormS = [];
        this.editFormB = [];
        this.editFormL = [];

        if (this.eventList.data.lesson !== '-')
          for (let i in this.eventList.data.lesson) {
            if (!this.editFormS[i]) this.editFormS[i] = {}
              this.editFormS[i].isDisabled = true;
          }

        if (this.eventList.data.breaktime !== 'lesson')
          for (let i in this.eventList.data.breaktime) {
            if (!this.editFormB[i]) this.editFormB[i] = {}
            this.editFormB[i].isDisabled = true;
          }

        if (this.eventList.data.lunch !== 'lesson' && this.eventList.data.lunch !== 'breaktime')
          for (let i in this.eventList.data.lunch) {
          if (!this.editFormL[i]) this.editFormL[i] = {}
            this.editFormL[i].isDisabled = true;
          }
        this.sendDetailWorkdays.show();
      } else {
        // Forms for templates with slots for events
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
      // Save template corrections
    async templateSave() {
          // 1. Форма не должна быть "испорчена" - возможно нарочное удаление структуры [.data]
          // 2. При внесении изменений в шаблон любого типа хотя бы в одной из форм должны быть события
          //    (невозможно сохранить, удалив все события из всех шаблонов, поскольку такой запрос нет смысла утверждать)
      this.forModal.withChanges = true;
      if (this.eventList.type === true)
      this.forModal.upd_tmp_list = this.eventList.data;
      else {
        this.forModal.upd_less = this.eventList.data.lesson;
        this.forModal.upd_break = this.eventList.data.breaktime;
        this.forModal.upd_lunch = this.eventList.data.lunch;
      }
    },
      // Set Active Now button
    async setActive(req) {
      if (!req.obj.isAccepted) {
        console.log('ERROR!');
        return;
      }

      let response = await fetch(`/moder/setactive`, this.options('PATCH', { name: req.name }));
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

        // Обновление данных об обработках у других модераторов
      this.socket.emit('upd-active', { name: req.name });
      
      this.successMessage = 'Запрос "' + req.name + '" был успешно установлен на воспроизведение.';
      this.succCallback.show();
      this.actModal.hide();
      this.userProcess = '';

      setTimeout(this.ProgressBar(this.activeTmp), 1000);
    },

      // Add tmp into req/acc/act program
    addToAss(list) {
      list.push({
      id: 0,
      name: '- Выберите -',
      time_to_swap: '00:00'
      });
    },
      // Очистка данных из объекта для работы с запросами
    clearUserProcessData() {
      this.userProcess = '';
      this.forModal.withChanges = false;
      this.forModal.upd_less = [];
      this.forModal.upd_break = [];
      this.forModal.upd_lunch = [];
      this.forModal.upd_tmp_list = [];
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
        this.errorMessage = message;
        this.errCallback.show();
        break;
      case 'info':
      default:
        this.infoMessage = message;
        this.infoCallback.show();
      }
    },

      // Работа со списками событий внутри шаблонов
    async addEvent(form, data) {
      if (!(this.addForm.name !== "" && (this.addForm.src !== ""))) {
        this.sayToUser('error', 'Пожалуйста, заполните все поля перед добавлением.');
        return;
      }

      if (this.addForm.name.length > 50)
        this.sayToUser('error',
          'Полученно слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + this.addForm.name.length);
      else if (!Number.isFinite(this.addForm.time) || this.addForm.time < 0)
        this.sayToUser('error',
          'Полчено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
      else if (this.format.test(this.addForm.name))
        this.sayToUser('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
      else {
      // ----- CORRECT PROCESSING ----
      // if (Number(this.addForm.type) === 1) {
      //     // Обработка файла загрузки
      //
      // }
      // Обработка URL-адреса
      form.push({isDisabled: true});
      data.push(this.addForm);
      this.addForm = {name: "", src: "", type: 0, time: 15, isActive: true}
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
    async saveEvent(index, form) {
      form[index].isDisabled = true;
    },
    async moveEvent(move, index, data) {
      let id1 = index;
      let id2 = null;
      if (move === "down" && id1 !== data.length-1)  id2 = id1++;
      if (move === "up" && id1 !== 0)  id2 = id1--;
      if (id2 !== null) this.correctArr(data, [id1, id2]);

    },
    correctArr(_arr, _param){
      /*
          коррекция  элементов массива по паре индекса
          *    _arr -- массив требующий коррекции
          *   _param -- пара [n1,n2] -- индексы массива для взаимной  перестановки
      */
      _arr[_param[1]] = _arr.splice(_param[0],1, _arr[_param[1]])[0]
    },
    switchPage(prevOrNext) {
      if (prevOrNext === 'next') {
        if (this.composeDetailsModal.numberOfCurrentEvent < this.composeDetailsModal.numberOfEvents)
          this.composeDetailsModal.numberOfCurrentEvent += 1;
      } else {
        if (this.composeDetailsModal.numberOfCurrentEvent > 1)
          this.composeDetailsModal.numberOfCurrentEvent -= 1;
      }
    },
    async endAllProcesses() {
      await fetch(`/moder/endprocess`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
        },
        body: JSON.stringify({ name: this.username.name }),
      });
        // Завершение процесса обработки у всех модераторов
      this.socket.emit('end-process', { name: this.username.name });
      for (let i in this.reqList) 
        if (this.reqList[i].isStartedProcess && this.reqList[i].name === this.userProcess) {
          this.reqList[i].isStartedProcess = false;
          this.reqList[i].inProcessing = false;
        }
      
      for (let i in this.activeTmp) 
        if (this.activeTmp[i].isStartedProcess && this.activeTmp[i].name === this.userProcess) {
          this.activeTmp[i].isStartedProcess = false;
          this.activeTmp[i].inProcessing = false;
        }
      
      for (let i in this.acceptedList) 
        if (this.acceptedList[i].isStartedProcess && this.acceptedList[i].name === this.userProcess) {
          this.acceptedList[i].isStartedProcess = false;
          this.acceptedList[i].inProcessing = false;
        }
      this.clearUserProcessData();
	    this.sayToUser('success', 'Все обработки успешно завершены.');
    },

    // Preview of program template
	  /**
	   * from - list of compose (acc/req/act)
	   * id_req - request's id
	   * special - parameter 'isspecial' from composes
	   * tmp - object of template from compose
	  */
    async openPreview(from, id_req, tmp, special, timeOrStep) {
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
        this.sayToUser('error', response.msg);
        return;
      }

      this.composeDetailsModal.previewEvents = response.events;
      this.composeDetailsModal.numberOfEvents = response.events.length;
      this.composeDetailsModal.nameOfCurrentEvent = response.events[0].name;
      this.composeDetailsModal.numberOfCurrentEvent = response.events.length === 0 ? 0 : 1;

      this.fullscreenModal.show();
    },

      // Hide text near arrows on small mobile devices
    resizeTextEdit() {
      if (window.innerWidth > 768) {
        this.prevarrow = 'Предыдущее событие'; 
        this.nextarrow = 'Следующее событие';
      } else {
        this.prevarrow = '';
        this.nextarrow = '';
      }
    },
    getArrowText() {
      window.addEventListener('resize', this.resizeTextEdit, true);
    },

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
  },
  mounted() {
    this.connect();
    this.getRequests(); 
    this.resizeTextEdit();
    this.ProgressBar(this.activeTmp);
    
    window.addEventListener('beforeunload', async (event) => {
      await fetch(`/moder/endprocess`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
        },
        body: JSON.stringify({ name: this.username.name }),
      });

      this.socket.emit('end-process', { name: this.username.name });

      event.preventDefault();
      event.returnValue = '';
    });
  }
}
</script>