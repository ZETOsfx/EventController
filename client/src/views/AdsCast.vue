<template>
    <div class="intro">
        <div class="p-3 m-3 mt-0 pt-0" style="font-size: 135%;">
            <h3 class="text p-0 mt-4" style="font-size: 135%;"> Важные объявления: </h3>
            <div class="row">
                <div v-for="ad in this.ads" class="col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-3 mb-sm-0 g-3">
                    <div class="card h-100">
                        <div class="card-header"> {{ ad.author }} </div>
                        <div class="card-body">
                            <h3 class="card-title"> {{ ad.name }} </h3>
                            <p class="card-text"> {{ ad.comment }} </p>
                        </div>
                        <div v-if="ad.timeOfLife === '9999-01-01'" class="card-footer"> Актуально: бессрочно </div>
                        <div v-if="ad.timeOfLife !== '9999-01-01'" class="card-footer"> Актуально до: {{ ad.timeOfLife }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['toast'],
    data()
    {
        return {
            ads: [],
        }
    },
    methods: {
        async getAds()
        {
            let response = await fetch('/notes/cast', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                })
            });
            response = await response.json();

            if (response.status === 'success') {
                this.ads = response.data;
            } else {
                this.toast('error', 'Что-то пошло не так :(');
            }
        }
    },

    async mounted()
    {
        await this.getAds();
        setInterval(async function ()
        {
            await this.getAds();
        }, 60000);
    }
}
</script>