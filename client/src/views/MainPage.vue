<template>
    <div class="intro">
        <link rel="stylesheet" href="/css/style_new.css" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/fa.min.css" rel="stylesheet" />
        <link href="/css/tabcolor.css" rel="stylesheet" />

        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link href="/css/boxicons.min.css" rel="stylesheet" />
        <div class="container">
            <h6 class="text mt-4">События К3 МФ МГТУ</h6>
            <div class="p-1 m-0">
                <div class="row">
                    <div v-for="ad in this.ads" class="col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-3 mb-sm-0 mt-1 gx-2">
                        <div class="card h-100">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-6 text-start">
                                        <div class="badge bg-secondary text-wrap align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                            </svg>
                                            {{ ad.author.name }}
                                        </div>
                                    </div>
                                    <div v-if="ad.expires === '9999-01-01'" class="col-6 text-end">
                                        <div class="badge bg-secondary text-wrap align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                            </svg>
                                            Бессрочно
                                        </div>
                                    </div>
                                    <div v-if="ad.expires !== '9999-01-01'" class="col-6 text-end">
                                        <div class="badge bg-secondary text-wrap align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                            </svg>
                                            {{ ad.expires }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ ad.name }}</h5>
                                <p class="card-text">{{ ad.comment }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['options', 'toast'],
    data() {
        return {
            ads: [],
        };
    },
    methods: {
        async getAds() {
            let response = await fetch(`/notes/cast`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }),
            });
            response = await response.json();

            if (response.status === 'success') {
                this.ads = response.data;
            } else {
                this.toast('error', 'Что-то пошло не так :(');
            }
        },
    },
    async mounted() {
        await this.getAds();
        this.emitter.emit('refresh', JSON.stringify(localStorage.getItem('user')).token);
    },
};
</script>
