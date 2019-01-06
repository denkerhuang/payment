const Logger = require('../../livingmenu_lib/log-handler')
const ApiAuthQuery = require('../api-auth-qry')
const ApiUtil = require('../../util/api-util')
const LMCONST = require('../../Constant')
const LMError = require('../../livingmenu_lib/error-handler')
const FsUtil = require('../../util/firestore-util')

class PaymentGetAllApi extends (ApiAuthQuery as { new(req, res): any }) {
    private name = 'PaymentGetAllApi'

    constructor(req, res) {
        super(req, res)
        // const h = Logger.orgLogHeader(this.name, 'constructor')
        req.apiUrl = '/payment'
    }

    async execute() {
        // const h = Logger.orgLogHeader(this.name, 'execute')
        try {
            await this.check([])
            await this.doAction()
            await this.final()
        } catch (error) {
            ApiUtil.sendError(error, this.res)
        }
    }

    async check(checkArray) {
        super.check(checkArray)
        this.req.logPath = this.name
        // const h = Logger.orgLogHeader(this.req.logPath, 'check')
        await Promise.all(checkArray)
    }

    async doAction() {
        Logger.orgLogHeader(this.name, 'doAction')
        const Query = this.req.query
        const checkFields = []
        const operators = []
        const conditions = []
        
        for (const key of Object.keys(Query)) {
            checkFields.push(key)
            operators.push('==')
            conditions.push(Query[key])
        }

        const rtnArray = []
        await FsUtil.getMulDataComplex(LMCONST.Collection_Payment, checkFields, operators, conditions, result => {
            result.forEach(doc => {
                rtnArray.push(doc)
            })
        }).catch(err => {
            throw new LMError(LMCONST.FirestoreError, { Message: err.message })
        })

        const tempPayer = Query.Payer
        const tempReceiver = Query.Receiver
        if(tempPayer!==undefined){
            Query.Receiver = tempPayer;
            delete Query.Payer
        }
        if(tempReceiver!==undefined){
            Query.Payer = tempReceiver;
        }
        const checkFields2 = []
        const operators2 = []
        const conditions2 = []
        const rtnArray2 = []
        for (const key of Object.keys(Query)) {
            checkFields2.push(key)
            operators2.push('==')
            conditions2.push(Query[key])
        }
        await FsUtil.getMulDataComplex(LMCONST.Collection_Payment, checkFields2, operators2, conditions2, result => {
            result.forEach(doc => {
                rtnArray2.push(doc)
            })
        }).catch(err => {
            throw new LMError(LMCONST.FirestoreError, { Message: err.message })
        })

        const returnArray = []
        await Promise.all(rtnArray.map(async (doc) => {
            await FsUtil.convertFSDocToJSObj(LMCONST.Collection_Payment, doc, result => {
                returnArray.push(result)
            })
        }))
        await Promise.all(rtnArray2.map(async (doc) => {
            await FsUtil.convertFSDocToJSObj(LMCONST.Collection_Payment, doc, result => {

                const tempPayer2 = result.Payer
                const tempReceiver2 = result.Receiver
                result.Payer = tempReceiver2;
                result.Receiver = tempPayer2;
                result.Amount = -result.Amount;

                returnArray.push(result)
            })
        }))

        this.output = returnArray
        // }
    }

}

export = PaymentGetAllApi