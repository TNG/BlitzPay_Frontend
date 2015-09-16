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
    directLogin: function(username, account) {
        Dispatcher.dispatch({
            actionType: UserConstants.USER_DIRECT_LOGIN,
            username: username,
            account: account
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
