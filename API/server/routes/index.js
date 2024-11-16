import LoginController from './login'
import UserControler from './user'
import ClientController from './client'
import RoleController from './role'
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

    router.post('/api/createclient',ClientController.createClient.create)
    router.post('/api/convertleadtoclient',ClientController.convertLeadToClient.convert)
    router.get('/api/getallclient',ClientController.getAllClient.getAll)
    router.get('/api/getclient',ClientController.getClient.getClient)
    router.put('/api/updateclient',ClientController.updateClient.update)
    router.delete('/api/deleteclient',ClientController.deleteClient.delete)
    
    router.get('/api/getalltoken',TokenController.getAllFcmToken.getAll)
    router.get('/api/sendnotification',TokenController.sendNotification.sendNotification)
    router.post('/api/createtoken',TokenController.createFcmToken.create)

    // router.post('/api/logout', LoginController.logout);
    return router;
}
