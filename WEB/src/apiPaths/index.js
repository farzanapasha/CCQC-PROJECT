import lead from './lead'
import client from './client'
import workorder from './workorder'
import schedule from './schedule'
import invoice from './invoice'
import payment from './payment'
import team from './team'
import user from './user'
import role from './role'
import equipment from './equipment'
import scheduletype from './scheduletype'
import workorderstatus from './workorderstatus'
import item from './item'
import qrcode from './qrcode'
import purchase from './purchase'
import dashboard from './dashboard'

const apiPaths = {
    login:'/api/login',
    lead:lead,
    client:client,
    workorder:workorder,
    schedule:schedule,
    invoice:invoice,
    payment:payment,
    equipment:equipment,
    scheduletype:scheduletype,
    team:team,
    item:item,
    workorderstatus:workorderstatus,
    user:user,
    purchase:purchase,
    qrcode:qrcode,
    dashboard:dashboard,
    role:role
}

export default apiPaths;