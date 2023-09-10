require('dotenv').config();
const db = require('../../config/dbConfig');

class Worker
{
    public getDate() {
        let date_ob = new Date();
        let dd = ("0" + date_ob.getDate()).slice(-2);
        let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let yyyy = date_ob.getFullYear();

        if (((Number(mm) % 2 === 1 && Number(mm) <= 7) || (Number(mm) > 7 && Number(mm) % 2 === 0)) && Number(dd) > 28) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (31 - Number(dd)));
            }
        } else if ((Number(mm) === 4 || Number(mm) === 6 || Number(mm) === 9 || Number(mm) === 11) && Number(dd) > 27) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (30 - Number(dd)));
            }
        } else if (Number(mm) === 2 && Number(dd) > 25) {
            if (Number(mm) + 1 < 10) {
                return yyyy + '-0' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
            } else {
                return yyyy + '-' + (Number(mm) + 1) + '-0' + (3 - (28 - Number(dd)));
            }
        } else {
            if (Number(dd) + 3 < 10) {
                return yyyy + '-' + mm + '-0' + (Number(dd) + 3);
            } else {
                return yyyy + '-' + mm + '-' + (Number(dd) + 3);
            }
        }
    }
}

module.exports = new Worker();