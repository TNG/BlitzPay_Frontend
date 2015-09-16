'use strict';

var React = require('react');
var Router = require('react-router');
var {Route, RouteHandler, Link } = Router;
var Styles = require('material-ui').Styles;
var ThemeManager = new Styles.ThemeManager();
var AppCanvas = require('material-ui').AppCanvas;
var SocialPayTheme = require('../themes/socialPayTheme');

var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');

var Header = require('./Header.react');
var Footer = require('./Footer.react');

var Login = require('./Login.react');

var RippleListener = require('../services/RippleListener');

ThemeManager.setTheme(SocialPayTheme);

var Beer2Peer = React.createClass({

    getInitialState: function() {
        return {
            user: UserStore.getUser()
        };
    },

    componentWillMount: function() {
        UserStore.addUserChangeListener(this.onUserChange);
        UserStore.addBalanceChangeListener(this.setUserFromStore);

        if(localStorage.getItem("name") && localStorage.getItem("account")) {
            UserActions.directLogin(localStorage.getItem("name"), localStorage.getItem("account"));
        }
    },
    componentWillUnmount: function() {
        UserStore.removeUserChangeListener(this.onUserChange);
        UserStore.removeBalanceChangeListener(this.setUserFromStore);
    },

    onUserChange: function() {
        this.setUserFromStore();
        RippleListener.listenToBalanceChanges(this.state.user.rippleAccount);
    },

    setUserFromStore: function() {
        var user = UserStore.getUser();
        this.setState({user: user});
    },

    //For Material UI
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {muiTheme: ThemeManager.getCurrentTheme()};
    },

    render: function() {
        var mainSection;
        var header;
        if (!this.state.user.isLoggedIn()) {
            mainSection = <Login/>;
        } else {
            header = <Header user = {this.state.user}/>;
            mainSection = <RouteHandler user = {this.state.user}/>;
        }
        return (
            <div className="centered">
                {header}
                <div className='inlineBlock' id="realContent">
                    {mainSection}
                </div>
                <Footer />
            </div>
        );
    }
});

module.exports = Beer2Peer;
