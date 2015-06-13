/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var CodeInput = require('./CodeInput.react');
var Transaction = require('./Transaction.react');

var RippleService = require('../services/RippleService');
var EventService = require('../services/EventService');



var {Progress, LoadingState} = require('./Progress.react');

var Show = React.createClass({

    componentWillMount: function() {

        var that = this;
        var eventCode = this.props.params.eventCode;

        EventService.queryEvent(eventCode, function(event, status) {
            console.log('found event ', event);

            RippleService.subscribeToTransactionsForEvent(event.recipientRippleAccountId, eventCode, function(newT) {
                console.log('new transaction', newT);

                var ts = that.state.transactions;

                ts.push(newT);

                that.setState({
                        transactions: ts,
                    });
            });
            RippleService.requestTransactionsForEvent(event.recipientRippleAccountId, eventCode, function (success,transactions) {
                if (success) {
                    that.setState({
                        transactions: transactions,
                        loadingState: LoadingState.LOADED,
                        event: event
                    });
                }
            });
        });

    },

    getInitialState: function() {
        return {
            transactions: [],
            loadingState: LoadingState.LOADING,
            event: {}
        };
    },
    render: function() {
        var transactions = this.state.transactions;
        var transactionList = [];
        var received = 0.00;
        for (var i=0; i< transactions.length; i++) {
            transactionList.push(<Transaction transaction={ transactions[i]} />);
            received = received + transactions[i].amount.to_human({precision: 2});
        }

        if (this.state.loadingState === LoadingState.LOADED) {

            return (
            <div>

                <p>
                    {this.state.event.eventName} {this.state.event.totalAmount}
                </p>

                <p>{this.props.params.eventCode}</p>
                <table className="historyTable">
                    <tr><td><b>Total</b></td><td><b>{this.state.event.totalAmount}</b></td></tr>
                        {transactionList}
                    <tr><td><b>Balance</b></td><th><b>{this.state.event.totalAmount - received}</b></th></tr>
                </table>

            </div>

        );
        } else {
            return (
                <Progress message = 'Loading Transactions...'/>
            );
        }
    }
});

module.exports = Show;
