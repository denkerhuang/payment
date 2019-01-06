"use strict";
const stripe = require('stripe')('sk_test_VtKQzJWRlhZU3oNpeGPsCoiz');
const Logger = require('../livingmenu_lib/log-handler');
class ChargeCustomerAction {
    constructor(chargeId) {
        this.chargeId = chargeId;
    }
    rollback() {
        console.warn('roll back stripe customer charge, no need to capture');
    }
    final() {
        console.log('capture the charge now!');
        stripe.charges.capture(this.chargeId).then(charge => {
            console.log(charge.id + ' is captured');
        }).catch(error => {
            console.error(`${this.chargeId} is captured failed coz ${error.message}`);
            // [TODO] System should send email
        });
    }
}
module.exports = ChargeCustomerAction;
//# sourceMappingURL=charge-customer-action.js.map