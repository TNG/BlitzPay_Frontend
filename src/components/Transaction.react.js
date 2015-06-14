/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');

var FontIcon = require('material-ui').FontIcon;

var Transaction = React.createClass({

    render: function () {
        var transaction = this.props.transaction;
        return (
            <tr>
                <td>{transaction.senderName}</td>
                <td>{-transaction.amount.to_human({precision: 2, min_precision: 2})}</td>
                <td>{transaction.amount.currency}</td>
                <td>OK</td>
            </tr>
        );
    }
});

module.exports = Transaction;
