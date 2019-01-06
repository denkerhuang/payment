"use strict";
class LivingMenuLog {
    constructor() {
        // private httpMethod
        // private className
        // private apiPathName
        // private functionName
        this.debugMode = false;
        // private showEntryPoint = true
        this.showderiveClass = true;
        this.showFunctionName = true;
        this.splitSign = ":";
        // console = console
        // this.functionName = functionName
    }
    orgLogHeader(deriveClass, functionName) {
        const header = deriveClass + this.splitSign + functionName;
        const fullHeader = "[" + header + "]";
        if (this.debugMode) {
            console.log(fullHeader + "starts");
        }
        return header;
    }
    debug(message, h) {
        if (this.debugMode) {
            console.log(this.forNewHeader(h) + message);
        }
    }
    log(message, h) {
        console.log(this.forNewHeader(h) + message);
    }
    warn(message, h) {
        console.warn(this.forNewHeader(h) + message);
    }
    error(message, h) {
        console.error(this.forNewHeader(h) + message);
    }
    dir(message, h) {
        console.log(this.forNewHeader(h));
        console.dir(message);
    }
    forNewHeader(h) {
        const array = h.split(this.splitSign);
        let newHeader = "[";
        // if(this.showEntryPoint){
        //   newHeader += array[0]+':'
        // }
        if (this.showderiveClass) {
            newHeader += array[0] + ":";
        }
        if (this.showFunctionName) {
            newHeader += array[1] + ":";
        }
        newHeader = newHeader.substring(0, newHeader.length - 1);
        newHeader += "]";
        return newHeader;
    }
}
const Logger = new LivingMenuLog();
module.exports = Logger;
//# sourceMappingURL=log-handler.js.map