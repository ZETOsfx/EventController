<template>
    <div class="intro">
        <div class="container text-center">
            <div class="row justify-content-center">
                <div class="col col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3 mt-5">
                    <div class="content mt-5">
                        <h3>ВХОД</h3>
                        <br />
                        <div class="form-floating">
                            <div class="form-floating is-invalid">
                                <input @keyup.enter="formNextFocus" v-model="username" type="text" class="form-control mb-2"
                                    name="name" id="floatingInputGroup" placeholder="Логин" style="color: black" required>
                                <label for="floatingInputGroup" style="color: black">Логин</label>
                            </div>
                        </div>
                        <div class="form-floating is-invalid">
                            <input @keyup.enter="signIn" v-model="password" type="password" class="form-control mb-2"
                                id="FIG" name="password" placeholder="Пароль" style="color: black" required>
                            <label for="FIG" style="color: black">Пароль</label>
                        </div>

                        <div v-show="submitted && !username && password" class="invalid-feedback">
                            Введите логин
                        </div>
                        <div v-show="submitted && !password && username" class="invalid-feedback">
                            Введите пароль
                        </div>
                        <div v-show="submitted && !password && !username" class="invalid-feedback">
                            Введите данные для входа
                        </div>
                        <div v-show="submitted && !loggingIn && password && username" class="invalid-feedback">
                            Логин или пароль не совпадают
                        </div>

                        <button @click="signIn" type="button" class="w-100 btn btn-lg btn-success">Войти</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data()
    {
        return {
            username: '',
            password: '',
            message: '',
            submitted: false,
        }
    },
    computed: {
        loggingIn()
        {
            return this.$store.state.authentication.status.loggingIn;
        },
    },
    created()
    {
        this.$store.dispatch('authentication/logout');
    },
    methods: {
        formNextFocus()
        {
            this.$nextTick(() =>
            {
                document.getElementById('FIG').focus({ focusVisible: true });
            });
        },
        async signIn()
        {
            this.submitted = true;

            const { username, password } = this;
            const { dispatch } = this.$store;

            if (username && password) {
                await dispatch('authentication/login', { username, password });
            }
        },
    }
}
</script>