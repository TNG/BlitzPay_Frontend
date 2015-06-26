/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var CodeInput = require('./CodeInput.react');
var Transaction = require('./Transaction.react');

var RippleService = require('../services/RippleService');
var EventService = require('../services/EventService');
var mui = require('material-ui');
var Paper = mui.Paper;
var ripple = require('ripple-lib');

var Colors = require('material-ui').Styles.Colors;

var {Progress, LoadingState} = require('./Progress.react');


var Show = React.createClass({

    componentWillMount: function() {

        var that = this;
        var eventCode = this.props.params.eventCode;

        EventService.queryEvent(eventCode, function(event, status) {
            console.log('found event ', event);

            RippleService.subscribeToTransactionsForEvent(event.recipientRippleAccountId, eventCode, function(newTransaction) {
                console.log('new transaction', newTransaction);

                var ts = that.state.transactions;

                ts.push(newTransaction);

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
        var received = ripple.Amount.from_human('0 EUR');

        for (var i = 0; i < transactions.length; i++) {
            transactionList.push(<Transaction transaction={ transactions[i]}/>);
            received = transactions[i].amount.add(received);
            console.log('received', received.to_human_full());
        }

        var total = ripple.Amount.from_human(this.state.event.totalAmount + ' EUR');
        var remaining = total.subtract(received);

        console.log('total', total.to_human_full());
        console.log('remaining', remaining.to_human_full());

        if (this.state.loadingState === LoadingState.LOADED) {
            var status;
            var statusStyle;
            if (remaining.to_human() <= 0.00) {
                status = '✓';
                statusStyle = {color: Colors.Li, fontSize: '150%', textAlign: 'center'};
            } else {
                status = '';
            }

            console.log('total', total.to_human_full());
            console.log('remaining', remaining.to_human_full());

                return (
                    <div>
                        <h2><span className="eventName">{this.state.event.eventName}</span></h2>
                        <Paper>
                        <table id="table" className="table table-mc-light-blue ">

                                <div className="eventCode" style={{fontSize: '150%', textAlign: 'center', paddingTop: '15px', paddingBottom: '10px'}}>{this.props.params.eventCode}</div>
                        </table>
                        </Paper>
                        <Paper>
                            <table id="table" className="table table-hover table-mc-light-blue table-condensed">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="bold">
                                    <td>Total</td>
                                    <td style={{textAlign: 'right'}}>{total.to_human({precision: 2, min_precision: 2})}&nbsp;{total.currency().to_human()} </td>
                                </tr>
                                {transactionList}
                                <tr className="bold">
                                    <td>Remaining</td>
                                    <td style={{textAlign: 'right'}}>{remaining.to_human({precision: 2, min_precision: 2})}&nbsp;{remaining.currency().to_human()}</td>
                                    <td style={statusStyle}>{status}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Paper>
                    </div>
                );
            } else {
                return (
                    <Progress message='Loading Transactions...'/>
                );
            }
        }
});

module.exports = Show;
