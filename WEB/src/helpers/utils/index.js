import _ from 'lodash';

export default class Util {
    static numStandard(number, decPlaces) {
        if (number < 1000000) {
            decPlaces = 0
        }
        decPlaces = Math.pow(10, decPlaces);
        var abbrev = ["K", "M", "B", "T"];
        for (var i = abbrev.length - 1; i >= 0; i--) {
            var size = Math.pow(10, (i + 1) * 3);
            if (size <= number) {
                number = Math.round(number * decPlaces / size) / decPlaces;
                number += abbrev[i];
                break;
            }
        }
        return number;
    }
    static getPropertiesByObj(responce, props) {
        const results = responce.toJSON ? responce.toJSON() : responce;
        if (results) {
            if (_.isArray(results)) {
                let res = [];
                _.map(results, result => {
                    res.push(this.getPropertiesByObj(result, props));
                }, this);
                return res;
            } else {
                const responce = {};
                _.map(props, prop => {
                    if (_.isString(prop)) {
                        const property = _.split(prop, ' as ');
                        responce[property[property.length - 1]] = _.result(results, property[0]);
                    } else {
                        _.pickBy(prop, (value, key) => {
                            const property = _.split(key, ' as ');
                            responce[property[property.length - 1]] =
                                this.getPropertiesByObj(_.result(results, property[0]), value);
                        });
                    }

                });
                return responce;
            }
        }
        return responce;
    }
}