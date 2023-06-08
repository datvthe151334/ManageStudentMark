const { Op } = require('sequelize');
const queryParams = require('../utils/query-params');
const ErrorResponse = require('../libs/error-response');
// @ts-ignore
const { Notification, UserMaster } = require('../models');
const getAccountFromToken = require('../utils/account-token');
class NotificationService {
    async fncFindOne(req) {
        const { id } = req.params;

        return Notification.findOne({
            where: { ID: id },
            include: [
                {
                    model: UserMaster,
                },
            ],
        });
    }

    async fncCreateOne(req) {
        return Notification.create({
            ...req.body,
            CreatedBy: getAccountFromToken(req),
        });
    }

    async fncFindAll(req) {
        const queries = queryParams(
            req.query,
            Op,
            //
            ['Description'],
            ['Status', 'CreatedDate', 'UserMasterID', 'UpdatedDate']
        );

        return Notification.findAndCountAll({
            order: [['CreatedDate', 'DESC']],
            where: queries.searchOr,
            include: [
                {
                    model: UserMaster,
                },
            ],
            distinct: true,
            limit: queries.limit,
            offset: queries.offset,
        });
    }

    async fncUpdateOne(req, next) {
        const { id } = req.params;
        const found = await this.fncFindOne(req);

        if (!found) return next(new ErrorResponse(404, 'Notification not found'));

        return Notification.update(
            {
                ...req.body,
                UpdatedBy: getAccountFromToken(req),
            },
            {
                where: { ID: id },
            }
        );
    }

    async fncDeleteOne(req, next) {
        const { id } = req.params;
        const found = await this.fncFindOne(req);

        if (!found) return next(new ErrorResponse(404, 'Notification not found'));

        return Notification.update(
            { Status: 2 },
            {
                where: { ID: id },
            }
        );
    }
}

module.exports = new NotificationService();
