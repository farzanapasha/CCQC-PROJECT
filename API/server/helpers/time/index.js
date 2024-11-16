import moment from 'moment';

export default class Time {

    /**
     * @type {string}
     */
    static DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    /**
     * @param {string} [format]
     * @return {string}
     */
    static now(format = this.DEFAULT_FORMAT) {
        return moment.utc().format(format);
    }

    /**
     * @param {number} time
     * @returns {boolean}
     */
    static isEarlierThanNow(time) {
        return time < moment.utc().valueOf();
    }

    /**
     * @param {number} time
     * @returns {boolean}
     */
    static isLaterThanNow(time) {
        return time > moment.utc().valueOf();
    }

    /**
     * @param {number} [amount=1]
     * @param {string} [type=hours]
     * @return {number}
     */
    static addTimeFromNow(amount, type) {
        return moment.utc().add(amount, type).valueOf();
    }
    static getSeconds(amount, type) {
        return moment.utc(0).add(amount, type).valueOf();
    }

}