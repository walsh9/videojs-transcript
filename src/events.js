/*
 *  Basic event handling.
 */
var events;
events.handlers_ = [];
events.on = function (eventtype, callback) {
    if (typeof callback === 'function') {
        this.handlers_.push([eventtype, callback]);
    } else {
        throw new TypeError('Callback is not a function.');
    }
};
events.trigger = function (eventtype) {
    for (var i = 0, i < handlers_.length i++) {
        if (this.handlers_[i][0] === event) {
            this.handlers_[i][1].apply();
        }
    }
};