/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var $ = require('jquery');
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var CircularProgress = mui.CircularProgress;
var RippleService = require('../services/RippleService');
var Config = require('../constants/Config');
var ErrorMessage = require('./ErrorMessage');
var keyMirror = require('keymirror');

var UserStore = require('../stores/UserStore');

var ripple = require('ripple-lib');
var CryptoService = require('../services/CryptoService');

var Progress = require('./Progress.react');
var LoadingState = require('./LoadingState');

var PaymentState = keyMirror({
    PAID: null,
    NOT_PAID: null
});


var Pay = React.createClass({
    getInitialState: function () {
        return {
            loadingState: LoadingState.LOADING,
            paymentState: PaymentState.NOT_PAID,
            loadingMessage: 'Retrieving event from server...',
            errorMessage: ''
        };
    },

    onSubmitPayment: function (e) {
        e.preventDefault();

        var user = UserStore.getUser();
        var secret = user.rippleSecret;
        if (!secret) {
            var pin = this.refs.pinField.getValue();
            if(pin.length < 5) {
                this.setState({
                    pinError: "The PIN must have at least 5 digits."
                });
                return;
            }
            secret = CryptoService.decryptSecret(pin);
            if(!secret) {
                this.setState({
                    pinError: "Invalid PIN!"
                });
                return;
            } else if (!RippleService.isSecretValid(secret)) {
                return false;
            }
        }

        var amount = this.refs.amountField.getValue().replace(',', '.');

        var rippleAmount = ripple.Amount.from_human(amount + ' ' + this.state.currency);

        this.setState({
            loadingState: LoadingState.LOADING,
            loadingMessage: 'Processing transaction...'
        });

        RippleService.pay(user.name, secret, this.state.targetRippleAccountId, rippleAmount, this.props.params.eventCode, function (success) {
            console.log('payment result ' + success);
            if (!success) {
                this.setState({
                    errorMessage: "Payment failed! Try again?",
                    loadingState: LoadingState.LOADED
                });
            } else {
                this.setState({
                    loadingState: LoadingState.LOADED,
                    paymentState: PaymentState.PAID,
                    errorMessage: ''
                });
            }
        }.bind(this));
    },

    componentDidMount: function () {
        $.get(Config.serverOptions.url + ':' + Config.serverOptions.port + '/event/' + this.props.params.eventCode, function (data) {
            this.setState({
                eventName: data.eventName,
                totalAmount: data.totalAmount,
                currency: data.currency,
                targetRippleAccountId: data.recipientRippleAccountId,
                eventCreator: data.recipientUserName
            });
        }.bind(this));
        this.setLoadedState();
    },

    setLoadedState: function () {
        this.setState({loadingState: LoadingState.LOADED});
    },

    render: function () {
        var pinField;
        if(localStorage.getItem("account")) {
            pinField = (
                <div>
                    <TextField ref="pinField"
                               type="password"
                               floatingLabelText="Secret decryption PIN"
                               errorText={this.state.pinError}
                               onChange={this._handlePINInputChange}
                               style={{width: '18em'}}/>
                    <br/>
                </div>
            );
        }

        if (this.state.loadingState === LoadingState.LOADING) {
            return (<Progress message={this.state.loadingMessage}/>);
        } else if (this.state.paymentState === PaymentState.PAID) {
            return (<div><img src='../images/check.svg' width="80px"/></div>);
        } else {
            return (
                <div>
                    <ErrorMessage message={this.state.errorMessage}/>

                    <p><b>{this.state.eventCreator}</b> has requested
                        <b> {this.state.totalAmount} {this.state.currency}</b> from the group.</p>

                    <form onSubmit={this.onSubmitPayment}>
                        <TextField ref="amountField"
                                   style={{width:'18em'}}
                                   hintText="0.00"
                                   step="0.01"
                                   type="number"
                                   floatingLabelText="EUR"
                                   errorText={this.state.amountError}
                            />
                        <br/>
                        {pinField}
                        <br/>
                        <RaisedButton type="submit" label="Pay!" primary={true}/>
                    </form>
                </div>
            );
        }
    },

    _handlePINInputChange: function _handlePINInputChange(e) {
        var value = e.target.value;
        this.setState({
            pinError: value.length >= 5 ? '' : 'The PIN must have at least 5 digits.'
        });
    }
});

Pay.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Pay;
