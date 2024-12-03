import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class TeamController {
static getTeam(id) {
    return DB("teamusermapping")
    .leftJoin('team', 'teamusermapping.team_id', '=', 'team.id')
    .leftJoin('user', 'teamusermapping.user_id', '=', 'user.id').where("'team.id'","=",id)
    .select('user.email', 'team.name as teamName', 'team.id as teamId',
        'user.name', 'user.gender', 'user.phone',"description","user.id as userId").then(data => {
            return _.map(_.groupBy(data, item =>item.teamId), (value, key) => {
                return {
                    name: value[0].teamName,
                    id: key,
                    description:value[0].description,
                    members: _.map(value, memberitem => {
                        return {
                            name: memberitem.name,
                            phone: memberitem.phone,
                            email: memberitem.email,
                            userId:memberitem.userId
                        }
                    })
                }
            })
        }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
