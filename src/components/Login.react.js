'use strict';

var React = require('react');

var Login = React.createClass({

    getInitialState() {
        return {
            loadingState: this.props.LoadingState.LOADED
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
            this.props.UserActions.loginUser(username, secret);
        }
    },

    render: function () {

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

        return (
            <div>
                <img src={this.props.Config.serverOptions.url + "/images/logo.png"} width="100" style={{paddingTop: "50px"}}></img>
                <form
                    onSubmit={this.login}
                >
                    {usernameInput}
                    <br />
                    {rippleSecretInput}
                    <br/>
                    <br/>
                    {raisedButton}
                    {progress}
                </form>
            </div>
        );
    }
});


Login.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Login;
