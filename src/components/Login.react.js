'use strict';

var React = require('react');

var Login = React.createClass({

    getInitialState() {
        var localStorage = this.props.LocalStorage;
        if (localStorage.getItem("name") && localStorage.getItem("account")) {
            console.log("Loading user from localStorage");
            this.props.UserActions.directLogin(localStorage.getItem("name"), localStorage.getItem("account"));
        }
        return {
            loadingState: this.props.LoadingState.LOADED,
            remember: this.props.remember || false
        };
    },

    login: function (e) {
        e.preventDefault();

        this.refs.usernameInput.validate();
        this.refs.rippleSecretInput.validate();

        if (this.refs.rippleSecretInput.isValid() && this.refs.usernameInput.isValid()) {
            this.setState({
                loadingState: this.props.LoadingState.LOADING
            });
            var username = this.refs.usernameInput.getValue();
            var secret = this.refs.rippleSecretInput.getValue();
            var pin = "";
            if (this.state.remember) {
                pin = this.refs.pinInput.getValue();
                if (pin === "" || pin.length < 5) {
                    this.setState({
                        pinErrorText: (pin === "" ? "PIN can not be empty" : "The PIN must have at least 5 digits."),
                        loadingState: this.props.LoadingState.LOADED
                    });
                    return;
                }
            }
            this.props.UserActions.loginUser(username, secret, pin);
        }
    },
    directLogin: function () {
        this.setState({
            loadingState: this.props.LoadingState.LOADING
        });
        var name = this.props.LocalStorage.getItem("name");
        var account = this.props.LocalStorage.getItem("account");
        this.props.UserActions.directLogin(name, account);
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            isInvalid: nextProps.isInvalid,
            loadingState: this.props.LoadingState.LOADED
        });
    },

    render: function () {
        var progress = this.getProgress();
        var form = this.getDefaultForm(progress);

        return (
            <div>
                <img src={this.props.Config.serverOptions.url + "/images/logo.png"} width="100"
                     style={{paddingTop: "50px"}}></img>
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

        if (this.state.loadingState === this.props.LoadingState.LOADING) {
            progress = this.props.children[1];
        } else {
            progress = <span style={style}><p>Login with any name and your Ripple secret.</p></span>;
        }
        return progress;
    },

    getDefaultForm: function (progress) {
        var rememberInput;
        if (this.state.remember) {
            rememberInput = this.props.children[5];
            rememberInput = React.addons.cloneWithProps(rememberInput, {
                ref: "pinInput",
                type: "password",
                floatingLabelText: "Encryption PIN",
                onChange: this._handlePINInputChange,
                errorText: this.state.pinErrorText,
                style: {width: '18em'}
            });
        }
        var raisedButton = this.props.children[2];
        raisedButton = React.addons.cloneWithProps(raisedButton, {
            type: "submit",
            label: "Login",
            primary: true
        });

        var usernameInput = this.props.children[3];
        usernameInput = React.addons.cloneWithProps(usernameInput, {
            ref: "usernameInput"
        });

        var rippleSecretInput = this.props.children[0];
        rippleSecretInput = React.addons.cloneWithProps(rippleSecretInput, {
            ref: "rippleSecretInput"
        });

        var rememberToggle = this.props.children[4];
        rememberToggle = React.addons.cloneWithProps(rememberToggle, {
            ref: "rememberToggle",
            label: "Remember me?",
            onToggle: this._handleRememberChange,
            style: {textAlign: "left"}
        });

        return (
            <form
                onSubmit={this.login}
                >
                {usernameInput}
                <br />
                {rippleSecretInput}
                <br/>
                <br/>
                {rememberToggle}
                {rememberInput}
                <br/>
                <br/>
                {raisedButton}
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
