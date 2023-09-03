import Vuex from 'vuex';

import { alert } from './modules/alert.module';
import { users } from './modules/users.module';
import { authentication } from './modules/authentication.module';

export const store = new Vuex.Store({
    modules: {
        alert,
        authentication,
        users
    }
});