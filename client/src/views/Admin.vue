<script>
export default {
    inject: ['session', 'socket', 'options', 'toast', 'clickBlock'],
    data()
    {
        return {
            process_started: false,

            users: [],
            volumes: ["editor", "moderator", "manager", "admin"],
            roles: ["Редактор", "Модератор", "Менеджер", "Администратор"],

            isChanged: false,
            forModal: {
                profile: '',
                index: '',
            },

            saveProfileModal: {},
            deleteUserModal: {},

            addForm: { name: '', login: '', role: '', password: '', checkpass: '' }
        }
    },
    methods: {
        /**
         * Соединение по WebSocket
         */
        async connect()
        {
            //
        },

        /**
         * Список профилей
         */
        async getUsers()
        {
            this.saveProfileModal = new bootstrap.Modal(document.getElementById('ModalSaveProfile'));
            this.deleteUserModal = new bootstrap.Modal(document.getElementById('ModalDeleteProfile'));

            let response = await fetch('/accounts', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                }),
            });
            response = await response.json();

            if (response.status === 'success') {
                this.users = response.data;
            } else {
                this.toast('error', 'Что-то пошло не так :(');
            }

            for (let i in this.users) {
                this.users[i].lock = true;
                this.users[i].password = '';
                this.users[i].checkpass = '';
            }
        },

        /**
         * Открытие модального окна в зависимости от действия
         * 
         * @param {*} index Индекс аккаунта в списке
         * @param {*} action Действие администратора
         */
        async triggerModal(index, action)
        {
            this.forModal.index = index;
            this.forModal.profile = this.users[index].name;

            if (action === 'save') {
                if (this.isChanged) {
                    this.saveProfileModal.show();
                } else {
                    await this.saveChanges(this.forModal);
                }
            } else if (action === 'del') {
                this.deleteUserModal.show();
            } else {
                console.log('error');
            }
        },

        /**
         * Добавить новый профиль
         */
        async addUser()
        {
            if (this.addForm.name.length > 16) {
                this.toast('error', 'Длина отображаемого имени превышает ограничение: 16 символов.');
            } else if (this.addForm.login.length > 20) {
                this.toast('error', 'Длина логина превышает ограничение: 20 символов.');
            } else {
                if (this.addForm.password !== this.addForm.checkpass) {
                    this.toast('error', 'Введенные пароли не совпадают.');
                    return;
                }

                let response = await fetch('/accounts/add', this.options('POST', {
                    name: this.addForm.name,
                    login: this.addForm.login,
                    password: this.addForm.password,
                    role: this.addForm.role,
                }));

                response = await response.json();

                if (response.status === 'success') {
                    this.toast('success', 'Пользователь был успешно добавлен.');

                    let usr = response.data;
                    usr.lock = true;
                    usr.checkpass = '';
                    this.users.push(usr);

                    this.addForm = { name: '', login: '', role: '', password: '', checkpass: '' };
                } else {
                    this.toast('error', response.data);
                }
            }
        },

        /**
         * Редактирование данных аккаунта
         * 
         * @param index Индекс в списке аккаунтов
         */
        async changeUser(index)
        {
            if (!this.process_started) {
                this.users[index].lock = false;
                this.process_started = true;
            } else {
                this.toast('error', 'Редактирование не более одного профиля одновременно.');
            }
        },

        /**
         * Сохранить изменения после редактирования данных аккаунта
         * 
         * @param modalData Данные для модального окна
         */
        async saveChanges(modalData)
        {
            let index = modalData.index;

            if (this.users[index].name.length > 16) {
                this.toast('error', 'Длина отображаемого имени превышает ограничение: 16 символов.');
            } else if (this.users[index].login.length > 20) {
                this.toast('error', 'Длина логина превышает ограничение: 20 символов.');
            } else {
                if (this.isChanged) {
                    if (this.users[index].password.length > 0 && this.users[index].checkpass === this.users[index].password) {
                        this.toast('error', 'Введенные пароли не совпадают.');
                        return;
                    }

                    let response = await fetch('/accounts/update', this.options('POST', {
                        id: this.users[index].id,
                        name: this.users[index].name,
                        login: this.users[index].login,
                        role: this.users[index].role,
                        password: this.users[index].password,
                    }));
                    response = await response.json();

                    if (response.status !== 'success') {
                        this.toast('error', response.data);
                        return;
                    }

                    this.users[index].password = '';
                    this.isChanged = false;
                    this.saveProfileModal.hide();
                    this.toast('success', 'Изменения внесены успешно.');
                }

                this.process_started = false;
                this.users[index].lock = true;
            }
        },

        /**
         * Удалить аккаунт
         * 
         * @param modalData Данные для модального окна
         */
        async deleteUser(modalData)
        {
            let index = modalData.index;

            let response = await fetch('/accounts/delete', this.options('DELETE', {
                id: this.users[index].id
            }));

            response = await response.json();

            if (response.status === 'success') {
                this.toast('error', response.data);
                return;
            }

            this.users.splice(index, 1);
            this.deleteUserModal.hide();
            this.toast('success', 'Профиль был успешно удален.');
            this.process_started = false;
        },
    },

    async mounted()
    {
        await this.connect();
        await this.getUsers();
    }
}
</script>

<template>
    <div class="intro">
        <!-- Modal for Delete Profile -->
        <div class="modal fade" id="ModalDeleteProfile" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel"> Подтверждение удаления профиля </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь удалить профиль <i>@{{ this.forModal.profile }}</i> <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Отмена </button>
                        <button name="id" form="del<%=i%>" type="submit" @click="deleteUser(this.forModal)" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Save Profile -->
        <div class="modal fade" id="ModalSaveProfile" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel"> Подтвердить изменение данных профиля </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь изменить профиль <i>@{{ this.forModal.profile }}</i> <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Отмена </button>
                        <button @click="saveChanges(this.forModal)" type="button" class="btn btn-success" data-bs-dismiss="modal">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h6 class="text mt-4"> Администрирование </h6>
            <div class="content">
                <!-- Вкладки -->
                <ul class="nav nav-pills" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-profiles-tab" data-bs-toggle="pill" data-bs-target="#pills-profiles" type="button" role="tab" aria-selected="true">Пользватели в системе</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-screens-tab" data-bs-toggle="pill" data-bs-target="#pills-screens" type="button" role="tab" aria-selected="false">Экраны в системе</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-scusers-tab" data-bs-toggle="pill" data-bs-target="#pills-scusers" type="button" role="tab" aria-selected="false">Доступ к экранам</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-subs-tab" data-bs-toggle="pill" data-bs-target="#pills-subs" type="button" role="tab" aria-selected="false">Оповещения</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-logs-tab" data-bs-toggle="pill" data-bs-target="#pills-logs" type="button" role="tab" aria-selected="false">Последние изменения</button>
                    </li>
                    <!-- КОНЕЦ: Вкладки -->
                </ul>
            </div>

            <div class="content">
                <!-- Содержимое вкладок -->
                <div class="tab-content" id="pills-tabContent">
                    <!-- Управление Профилями -->
                    <div class="tab-pane fade show active" id="pills-profiles" role="tabpanel" aria-labelledby="pills-profiles-tab" tabindex="0">
                        <div class="introduce">
                            <div v-for="(user, index) in this.users">
                                <div class="row gy-2 gx-2 align-items-center" style="margin-top: 3px;">
                                    <!-- ОТОБРАЖАЕМОЕ ИМЯ -->
                                    <div @click="this.clickBlock(this.users[index].lock)" class="col-12 col-md-6 col-lg-4 col-xl-2">
                                        <input type="text" class="form-control" name="name" @change="this.isChanged = true" v-model="this.users[index].name" :disabled="this.users[index].lock" />
                                    </div>
                                    <!-- РЕДАКТИРОВАТЬ -->
                                    <div v-if="user.lock" class="col-12 col-md-6 col-lg-4 col-xl">
                                        <button @click="changeUser(index)" class="btn btn-outline-secondary">
                                            Редактировать
                                        </button>
                                    </div>
                                    <!-- ЛОГИН -->
                                    <div v-if="!user.lock" class="col-12 col-md-6 col-lg-4 col-xl">
                                        <input type="text" class="form-control" name="name" @change="this.isChanged = true" v-model="this.users[index].login" />
                                    </div>
                                    <!-- РОЛЬ -->
                                    <div v-if="!user.lock && user.name !== this.session().name" class="col-12 col-lg-4 col-xl">
                                        <select v-model="this.users[index].role" @change="this.isChanged = true" class="form-select" name="role" id="role">
                                            <option v-for="(vol, index) in this.volumes" :value="vol" :selected="user.role === vol"> {{ this.roles[index] }} </option>
                                        </select>
                                    </div>
                                    <!-- НОВЫЙ ПАРОЛЬ -->
                                    <div v-if="!user.lock" class="col-12 col-md-6 col-lg-4 col-xl">
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="password>" name="password" placeholder="Новый пароль" readonly v-model="this.users[index].password" @change="this.isChanged = true" onfocus="this.removeAttribute('readonly')" />
                                        </div>
                                    </div>
                                    <!-- ПОДТВЕРЖДЛЕНИЕ ПАРОЛЯ -->
                                    <div v-if="!user.lock" class="col-12 col-md-6 col-lg-4 col-xl">
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="password" name="password" placeholder="Подтвердите пароль" readonly v-model="this.users[index].checkpass" onfocus="this.removeAttribute('readonly')" />
                                        </div>
                                    </div>
                                    <!-- СОХРАНИТЬ -->
                                    <div v-if="!user.lock" class="col-6 col-lg-2 col-xl">
                                        <button @click="triggerModal(index, 'save')" type="button" class="btn btn-outline-success w-100">Сохранить</button>
                                    </div>
                                    <!-- УДАЛИТЬ -->
                                    <div v-if="!user.lock" class="col-6 col-lg-2 col-xl">
                                        <button v-if="!(this.users[index].name === this.session().name)" @click="this.triggerModal(index, 'del')" type="button" class="btn btn-outline-danger w-100"> Удалить </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Форма добавления -->
                            <div class="row gy-2 gx-2 align-items-center" style="margin-top: 3px;">
                                <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                                    <input type="text" class="form-control" id="name" name="name" placeholder="Отображаемое имя" readonly v-model="this.addForm.name" onfocus="this.removeAttribute('readonly')" />
                                </div>
                                <div class="col-12 col-md-6 col-lg-4 col-xl">
                                    <input type="text" class="form-control" id="login" name="name" placeholder="Логин" readonly v-model="this.addForm.login" onfocus="this.removeAttribute('readonly')" />
                                </div>
                                <div class="col-12 col-lg-4 col-xl">
                                    <select v-model="this.addForm.role" class="form-select" name="role" id="role">
                                        <option value='' selected="">- Роль -</option>
                                        <option value="editor">Редактор </option>
                                        <option value="moderator">Модератор </option>
                                        <option value="manager">Менеджер </option>
                                        <option value="admin">Администратор </option>
                                    </select>
                                </div>
                                <div class="col-12 col-md-6 col-lg-4 col-xl">
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="password" name="password" placeholder="Пароль" readonly v-model="this.addForm.password" onfocus="this.removeAttribute('readonly')" />
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 col-lg-4 col-xl">
                                    <div class="input-group">
                                        <input type="password" class="form-control" id="password" name="password" placeholder="Подтвердите пароль" readonly v-model="this.addForm.checkpass" onfocus="this.removeAttribute('readonly')" />
                                    </div>
                                </div>
                                <div class="col-6 col-lg-2 col-xl">
                                    <button type="submit" @click="addUser" class="btn btn-success">Добавить</button>
                                </div>
                            </div>
                        </div>
                        <!-- КОНЕЦ: Управление Профилями -->
                    </div>

                    <!-- Управление экранами -->
                    <div class="tab-pane fade" id="pills-screens" role="tabpanel" aria-labelledby="pills-screens-tab" tabindex="0">
                        <div class="d-flex w-100 justify-content-start align-items-center gap-1 mt-2">
                            <select class="form-select w-auto">
                                <option selected>- Выберите -</option>
                                <option value="1">Хол актового</option>
                                <option value="2">Что-то ещё</option>
                            </select>
                            <div>
                                <button type="button" class="btn btn-success">Добавить к ослеживанию</button>
                            </div>
                        </div>
                        <!-- КОНЕЦ: Управление экранами -->
                    </div>
                    <!-- НАЗНАЧЕНИЕ ЭКРАНОВ -->
                    <div class="tab-pane fade" id="pills-scusers" role="tabpanel" aria-labelledby="pills-scusers-tab" tabindex="0">
                        <div class="d-flex align-items-start">
                            <div class="row ms-2">
                                <div class="nav flex-column nav-pills col-12 col-md-auto me-3 mt-2" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <!-- АДМИНИСТРАТОРЫ -->
                                    <button class="nav-link active" id="v-pills-admins-tab" data-bs-toggle="pill" data-bs-target="#v-pills-admins" type="button" role="tab" aria-controls="v-pills-admins" aria-selected="true">Администраторы</button>
                                    <!-- МОДЕРАТОРЫ -->
                                    <button class="nav-link" id="v-pills-moders-tab" data-bs-toggle="pill" data-bs-target="#v-pills-moders" type="button" role="tab" aria-controls="v-pills-moders" aria-selected="false">Модераторы</button>
                                    <!-- РЕДАКТОРЫ -->
                                    <button class="nav-link" id="v-pills-editors-tab" data-bs-toggle="pill" data-bs-target="#v-pills-editors" type="button" role="tab" aria-controls="v-pills-editors" aria-selected="false">Редакторы</button>
                                    <!-- МЕНЕДЖЕРЫ -->
                                    <button class="nav-link" id="v-pills-managers-tab" data-bs-toggle="pill" data-bs-target="#v-pills-managers" type="button" role="tab" aria-controls="v-pills-managers" aria-selected="false">Менеджеры</button>
                                </div>
                                <!-- СОДЕРЖИМОЕ ВКЛАДОК -->
                                <div class="tab-content col-12 col-md ps-0  mt-2" id="v-pills-tabContent">
                                    <!-- СОДЕРЖИМОЕ АДМИНИСТРАТОРЫ -->
                                    <div class="tab-pane fade show active" id="v-pills-admins" role="tabpanel" aria-labelledby="v-pills-admins-tab" tabindex="0">
                                        <ul class="list-group">
                                            <li class="list-group-item">
                                                <div class="row g-2">
                                                    <div class="col-12 col-md-7 col-lg-6 col-xl-5">
                                                        <input type="text" class="form-control" id="name" name="name" value="Пользователь 1" disabled readonly>
                                                    </div>
                                                    <div class="col-12 m-1">
                                                        Доступные экраны для работы в системе:
                                                    </div>
                                                    <div class="row row-cols-auto">
                                                        <div class="m-0 ms-2 p-0 b-0 mt-1">
                                                            <input type="checkbox" class="btn-check col-sm" id="btn-check-1" checked>
                                                            <label class="btn btn-outline-success" for="btn-check-1">Кафедра К3</label>
                                                        </div>
                                                        <div class="m-0 ms-2 p-0 b-0 mt-1">
                                                            <input type="checkbox" class="btn-check col-sm" id="btn-check-2">
                                                            <label class="btn btn-outline-success" for="btn-check-2">МФ TV HALL</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!-- ЕЩЁ ОДИН li ДЛЯ ДЕМОНСТРАЦИИ - УДАЛИТЬ -->
                                            <li class="list-group-item">
                                                <div class="row g-2">
                                                    <div class="col-12 col-md-7 col-lg-6 col-xl-5">
                                                        <input type="text" class="form-control" id="name" name="name" value="Пользователь 2" disabled readonly>
                                                    </div>
                                                    <div class="col-12 m-1">
                                                        Доступные экраны для работы в системе:
                                                    </div>
                                                    <div class="row row-cols-auto">
                                                        <div class="m-0 ms-2 p-0 b-0 mt-1">
                                                            <input type="checkbox" class="btn-check col-sm" id="btn-check-3" checked>
                                                            <label class="btn btn-outline-success" for="btn-check-3">Кафедра К3</label>
                                                        </div>
                                                        <div class="m-0 ms-2 p-0 b-0 mt-1">
                                                            <input type="checkbox" class="btn-check col-sm" id="btn-check-4">
                                                            <label class="btn btn-outline-success" for="btn-check-4">МФ TV HALL</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <!-- ВВЕРХУ: ЕЩЁ ОДИН li ДЛЯ ДЕМОНСТРАЦИИ - УДАЛИТЬ -->
                                        </ul>
                                    </div>
                                    <!-- СОДЕРЖИМОЕ МОДЕРАТОРЫ -->
                                    <div class="tab-pane fade" id="v-pills-moders" role="tabpanel" aria-labelledby="v-pills-moders-tab" tabindex="0">
                                        <ul class="list-group">
                                            <li class="list-group-item">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control" id="name" name="name" value="Нет доступных пользователей" disabled readonly>
                                                    </div>
                                                    <div class="col-12 m-1">
                                                        Добавьте хотя бы одного пользователя в систему с данной ролью для
                                                        настройки прав доступа к экранам.
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- СОДЕРЖИМОЕ РЕДАКТОРЫ -->
                                    <div class="tab-pane fade" id="v-pills-editors" role="tabpanel" aria-labelledby="v-pills-editors-tab" tabindex="0">
                                        <ul class="list-group">
                                            <li class="list-group-item">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control" id="name" name="name" value="Нет доступных пользователей" disabled readonly>
                                                    </div>
                                                    <div class="col-12 m-1">
                                                        Добавьте хотя бы одного пользователя в систему с данной ролью для
                                                        настройки прав доступа к экранам.
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- СОДЕРЖИМОЕ МЕНЕДЖЕРЫ -->
                                    <div class="tab-pane fade" id="v-pills-managers" role="tabpanel" aria-labelledby="v-pills-managers-tab" tabindex="0">
                                        <ul class="list-group">
                                            <li class="list-group-item">
                                                <div class="row g-2">
                                                    <div class="col-12">
                                                        <input type="text" class="form-control" id="name" name="name" value="Нет доступных пользователей" disabled readonly>
                                                    </div>
                                                    <div class="col-12 m-1">
                                                        Добавьте хотя бы одного пользователя в систему с данной ролью для
                                                        настройки прав доступа к экранам.
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Управление уведомлениями -->
                    <div class="tab-pane fade" id="pills-subs" role="tabpanel" aria-labelledby="pills-subs-tab" tabindex="0">
                        <div class="row">
                            <div class="col-12 col-lg-8 col-xl-6">
                                <select class="form-select" aria-label="Default select example">
                                    <option selected>Выберите аккаунт для настройки</option>
                                    <option value="1">Myasnyankin</option>
                                    <option value="2">Ivanov</option>
                                    <option value="3">sch</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-4 col-xl-3 mt-2">
                                <input type="email" class="form-control" placeholder="Адрес почты">
                            </div>
                            <div class="col-12 col-md-6 col-lg-4 col-xl-3 mt-2">
                                <input type="email" class="form-control" placeholder="Подтверждение адреса почты">
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-12 col-lg-8 col-xl-6">
                                <ul class="list-group">
                                    <li class="list-group-item d-flex align-items-center">
                                        <input class="form-check-input me-1 col-auto" type="checkbox" id="mail-1">
                                        <label class="form-check-label ms-1 stretched-link col" for="mail-1">
                                            Утверждение / Отклонение отправленной вами программы
                                        </label>
                                    </li>
                                    <li class="list-group-item d-flex align-items-center">
                                        <input class="form-check-input me-1 col-auto" type="checkbox" id="mail-2">
                                        <label class="form-check-label ms-1 stretched-link col" for="mail-2">
                                            Получение новых объявлений, отображаемых на трансляции
                                        </label>
                                    </li>
                                    <li class="list-group-item d-flex align-items-center">
                                        <input class="form-check-input me-1 col-auto" type="checkbox" id="mail-3">
                                        <label class="form-check-label ms-1 stretched-link col" for="mail-3">
                                            Получение новых объявлений, видимых только пользователям системы
                                        </label>
                                    </li>
                                    <li class="list-group-item d-flex align-items-center">
                                        <input class="form-check-input me-1 col-auto" type="checkbox" id="mail-4">
                                        <label class="form-check-label ms-1 stretched-link col" for="mail-4">
                                            Получение новых запросов на утверждение
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-auto mt-2">
                                <button type="button" class="btn btn-success mb-0 w-100">Сохранить оповещения</button>
                            </div>
                            <div class="col-12 col-md-6 col-lg-auto mt-2">
                                <button type="button" class="btn btn-outline-danger mb-0 w-100">Удалить почтовый адрес</button>
                            </div>
                        </div>
                    </div>

                    <!-- ЛОГИ -->
                    <div class="tab-pane fade" id="pills-logs" role="tabpanel" aria-labelledby="pills-logs-tab"
                         tabindex="0">
                        <!-- <ul v-for="(log, index) in logData" class="list-group">
                        for (var i in logData) {
                            try { logData[i][0].username;

                                <li class="list-group-item justify-content-between align-items-center">
                                    <div class="d-flex w-100 justify-content-between">
                                        <div>
                                            <strong>
                                                Изменена последовальнсоть отображения
                                            </strong>
                                            <small><i>@ logData[i][0].username </i></small>
                                        </div>
                                        <small class="text-muted"> <%= logData[i][logData[i].length - 1].date %> <%= logData[i][logData[i].length - 1].time %> </small>
                                    </div>
                                    <ul class="list-group">
                                        for (var j in logData[i]) {
                                            if (logData[i][j].type === 1) {
                                                // Добавлен элемент
                                                <li class="list-group-item justify-content-between align-items-center">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <div>
                                                            <strong> Добавлен элемент отображения </strong>
                                                        </div>
                                                        <small class="text-muted"> <%= logData[i][j].date %> <%= logData[i][j].time %> </small>
                                                    </div>
                                                    <small class="d-flex w-100 justify-content-between">
                                                        <div>Имя события: "<i><%= logData[i][j].name %></i>"</div>
                                                        <div>Тип ресурса: "<i><%= event_type[logData[i][j].e_src_type_s] %></i>"</div>
                                                        <div>Длительность: <i><%= logData[i][j].e_timing_s %> сек</i></div>
                                                        <i><a href="<%= logData[i][j].e_src_s %>">Ссылка</a></i>
                                                    </small>
                                                </li>
                                            } else if (logData[i][j].type === 0) {
                                                // Удалён элемент
                                                <li class="list-group-item justify-content-between align-items-center">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <div>
                                                            <strong> Удалён элемент отображения </strong>
                                                        </div>
                                                        <small class="text-muted"> <%= logData[i][j].date %> <%= logData[i][j].time %> </small>
                                                    </div>
                                                    <small class="d-flex w-100 justify-content-between">
                                                        <div>Имя события: "<i><%= logData[i][j].name %></i>"</div>
                                                        <div>Тип ресурса: "<i><%= event_type[logData[i][j].e_src_type_s] %></i>"</div>
                                                        <div>Длительность: <i><%= logData[i][j].e_timing_s %> сек</i></div>
                                                        <i><a href="<%= logData[i][j].e_src_s %>">Ссылка</a></i>
                                                    </small>
                                                </li>
                                            } else if (logData[i][j].type === 4) {
                                                // Удалён элемент
                                                <li class="list-group-item justify-content-between align-items-center">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <div>
                                                            <strong> Изменен порядок отображения событий </strong>
                                                        </div>
                                                    </div>
                                                </li>
                                            } else if (logData[i][j].type === 2) {
                                                // Изменён элемент
                                                <li class="list-group-item justify-content-between align-items-center">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <div>
                                                            <strong> Изменён элемент отображения </strong>
                                                        </div>
                                                        <small class="text-muted"> <%= logData[i][j].date %> <%= logData[i][j].time %> </small>
                                                    </div>
                                                    <small class="d-flex w-100 justify-content-between">
                                                        Стало:
                                                        <div>Имя события: "<i><%= logData[i][j].e_name_e %></i>"</div>
                                                        <div>Тип ресурса: "<i><%= event_type[logData[i][j].e_src_type_e] %></i>"</div>
                                                        <div>Длительность: <i><%= logData[i][j].e_timing_e %> сек</i></div>
                                                        <i><a href="<%= logData[i][j].e_src_e %>">Ссылка</a></i>
                                                    </small>
                                                    <small class="d-flex w-100 justify-content-between">
                                                        Было:
                                                        <div>Имя события: "<i><%= logData[i][j].name %></i>"</div>
                                                        <div>Тип ресурса: "<i><%= event_type[logData[i][j].e_src_type_s] %></i>"</div>
                                                        <div>Длительность: <i><%= logData[i][j].e_timing_s %> сек</i></div>
                                                        <i><a href="<%= logData[i][j].e_src_s %>">Ссылка</a></i>
                                                    </small>
                                                </li>
                                            }
                                        }
                                    </ul>
                                </li>
                            } catch (err) {
                                // Удалено объявление (вручную)
                                if (logData[i].type === 0 && !logData[i].a_isauto) {
                                    <li class="list-group-item justify-content-between align-items-center">
                                        <div class="d-flex w-100 justify-content-between">
                                            <div>
                                                <strong> Удалено объявление </strong>
                                                <small><i>@<%= logData[i].username %></i></small>
                                            </div>
                                            <small class="text-muted"><%= logData[i].date %> <%= logData[i].time %></small>
                                        </div>
                                        <small class="d-flex w-100 justify-content-between">
                                            <div>Заголовок: "<i><%= logData[i].name %></i>"</div>
                                            <div>Вывод на экран: "<i><% if (logData[i].a_translate) { %><%= 'Да' %><% } else { %><%= 'Нет' %><% } %></i>"</div>
                                            <div>До: <%= logData[i].a_timeout %></div>
                                        </small>
                                        <small class="d-flex w-100 justify-content-between">
                                            <div>
                                                Текст объявления: "<i><%= logData[i].a_comment %></i>"
                                            </div>
                                            <div>Автор: <i>@<%= logData[i].a_author %></i></div>
                                        </small>
                                    </li>
                                } else if (logData[i].type === 0 && logData[i].a_isauto) {
                                    // Удалено объявление (автоматисески)
                                    <li class="list-group-item justify-content-between align-items-center">
                                        <div class="d-flex w-100 justify-content-between">
                                            <div>
                                                <strong> Удалено объявление </strong>
                                                <small><i>@system</i></small>
                                            </div>
                                            <small class="text-muted"><%= logData[i].date %> <%= logData[i].time %></small>
                                        </div>
                                        <small>
                                            Автоматическое удаление объявления (истёк установленный срок
                                            актуальности)
                                        </small>
                                        <small class="d-flex w-100 justify-content-between">
                                            <div>Заголовок: "<i><%= logData[i].name %></i>"</div>
                                            <div>Вывод на экран: "<i><% if (logData[i].a_translate) { %><%= 'Да' %><% } else { %><%= 'Нет' %><% } %></i>"</div>
                                            <div>До: <%= logData[i].a_timeout %></div>
                                        </small>
                                        <small class="d-flex w-100 justify-content-between">
                                            <div>
                                                Текст объявления: "<i><%= logData[i].a_comment %></i>"
                                            </div>
                                            <div>Автор: <i>@<%= logData[i].a_author %></i></div>
                                        </small>
                                    </li>
                                } else if (logData[i].type === 1) {
                                    // Добавлено объявление
                                    <li class="list-group-item justify-content-between align-items-center">
                                        <div class="d-flex w-100 justify-content-between">
                                            <div>
                                                <strong> Добавлено объявление </strong>
                                                <small><i>@<%= logData[i].username %></i></small>
                                            </div>
                                            <small class="text-muted"><%= logData[i].date %> <%= logData[i].time %></small>
                                        </div>
                                        <small class="d-flex w-100 justify-content-between">
                                            <div>Заголовок: "<i><%= logData[i].name %></i>"</div>
                                            <div>Вывод на экран: "<i><% if (logData[i].a_translate) { %><%= 'Да' %><% } else { %><%= 'Нет' %><% } %></i>"</div>
                                            <div>До: <%= logData[i].a_timeout %></div>
                                        </small>
                                        <small>
                                            Текст объявления: "<i><%= logData[i].a_comment %></i>"
                                        </small>
                                    </li>
                                }
                            }
                        }

                    </ul> -->

                    </div>
                    <!-- КОНЕЦ: Содержимое вкладок -->
                </div>

            </div>
        </div>
    </div>
</template>