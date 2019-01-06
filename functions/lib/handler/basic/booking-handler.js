"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require('stripe')('sk_test_VtKQzJWRlhZU3oNpeGPsCoiz');
const expressBooking = require('express');
const appBooking = expressBooking();
exports.appBooking = appBooking;
const Logger = require('../../livingmenu_lib/log-handler');
const LMError = require('../../livingmenu_lib/error-handler');
const ApiUtil = require('../../util/api-util');
const FsUtil = require('../../util/firestore-util');
const LMCONST = require('../../Constant');
const BookingCreateApi = require('../../api/booking-create');
const userIdTest = '3W552KXz4UXwMoUmxhAW'; // TODO will retrieved from Auth
//retrieve single dish by BookingId
appBooking.get('/:BookingId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const BookingId = req.params.BookingId;
    Logger.log('BookingId: ' + BookingId);
    let returnObject;
    // retrieve one single booking data by condition
    try {
        yield FsUtil.getDocData(LMCONST.Collection_Booking, BookingId, (result) => {
            returnObject = result;
        });
    }
    catch (error) {
        ApiUtil.sendError(error, res);
    }
    res.send(returnObject);
}));
//book a session
appBooking.post('/', (req, res) => {
    new BookingCreateApi(req, res).execute();
    // Logger.setFunctionName(".");
    // Logger.log('********** main function starts **********');
    // const input = req.input;
    // const lmError = req.lmError;
    // if (lmError !== undefined) {
    // 	Logger.warn('lmError code: ' + lmError.code + ", " + lmError.obj.Message);
    // 	return lmError.send(res);
    // }
    // const amount = input.Amount;
    // const currency = input.Currency;
    // const bookingId = req.params.BookingId;
    // const stripeCusId = req.stripeCusId;
    // Logger.log('stripeCusId: ' + stripeCusId);
    // // const returnObject = req.returnObject;
    // const txManager = new TransactionManager();
    // try {
    // 	// Action 1: charge customer
    // 	let chargeId;
    // 	await stripe.charges.create({
    // 		amount,
    // 		currency,
    // 		description: 'pay for booking session',
    // 		customer: stripeCusId,
    // 		capture: false,
    // 	}).then(charge => {
    // 		chargeId = charge.id;
    // 		Logger.log(chargeId + ' is charged without capturing');
    // 		const cca = new ChargeCustomerAction(charge.id);
    // 		txManager.addAction(cca);
    // 	}).catch(error => {
    // 		throw new LMError(LMCONST.StripeError, { "Message": error.message });
    // 	});
    // 	// Action 2: update Booking Status = ‘booked’
    // 	// FsUtil.batchUpd(LMCONST.Collection_Booking, bookingId, {
    // 	// 	StripeChgId: chargeId,
    // 	// 	Status: LMCONST.BookingStatus_Booked
    // 	// });
    // 	txManager.batchUpd(LMCONST.Collection_Booking, bookingId, {
    // 		StripeChgId: chargeId,
    // 		Status: LMCONST.BookingStatus_Booked
    // 	});
    // 	// Action 3: close if it reach the station/people limit
    // 	let bookingObj;
    // 	await FsUtil.getDocData(LMCONST.Collection_Booking, bookingId, (result) => {
    // 		bookingObj = result;
    // 	});
    // 	const stationType = bookingObj.StationType;
    // 	let bookedNumber = 0;
    // 	const fields = ['StationType', 'Status', 'BookingType'];
    // 	const operators = ['==', '==', '=='];
    // 	const conditions = [stationType, LMCONST.BookingStatus_Booked, 'CK'];
    // 	Logger.log('Current Station Type: ' + stationType);
    // 	await FsUtil.getDocsDataComplex(LMCONST.Collection_Booking, fields, operators, conditions, (bookingArray) => {
    // 		bookedNumber = bookingArray.size;
    // 	});
    // 	await FsUtil.getDocData(LMCONST.Collection_ZoneSession, bookingObj.ZoneSessionId, (result) => {
    // 		const stationLimit = result.StationLimit;
    // 		Logger.log('Zone Station Limit: ' + stationLimit);
    // 		Logger.log('Booked Number (exclude me): ' + bookedNumber);
    // 		if (stationLimit <= bookedNumber + 1) {
    // 			Logger.log(stationLimit + '(limit) <= 1(me) + ' + bookedNumber + '(booked), Station reaches the limit');
    // 			Logger.log('close the zone session now');
    // 			// FsUtil.batchUpd(LMCONST.Collection_ZoneSession, bookingObj.ZoneSessionId, {
    // 			// 	Status: LMCONST.ZoneSessionStatus_Close
    // 			// });
    // 			txManager.batchUpd(LMCONST.Collection_ZoneSession, bookingObj.ZoneSessionId, {
    // 				Status: LMCONST.ZoneSessionStatus_Close
    // 			});
    // 		}
    // 	});
    // 	// await FsUtil.batchCommit()
    // 	await txManager.batchCommit()
    // 		.then(() => {
    // 			Logger.log("Update Booking Status as '" + LMCONST.BookingStatus_Booked + "' Success");
    // 		}).catch(error => {
    // 			console.log(error);
    // 			txManager.rollback();
    // 			throw new LMError(LMCONST.ServerErrors, { "Message": error.message });
    // 		});
    // 	txManager.final();
    // 	bookingObj.Status = LMCONST.BookingStatus_Booked;
    // 	res.send(bookingObj);
    // 	FsUtil.record(req);
    // } catch (error) {
    // ApiUtil.sendError(error, res);
    // }
});
function checkIfUserCanBook(req, res, next) {
    Logger.setFunctionName('checkIfUserCanBook');
    const BookingId = req.params.BookingId;
    Logger.log('BookingId: ' + BookingId);
    const ChefId = '3W552KXz4UXwMoUmxhAW'; // TODO will retrieved from Auth
    Logger.log('ChefId: ' + ChefId);
    let checkBookingStatus;
    let checkCustomer;
    // Check 1: If (BookingStatus == preview) => {Incorrect Booking Status}
    let lmError;
    try {
        FsUtil.getDocFSData(LMCONST.Collection_User, ChefId, (userObject) => {
            // Check 1: If role == 'chef'
            Logger.log('User Roles: ' + userObject.Role);
            if (!userObject.Role.includes('chef')) {
                lmError = new LMError(LMCONST.NoRolePermission, {
                    "UserId": ChefId,
                    "Role": userObject.Role,
                });
            }
            // Check 2: If (StripeCusId exists) => {No customer id found}
            else if (typeof userObject.StripeCusId === 'undefined') {
                lmError = new LMError(LMCONST.NoCustomerFound, {
                    "UserId": ChefId
                });
            }
            else {
                req.stripeCusId = userObject.StripeCusId;
            }
            req.lmError = lmError;
            checkBookingStatus = true;
            if (checkBookingStatus && checkCustomer) {
                next();
            }
        });
    }
    catch (error) {
        new LMError(LMCONST.ServerErrors, { "Message": error.message }).send(res);
    }
    try {
        FsUtil.getDocData(LMCONST.Collection_Booking, BookingId, (bookingResult) => __awaiter(this, void 0, void 0, function* () {
            // Check 3: If (BookingStatus == preview) => {Incorrect Booking Status}
            if (bookingResult.Status !== LMCONST.BookingStatus_Preview) {
                lmError = new LMError(LMCONST.BookingStatusError, {
                    "BookingId": BookingId,
                    "BookingStatus": bookingResult.Status
                });
            }
            // Check 4: If station type is full in class limit 
            //	==> if (class_limit - all booinking) > 0, where booking.status == 'booked', same station_type
            if (bookingResult.BookingType === 'CE') {
                //
            }
            else { // 'CK_FQ', 'CK_DP'
                // Logger.log('Current Station Type: '+stationType);
                yield FsUtil.getDocData(LMCONST.Collection_ZoneSession, bookingResult.ZoneSessionId, (zoneSessionResult) => {
                    // Logger.log('bookingObj.ZoneSessionId: '+bookingObj.ZoneSessionId);
                    // Logger.log('zoneSessionObj.Status: '+zoneSessionObj.Status);
                    if (zoneSessionResult.Status === LMCONST.ZoneSessionStatus_Close) {
                        lmError = new LMError(LMCONST.ZoneSessionStatusError, {
                            "BookingId": BookingId,
                            "ZoneSessionId": bookingResult.ZoneSessionId,
                            "Zone Session Status": zoneSessionResult.Status
                        });
                    }
                });
            }
            req.returnObject = bookingResult;
            req.lmError = lmError;
            checkCustomer = true;
            if (checkBookingStatus && checkCustomer) {
                next();
            }
        }));
    }
    catch (error) {
        ApiUtil.sendError(error, res);
    }
}
//# sourceMappingURL=booking-handler.js.map