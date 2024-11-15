import Checkit from 'checkit';
import _keys from 'lodash/keys'

import Exception from './../exception';

export default class Validator {
    /**
     * @param {Object} data
     * @param {Object} rules
     * @returns {true or throw an exception}
     */
    static run(data, rules) {
        return new Checkit(rules).run(data).then(() => {
            console.log("true")

            return true;
        }).catch(e => {
            console.log(e)
            throw {
                message: Exception.INVALID_INPUT_EXCEPTION,
                detailedMessage: 'Missing required fields: ' + _keys(e.errors)
            };
        });
    }
}