import LoginController from './login'
import UserControler from './user'
import LeadController from './lead'
import ClientController from './client'
import WorkOrderController from './workorder'
import ScheduleController from './schedule'
import InvoiceController from './invoice'
import PaymentController from './payment'
import TeamController from './team'
import RoleController from './role'
import EquipmentsController from './equipments'
import ItemController from './item'
import WorkTypesController from './worktypes'
import WorkorderStatusController from './workorderstatus'
import QRCodeController from './qrcode'
import TeamLocationController from './teamlocation'
import PurchaseOrderController from './purchaseorder'
import dashboardController from './dashboard'
import TokenController from './fcmtoken'


export default (express,JWTMiddleware) => {
    const router = new express.Router();
    const jwtIgnorePaths = [
        '/api/login',
    ];
    router.use(JWTMiddleware.createApiMiddleware({
        pathRegexp: /^\/api\/.+/,
        whiteList: jwtIgnorePaths
    }));
    router.post('/api/login', LoginController.login.login);
    router.get('/api/profile', LoginController.profile.profile);
    router.put('/api/changepassword', LoginController.changePassword.changePassword);

    router.post('/api/createuser',UserControler.createUser.create)
    router.get('/api/getalluser',UserControler.getAllUser.getAll)
    router.get('/api/getuser',UserControler.getUser.getUser)
    router.put('/api/updateuser',UserControler.updateUser.update)
    router.delete('/api/deleteuser',UserControler.deleteUser.delete)
    
    router.get('/api/getallrole',RoleController.getAllRole.getAll)

    router.post('/api/createlead',LeadController.createLead.create)
    router.get('/api/getalllead',LeadController.getAllLead.getAll)
    router.get('/api/getlead',LeadController.getLead.getLead)
    router.put('/api/updatelead',LeadController.updateLead.update)
    router.delete('/api/deletelead',LeadController.deleteLead.delete)

    router.post('/api/createclient',ClientController.createClient.create)
    router.post('/api/convertleadtoclient',ClientController.convertLeadToClient.convert)
    router.get('/api/getallclient',ClientController.getAllClient.getAll)
    router.get('/api/getclient',ClientController.getClient.getClient)
    router.put('/api/updateclient',ClientController.updateClient.update)
    router.delete('/api/deleteclient',ClientController.deleteClient.delete)


    router.post('/api/createworkorder',WorkOrderController.createWorkOrder.create)
    router.get('/api/getallworkorder',WorkOrderController.getAllWorkOrder.getAll)
    router.get('/api/getworkorder',WorkOrderController.getWorkOrder.getWorkOrder)
    router.get('/api/getworkorderbyclient',WorkOrderController.getWorkOrderByClient.getWorkOrder)
    router.put('/api/updateworkorder',WorkOrderController.updateWorkOrder.update)
    router.delete('/api/deleteworkorder',WorkOrderController.deleteWorkOrder.delete)

    router.post('/api/createschedule',ScheduleController.createSchedule.create)
    router.get('/api/getallschedule',ScheduleController.getAllSchedule.getAll)
    router.get('/api/getschedule',ScheduleController.getSchedule.getSchedule)
    router.get('/api/getschedulebyclient',ScheduleController.getScheduleByClient.getSchedule)
    router.get('/api/getschedulebyworkorder',ScheduleController.getScheduleByWorkorder.getSchedule)
    router.put('/api/updateschedule',ScheduleController.updateSchedule.update)
    router.delete('/api/deleteschedule',ScheduleController.deleteSchedule.delete)


    router.post('/api/createinvoice',InvoiceController.createInvoice.create)
    router.get('/api/getallinvoice',InvoiceController.getAllInvoice.getAll)
    router.get('/api/getinvoice',InvoiceController.getInvoice.getInvoice)
    router.get('/api/getinvoicebyclient',InvoiceController.getInvoiceByClient.getInvoice)
    router.get('/api/getinvoicebyworkorder',InvoiceController.getInvoiceByWorkorder.getInvoice)
    router.put('/api/updateinvoice',InvoiceController.updateInvoice.update)
    router.delete('/api/deleteinvoice',InvoiceController.deleteInvoice.delete)
    router.get("/api/downloadinvoice",InvoiceController.downloadInvoice.download)
    router.get("/api/downloadinvoicebuffer",InvoiceController.downloadInvoice.downloadBuffer)

    router.post('/api/createpayment',PaymentController.createPayment.create)
    router.get('/api/getallpayment',PaymentController.getAllPayment.getAll)
    router.get('/api/getpayment',PaymentController.getPayment.getPayment)
    router.get('/api/getpaymentbyclient',PaymentController.getPaymentByClient.getPayment)
    router.get('/api/getpaymentbyinvoice',PaymentController.getPaymentByInvoice.getPayment)
    router.put('/api/updatepayment',PaymentController.updatePayment.update)
    router.delete('/api/deletepayment',PaymentController.deletePayment.delete)

    router.post('/api/createteam',TeamController.createTeam.create)
    router.get('/api/getallteam',TeamController.getAllTeam.getAll)
    router.get('/api/getteam',TeamController.getTeam.getTeam)
    router.put('/api/updateteam',TeamController.updateTeam.update)
    router.delete('/api/deleteteam',TeamController.deleteTeam.delete)

    router.get('/api/getequipments',EquipmentsController.getAllEquipments.getAll)
    router.post('/api/createequipments',EquipmentsController.createEquipments.create)

    router.get('/api/getitem',ItemController.getAllItem.getAll)
    router.post('/api/createitem',ItemController.createItem.create)

    router.get('/api/getworktypes',WorkTypesController.getAllTypes.getAll)
    router.post('/api/createworktypes',WorkTypesController.createTypes.create)

    router.get('/api/getworkorderstatus',WorkorderStatusController.getAllStatus.getAll)
    router.post('/api/createworkorderstatus',WorkorderStatusController.createStatus.create)

    router.get('/api/getallqrcode',QRCodeController.getAllQRCode.getAll)
    router.get('/api/getqrcode',QRCodeController.getQRCode.getQRCode)
    router.get('/api/getqrcodebyworkorder',QRCodeController.getQRCodeByWorkorder.getQRCodeByWorkorder)
    router.get('/api/getqrcodebyclient',QRCodeController.getQRCodeByClient.getQRCodeByClient)
    router.post('/api/createqrcode',QRCodeController.createQRCode.create)

    router.get('/api/getallteamlocation',TeamLocationController.getAllTeamLocation.getAll)
    router.post('/api/createteamlocation',TeamLocationController.createTeamLocation.create)

    router.get('/api/getalltoken',TokenController.getAllFcmToken.getAll)
    router.get('/api/sendnotification',TokenController.sendNotification.sendNotification)
    router.post('/api/createtoken',TokenController.createFcmToken.create)

    router.post('/api/createpurchaseorder',PurchaseOrderController.createPurchase.create)
    router.get('/api/getallpurchaseorder',PurchaseOrderController.getAllPurchase.getAll)
    router.get('/api/getpurchaseorder',PurchaseOrderController.getPurchase.getPurchase)
    router.get('/api/getpurchaseorderbyclient',PurchaseOrderController.getPurchaseByClient.getPurchaseByClient)
    router.get('/api/getpurchaseorderbyworkorder',PurchaseOrderController.getPurchaseByWorkorder.getPurchaseByWorkorder)
    router.put('/api/updatepurchaseorder',PurchaseOrderController.updatePurchase.update)
    router.delete('/api/deletepurchaseorder',PurchaseOrderController.deletePurchase.delete)

    router.get('/api/getleadworkordercount',dashboardController.getLeadWorkorderCount.getLeadWorkorderCount)
    router.get('/api/getworkorderbyteam',dashboardController.getWorkorderByTeam.getWorkorderByTeam)
    router.get('/api/getInvoiceAndWorkorder',dashboardController.getInvoiceAndWorkorder.getInvoiceAndWorkorder)

    // router.post('/api/logout', LoginController.logout);
    return router;
}