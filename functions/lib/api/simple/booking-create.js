"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_VtKQzJWRlhZU3oNpeGPsCoiz');
const ApiSauthAlter = require('../api-sauth-alter');
const ChargeCustomerAction = require('../../action/charge-customer-action');
const ApiUtil = require('../../util/api-util');
const FsUtil = require('../../util/firestore-util');
const TrnasactionUtil = require('../../util/transaction-util');
const Logger = require('../../livingmenu_lib/log-handler');
const LMError = require('../../livingmenu_lib/error-handler');
const LMCONST = require('../../Constant');
class BookingCreateApi extends ApiSauthAlter {
    constructor(req, res) {
        super(req, res);
        // private req
        // private res
        this.name = 'BookingCreateApi';
        this.discount = 500;
        this.currency = 'sgd';
        const h = Logger.orgLogHeader(this.name, 'constructor');
        req.apiUrl = '/bookings';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const h = Logger.orgLogHeader(this.name, 'execute');
            try {
                yield this.check([]);
                yield this.doAction();
                yield this.final();
            }
            catch (error) {
                ApiUtil.sendError(error, this.res);
            }
        });
    }
    check(checkArray) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("check").call(this, checkArray);
            const h = Logger.orgLogHeader(this.req.logPath, 'check');
            const Body = this.req.body;
            //Check 1: if session.status === 'open'
            checkArray.push(checkSessionStatus(Body.SessionId, (result) => {
                //Check 1.5: if booking pax more than session available amount
                result.BookedNumber = result.BookedNumber === undefined ? 0 : result.BookedNumber;
                if (result.BookedNumber + Body.Pax > result.Limit
                    || Body.Pax > result.Pax) {
                    throw new LMError(LMCONST.RequestFailed, {
                        "Message": "Booking pax more than session available amount"
                    });
                }
                else {
                    this.sessionObj = result;
                }
            }));
            //Check 2: if user exist in user collection
            checkArray.push(FsUtil.getData(LMCONST.Collection_User, Body.UserId, (result) => {
                this.userObj = result;
            }));
            yield Promise.all(checkArray);
        });
    }
    doAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const txManager = new TrnasactionUtil();
            const h = Logger.orgLogHeader(this.name, 'doAction');
            this.Input = this.req.input;
            console.log(`session obj = ${this.sessionObj}`);
            const bookingObj = {
                'UserId': this.Input.UserId,
                'SessionId': this.sessionObj.SessionId,
                'Fee': undefined,
                'StripeChgId': undefined,
                'BookingTime': admin.firestore.FieldValue.serverTimestamp(),
                'Status': LMCONST.BookingStatus_Booked,
                'Pax': this.Input.Pax,
                'Discount': false
            };
            //Action 1: referral_code first time, booking.fee = session.fee - 5
            let personalFee;
            if ((yield checkReferralCode(this.Input.ReferralCode, this.sessionObj.OwnerId)) && this.userObj.isJoined !== undefined && !this.userObj.IsJoined) {
                personalFee = this.sessionObj.Fee - this.discount;
                bookingObj.Discount = true;
                txManager.batchUpd(LMCONST.Collection_User, this.userObj.UserId, {
                    "IsJoined": true,
                    "InviterId": this.sessionObj.OwnerId
                });
            }
            else {
                personalFee = this.sessionObj.Fee;
                txManager.batchUpd(LMCONST.Collection_User, this.userObj.UserId, {
                    "IsJoined": true
                });
            }
            bookingObj.Fee = personalFee * this.Input.Pax;
            //Action 2: create card with stripe API
            let tokenId;
            yield stripe.tokens.create({
                card: {
                    "number": this.Input.CardNumber,
                    "exp_month": this.Input.ExpMonth,
                    "exp_year": this.Input.ExpYear,
                    "cvc": this.Input.CVC
                }
            }).then(token => {
                tokenId = token.id;
            }).catch(error => {
                throw new LMError(LMCONST.StripeError, { "Message": error.message });
            });
            //Action 3: charge with stripe API
            let chargeId;
            yield stripe.charges.create({
                amount: bookingObj.Fee,
                currency: this.currency,
                source: tokenId,
                description: 'pay for booking session',
                capture: false,
            }).then(charge => {
                chargeId = charge.id;
                bookingObj.StripeChgId = chargeId;
                console.log(chargeId + ' is charged without capturing');
                const cca = new ChargeCustomerAction(charge.id);
                txManager.addAction(cca);
            }).catch(error => {
                throw new LMError(LMCONST.StripeError, { "Message": error.message });
            });
            //Action 4: session.bookedNumber + Input.pax
            const updSessionObj = {
                BookedNumber: this.sessionObj.BookedNumber + this.Input.Pax,
                Status: this.sessionObj.Status
            };
            //Action 5: if session.limit <= session.bookedNumber, close session
            if (this.sessionObj.Limit <= updSessionObj.BookedNumber) {
                updSessionObj.Status = LMCONST.SessionStatus_Close;
            }
            txManager.batchUpd(LMCONST.Collection_Session, this.sessionObj.SessionId, updSessionObj);
            //Action 6: insert data into booking collection with 
            const returnObj = { "id": undefined };
            txManager.batchAdd(LMCONST.Collection_Booking, bookingObj, returnObj);
            //Start trnasaction
            yield txManager.batchCommit()
                .then(() => {
                console.log("Update Booking Status as '" + LMCONST.BookingStatus_Booked + "' Success");
                this.output = { "BookingId": returnObj.id };
            }).catch(error => {
                console.log(error);
                txManager.rollback();
                throw new LMError(LMCONST.ServerErrors, { "Message": error.message });
            });
            txManager.final();
            // [TEST Only] set uid = admin id after created
            this.req.description = 'test to book session';
        });
    }
    final() {
        super.final();
        const h = Logger.orgLogHeader(this.name, 'final');
    }
}
function checkSessionStatus(sessionId, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield FsUtil.getData(LMCONST.Collection_Session, sessionId, (sessionJson) => {
            if (sessionJson.Status !== LMCONST.SessionStatus_Open) {
                throw new LMError(LMCONST.SessionStatusError, {});
            }
            else {
                callback(sessionJson);
            }
        });
    });
}
function checkReferralCode(referralCode, ownerId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (referralCode !== undefined) {
            try {
                let result;
                yield FsUtil.getData(LMCONST.Collection_User, ownerId, user => {
                    if (user.ReferralCode !== undefined && user.ReferralCode === referralCode) {
                        result = true;
                    }
                    else {
                        result = false;
                    }
                });
                return result;
            }
            catch (err) {
                throw err;
            }
        }
        else {
            return false;
        }
    });
}
module.exports = BookingCreateApi;
//# sourceMappingURL=booking-create.js.map