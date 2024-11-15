import _split from 'lodash/split';
import _map from 'lodash/map';
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';
import _result from 'lodash/result';
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';
import _pickBy from 'lodash/pickBy';

import Exception from './../exception';
import Defines from './../../config';

export default class Util {
    static getProperties(callback, props) {
        return callback.then((responce) => {
            if (responce && props && props.length > 0) {
                return this.getPropertiesByObj(responce, props);
            }
            throw new Error(Exception.MODEL_NOT_FOUND_EXCEPTION);
        });
    }

    static getPropertiesByObj(responce, props) {
        const results = responce.toJSON ? responce.toJSON() : responce;
        if (results) {
            if (_isArray(results)) {
                let res = [];
                _map(results, result => {
                    res.push(this.getPropertiesByObj(result, props));
                }, this);
                return res;
            } else {
                const responce = {};
                _map(props, prop => {
                    if (_isString(prop)) {
                        const property = _split(prop, ' as ');
                        responce[property[property.length - 1]] = _result(results, property[0]);
                    } else {
                        _pickBy(prop, (value, key) => {
                            const property = _split(key, ' as ');
                            responce[property[property.length - 1]] =
                                this.getPropertiesByObj(_result(results, property[0]), value);
                        });
                    }

                });
                return responce;
            }
        }
        return responce;
    }

    static getTempPath() {
        return Defines.TEMP_PATH;
    }

    static getValues(results, props) {
        const responce = {};
        _forEach(props, prop => {
            const property = _split(prop, ' as ');
            responce[property[property.length - 1]] = _result(results, property[0]);
        });
        return responce;
    }

    static getToken(req) {
        return _get(req, 'body.access_token') ||
            _get(req, 'query.access_token') ||
            req.headers['x-access-token'];
    }
}