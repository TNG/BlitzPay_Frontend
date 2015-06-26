/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;
var UserActions = require('../actions/UserActions');
var Config = require('../constants/Config');


var $ = require('jquery');

var RippleVaultClient = require('ripple-vault-client');
var vc = new RippleVaultClient.VaultClient('rippletrade.com');
var {Progress, LoadingState}  = require('./Progress.react');


var Login = React.createClass({

    getInitialState() {
        return {errorText : '',
                loadingState: LoadingState.LOADED
        };
    },

    login: function() {
        this.setState({ errorText: '',
            loadingState: LoadingState.LOADING});
        var username = this.refs.username.getValue();
        var password = this.refs.password.getValue();
        vc.loginAndUnlock(username, password, null, function(err, resp) {
            if(!err) {
                this.setState({ errorText: '',
                    loadingState: LoadingState.LOADED});
            } else {
                this.setState({ errorText: err.toString(),
                    loadingState: LoadingState.LOADED});
            }
            UserActions.loginUser(username, resp.secret);
        }.bind(this));
        return false;
    },

    render: function () {

        var style= {
            fontSize: "80%",
            color: "#757575"
        };

        var progress;

        if (this.state.loadingState === LoadingState.LOADING) {
            progress =  <Progress />;
        } else {
            progress = <span style={style}><p>Login with your <a href="https://rippletrade.com/">Ripple Trade</a> credentials.</p></span>;
        }

        return (

            <div>
                <form onSubmit={this.login} >
                    <br/>
                    <img src={Config.serverOptions.url + "/images/logo.png"} width="100"></img>
                    <br/>
                        <TextField
                            ref = "username"
                            floatingLabelText="Username"
                            style={{width: '18em'}}/>
                        <br/>
                        <TextField
                            type="password"
                            ref = "password"
                            floatingLabelText="Password"
                            errorText = {this.state.errorText}
                            style={{width: '18em'}}/>
                        <br/>
                        <br/>
                        <RaisedButton label='Login' primary={true} />
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
