<template>
    <video muted="muted" :id="'v' + id" autoplay :src="src"></video>
</template>

<script>
export default {
    props: ['src', 'id'],
    data() {
        return {};
    },
    methods: {},
    mounted() {
        var _self = this;
        this.emitter.on('change', function (id) {
            if (id === _self.id) document.getElementById('v' + _self.id).play();
            else document.getElementById('v' + _self.id).pause();
        });
    },
};
</script>
