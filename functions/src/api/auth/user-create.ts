const Logger = require('../../livingmenu_lib/log-handler')
const ApiAuthAlter = require('../api-auth-alter')
const ApiUtil = require('../../util/api-util')
const LMCONST = require('../../Constant')
const FsUtil = require('../../util/firestore-util')

class UserCreateApi extends (ApiAuthAlter as { new(req, res): any }) {
    private name = 'UserCreateApi'

    constructor(req, res) {
        super(req, res)
        // const h = Logger.orgLogHeader(this.name, 'constructor')

        req.apiUrl = '/user'
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
        const Input = this.req.input;


        // Action 1: insert data into user collection
        await FsUtil.addDataPlusChecking(LMCONST.Collection_User, this.req.input, (docId) => {
            this.output = { UserId: docId };
        })

        // [TEST Only] set uid = admin id after created
        this.req.description = ''
    }

}

export = UserCreateApi;