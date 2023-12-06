import Vuex from 'vuex';

import { alert } from './modules/alert.module';
import { authentication } from './modules/authentication.module';
import { users } from './modules/users.module';

export const store = new Vuex.Store({
    modules: {
        alert,
        authentication,
        users,
    },
});
