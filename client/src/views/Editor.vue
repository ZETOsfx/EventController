<template>
  <div class="intro">
    <div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="Canva" aria-labelledby="staticBackdropLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">Выберите файл</h5>
            <button @click="closeCanvas()" type="button" class="btn-close"></button>
        </div>
        <div class="input-group flex-nowrap pt-0 pb-0 ps-3 pe-3">
            <span class="input-group-text" id="addon-wrapping">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
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
                                <p class="card-text m-0"> {{ file.author }}
                                    <small class="text-body-secondary ms-1"> {{ file.unlim ? 'Бессрочно' : 'До: ' + file.actual }} </small>
                                </p>
                            </div>

                            <div class="col-auto">
                                <button type="button" class="btn btn-outline-secondary btn-sm me-1" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path>
                                    </svg>
                                </button>
                                <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                    Выбрать
                                </button>
                            </div>
                        </div>
                    </small>
                    <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;">
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
            <div v-for="file in filesImg">
                <div class="card mb-2">
                    <small class="card-header">
                        <div class="row justify-content-between align-items-center">
                            <div class="col-auto align-items-center">
                                <p class="card-text m-0"> {{ file.author }}
                                    <small class="text-body-secondary ms-1"> {{ file.unlim ? 'Бессрочно' : 'До: ' + file.actual }} </small>
                                </p>
                            </div>

                            <div class="col-auto">
                                <button type="button" class="btn btn-outline-secondary btn-sm me-1" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path>
                                    </svg>
                                </button>
                                <button @click="selectFile(file)" type="button" class="btn btn-success btn-sm">
                                    Выбрать
                                </button>
                            </div>
                        </div>
                    </small>
                    <img :src="file.src" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;">
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
            <div v-for="file in filesClip">
                <div class="card mb-2">
                    <small class="card-header">
                    <div class="row justify-content-between align-items-center">
                        <div class="col-auto align-items-center">
                        <p class="card-text m-0">Малашин А.А.
                            <small class="text-body-secondary ms-1"> До: 01.04.2023 </small>
                        </p>
                        
                        </div>
                        <div class="col-auto">
                        <button type="button" class="btn btn-outline-secondary btn-sm me-1" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path>
                            </svg>
                            <button type="button" class="btn btn-success btn-sm">
                            Выбрать
                            </button>
                        </button>
                        </div>
                    </div>
                    </small>
                    <img src="https://i.ytimg.com/vi/MdTuact6xmY/maxresdefault.jpg" style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;">
                    <div class="card-body">
                    <h6 class="card-title m-0">bmstu.jpg 
                        <small class="text-body-secondary ms-1"> (954 kb) </small>
                    </h6>
                    </div>
                </div>
            </div>
        </div>
      </div> 
    </div>

    <!-- Группировка toasts --> 
    <toast :time="currentTime" :successCb="successMessage" :errorCb="errorMessage" :infoCb="infoMessage"></toast>

    <!--Группировка модалки-->
    <detailModals :eventList="eventList" :editFormS="editFormS" :editFormB="editFormB" :editFormL="editFormL"
      :addForm="addFormCmp" :addEventCmp="addEventCmp" :saveEventCmp="saveEventCmp" :delEventCmp="delEventCmp"
      :moveEventCmp="moveEventCmp" :templateSave="templateSave" :currentModalPage="currentModalPage"
      :customForms="customForms" :editEventCmp="editEventCmp"> </detailModals>

    <!-- Modal for Save template -->
    <div class="modal fade" id="ModalSave" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Подтверждение сохранения</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Вы собираетесь сохранить изменения в шаблоне "{{ tmpName }}". <br> Вы уверены?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button class="btn btn-success" @click="saveChanges" @keyup.enter="saveChanges">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Delete template -->
    <div class="modal fade" id="ModalDelete" tabindex="-1" aria-hidden="true"  >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Подтверждение удаления</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Вы собираетесь удалить шаблон "{{ tmpName }}". <br> Вы уверены?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button @click="delTmp(tmpName)" @keyup.enter="delTmp(tmpName)" class="btn btn-danger" data-bs-dismiss="modal">Удалить</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Delete compose -->
    <div class="modal fade" id="ModalDelcmp" tabindex="-1" aria-hidden="true"  >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Подтверждение удаления</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Вы собираетесь удалить программу. <br> Вы уверены?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button @click="deleteCmp(this.CMP_ID)" @keyup.enter="deleteCmp(this.CMP_ID)" class="btn btn-danger" data-bs-dismiss="modal">Удалить</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Send compose -->
    <div class="modal fade" id="ModalSend" tabindex="-1" aria-hidden="true"  >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Подтверждение отправки</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Для отправки на модерацию необходимо заполнить поля для модератора. <br><br> Пожалуйста, заполняйте поля адекватно и корректно, поскольку модератор увидит те данные и информацию, которые вы укажете. <br><br>
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Название:</label>
                <input @keyup.enter="sendCompose(this.CMP_ID, this.CMP_NAME, this.CMP_COMM); this.modalSend.hide()" v-model="CMP_NAME" type="text" class="form-control" id="recipient-name" placeholder="Заголовок трансляции"/>
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Комментарий:</label>
                <textarea @keyup.enter="sendCompose(this.CMP_ID, this.CMP_NAME, this.CMP_COMM); this.modalSend.hide()" v-model="CMP_COMM" class="form-control" id="message-text" placeholder="Не обязательно"></textarea>
              </div>
            </form>
          </div>

          <div class="modal-footer row justify-content-between">
            <div class="col-12 col-sm-auto">
              <input v-model="cmpDateSend" id="startDate" class="form-control" type="date"/>
            </div>
            <div class="col-12 col-sm-auto">
              <div class="row gap-1 m-0">
                <button class="btn btn-secondary col-12 col-sm-auto" data-bs-dismiss="modal">Отмена</button>
                <button @click="sendCompose(this.CMP_ID, this.CMP_NAME, this.CMP_COMM)" class="btn btn-success col-12 col-sm-auto">Отправить</button>
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
            Поля "Название" и "Комментарий" служат заметками. <br> Их не будет видеть модератор или кто-либо еще. <br> Здесь можно записать важную для себя информацию.  <br> Данная композиция будет доступна только вам. <br><br>
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Название:</label>
                <input v-model="nameProg" type="text" class="form-control" id="recipient-name" placeholder="Заголовок трансляции"/>
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Комментарий:</label>
                <textarea v-model="commProg" class="form-control" id="message-text" placeholder="Не обязательно"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">

            <!-- Стандартное расписание -->
            <div v-if="!specProg" class="d-flex w-100 justify-content-between align-items-center gap-1">
              Пары:
              <select v-model="programList[0]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                <option value="-" selected>- Нет изменений -</option>
                <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
              </select>
            </div>
            <div v-if="!specProg" class="d-flex w-100 justify-content-between align-items-center gap-1">
              Перерыв:
              <select v-model="programList[1]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                <option value="-" selected>- Нет изменений -</option>
                <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
              </select>
            </div>
            <div v-if="!specProg" class="d-flex w-100 justify-content-between align-items-center gap-1">
              Обед:
              <select v-model="programList[2]" class="form-select form-select-sm w-75" aria-label=".form-select-sm example">
                <option value="-" selected>- Нет изменений -</option>
                <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
              </select>
            </div>

            <div v-if="specProg" v-for="(program, index) in this.programList" class="d-flex w-100 justify-content-between gap-1">
              <input v-model="this.programTimes[index]" type="time" class="form-control form-select-sm">
              <select v-model="this.programList[index]" class="form-select form-select-sm" aria-label="Default select example">
                <option value="-" selected>- Не выбрано -</option>
                <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
              </select>
              <button @click="deleteTmpFromSpecial(index)" type="button" class="btn btn-outline-danger btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                </svg>
              </button>
            </div>

            <button v-if="specProg" @click=" addTmpToSpecial()" type="button" class="btn btn-outline-success btn-sm w-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
              </svg>
              Добавить
            </button>

            <div class="d-flex w-100 justify-content-between gap-1">
              <select v-model="screenProg" class="form-select" aria-label="Default select example">
                <option selected value="1">Кафедра К3 - основной</option>
              </select>
            </div>
            <div class="row w-100 justify-content-between align-items-center">
              <div class="col form-check form-switch">
                <input v-model="specProg" @click="changeType()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                <label class="form-check-label" for="flexSwitchCheckDefault">Особое расписание</label>
              </div>
                <button type="button" class="btn col btn-outline-secondary" data-bs-dismiss="modal"> Отмена </button>
                <button @click="composeTemplate(this.specProg)" type="button" class="btn col btn-success ms-2"> Собрать </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for New template name -->
    <div class="modal fade" id="ModalNameTmp" tabindex="-1" aria-hidden="true"  >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Создать новый шаблон</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Укажите название шаблона:
            <div class="ps-0 mt-2 col-12">
              <input v-if="['empty', 'default'].includes(this.forModal.newType)" v-model="newNameOrig" @keyup.enter="addTmp(newNameOrig, this.forModal.newType, [])" id="name" name="name" type="text" class="form-control" placeholder="Имя шаблона">
			        <input v-if="this.forModal.newType === 'copy'" v-model="newNameOrig" @keyup.enter="addTmp(newNameOrig, this.forModal.newType, this.events)" id="name" name="name" type="text" class="form-control" placeholder="Имя шаблона">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button v-if="this.forModal.newType === 'empty'" class="btn btn-success" @click="addTmp(newNameOrig, this.forModal.newType, [])">Создать пустой</button>
            <button v-if="this.forModal.newType === 'default'" class="btn btn-success" @click="addTmp(newNameOrig, this.forModal.newType, [])">Создать по умолчанию</button>
            <button v-if="this.forModal.newType === 'copy'" class="btn btn-success" @click="addTmp(newNameOrig, this.forModal.newType, this.events)">Создать копию</button>
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
                  <div v-if="this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:red">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                    </svg>
                    ИЗМЕНЕНИЯ НЕ СОХРАНЕНЫ
                  </div>
                  <div v-if="!this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                    </svg>
                    ИЗМЕНЕНИЯ СОХРАНЕНЫ
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
      <h6 class="text mt-4"> Работа с трансляцией </h6>
      <!-- Вкладки -->
      <div class="content">
        <ul class="nav nav-pills mb-0" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="pills-templates-tab" data-bs-toggle="pill" data-bs-target="#pills-templates" type="button" role="tab" aria-selected="true">Работа с шаблонами</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="pills-composed-tab" data-bs-toggle="pill" data-bs-target="#pills-composed" type="button" role="tab"  aria-selected="false">Скомпанованные программы</button>
            </li>
        <!-- КОНЕЦ: Вкладки -->
        </ul>
      </div>
      <!-- СОДЕРЖИМОЕ ВКЛАДОК -->
      <div class="tab-content" id="pills-tabContent">
        
        <!-- ШАБЛОНЫ -->
        <div class="tab-pane fade show active" id="pills-templates" role="tabpanel" aria-labelledby="pills-templates-tab" tabindex="0"> 
          <div class="content">
            <div class="row ms-0 me-0 mt-0 gx-2 justify-content-between">
              <div class="col-12 col-sm-12 col-md-12 col-lg-7">
                <div class="input-group ms-0 me-0 mb-2">
                  <!-- v-for="tmp in this.tmpList" -->
                  <select v-model="tmpName" class="form-select" id="inputGroupSelect04" @keyup.enter="getTmp(this.tmpName)">
                      <option value="-" selected>- Выберите -</option>
                      <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                  </select>
                  <button @click="getTmp(this.tmpName)" class="btn btn-success" type="button">Открыть</button>
                </div>
              </div>

              <div v-if="canEdit || isAuthor" class="col-12 col-sm-12 col-md-5 col-lg-2">
                <div v-if="canEdit || isAuthor" class="row mt-0 gx-2">

                  <!-- Button trigger Delete modal -->
                  <div class="col-12 mb-2">
                    <button v-if="isAuthor" type="button" class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#ModalDelete" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                      </svg>
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="col-12 col-sm-12 col-md-7 col-lg-3 mb-2">
                <!-- Button trigger Send modal -->
                <button type="button" class="btn btn-success w-100" @click="composeForm()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stack" viewBox="0 0 16 16">
                    <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z"/>
                    <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z"/>
                  </svg>
                Скомпоновать  
                </button>
              </div>

              <div class="row ms-0 me-0 mt-0 gx-2">
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

              <!-- SWITCHES -->
              <div v-if="isGet" class="d-flex w-100 justify-content-start align-items-center gap-3 mt-1">
                <!-- SWITCH - Видимость -->
                <div v-if="isAuthor" class="form-check form-switch mt-1">
                    <input @click="this.composeDetailsModal.withChanges = true;" class="form-check-input" type="checkbox" role="switch" v-model="canView" :checked="canView">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Разрешить просматривать другим</label>
                </div>
                <!-- SWITCH - Реактирование -->
                <div v-if="canView && isAuthor" class="form-check form-switch mt-1">
                    <input @click="this.composeDetailsModal.withChanges = true;" class="form-check-input" type="checkbox" role="switch" v-model="canEdit" :checked="canEdit">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Разрешить редактировать другим</label>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isGet" class="content">
            <div class="row gx-2 gy-2 align-items-center">
              <div class="col-12">
                <div class="row justify-content-start">
                  <div v-if="this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:red">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                    </svg>
                    ИЗМЕНЕНИЯ НЕ СОХРАНЕНЫ
                  </div>
                  <div v-if="!this.composeDetailsModal.withChanges" class="col-auto m-0" style="color:green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                    </svg>
                    ИЗМЕНЕНИЯ СОХРАНЕНЫ
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
                    <button type="button" class="btn btn-success w-100"  @click="checkIssues">Сохранить</button>
                  </div>
                  <div class="col">
                    <button @click="openPreview('tmp')" type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#PreviewModal"> Предпросмотр </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-for="(event, index) in events" class="row gx-2 gy-2 align-items-center p-1">
              <!-- ИНПУТ НА ИМЯ -->
              <div v-if="!editForm[index].isDeleted" @click="this.clickDebian(editForm[index].isDisabled)" class="col-12 col-sm-4 col-md-4 col-lg-3">
                <label class="visually-hidden" for="specificSizeInputName1">Name</label>
                <input v-model="event.name"  class="form-control" id="specificSizeInputName1" placeholder="Имя"
                        :disabled="editForm[index].isDisabled">
              </div>
              <!-- ССЫЛКА -->
              <div v-if="!editForm[index].isDeleted && !editForm[index].isDisabled && event.type === 1" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <label class="visually-hidden" for="specificSizeInputGroupUsername1">Username</label>
                <input v-model="event.src" type="text" class="form-control" id="specificSizeInputGroupUsername1"
                        placeholder="Ссылка">
              </div>
              <!-- ФАЙЛ -->
              <div v-if="!editForm[index].isDeleted && !editForm[index].isDisabled && event.type !== 1" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <div class="hstack gap-1">
                  <input class="form-control" type="text" :value="event.src.split('--')[1]" disabled>
                  <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                  <button class="btn btn-outline-success" type="button" @click="openCanvas(events[index], -1, types[event.type], true)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                    </svg>
                  </button>
                  <div v-if="event.src.split('--')[1]" class="vr"></div>
                  <button v-if="event.src.split('--')[1]" @click="clearFile(event)" type="button" class="btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- ПРОСМОТР -->
              <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <a type="button" class="btn btn-outline-info w-100" :href="event.src" target="_blank" rel="noopener noreferrer"> Просмотр </a>
              </div>
              <!-- СЕЛЕКТОР НА ТИП -->
              <div v-if="!editForm[index].isDeleted" @click="this.clickDebian(editForm[index].isDisabled)" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                <select v-model="event.type" class="form-select" id="specificSizeSelect" :disabled="editForm[index].isDisabled">
                  <option value="0">Изображение</option>
                  <option value="1">WEB-форма</option>
                  <option value="2">Видео</option>
                </select>
              </div>
              <!-- ИНПУТ НА ВРЕМЯ -->
              <div v-if="!editForm[index].isDeleted" @click="this.clickDebian(editForm[index].isDisabled)" class="col-12 col-sm-2 col-md-2 col-lg-1">
                <label class="visually-hidden" for="specificSizeInputGroupUsername2">Username</label>
                <input v-model="event.time" type="number" class="form-control" id="specificSizeInputGroupUsername2" placeholder="Время в сек" :disabled="editForm[index].isDisabled">
              </div>
              <!-- КНОПКА РЕДАКТИРОВАТЬ -->
              <div v-if="!editForm[index].isDeleted && (canEdit || isAuthor)" class="col-auto">
                <button v-if="!editForm[index].isDeleted && editForm[index].isDisabled" @click="editEvent(index)" class="btn btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                  </svg>
                  <!-- Редактировать -->
                </button>
                <!-- СОХРАНИТЬ / УДАЛИТЬ -->
                <template v-if="!editForm[index].isDisabled">
                  <button @click="saveEvent(index)" class="btn btn-secondary"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card" viewBox="0 0 16 16">
                      <path d="M6.25 3.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2zm2 0a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2z"/>
                      <path fill-rule="evenodd" d="M5.914 0H12.5A1.5 1.5 0 0 1 14 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5V3.914c0-.398.158-.78.44-1.06L4.853.439A1.5 1.5 0 0 1 5.914 0zM13 1.5a.5.5 0 0 0-.5-.5H5.914a.5.5 0 0 0-.353.146L3.146 3.561A.5.5 0 0 0 3 3.914V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-13z"/>
                    </svg>
                    <!-- Сохранить  -->
                  </button>
                  <button @click="delEvent(index)" class="btn btn-outline-danger ms-1"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                    <!-- Удалить  -->
                  </button>
                </template>
              </div>
              <!-- ВВЕРХ -->
              <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled && (canEdit || isAuthor)" class="col-auto">
                <button @click="moveEvent('up', index)" class="btn btn-outline-warning"><i class="fa-solid fa-up"></i></button>
              </div>
              <!-- ВНИЗ -->
              <div v-if="!editForm[index].isDeleted && editForm[index].isDisabled && (canEdit || isAuthor)" class="col-auto">
                <button @click="moveEvent('down', index)" class="btn btn-outline-warning"><i class="fa-solid fa-down"></i></button>
              </div>
            </div>
            <!--ФОРМА ДОБАВЛЕНИЯ!!!!!!!!!-->
            <div v-if="canEdit || isAuthor" class="row gx-2 gy-2 align-items-center p-1">
              <div class="col-12 col-sm-4 col-md-4 col-lg-3">
                <label class="visually-hidden" for="specificSizeInputName">Name</label>
                <input v-model="addForm.name" type="text" class="form-control" id="specificSizeInputName" placeholder="Имя" required>
              </div>

              <div v-if="addForm.type === 1" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <label class="visually-hidden" for="specificSizeInputGroupUsername3">Username</label>
                <input v-model="addForm.src" type="text" class="form-control" id="specificSizeInputGroupUsername3" placeholder="Ссылка" required>
              </div>

              <!-- ФАЙЛ -->
              <div v-if="addForm.type !== 1" class="col-12 col-sm-3 col-md-3 col-lg-2">
                <div class="hstack gap-1">
                  <input class="form-control" type="text" :value="addForm.src.split('--')[1]" disabled>
                  <!-- ВОТ ТУТ КНОПКА ВЫБОРА - ОТКРЫТИЯ OFFCANVAS (Сам он выше, на 2 строчке) -->
                  <button class="btn btn-outline-success" type="button" @click="openCanvas(addForm, -1, types[addForm.type], true)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2-open" viewBox="0 0 16 16">
                      <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"/>
                    </svg>
                  </button>
                  <div v-if="addForm.src.split('--')[1]" class="vr"></div>
                  <button v-if="addForm.src.split('--')[1]" @click="clearFile(addForm)" type="button" class="btn btn-outline-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="col-12 col-sm-3 col-md-3 col-lg-2">
                <label class="visually-hidden" for="specificSizeSelect">Preference</label>
                <select v-model="addForm.type" class="form-select" id="specificSizeSelect">
                  <option value="0" selected>Изображение</option>
                  <option value="1">WEB-форма</option>
                  <option value="2">Видео</option>
                </select>
              </div>

              <div class="col-12 col-sm-2 col-md-2 col-lg-1">
                <label class="visually-hidden" for="specificSizeInputGroupUsername">Username</label>
                <input v-model="addForm.time" type="number" class="form-control" id="specificSizeInputGroupUsername" placeholder="Время в сек" required>
              </div>

              <div class="col-auto">
                <button @click="addEvent()" type="submit" class="btn btn-success">Добавить</button>
              </div>

            </div>
            <br>
          </div>
        </div>

        <!-- СКОМПАНОВАННЫЕ ПРОГРАММЫ ТРАНСЛЯЦИИ -->
        <div class="tab-pane fade" id="pills-composed" role="tabpanel" aria-labelledby="pills-composed-tab" tabindex="0">
          <div v-if="this.composes.length === 0" class="content"> У вас нет скомпанованных программ </div>
          <div v-if="this.composes.length > 0" class="content">
            <ul class="list-group">
              <li v-for="(cmp, index) in this.composes" class="list-group-item">
                <!-- ЗАГОЛОВОК, КОММЕНТ -->
                <div class="me-auto">
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
                <div v-if="!cmp.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                  <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Пары: </div>
                  <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                    <div class="d-flex w-100">
                      <select v-model="cmp.lesson" @change="this.eventList = []; cmp.lesson_change = true;" class="form-select form-select-sm me-1" :disabled="cmp.lock">
                        <option selected :value="cmp.lesson"> {{ cmp.lesson }} </option>
                        <option v-for="tmp in this.tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>
                      <button v-if="!cmp.lock && cmp.lesson_change !== true" @click="openPreview('cmp', cmp.id, { name: cmp.lesson })" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>
                      <a v-if="!cmp.lock && cmp.lesson_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <!-- ПЕРЕРЫВ -->
                <div v-if="!cmp.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                  <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Перерыв: </div>
                  <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                    <div class="d-flex w-100">
                      <select  v-model="cmp.breaktime" @change="this.eventList = []; cmp.breaktime_change = true;" class="form-select form-select-sm me-1" :disabled="cmp.lock">
                        <option selected :value="cmp.breaktime"> {{ cmp.breaktime }} </option>
                        <option v-for="tmp in this.tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>
                      <button v-if="!cmp.lock && cmp.breaktime_change !== true" @click="openPreview('cmp', cmp.id, { name: cmp.breaktime })"  type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>
                      <a v-if="!cmp.lock && cmp.breaktime_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <!-- ОБЕД -->
                <div v-if="!cmp.isspecial" class="row w-100 align-items-center mt-1 ms-0 me-0">
                  <div class="col-12 col-sm-4 col-md-3 col-lg-2 p-0"> Обед: </div>
                  <div class="col-12 col-sm-8 col-md-9 col-lg-10 p-0">
                    <div class="d-flex w-100">
                      <select  v-model="cmp.lunch" @change="this.eventList = []; cmp.lunch_change = true;" class="form-select form-select-sm me-1" :disabled="cmp.lock">
                        <option selected :value="cmp.lunch"> {{ cmp.lunch }} </option>
                        <option v-for="tmp in this.tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                      </select>
                      <button v-if="!cmp.lock && cmp.lunch_change !== true" @click="openPreview('cmp', cmp.id, { name: cmp.lunch })" type="button" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      </button>
                      <a v-if="!cmp.lock && cmp.lunch_change === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- СПЕЦШАБЛОН -->
                <div v-if="cmp.isspecial" v-for="(tmp, index) in cmp.spectemplates" class="d-flex w-100 justify-content-between gap-1 mt-1">
                  <input v-model="cmp.spectemplates[index].time_to_swap" type="time" class="form-control form-select-sm" :disabled="cmp.lock">
                  <select v-model="cmp.spectemplates[index].name" @change="detectID(cmp.spectemplates, index); tmp.changed = true;" class="form-select form-select-sm" aria-label="Default select example" :disabled="cmp.lock">
                    <option :value="cmp.spectemplates[index].name" selected> {{ cmp.spectemplates[index].name }} </option>
                    <option v-for="tmp in tmpList" :value="tmp.name" > {{ tmp.name }}  ( by: {{ tmp.author }} ) - upd: {{ tmp.last_modify }} </option>
                  </select>
                  <!-- УДАЛИТЬ -->
                  <button v-if="!cmp.lock" @click="cmp.spectemplates.splice(index, 1)" type="button" class="btn btn-outline-danger btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                    </svg>
                  </button>
                  <!-- ПРЕДПРОСМОТР -->
                  <button v-if="!cmp.lock && tmp.changed !== true" type="button" @click="openPreview('cmp', cmp.id, tmp)" data-bs-toggle="modal" data-bs-target="#PreviewModal" class="btn btn-info btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                  </button>
                  <a v-if="!cmp.lock && tmp.changed === true" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" class="btn btn-outline-info btn-sm" data-bs-title="ВНИМАНИЕ!" data-bs-content="Предпросмотр недоступен после изменеия шаблона. Данный функционал будет доступен только после удтверждения данной трансляции.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path>
                    </svg>
                  </a>
                </div>

                <!-- ДОБАВИТЬ -->
                <button v-if="cmp.isspecial && !cmp.lock" @click="addToAss(cmp.spectemplates)" type="button" class="btn btn-outline-success btn-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                  </svg>
                  Добавить
                </button>
                
                <!-- НИЖНЯЯ СТРОКА ОБРАБОТКИ -->
                <div class="row w-100 align-items-center g-1 mt-2">
                  <div class="col-12 col-sm-4 col-md mb-1 form-check form-switch">
                    <input v-model="cmp.isspecial" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault26" :disabled="true"/>
                    <label class="form-check-label" for="flexSwitchCheckDefault26"> Особое расписание </label>
                  </div>

                  <!--КНОПКИ ОБРАБОТКИ СОБЫТИЯ-->
                  <div v-if="cmp.lock" class="col-12 col-sm-8 col-md-8 col-lg-6 col-xl-5">
                    <div class="row w-100 g-2">
                      <div class="col">
                        <button @click="cmpEditStart(index)" class="btn btn-outline-secondary w-100"> 
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg>
                          Редактировать 
                        </button>
                      </div>
                      <div class="col">
                        <button @click="this.CMP_ID = cmp.id;" class="btn btn-outline-warning w-100" data-bs-toggle="modal" data-bs-target="#ModalSend"> 
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                          </svg>
                          Отправить 
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md mb-1">
                    <button @click="cmpEditEnd(index)" type="button" class="btn btn-outline-secondary w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                      Отмена 
                    </button>
                  </div>
                  <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Details modal -->
                    <button v-if="cmp.isspecial" @click="openCompose(cmp.id, cmp.spectemplates)" type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                    <button v-if="!cmp.isspecial" @click="openCompose(cmp.id, [cmp.lesson, cmp.breaktime, cmp.lunch])" type="button" class="btn btn-outline-info w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                      Просмотр
                    </button>
                  </div>
                  <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Deny modal -->
                    <button @click="this.CMP_ID = cmp.id;" type="button" class="btn btn-outline-danger w-100" data-bs-toggle="modal" data-bs-target="#ModalDelcmp"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                      </svg>
                    Удалить
                    </button>
                  </div>
                  <div v-if="!cmp.lock" class="col-12 col-sm-12 col-md mb-1">
                    <!-- Button trigger Confirm modal -->
                    <button v-if="cmp.isspecial" @click="saveCompose(cmp, cmp.spectemplates, this.eventList?.data, cmp.date)" type="button" class="btn btn-success w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                        <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z"/>
                      </svg>
                      Сохранить 
                    </button>
					          <button v-if="!cmp.isspecial" @click="saveCompose(cmp, [cmp.lesson, cmp.breaktime, cmp.lunch], [this.eventList?.data?.lesson, this.eventList?.data?.breaktime, this.eventList?.data?.lunch], cmp.date)" type="button" class="btn btn-success w-100"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sd-card-fill" viewBox="0 0 16 16">
                        <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0Zm-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0Zm1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z"/>
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
	    session: this.getSession(),
  
        // --- ПОЛЯ ДЛЯ РАБОТЫ С КОМПОЗАМИ ---
      eventList: [],           // Список для событий открываемого шаблона
      editFormS: [],           // Форма редактирования события (Study)
      editFormB: [],           // Перерыв (Break)
      editFormL: [],           // Обед (Lunch)
      customForms: [],         // Список форм редактирования для спец. шаблонов
      composeDetailsModal: {
        templateName: '',           // Имя предпросматриваемого шаблона
        authorName: '',             // Автор этого самого шаблона
        withChanges: false,         // Круто 
        previewEvents: [],          // События данного шаблона
        numberOfEvents: 0,          // Число событий в данном шаблоне
        nameOfCurrentEvent: '',     // Имя открытого на данный момент события внутри шаблона
        numberOfCurrentEvent: 0     // Порядковый номер открытого на данный момент события 
      },
      currentModalPage: 0,

      // ----- FILE CANVAS ------
      reserveType: '',
      filter: '',
      viewFiles: [],  // Список файлов, отображаемых по фильтруемым параметрам
      types: ['image', 'webform', 'video'],
      typeOfList: '',
      canvas: {},
      filesImg: [],
      filesClip: [],
      dataForm: {},
      dataIndex: {},
      // ------------------------

      CMP_ID: null,   // ID композиции для обработки
      CMP_NAME: '',   // Заголовок (видно модератору)
      CMP_COMM: '',   // Комментарий (для модератора)
      CMP_EDIT_STARTED: false,

        // --- ПОЛЯ ДЛЯ РАБОТЫ С ШАБЛОНАМИ ---
      openedTmp: "",        // Имя открытого шаблона
      lastModify: "",       // Последний профиль, вносивший изменения в шаблон
      newNameOrig: "",             // Поле "Имя нового шаблона"
      tmpName: "-",         // Селектор имен шаблонов для открытия 
      forModal: {			      // Данные для модальных окон
        newType: '',
        withChanges: false,
        upd_less: [],
        upd_break: [],
        upd_lunch: [],
        name: '',       // NOT NULL
        obj: {},        // NOT NULL
        index: '',
        comment: ''
      },

        // --- ПАРАМЕТРЫ ДОСТУПА ---
      isAuthor: false,      // Является ли пользователь автором шаблона
      canView: false,       // Видимость шаблона для др. профилей
      canEdit: false,       // Возможность редактировать шаблон другими пользователями
      isGet: false,         // Состояние страницы - открыт ли шаблон
      firstflag: true,

        // --- SEND TO MODER ---
      cmpDateSend: '',
      nameProg: '',         // Заголовок шаблона
      commProg: '',         // Комментарий редактора
      programList: ['-', '-', '-'],
      programTimes: [],
             
      screenProg: '1',      // Моник
      specProg: false,      // Ты СПЕЦИАЛЬНО?

        // --- ЧИТАЕМЫЕ ДАННЫЕ ИЗ ОТВЕТОВ СЕРВЕРА ---
      tmpList: {},          // Список шаблонов для развертывания
      composes: [],
      events: [],           // События (список, упорядоченный согласно базе данных)
      editForm: [],         // Форма редактирования события  
                            // Форма добавления нового события с полями 
      addForm: { name: "", src: "", type: 0, time: 15, isActive: true },
      addFormCmp: { name: "", src: "", type: 0, time: 15, isActive: true },
      canvas: {},

      succCallback: [],     // Колбек - успешно
      errCallback: [],      // Колбек - ошибка 
      sendCallback: [],     // Модалка формы отправки
      infoCallback: [],

      successMessage: null, // Текст успешной операции
      errorMessage: null,   // Текст ошибки
      infoMessage: null,
      currentTime: null,
      prevarrow: '',
      nextarrow: '',

      modalSend: {},
     
      format: /[`!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~]/  // Недопустимые в именовании символы
    }
  },
  methods: {
	  // ----- GENERAL OPS -----
	    // ws connection
    connect() {
      this.socket = this.getSocket();
    },
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

    openCanvas(form, index, type, inForm = false) {
      this.dataForm = form;
      if (inForm)
          this.dataIndex = -1;
      else
          this.dataIndex = index;
      this.typeOfList = type;
      this.canvas.show();
    },
    selectFile(file) {
        if (this.dataIndex === -1)
            this.dataForm.src = file.src;
        else
            this.dataForm[this.dataIndex].src = file.src;
        this.closeCanvas();
    },
    closeCanvas() {
        this.canvas.hide();
    },
    search(searchParam) {
      if (searchParam === '') {
          this.typeOfList = this.reserveType;
          return;
      } 

      if (this.typeOfList !== 'filtered')
          this.reserveType = this.typeOfList;

      this.typeOfList = 'filtered';

      this.viewFiles = [];

      for (let i in this.filesImg) 
          if (this.filesImg[i].name.includes(searchParam)) 
              this.viewFiles.push(this.filesImg[i]);
              
      for (let i in this.filesClip) 
          if (this.filesClip[i].name.includes(searchParam)) 
              this.viewFiles.push(this.filesClip[i]);
    }, 
    clearFile(file) {
        file.src = '';
    },

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
	    // get all templates & composes
    async allTmp(withmodals = true) {
      if (withmodals) {
        this.canvas = new bootstrap.Offcanvas('#Canva');
        this.sendDetailWorkdays = new bootstrap.Modal(document.getElementById('detailsWorkdaysModal'));
        this.sendDetailSpecial = new bootstrap.Modal(document.getElementById('detailsSpecialModal'));
        this.succCallback = new bootstrap.Toast(document.getElementById("ToastSuccess"));
        this.errCallback = new bootstrap.Toast(document.getElementById("ToastError"));
        this.sendCallback = new bootstrap.Modal(document.getElementById('SendModerModal'));
        this.saveModal = new bootstrap.Modal(document.getElementById('ModalSave'));
        this.newTmpModal = new bootstrap.Modal(document.getElementById('ModalNameTmp'));
        this.modalSend = new bootstrap.Modal(document.getElementById('ModalSend'));
	    }

      let response = await fetch(`/event/alltmp`, {
        method: 'GET',
          // THIS IS IMPORTANT
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-access-token' : JSON.parse(localStorage.getItem('user')).token
        }),
      });
      response = await response.json();

        // ---- ВИДИМЫЕ ШАБЛОНЫ ----
      this.tmpList = response.templates;

        // ---- СКОМПАНОВАННЫЕ ----
      this.composes = response.composes;
      for (let i in this.composes) {
        this.composes[i].lock = true;
        if (this.composes[i].isspecial === false) {
          this.composes[i].lesson_res = JSON.parse(JSON.stringify(this.composes[i].lesson));
          this.composes[i].breaktime_res = JSON.parse(JSON.stringify(this.composes[i].breaktime));
          this.composes[i].lunch_res = JSON.parse(JSON.stringify(this.composes[i].lunch));
        } else {
          // ЗДЕСЬ СДЕЛАТЬ РЕЗЕРВНЫЕ КОПИИ ДЛЯ КАЖДОГО ШАБЛОНА ИЗ ПРОГРАММЫ СПЕЦИАЛЬНОГО ТИПА
          this.composes[i].spectemplates_res = JSON.parse(JSON.stringify(this.composes[i].spectemplates));
        }
      }

      let respo = await fetch(`/upload/files`, {
        method: 'GET',
        // THIS IS IMPORTANT
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-access-token' : JSON.parse(localStorage.getItem('user')).token
        })
      });

      respo = await respo.json();
      respo.files.forEach((file) => {
        if (file.type === 'image')
          this.filesImg.push(file);
        else 
          this.filesClip.push(file);
      });

        // ---- КАЛЕНДАРЬ В МОДАЛКЕ ----
      let date_ob = new Date();
      let dd = ("0" + date_ob.getDate()).slice(-2);
      let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let yyyy = date_ob.getFullYear();
      let minDate = yyyy + '-' + mm + '-' + dd;
      let maxDate = (Number(yyyy) + 1) + '-' + mm + '-' + dd;

      document.getElementById('startDate').min = minDate;
      document.getElementById('startDate').max = maxDate;
      document.getElementById('startDate').value = minDate;
      this.cmpDateSend = minDate;
        // ---- КОНЕЦ: КАЛЕНДАРЬ ----
    },
	    // open tmp (get inner template data)
    async getTmp(name) {
      if (name !== "-") {
        let response = await fetch(` /event/all`, this.options('PATCH', { name: name }));
        this.events = (await response.json());
      
        if (this.events[0].name === "none" && this.events[0].src === "none"){
          this.events = [];
		      this.sayToUser('error',
			      'Данный шаблон был удален его автором. \nСвяжитесь с автором шаблона для уточнения информации.');
        } else {
          this.canView = this.events[0].canview;
          this.canEdit = !this.events[0].isprivate;
          this.isAuthor = this.events[0].isauthor;

          if ([this.events[0].name, this.events[0].src].includes("undef"))
            this.events = [];
            this.openedTmp = name;
            this.isGet = true;
            
          for (let i in this.events) {
            if (!this.editForm[i]) this.editForm[i] = {}
              this.editForm[i].isDisabled = true;
          }
          this.composeDetailsModal.withChanges = false;
        }
      } else
		    this.sayToUser('error', 'Пожалуйста, выберите шаблон, который хотите открыть.');
    },
  		// modal window trigger <- type of ops
    async triggerModal(tmp_type) {
      this.forModal.newType = tmp_type;
      if (tmp_type === 'copy' && this.openedTmp === '') {
		    this.sayToUser('error', 'Для создания копии шаблона необходимо открыть шаблон, который нужно скопировать!');
        return;
      }
      this.newTmpModal.show();
    },
	    // check the level of stupid user
    clickDebian(isDebian) {
      if (isDebian)
		    this.sayToUser('error', 'Начните редактирование формы для изменения данного параметра.');
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
	    // event listing fisting
    switchPage(prevOrNext) {
      if (prevOrNext === 'next')
        if (this.composeDetailsModal.numberOfCurrentEvent < this.composeDetailsModal.numberOfEvents)
          this.composeDetailsModal.numberOfCurrentEvent += 1;
      else
        if (this.composeDetailsModal.numberOfCurrentEvent > 1)
          this.composeDetailsModal.numberOfCurrentEvent -= 1;
    },
	    // open preview modal
    async openPreview(tmpOrCmp, id = '', tmp = {}) {
      if (tmpOrCmp === 'tmp') {
        this.composeDetailsModal.templateName = this.openedTmp;      // +
        for (let i in this.tmpList)
          if (this.tmpList[i].name === this.openedTmp) {
            this.composeDetailsModal.authorName = this.tmpList[i].author;
            break;
          }
        this.composeDetailsModal.previewEvents = this.events;
        this.composeDetailsModal.numberOfEvents = this.events.length;
        this.composeDetailsModal.nameOfCurrentEvent = this.events[0].name
        this.composeDetailsModal.numberOfCurrentEvent = this.events.length === 0 ? 0 : 1;
      } else {
        this.composeDetailsModal.templateName = tmp.name;
        this.composeDetailsModal.authorName = tmp.author;

        let response = await fetch('/event/tmpcmpreserve', this.options('PATCH', { id, time: tmp.time_to_swap, name: tmp.name }));
        response = await response.json();

        this.composeDetailsModal.previewEvents = response;        
        this.composeDetailsModal.numberOfEvents = response.length;
        this.composeDetailsModal.nameOfCurrentEvent = response[0].name;
        this.composeDetailsModal.numberOfCurrentEvent = response.length === 0 ? 0 : 1;
      }
      // this.sendDetailSpecial.show();
    },

	  // --- OPS ON TEMPLATES ---
	    // create new template
    async addTmp(name, tmp_type, events) {
      this.forModal.newType = tmp_type;

      if (this.format.test(name))
		this.sayToUser('error', 'Имя шаблона не должно содержать специальных символов: \n' + this.format);
      else if (name.length > 30)
		this.sayToUser('error',
			'Полученно слишком длинное наименование шаблона. \nПроверьте, пожалуйста, правильность введённых данных \nРазрешено символов: 30. Получено: ' + name.length);
	  else if (name === "")
		this.sayToUser('error', 'Заполните имя нового шаблона!');
	  else if (tmp_type === 'copy' && this.openedTmp === '')
		this.sayToUser('error', 'Для создания копии шаблона необходимо открыть шаблон, который нужно скопировать!');
	  else {
		let callback = await fetch(` /event/addtmp`, this.options('PATCH', {
		  name: name,
		  tmp_type: tmp_type,
		  events: events
		}));
		callback = await callback.json();

		if (callback.typecall === 'success') {
		  this.tmpList.push(callback.template);
		  this.tmpName = name;
		  this.newNameOrig = "";
		  this.successMessage = '';
		  await this.getTmp(name);
		  switch (tmp_type) {
			case 'copy':
			  this.sayToUser('success', 'Шаблон был успешно скопирован под именем: \"' + name + '\".');
			  break;
			case 'default':
			case 'empty':
			default:
			  this.sayToUser('success', 'Шаблон \"' + name + '\" был успешно создан.');
		  }
		  this.newTmpModal.hide();
		} else
		  this.sayToUser('error', 'Шаблон c именем: \"' + name + '\" уже существует. Придумайте другое.');
	  }
	},
	    // delete template
    async delTmp(name) {
      if (name === "-") {
		this.sayToUser('error', 'Выберите шаблон, который хотите удалить.');
		return;
	  }

	  let response = await fetch(`/event/deltmp`, this.options('DELETE', { name: name }));
	  response = await response.json();

	  if (response.message !== 'Success') {
		this.sayToUser('error', 'Данный шаблон не найден. Попробуйте перезагрузить страницу.');
		return;
	  }
	  this.openedTmp = "";
	  this.isGet = false;
	  this.canEdit = false;
	  this.canView = false;
	  this.isAuthor = false;
	  this.name = "";
	  this.sayToUser('success', 'Шаблон "' + this.tmpName + '" был успешно удален.');
	  for (let i in this.tmpList) {
		if (this.tmpList[i].name === name)
		  this.tmpList.splice(i, 1);
	  }
	  this.tmpName = "-";
    },
	    // add event to opened template
    async addEvent() {
      if (!(this.addForm.name !== "" && (this.addForm.src !== ""))) {
        this.sayToUser('error', 'Пожалуйста, заполните все поля перед добавлением.');
        return;
      }

      if (this.addForm.name.length > 50)
        this.sayToUser('error', 'Полученно слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + this.addForm.name.length);
      else if (!Number.isFinite(this.addForm.time) || this.addForm.time < 0)
        this.sayToUser('error', 'Полчено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
      else if (this.format.test(this.addForm.name))
        this.sayToUser('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
      else if (this.addForm.name.trim() === '')
        this.sayToUser('error', 'Имя события не должно состоять только из пробелов.');
      else {
        // ----- CORRECT PROCESSING ----

        // if (Number(this.addForm.type) === 1) {
        //     // Обработка файла загрузки
        // }

        // Обработка URL-адреса
        this.editForm.push({isDisabled: true});
        this.events.push(this.addForm);
        this.addForm = {name: "", src: "", type: 0, time: 15, isActive: true}
        this.composeDetailsModal.withChanges = true;
      }
    },
      // input changes to opened template
    async editEvent(index) {
      this.editForm[index].isDisabled = false;
    },
      // lock input correction form from opened template
    async saveEvent(index) {
      if (this.events[index].src === '')
		    this.sayToUser('error', 'Не определен ресурс события. ');
      else if (this.format.test(this.events[index].name))
		    this.sayToUser('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
      else if (this.events[index].name === '')
  		  this.sayToUser('error', 'Не определено имя события.');
      else if (this.events[index].name.trim() === '')
  		  this.sayToUser('error', 'Имя события не должно состоять только из пробелов.');
      else if (this.events[index].time === '')
  		  this.sayToUser('error', 'Не определено время.');
      else if (Number(this.events[index].time) <= 0)
  		  this.sayToUser('error', 'Время не может быть отрицательным.');
      else if (Number(this.events[index].type) !== 0 && Number(this.events[index].type) !== 1 && Number(this.events[index].type) !== 2)
  		  this.sayToUser('error', 'System: обнаружена попытка сломать форму. Уведомление о ваших действиях направлено администратору.');
      else if (this.events[index].name.length <= 50) {
        this.editForm[index].isDisabled = true;
        this.composeDetailsModal.withChanges = true;
      } else
  		  this.sayToUser('error', 'Полученно слишком длинное наименование события. \nРазрешено символов: 50. Получено: ' + this.events[index].name.length);
    },
      // delete events from opened template
    async delEvent(index) {
      this.editForm[index].isDisabled = true;
      this.editForm[index].isDeleted = true;
      this.events.splice(index, 1);
      this.editForm.splice(index, 1);
      this.composeDetailsModal.withChanges = true;
    },
      // check saving process correct
    async checkIssues() {
      for (let form in this.editForm)
		if (!this.editForm[form].isDisabled) {
		  this.sayToUser('error', 'Невозможно сохранить изменения, пока идет редактирование.');
		  return;
		}
      this.saveModal.show();
    },
      // save changes from opened template
    async saveChanges() {
      if (this.events[0] === undefined)
		this.events[0] = { name: "empty", src: "empty", type: 0, time: 1, isActive: true }

      for (let i in this.events) {
        this.events[i].canview = this.canView;
        this.events[i].isprivate = !this.canEdit;
        this.events[i].openedtmp = this.openedTmp;
      }
      await fetch(` /event/save`, this.options('PATCH', this.events));
      this.saveModal.hide();
	  this.sayToUser('success', 'Шаблон "' + this.openedTmp + '" был успешно сохранен.');
      this.composeDetailsModal.withChanges = false;
    },
      // move event in order from opened template
    async moveEvent(move, index) {
      let id1 = index;
      let id2 = null;
      if (move === "down" && id1 !== this.events.length-1)  
        id2 = id1++;
      if (move === "up" && id1 !== 0)  
        id2 = id1--;

      if (id2 !== null) {
        this.correctArr(this.events, this.editForm, [id1, id2])
      }
      this.composeDetailsModal.withChanges = true;
    },
      // correct position of event in template order
    correctArr(_arr, _form, _param) {
      /*
        коррекция  элементов массива по паре индекса
        *    _arr -- массив требующий коррекции
        *   _param -- пара [n1,n2] -- индексы массива для взаимной перестановки
      */
      _form[_param[1]] = _form.splice(_param[0], 1, _form[_param[1]])[0];
      _arr[_param[1]] = _arr.splice(_param[0], 1, _arr[_param[1]])[0];
    },

    // --- РАБОТА С ШАБЛОНАМИ ВНУТРИ КОМПОЗИЦИЙ ---
    async addEventCmp(form, data) {
      if (!(this.addFormCmp.name !== "" && this.addFormCmp.src !== "")) {
        this.sayToUser('error', 'Пожалуйста, заполните все поля перед добавлением.');
        return;
      }

      if (this.addFormCmp.name.length > 50)
        this.sayToUser('error', 'Полученно слишком длинное наименование события. \nПроверьте, пожалуйста, правильность введённых данных. \nРазрешено символов: 50. Получено: ' + this.addFormCmp.name.length);
      else if (!Number.isFinite(this.addFormCmp.time) || this.addFormCmp.time < 0)
        this.sayToUser('error', 'Полчено некорректное значение времени при добавлении события. \n Проверьте, пожалуйста, правильность введённых данных.');
      else if (this.format.test(this.addFormCmp.name))
        this.sayToUser('error', 'Имя события не должно содержать специальных символов: \n' + this.format);
      else {
        // ----- CORRECT PROCESSING ----

        // if (Number(this.addForm.type) === 1) {
        //     // Обработка файла загрузки
        // }
        // Обработка URL-адреса
        form.push({ isDisabled: true });
        data.push(this.addFormCmp);
        this.addFormCmp = { name: "", src: "", type: 0, time: 15, isActive: true };
      }
    },

    async delEventCmp(index, form, data) {
      form[index].isDisabled = true;
      form.splice(index, 1);
      data.splice(index, 1);
    },

    async editEventCmp(index, form) {
      form[index].isDisabled = false;
    },

    async saveEventCmp(index, form) {
      form[index].isDisabled = true;
    },

    async moveEventCmp(move, index, data, form) {
      let id1 = index;
      let id2 = null;
      if (move === "down" && id1 !== data.length-1)  id2 = id1++;
      if (move === "up" && id1 !== 0)  id2 = id1--;
      if (id2 !== null) this.correctArr(data, form, [id1, id2]);
    },

    async templateSave() {
        // 1. Форма не должна быть "испорчена" - возможно нарочное удаление структуры [.data]
        // 2. При внесении изменений в шаблон любого типа хотя бы в одной из форм должны быть события
        //    (невозможно сохранить, удалив все события из всех шаблонов, поскольку такой запрос нет смысла утверждать)
      if (this.eventList.data !== undefined) {
        this.forModal.withChanges = true;
        this.forModal.upd_less = this.eventList.data.lesson;
        this.forModal.upd_break = this.eventList.data.breaktime;
        this.forModal.upd_lunch = this.eventList.data.lunch;
      }
    },

    // --- COMPOSE MODAL METHODS ---
      // change type of template middleware (standard <-> spec)
    changeType() {
      if (this.specProg) {
        this.programList = ['-', '-', '-'];
        this.programTimes = [];
      } else {
        this.programList = ['-'];
        this.programTimes = ['00:00'];
      }
    },
      // delete tmp from spsecial tamplate [compose modal]
    deleteTmpFromSpecial(index) {
      this.programList.splice(index, 1);
      this.programTimes.splice(index, 1);
    },
      // add tmp from spsecial tamplate [compose modal]
    addTmpToSpecial() {
      this.programList.push('-');
      this.programTimes.push('00:00');
    },
      // open modal [compositing ops]
    async composeForm() {
      this.sendCallback.show();
    },
      // op 'compose' [compose modal]
    async composeTemplate(spec) {
      if (spec) 
        for (let i in this.programList) {
          if (this.programList[i] === '-') {
			      this.sayToUser('error', 'При сборке программы особого типа заполните все поля корректно.');
            return;
          }
        }

      // !this.specProg && (this.programTimes = []);
      let response = await fetch(`/event/compose`, this.options('PUT', {
          name: this.nameProg, 
          comment: this.commProg, 
          programs: this.programList,
          times: this.programTimes, 
          screen: this.screenProg, 
          isSpec: this.specProg
        }
      ));
      response = (await response.json());
      this.errorMessage = response.message;
        // Ошибка при некорректных полях
      if (this.errorMessage !== '-')
		    this.sayToUser('error', this.errorMessage);
      else {
		    this.sayToUser('success', 'Программа трансляции успешно скомпанована.');
          // Скрыть мочалку отправки
        this.sendCallback.hide();
        let newCmp = response.cmp;
        newCmp[0].lock = true;
        if (newCmp[0].isspecial === true)
          newCmp[0].spectemplates = response.spec;
        this.composes.push(newCmp[0]);
          // Обнуление для не дублирования при нескольких запросах подряд
        const data = {
          request: this.nameProg,
          name: this.session.name
        }
        this.socket.emit('new-request', data);

        this.nameProg = '';
        this.commProg = '';
        this.programList = ['-', '-', '-'];
        this.programTimes = [];
        this.screenProg = '1';
      }
    },

    // ---- OPS ON COMPOSES ----
      // speaking name
    async cmpEditStart(index) {
      if (this.CMP_EDIT_STARTED)
		    this.sayToUser('error', 'Для корректности работы одновременно можно редактировать не более одной программы.');
      else {
        this.CMP_EDIT_STARTED = true;
        this.composes[index].lock = false;
      }
    },
      // speaking name
    cmpEditEnd(index) {
      this.CMP_EDIT_STARTED = false;
      if (this.composes[index].isspecial === false) {
        this.composes[index].lesson = JSON.parse(JSON.stringify(this.composes[index].lesson_res));
        this.composes[index].breaktime = JSON.parse(JSON.stringify(this.composes[index].breaktime_res));
        this.composes[index].lunch = JSON.parse(JSON.stringify(this.composes[index].lunch_res));
      } else {
        // ЗДЕСЬ СДЕЛАТЬ РЕЗЕРВНЫЕ КОПИИ ДЛЯ КАЖДОГО ШАБЛОНА ИЗ ПРОГРАММЫ СПЕЦИАЛЬНОГО ТИПА
        this.composes[index].spectemplates = JSON.parse(JSON.stringify(this.composes[index].spectemplates_res));
      }
      this.composes[index].lock = true;
    },
      // delete compose from compose-list + [needs access] 
    async deleteCmp(id) {
      if (id === undefined) {
        this.sayToUser('error', 'Произошла ошибка. Пожалуйста, перезагрузите страницу.');
        return;
	    }

      await fetch(` /event/delcmp`, this.options('DELETE', { id: id }));
      this.sayToUser('success', 'Скомпанованная программа была успешно удалена.');

      for (let i in this.composes)
        if (this.composes[i].id === id) {
          this.composes.splice(Number(i), 1);
          break;
        }

      this.CMP_EDIT_STARTED = false;
    },
      // send tmp to moder page + [needs access]
    async sendCompose(id, name, comm) {
      let response = await fetch('/event/sendcmp', this.options('PATCH', { id, name, comm, date: this.cmpDateSend }));
      response = await response.json();

      if (response.cb === 'success') {
		    this.sayToUser('success', response.message);
        this.modalSend.hide();
        this.CMP_NAME = '';  
        this.CMP_COMM = '';
      } else
		    this.sayToUser('error', response.message);
    },
      // open templates from compose 
    async openCompose(id, tmpList) {
      if (!this.forModal.withChanges) {
        let response = await fetch('/event/opencmp', this.options('PATCH', { id, tmpList }));
        this.eventList = (await response.json());
      }

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

        if (!['lesson', 'breaktime'].includes(this.eventList.data.lunch))
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
      // save changes in compose // NEW TEMPLATES
    async saveCompose(cmp, tmpList, eventList, date) {
      let response;
      let replace;

        // Standard
      if (!cmp.isspecial) {
        if (eventList[0] === undefined) 
          replace = [];
        else 
          replace = eventList;
        response = await fetch('/event/savecmp', this.options('PATCH', {
          id: cmp.id,
          tmpList,
          eventList: replace,
          date,
          timeList: null
        }));
      } else {
          // Special
        let tmpFilter = [], timeFilter = [];
        for (let i in tmpList) {
          tmpFilter.push(tmpList[i].name);
          timeFilter.push(tmpList[i].time_to_swap);
        }

        let eventFilter = [];
        for (let i in eventList)
          eventFilter.push(eventList[i].events);

        response = await fetch('/event/savecmp', this.options('PATCH', {
          id: cmp.id,
          tmpList: tmpFilter,
          eventList: eventFilter,
          date,
          timeList: timeFilter
        }));
      }

      response = await response.json();
      // Callback -> message
      if (response.cb === 'success') {
		    this.sayToUser('success', response.message);
        this.sendDetailWorkdays.hide();
        this.CMP_EDIT_STARTED = false;
        cmp.lock = true;
        await this.allTmp(false);
      } else
		    this.sayToUser('error', response.message);
    },
      // Кнопка "Добавить" - внутри композиций специального типа
    addToAss(list) {
      list.push({
        id: 0,
        name: '- Выберите -',
        time_to_swap: '00:00'
      });
    },
      // При смене шаблона внутри специальной композиции - обновление id и подсос даты
    detectID(list, index){
      for (let i in this.tmpList) {
        if (list[index].name === this.tmpList[i].name) {
          list[index].id = this.tmpList[i].id;
          list[index].isprivate = this.tmpList[i].isprivate;
          list[index].last_modify = this.tmpList[i].last_modify;
          list[index].canview = this.tmpList[i].canview;
          list[index].author = this.tmpList[i].author;
        }
      }
    },
      // fetch helpful method
    options(method, body) {
      return {
        method: method,
        headers: {
          'Content-type': 'application/json; charset=UTF-8', // Indicates the content
          'x-access-token' : JSON.parse(localStorage.getItem('user')).token,
        },
        body: JSON.stringify(body),
        session: this.session,
      }
    },
  },
  async mounted() {
    this.connect();         // ws + session
    await this.allTmp();    // get all templates

    this.resizeTextEdit();  // hide text on buttons 
    this.getArrowText();    // for mobile devices (preview modal)
  }
}
</script>