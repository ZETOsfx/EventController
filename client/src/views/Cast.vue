<template>
    <div v-if="isInit" class="background">
        <div class="layer-text">
            Loading... [{{ activeItemId }}/{{ calcTypeFrom() }}]
        </div>
        <div class="layer">
        </div>
    </div>
    <template v-for="page in pages.image">
        <customImage v-show="page.id === activeItemId" :src="page.src" />
    </template>
    <template v-for="page in pages.video">
        <customVideo :id="page.id" v-show="page.id === activeItemId" :src="page.src"></customVideo>
    </template>
    <template v-for="page in pages.form">
        <customIframe :itemId="page.id" :load="formLoad" v-show="page.id === activeItemId" :src="page.src"></customIframe>
    </template>
</template>

<script>
import customImage from "../components/image.vue";
import customVideo from "../components/video.vue";
import customIframe from "../components/iframe.vue";

export default {
    inject: ['socket', 'toast'],
    components: {
        customImage,
        customVideo,
        customIframe,
    },
    data()
    {
        return {
            list: null,
            now: Date.now(),
            pages: {
                image: [{ id: null, src: null }],
                video: [{ id: null, src: null }],
                form: [{ id: null, src: null }],
                end: [{ id: null, src: null }]
            },
            activeItemId: -1,
            isInit: true,
            loadingId: []
        }
    },
    methods: {
        connect()
        {
            this.socket().on('active:upd', async (data) =>
            {
                console.log('Update signal:' + data.for);
                window.location.reload();
            });
        },

        async getData()
        {
            let response = await fetch('/cast', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                })
            });
            response = await response.json();

            if (response.status === 'success') {
                this.list = response.data;
            } else {
                this.toast('error', 'Что-то пошло не так :(');
            }
        },

        async buildPages()
        {
            for (let i in this.list) {
                let obj = this.list[i];
                obj.id = parseInt(i);

                if (this.pages[obj.type][0].src === null) {
                    this.pages[obj.type] = [];
                }

                this.pages[obj.type].push(obj);
                if (obj.type === "form" && this.isInit) {
                    this.activeItemId = obj.id;
                    await this.checkLoad(this.activeItemId)
                }
            }
        },
        async getPage()
        {
            if (this.now > (new Date(this.list[this.list.length - 1].time)).getTime()) {
                await this.getData();
                await this.buildPages();
            }
            for (let k in this.list) {
                let time = (new Date(this.list[k].time)).getTime()
                if (this.now > time) continue;
                if (k != 0) {
                    return this.list[parseInt(k) - 1].id;
                } else {
                    return this.activeItemId;
                }
            }
        },
        async formLoad(e)
        {
            this.loadingId.push(parseInt(e.currentTarget.dataset.id))
        },
        async timer()
        {
            this.now = Date.now();
            this.activeItemId = await this.getPage();
            this.emitter.emit('change', this.activeItemId);
        },
        calcTypeFrom()
        {
            let z = 0;
            for (let i in this.list) {
                let obj = this.list[i];
                if (obj.type === "form") {
                    z++;
                }
            }
            return z;
        },
        async checkLoad(id)
        {
            let _self = this;
            let promise = new Promise(function (resolve, reject)
            {
                let intr = setInterval(async () =>
                {
                    for (let i in _self.loadingId) {
                        if (_self.loadingId[i] === id) {
                            clearInterval(intr);
                            return resolve();
                        }
                    }
                }, 200);
            });
            return promise;
        },
        sleep(time)
        {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    },
    async mounted()
    {
        this.connect();
        await this.getData();

        this.buildPages().then(() =>
        {
            this.isInit = false;
            this.list.sort((a, b) =>
            {
                return (new Date(a.time).getTime()) - (new Date(b.time).getTime());
            });
            this.timer();
            setInterval(this.timer, 2000);
        })
    }
}
</script>