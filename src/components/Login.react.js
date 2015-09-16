/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;
var Toggle = require('material-ui').Toggle;
var UserActions = require('../actions/UserActions');
var Config = require('../constants/Config');
var RippleSecretInput = require('./RippleSecretInput');
var UsernameInput = require('./UsernameInput');
var CodeInput = require('./CodeInput.react');


var $ = require('jquery');

var {Progress, LoadingState}  = require('./Progress.react');


var Login = React.createClass({

    getInitialState() {
        if(localStorage.getItem("name") && localStorage.getItem("account")) {
            console.log("Loading user from localStorage");
            UserActions.directLogin(localStorage.getItem("name"), localStorage.getItem("account"));
        }
        return {
            loadingState: LoadingState.LOADED,
            remember: false
        };
    },

    login: function (e) {
        e.preventDefault();

        this.refs.usernameInput.validate();
        this.refs.rippleSecretInput.validate();

        if (this.refs.rippleSecretInput.isValid() && this.refs.usernameInput.isValid()) {
            this.setState({
                loadingState: LoadingState.LOADING
            });
            var username = this.refs.usernameInput.getValue();
            var secret = this.refs.rippleSecretInput.getValue();
            var pin = "";
            if (this.state.remember) {
                pin = this.refs.pinInput.getValue();
                if (pin === "") {
                    this.setState({
                        pinErrorText: "PIN can not be empty",
                        loadingState: LoadingState.LOADED
                    });
                    return;
                }
            }
            UserActions.loginUser(username, secret, pin);
        }
    },

    directLogin: function () {
        this.setState({
            loadingState: LoadingState.LOADING
        });

        var name = localStorage.getItem("name");
        var account = localStorage.getItem("account");
        UserActions.directLogin(name, account);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            isInvalid: nextProps.isInvalid,
            loadingState: LoadingState.LOADED
        });
    },

    render: function () {
        var progress = this.getProgress();
        var form = this.getDefaultForm(progress);

        return (
            <div>
                <img src={Config.serverOptions.url + "/images/logo.png"} width="100" style={{paddingTop: "50px"}}></img>
                {form}
            </div>
        );
    },

    getProgress: function () {
        var style = {
            fontSize: "80%",
            color: "#757575"
        };

        var progress;
        if (this.state.loadingState === LoadingState.LOADING) {
            progress = <Progress />;
        } else {
            progress = <span style={style}><p>Login with any name and your Ripple secret.</p></span>;
        }
        return progress;
    },

    getDefaultForm: function (progress) {
        var remember;
        if (this.state.remember) {
            remember = <TextField ref="pinInput"
                                  type="password"
                                  floatingLabelText="Encryption PIN"
                                  onChange={this._handlePINInputChange}
                                  errorText={this.state.pinErrorText}
                                  style={{width: '18em'}}/>;
        }
        return (
            <form onSubmit={this.login}>
                <UsernameInput ref="usernameInput"/>
                <br />
                <RippleSecretInput ref="rippleSecretInput"/>
                <br/>
                <br/>
                <Toggle
                    ref="remember"
                    label="Remember me?"
                    onToggle={this._handleRememberChange}
                    style={{textAlign: "left"}}/>
                {remember}
                <br/>
                <br/>
                <RaisedButton type="submit" label='Login' primary={true}/>
                {progress}
            </form>
        );
    },

    _handlePINInputChange: function _handlePINInputChange(e) {
        var value = e.target.value;
        this.setState({
            isInvalid: false,
            pinErrorText: value.length >= 5 ? '' : 'The PIN must have at least 5 digits.'
        });
    },

    _handleFormSwitch: function () {
        this.setState({
            loadingState: LoadingState.LOADED,
            pinForm: false
        });
    },

    _handleRememberChange: function (event, toggled) {
        this.setState({
            remember: toggled
        });
    }
});

Login.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Login;
