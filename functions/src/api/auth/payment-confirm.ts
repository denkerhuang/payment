const Logger = require('../../livingmenu_lib/log-handler')
const ApiAuthAlter = require('../api-auth-alter')
const ApiUtil = require('../../util/api-util')
const LMCONST = require('../../Constant')
const FsUtil = require('../../util/firestore-util')

class PaymentConfirmApi extends (ApiAuthAlter as { new(req, res): any }) {
    private name = 'PaymentConfirmApi'

    constructor(req, res) {
        super(req, res)
        req.apiUrl = '/payment'
    }

    async execute() {
        try {
            await this.check([]);
            await this.doAction();
            await this.final();
        } catch (error) {
            ApiUtil.sendError(error, this.res);
        }
    }

    async check(checkArray) {
        super.check(checkArray)
        this.req.logPath = this.name
        await Promise.all(checkArray);
    }

    async doAction() {
        const h = Logger.orgLogHeader(this.name, 'doAction')
        const PaymentId = this.req.params.PaymentId

        // Action 1: insert payable data into payment collection
        const Input = this.req.input
        Input.Status = 'confirmed'
        await FsUtil.updData(LMCONST.Collection_Payment, PaymentId, Input)
    }

}

export = PaymentConfirmApi;