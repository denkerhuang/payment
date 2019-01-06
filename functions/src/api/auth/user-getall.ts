const Logger = require('../../livingmenu_lib/log-handler')
const ApiAuthQuery = require('../api-auth-qry')
const ApiUtil = require('../../util/api-util')
const LMCONST = require('../../Constant')
const FsUtil = require('../../util/firestore-util')

class UserGetAllApi extends (ApiAuthQuery as { new(req, res): any }) {
    private name = 'UserGetAllApi'

    constructor(req, res) {
        super(req, res)
        // const h = Logger.orgLogHeader(this.name, 'constructor')
        req.apiUrl = '/user'
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

        // Action 1: retrieve all docs in User collection
        await FsUtil.getWholeData(LMCONST.Collection_User, (docs) => {
            this.output = docs    
        })
    }

}

export = UserGetAllApi