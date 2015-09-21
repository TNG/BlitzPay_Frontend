/**
 * Created by agreimel on 16/09/15.
 */
'use strict';

var React = require('react');
var $ = require('jquery');
var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var UserStore = require('../stores/UserStore');
var LoadingState = require('./LoadingState');
var Config = require('../constants/Config');
var RippleService = require('../services/RippleService');
var Progress = require('./Progress.react');


var Admin = React.createClass({

    getInitialState: function() {
        return {
            loadingState: LoadingState.LOADED
        };
    },

    connectAccount: function(e) {
        e.preventDefault();

        var user = UserStore.getUser();
        RippleService.connectAccount(user.rippleSecret, function(res) {

        });
    },

    giveMoneyToAccount: function (e) {
        e.preventDefault();

        this.setState({
            loadingState: LoadingState.LOADING
        });
        var receiver = this.refs.accountField.getValue();
        var amount = this.refs.amountField.getValue().replace(',', '.');
        RippleService.giveMoney(receiver, amount, function () {
            this.setState({
                loadingState: LoadingState.LOADED
            });
        }.bind(this));
    },

    render: function () {

        var giveMoneyForm;
        if(this.state.loadingState === LoadingState.LOADING) {
            giveMoneyForm = <Progress />;
        } else {
            giveMoneyForm = <form onSubmit={this.giveMoneyToAccount}>
                <TextField
                    ref="accountField"
                    hintText="r4ra6AucpstFoEopgq93bvJdGFSNHFakLY"
                    style={{width: "20em"}}
                    floatingLabelText="Account ID"/>
                <br/>
                <TextField
                    ref="amountField"
                    hintText="0.00"
                    style={{width: "20em"}}
                    floatingLabelText="TNG"
                    type="number"
                    step="0.01"/>
                <br/>
                <RaisedButton type="submit" label="Add" primary={true}/>
                <br/>
                <span style={{fontSize: "80%", color: "#757575"}}>Requires a trust line from the account to the bank</span>
            </form>;
        }


        return (
            <div>
                <h3>Connect this account to the TNG bank</h3>
                <form onSubmit={this.connectAccount}>
                    <RaisedButton type="submit" label="Connect" primary={true}/>
                    <br/>
                    <span style={{fontSize: "80%", color: "#757575"}}>Creates a trust line to the TNG bank account.</span>
                </form>
                <br/>
                <br/>

                <h3>Give money to an account</h3>
                {giveMoneyForm}
                <br/>
            </div>
        );
    }
});

Admin.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Admin;
