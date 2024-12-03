import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class ScheduleController {
static getSchedule(id) {
    return DB("schedule")
    .leftJoin("team", 'schedule.team_id', '=', 'team.id')
    .leftJoin("equipment",'schedule.equipment_id', '=', 'equipment.id')
    .leftJoin("scheduletype",'schedule.type_id', '=', 'scheduletype.id')
    .where('schedule.id', '=', id)
    .select('schedule.id','workorder_id', 'team_id', 'client_id','equipment_id','type_id','status', 'startdate',
    'enddate','description','equipment.name as equipmentName',"scheduletype.name as typeName","job_name","team.name as teamName").then(data => { 
        return data[0]
   }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
