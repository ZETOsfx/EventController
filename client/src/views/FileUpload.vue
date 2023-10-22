
<template>
    <div class="intro">
        <!-- Full Screen Modal -->
        <div v-if="this.files.length > 0" class="modal fade" id="fullScreenModal" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ this.forModal.name }}.{{ this.forModal.format
                        }} ({{ this.forModal.weight }})</h1>
                        <button type="button" class="btn btn-outline-secondary btn-sm col-auto ms-1"
                            data-bs-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path
                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img v-if="this.forModal.type === 'img' || this.forModal.type === 'image'" :src="this.forModal.src"
                            style="object-fit: contain; width: 100%; height: 100%;" alt="">
                    </div>
                    <div class="modal-footer">
                        <div class="row justify-content-between">
                            <div class="col-auto"> Загрузил: {{ this.forModal.author }} </div>
                            <div v-if="!this.forModal.unlim" class="col-auto"> Актуально до: {{ this.forModal.actual }}
                            </div>
                            <div v-if="this.forModal.unlim" class="col-auto"> Бессрочно </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Delete -->
        <div class="modal fade" id="ModalDeleteFile" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Подтверждение удаления</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Вы собираетесь удалить файл "{{ this.forModal.name }}". <br> Вы уверены?
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button @click=" deleteItem(this.forModal.index)" class="btn btn-danger"
                            data-bs-dismiss="modal">Удалить</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h6 class="text mt-4"> Загрузка файлов </h6>
            <!-- ADD FORM -->
            <div class="content">
                <div class="mb-3">
                    <form action="/files/img/add" method="POST" enctype="multipart/form-data"
                        @submit="handleFormSubmit($event)">
                        <div class="row ms-0 me-0 mt-0 gx-2 mb-1">
                            <div class="col-12 mb-2">
                                <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                    style="position: relative;">
                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
                                        {{ storagePercent }} <small class="text-body-secondary ms-1">({{ storageUsed }} / {{
                                            storageSize }})</small></div>
                                    <div id="progressBarStorage" class="progress-bar bg-success"></div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-10 mb-2">
                                <input @change="handleUploads" name="image" class="form-control" type="file" id="formFile"
                                    accept="image/*" multiple ref="inputFile">
                            </div>
                            <div class="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2">
                                <button @click="uploadFiles" type="submit" class="btn btn-success w-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-upload" viewBox="0 0 16 16">
                                        <path
                                            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z">
                                        </path>
                                        <path
                                            d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z">
                                        </path>
                                    </svg>
                                    Загрузить
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div v-if="this.sendFiles.length > 0"
                    class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-2">
                    <div v-for="(file, index) in sendFiles" class="col">
                        <div class="card h-100">
                            <!-- <small class="card-header">
                                <div class="row justify-content-end">
                                    <button @click="triggerModal('read', index, 'sendFiles')" type="button" class="btn btn-outline-secondary btn-sm col-auto ms-1" data-bs-toggle="modal" data-bs-target="#fullScreenModal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path>
                                        </svg>
                                    </button>
                                    <button @click="sendFiles.splice(index, 1)" type="button" class="btn btn-outline-danger btn-sm col-auto ms-1" data-bs-toggle="modal" data-bs-target="#ModalDeleteFile">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </small> -->
                            <img v-if="file.type.includes('image')"
                                :src="'data:image/' + file.type + ';base64,' + this.fileURL[index]"
                                style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;" alt="">
                            <img v-if="file.type.includes('video')" :src="this.fileURL[index]"
                                style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;" alt="">
                            <div class="card-body">
                                <h6 class="card-title">{{ file.name }}
                                    <small class="text-body-secondary ms-1"> {{ Math.round(file.size / (1024 * 1024) *
                                        100) / 100 }} МБ </small>
                                </h6>
                                <small class="card-text">{{ session.public_name }}</small>
                            </div>
                            <!-- <div class="card-footer">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-auto">
                                        <small v-if="file.actual !== '01-01-9999'" class="text-body-secondary"> До: {{ file.actual }} </small>
                                        <small v-if="file.actual === '01-01-9999'" class="text-body-secondary"> Бессрочно </small>
                                    </div>
                                    <div class="col-auto">
                                        <input id="Date" class="form-control" type="date"/>
                                    </div>
                                    <button type="button" class="btn btn-success col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div v-if="showProgressBar" class="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    <div id="progressLoadForm" class="progress-bar progress-bar-striped progress-bar-animated bg-success">{{
                        progressLoaded }}%</div>
                </div>
            </div>

            <!-- FILE LIST -->
            <div v-if="this.files.length === 0" class="content"> Загруженные файлы отсутствуют.</div>
            <div v-if="this.files.length > 0" class="content">
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-2">
                    <div v-for="(file, index) in this.files" class="col">
                        <div class="card h-100">
                            <small class="card-header">
                                <div class="row justify-content-end">
                                    <button @click="triggerModal('read', index, 'files')" type="button"
                                        class="btn btn-outline-secondary btn-sm col-auto ms-1" data-bs-toggle="modal"
                                        data-bs-target="#fullScreenModal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-fullscreen" viewBox="0 0 16 16">
                                            <path
                                                d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z">
                                            </path>
                                        </svg>
                                    </button>
                                    <a type="button" :href="file.src" @click.prevent="downloadItem(file)"
                                        class="btn btn-outline-success btn-sm col-auto ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-download" viewBox="0 0 16 16">
                                            <path
                                                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z">
                                            </path>
                                            <path
                                                d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z">
                                            </path>
                                        </svg>
                                    </a>
                                    <button type="button" class="btn btn-outline-danger btn-sm col-auto ms-1">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            @click="triggerModal('delete', index, 'files')" width="16" height="16"
                                            fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"
                                            data-bs-toggle="modal" data-bs-target="#ModalDeleteFile">
                                            <path
                                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </small>
                            <img v-if="file.type === 'image'" :src="file.src"
                                style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;" alt="">
                            <video v-if="file.type === 'video'" :src="file.src"
                                style="object-fit: cover; width: 100%; height: 100%; max-height: 140px;"></video>
                            <div class="card-body">
                                <h6 class="card-title">{{ file.name }}.{{ file.format }}
                                    <small class="text-body-secondary ms-1"> {{ file.weight }} </small>
                                </h6>
                                <small class="text-body-secondary">
                                    {{ file.author }}
                                </small>
                            </div>
                            <div class="card-footer">
                                <div class="row justify-content-between align-items-center">
                                    <div v-if="!file.edit" class="col-auto">
                                        <small v-if="!file.unlim" class="text-body-secondary"> До: {{ file.actual }}
                                        </small>
                                        <small v-if="file.unlim" class="text-body-secondary"> Бессрочно </small>
                                    </div>

                                    <div v-if="file.edit" class="col-12 mb-2">
                                        <input v-if="!file.unlim" id="Date" v-model="file.actual" class="form-control"
                                            type="date" />
                                    </div>
                                    <div v-if="file.edit" class="col-6">
                                        <div class="row m-0 p-0">
                                            <input type="checkbox" v-model="file.unlim" class="btn-check col"
                                                id="btn-check-outlined" autocomplete="off">
                                            <label class="btn btn-outline-info" for="btn-check-outlined">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z">
                                                    </path>
                                                    <path
                                                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z">
                                                    </path>
                                                </svg>
                                            </label> <br>
                                        </div>
                                    </div>
                                    <div v-if="file.edit" class="col-6">
                                        <button type="button" @click="file.edit = false" class="btn btn-success w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                                <path
                                                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>

                                    <button v-if="!file.edit" @click="file.edit = true" type="button"
                                        class="btn btn-outline-secondary btn-sm col-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            class="bi bi-pencil" viewBox="0 0 16 16">
                                            <path
                                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    inject: ['session', 'socket', 'toast', 'options'],
    data()
    {
        return {
            minScreenSizeError: false,

            showProgressBar: false,
            progressLoaded: 0,

            storagePercent: 0,
            storageSize: 100,
            storageUsed: 0,

            fileURL: [],
            sendFiles: [],
            files: [],

            forModal: {
                index: -1,
                name: '',
                format: '',
                weight: '',
                actual: '',
                author: '',
                src: '',
                type: '',
                unlim: false,
            }
        }
    },
    methods: {
        connect()
        {
            //
        },

        async getFiles()
        {
            let responseFiles = await fetch('/files/img', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                }),
            });
            responseFiles = await responseFiles.json();

            if (responseFiles.status === 'success') {
                this.files = responseFiles.data;
            } else {
                this.toast('error', responseFiles.data);
            }

            let responseStorage = await fetch('/storage', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'x-access-token': JSON.parse(localStorage.getItem('user')).token,
                }),
            });
            responseStorage = await responseStorage.json();

            if (responseStorage.status === 'success') {
                this.storagePercent = responseStorage.data[2];
                this.storageUsed = responseStorage.data[1];
                this.storageSize = responseStorage.data[0];

                document.getElementById('progressBarStorage').setAttribute('style', 'width: ' + this.storagePercent);
            } else {
                this.toast('error', responseFiles.data);
            }
        },

        updateBar()
        {
            document.getElementById('progressLoadForm').removeAttribute('style');
            document.getElementById('progressLoadForm').setAttribute('style', 'width: ' + this.progressLoaded + '%');
        },

        handleFormSubmit(event)
        {
            event.preventDefault();

            if (!this.fileURL[0]) {
                this.toast('error', 'Выберите файлы для загрузки.');
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', event.target.action);
            xhr.setRequestHeader('x-access-token', JSON.parse(localStorage.getItem('user')).token);
            this.showProgressBar = true;

            let compose = this;
            xhr.onload = function ()
            {
                if (this.status === 200) {
                    compose.$refs.inputFile.value = null;
                    compose.showProgressBar = false;
                    compose.progressLoaded = 0;
                    compose.sendFiles = [];
                    compose.getFiles();
                    compose.toast('success', 'Файлы успешно загружены в хранилище.');
                } else {
                    compose.toast('error', 'Ошибка загрузки файла(ов).');
                }
            };

            xhr.upload.addEventListener('progress', function (event)
            {
                const percentComplete = (event.loaded / event.total) * 100;
                compose.progressLoaded = Math.round(percentComplete);
                compose.updateBar();
            });

            xhr.send(new FormData(event.target));
        },

        handleUploads(event)
        {
            this.sendFiles = [];
            this.fileURL = [];

            for (let i in event.target.files) {
                this.sendFiles.push(event.target.files[i]);
            }

            this.sendFiles.splice(this.sendFiles.length - 2, 2);

            for (let i in this.sendFiles) {
                if (this.sendFiles[i].type.includes('image')) {
                    const reader = new FileReader();
                    reader.readAsDataURL(event.target.files[i]);
                    reader.onload = () => this.fileURL.push((reader.result).split(",")[1]);
                } else {
                    this.fileURL.push('data:image/png;base64,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');
                }
            }
        },

        async deleteItem(index)
        {
            const id = this.files[index].id;

            let response = await fetch('/files/img/delete', this.options('DELETE', { id }));
            response = await response.json();

            if (response.status === 'success') {
                this.files.splice(index, 1);
                this.toast('success', 'Файл успешно удален из хранилища.');
            } else {
                this.toast('error', response.cb);
            }
        },

        triggerModal(ops, indexorfile, src)
        {
            switch (ops) {
                case 'read':
                    if (src === 'files') {
                        this.forModal.index = indexorfile;
                        this.forModal.name = this.files[indexorfile].name;
                        this.forModal.actual = this.files[indexorfile].actual;
                        this.forModal.author = this.files[indexorfile].author;
                        this.forModal.src = this.files[indexorfile].src;
                        this.forModal.format = this.files[indexorfile].format;
                        this.forModal.weight = this.files[indexorfile].weight;
                        this.forModal.type = this.files[indexorfile].type;
                    } else {
                        this.forModal.index = indexorfile;
                        this.forModal.name = this.sendFiles[indexorfile].fileName.split('.')[0];
                        this.forModal.unlim = true;
                        this.forModal.author = this.sendFiles[indexorfile].author;
                        this.forModal.src = this.sendFiles[indexorfile].dataUrl;
                        this.forModal.format = this.sendFiles[indexorfile].fileExtension;
                        this.forModal.weight = ('weight');
                        this.forModal.type = this.sendFiles[indexorfile].fileMimeType.split('/')[0];
                    }
                    // fetch '/open' 
                    // - success - open view-modal
                    // - error - error message
                    break;
                case 'add':
                    this.forModal.file = indexorfile;
                    // addModal
                    break;
                case 'delete':
                    if (src === 'files') {
                        this.forModal.index = indexorfile;
                        this.forModal.name = this.files[indexorfile].name;
                        this.forModal.actual = this.files[indexorfile].actual;
                        this.forModal.author = this.files[indexorfile].author;
                        this.forModal.src = this.files[indexorfile].src;
                        this.forModal.format = this.files[indexorfile].format;
                        this.forModal.weight = this.files[indexorfile].weight;
                        this.forModal.type = this.files[indexorfile].type;
                    } else {
                        this.forModal.index = indexorfile;
                        this.forModal.name = this.sendFiles[indexorfile].fileName.split('.')[0];
                        this.forModal.unlim = true;
                        this.forModal.author = this.sendFiles[indexorfile].author;
                        this.forModal.src = this.sendFiles[indexorfile].dataUrl;
                        this.forModal.format = this.sendFiles[indexorfile].fileExtension;
                        this.forModal.weight = ('weight');
                        this.forModal.type = this.sendFiles[indexorfile].fileMimeType.split('/')[0];
                    }
                    break;
            }
        },

        downloadItem(file)
        {
            axios({
                url: file.src,
                method: 'GET',
                responseType: 'blob',
            }).then((response) =>
            {
                let fileURL = window.URL.createObjectURL(new Blob([response.data]));
                let fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', file.name + '.' + file.format);
                document.body.appendChild(fileLink);
                fileLink.click();
            });
        },
    },
    mounted()
    {
        this.connect();
        this.getFiles();
    }
}
</script>