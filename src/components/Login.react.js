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
        return {
            loadingState: LoadingState.LOADED,
            pinForm: this.props.pin,
            remember: false
        };
    },

    login: function (e) {
        e.preventDefault();
        this.refs.usernameInput.validate();
        this.refs.rippleSecretInput.validate();
        if (this.refs.rippleSecretInput.isValid() && this.refs.usernameInput.isValid()) {
            this.setLoading(LoadingState.LOADING);
            var username = this.refs.usernameInput.getValue();
            var secret = this.refs.rippleSecretInput.getValue();
            var pin = "";
            if (this.state.remember) {
                pin = this.refs.pinInput.getValue();
            }
            UserActions.loginUser(username, secret, pin);
        }
    },

    loginWithPin: function (e) {
        e.preventDefault();
        this.setLoading(LoadingState.LOADING);

        var pin = this.refs.pinInput.getValue();
        UserActions.loginUserWithPin(pin);

        this.setLoading(LoadingState.LOADED);
    },

    render: function () {
        var progress = this.getProgress();

        var form;
        if (this.state.pinForm) {
            form = this.getPinForm(progress);
        } else {
            form = this.getDefaultForm(progress);
        }

        return (
            <div>
                <img src={Config.serverOptions.url + "/images/logo.png"} width="100" style={{paddingTop: "50px"}}></img>
                {form}
            </div>
        );
    },

    switchForm: function () {
        this.setState({
            loadingState: LoadingState.LOADED,
            pinForm: false,
            remember: false
        });
    },

    changeRemember: function (event, toggled) {
        this.setState({
            loadingState: LoadingState.LOADED,
            pinForm: this.state.pinForm,
            remember: toggled
        });
    },

    setLoading: function (loadingState) {
        this.setState({
            loadingState: loadingState,
            pinForm: this.state.pinForm,
            remember: this.state.remember
        });
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
            if (this.state.pinForm) {
                progress = <span style={style}><p>Login with your PIN.</p></span>;
            } else {
                progress = <span style={style}><p>Login with any name and your Ripple secret.</p></span>;
            }
        }
        return progress;
    },

    getPinForm: function (progress) {
        var error;
        if (this.props.isInvalid) {
            error = "Invalid PIN";
        }
        return (
            <form onSubmit={this.loginWithPin}>
                <h3>Welcome back, {localStorage.getItem("name")}!</h3>
                <TextField ref="pinInput"
                           type="password"
                           floatingLabelText="Encryption PIN"
                           errorText={error}
                           style={{width: '18em'}}/>
                <br/>
                <br/>
                <RaisedButton type="submit" label='Login' primary={true}/>
                {progress}
                <br/>
                <br/>
                <RaisedButton onClick={this.switchForm} label='Switch to regular login'/>
            </form>
        );
    },

    getDefaultForm: function (progress) {
        var remember;
        if (this.state.remember) {
            remember = <TextField ref="pinInput"
                                  type="password"
                                  hintText="Encryption PIN"
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
                    onToggle={this.changeRemember}
                    style={{textAlign: "left"}}/>
                {remember}
                <br/>
                <br/>
                <RaisedButton type="submit" label='Login' primary={true}/>
                {progress}
            </form>
        );
    }
});

Login.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Login;
