import Exception from './../../helpers/exception';
import DashboardService from './../../services/dashboard'

export default class DashboardController {
    static getInvoiceAndWorkorder(req, res) {
        return DashboardService.getInvoiceAndWorkorder.getInvoiceAndWorkorder().then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }
}