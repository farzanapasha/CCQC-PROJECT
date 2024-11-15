import _pick from 'lodash/pick';


export default class ProfileController {
static profile(req, res) {
        res.status(200).json({
            data: req.session.user
        });
}
}
