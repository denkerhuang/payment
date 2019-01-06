const Logger = require('../../livingmenu_lib/log-handler')
const ApiAuthAlter = require('../api-auth-alter')
const ApiUtil = require('../../util/api-util')
const LMCONST = require('../../Constant')
const FsUtil = require('../../util/firestore-util')

class PaymentCreateApi extends (ApiAuthAlter as { new(req, res): any }) {
    private name = 'PaymentCreateApi'

    constructor(req, res) {
        super(req, res)
        // const h = Logger.orgLogHeader(this.name, 'constructor')

        req.apiUrl = '/payment'
    }

    async execute() {
        // const h = Logger.orgLogHeader(this.name, 'execute')
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
        // const h = Logger.orgLogHeader(this.req.logPath, 'check')
        await Promise.all(checkArray);
    }

    async doAction() {
        const h = Logger.orgLogHeader(this.name, 'doAction')
        
        // Action 1: insert payable data into payment collection
        const payable = this.req.input
        payable.Status = 'pending'
        await FsUtil.addDataPlusChecking(LMCONST.Collection_Payment, payable, (docId) => {
            this.output = { PaymentId: docId };
        })
        
        // Action 2: insert receivable data into payment collection
        // const receivable = {
        //     Payer: payable.Receiver,
        //     Receiver: payable.Payer,
        //     Amount: -payable.Amount,
        // };
        // delete payable.Receiver
        // delete payable.Payer
        // delete payable.Amount
        // Object.keys(payable).forEach(key => {
        //     receivable[key] = payable[key]
        // })
        
        // await FsUtil.addDataPlusChecking(LMCONST.Collection_Payment, receivable, (docId) => {
        //     this.output = { PaymentId: docId };
        // })

        // [TEST Only] set uid = admin id after created
        this.req.description = ''
    }

}

export = PaymentCreateApi;