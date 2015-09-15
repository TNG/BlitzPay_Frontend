/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var UserConstants = require('../constants/UserConstants');

var Dispatcher = require('../dispatcher/Beer2PeerDispatcher');

var UserActions = {
    /**
     * @param username
     * @param secret
     * @param pin
     */
    loginUser: function(username, secret, pin) {
        Dispatcher.dispatch({
            actionType: UserConstants.USER_CREATE_WITH_SECRET,
            username: username,
            secret: secret,
            pin: pin
        });
    },
    loginUserWithPin: function(pin) {
        Dispatcher.dispatch({
            actionType: UserConstants.USER_CREATE_WITH_PIN,
            pin: pin
        });
    },
    logout: function() {
        Dispatcher.dispatch({
           actionType: UserConstants.USER_LOGOUT
        });
    },
    changeBalance: function(balances) {
        Dispatcher.dispatch({
            actionType: UserConstants.USER_BALANCE_CHANGE,
            balances: balances
        });
    }
};

module.exports = UserActions;
