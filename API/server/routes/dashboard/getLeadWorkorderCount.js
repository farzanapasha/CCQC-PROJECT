import Exception from './../../helpers/exception';
import DashboardService from './../../services/dashboard'

export default class DashboardController {
    static getLeadWorkorderCount(req, res) {
        const {
            startDate, endDate
        } = req.query;

        return DashboardService.getLeadWorkorderCount.getLeadWorkorderCount(startDate, endDate).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }
}