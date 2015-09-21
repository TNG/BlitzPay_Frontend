'use strict';

var ripple = require('ripple-lib');
var Remote = ripple.Remote;
var Config = require('../constants/Config');
var sjcl = require('sjcl');

var SEND_MAX_FACTOR = 1.01;

function convertHexToString(hexString) {
    var bits = sjcl.codec.hex.toBits(hexString);
    return sjcl.codec.utf8String.fromBits(bits);
}

var RippleService = {
    isSecretValid: function (secret) {
        return !!secret && !!ripple.Base.decode_check(33, secret);
    },

    getAccountFromSecret: function (secret) {
        if (!this.isSecretValid(secret)) {
            throw 'invalid secret ' + secret;
        }

        return ripple.Seed.from_json(secret).get_key().get_address().to_json();
    },

    connectAccount: function (senderSecret, callback) {
        var senderAccount = this.getAccountFromSecret(senderSecret);
        this.remote.setSecret(senderAccount, senderSecret);

        var transaction = this.remote.createTransaction('TrustSet', {
            account: senderAccount,
            limit: "1000/TNG/" + Config.bankAccount
        });
        transaction.submit(function(err) {
            if (err) {
                console.log('- Transaction Submit Callback Error -');
                console.log(err);
                callback(false);
            }
            else {
                console.log('- Transaction Submit Callback -');
                callback(true);
            }
        });
    },

    giveMoney: function (recipientAccount, amount, callback) {
        this.remote.setSecret(Config.bankAccount, "SECRET_PLACEHOLDER");

        var rippleAmount = ripple.Amount.from_human(amount + ' TNG');
        rippleAmount.set_issuer(Config.bankAccount);
        var sendMax = rippleAmount.scale(SEND_MAX_FACTOR).set_issuer(Config.bankAccount);

        var transaction = this.remote.createTransaction('Payment', {
            account: Config.bankAccount,
            destination: recipientAccount,
            amount: rippleAmount
        });
        transaction.setSendMax(sendMax);

        transaction.submit(function(err) {
            if (err) {
                console.log('- Transaction Submit Callback Error -');
                console.log(err);
                callback(false);
            }
            else {
                console.log('- Transaction Submit Callback -');
                callback(true);
            }
        });

    },

    pay: function (userName, senderSecret, recipientAccount, amount, eventCode, callback) {
        console.log('Pay was called with ' + senderSecret + ' ' + recipientAccount + ' ' + amount);

        var senderAccount = this.getAccountFromSecret(senderSecret);

        this.remote.setSecret(senderAccount, senderSecret);

        amount.set_issuer(recipientAccount);
        var sendMax = amount.scale(SEND_MAX_FACTOR).set_issuer(senderAccount);
        console.log('amount: ' + amount.to_human_full());
        console.log('sendMax: ' + sendMax.to_human_full());

        sendMax.set_issuer(Config.bankAccount);
        amount.set_issuer(Config.bankAccount);

        var tx = this.remote.createTransaction('Payment', {
            account: senderAccount,
            destination: recipientAccount,
            amount: amount
        });
        tx.setSendMax(sendMax);

        tx.addMemo({
            memoType: 'beer2peer',
            memoFormat: 'json',
            memoData: {
                eventCode: eventCode,
                userName: userName
            }
        });

        tx.on('state', function (state) {
            console.log('tx state changed to ' + state);
        });

        console.log('tx to be submitted: ', tx.tx_json);

        tx.submit(function (err) {
            if (err) {
                console.log('- Transaction Submit Callback Error -');
                console.log(err);
                callback(false);
            }
            else {
                console.log('- Transaction Submit Callback -');
                callback(true);
            }
        });
    },

    requestTransactionsForEvent: function (recipientAccount, eventCode, callback) {
        var that = this;

        var opts = {
            account: recipientAccount,
            ledger_index_min: -1,
            ledger_index_max: -1,
            limit: 100, // at some point we might want to implement paging
            forward: false
        };
        this.remote.requestAccountTransactions(opts, function (err, resp) {
            if (err) {
                console.log("request account tx error", err);
                callback(false);
                return;
            }
            console.log("requestAccountTransactions resp", resp);

            var ts = resp.transactions.
                filter(function (t) {
                    return that._isIncomingPaymentForEvent(t.tx, recipientAccount, eventCode);
                }).
                map(function (t) {
                    return that._convertTxToInternalTransaction(t.tx, t.meta);
                });

            console.log('TS', ts);

            callback(true, ts);
        });
    },

    startListeningToBalanceChanges: function (accountString, callback) {
        var account = this.remote.findAccount(accountString);
        console.log('Getting balance: ', account._events);
        var lineHandler = function (err, res) {
            if (err) {
                console.log('balance load error', err);
                callback(false, null);
                return;
            }
            console.log('lines', res);

            var balances = res.lines.
                map(function (l) {
                    return ripple.Amount.from_json({
                        currency: l.currency,
                        issuer: l.account,
                        value: l.balance
                    });
                });

            callback(true, balances);
        };

        account.lines(lineHandler);
        account.on('transaction', function () {
            account.lines(lineHandler);
        });
    },

    stopListeningToBalanceChanges: function (accountString) {
        var account = this.remote.findAccount(accountString);
        account.removeAllListeners('transaction');
    },

    _isIncomingPaymentForEvent: function (tx, recipientAccount, eventCode) {
        var isPaymentToDest = tx.TransactionType === 'Payment' && tx.Destination === recipientAccount;

        var memoData = this._getOurMemoData(tx.Memos);
        var isForEvent = memoData && memoData.eventCode === eventCode;

        return isPaymentToDest && isForEvent;
    },

    _convertTxToInternalTransaction: function (tx, meta) {
        var memoData = this._getOurMemoData(tx.Memos);

        return {
            senderAccount: tx.Account,
            senderName: memoData.userName,
            amount: ripple.Amount.from_json(meta.delivered_amount || tx.Amount)
        };
    },

    subscribeToTransactionsForEvent: function (recipientAccount, eventCode, callback) {
        var that = this;

        console.log('starting to listen to account events ', recipientAccount);

        var account = this.remote.findAccount(recipientAccount);

        console.log("Incoming Transaction", account._events);

        account.on('transaction-inbound', function (netT) {
            console.log('new transaction pushed from network ', netT);

            var tx = netT.transaction;

            if (that._isIncomingPaymentForEvent(tx, recipientAccount, eventCode)) {
                var ta = that._convertTxToInternalTransaction(tx, netT.meta);
                callback(ta);
            }
        });
    },

    _parseMemoData: function (memo) {
        if (memo.MemoType !== undefined) {
            memo.parsed_memo_type = convertHexToString(memo.MemoType);
        }
        if (memo.MemoFormat !== undefined) {
            memo.parsed_memo_format = convertHexToString(memo.MemoFormat);
        }
        if (memo.MemoData !== undefined) {
            if (memo.parsed_memo_format === 'json') {
                memo.parsed_memo_data = JSON.parse(convertHexToString(memo.MemoData));
            } else if (memo.parsed_memo_format === 'text') {
                memo.parsed_memo_data = convertHexToString(memo.MemoData);
            }
        }

        return memo;
    },

    _getOurMemoData: function (memos) {
        var that = this;

        if (!memos) {
            return null;
        }

        var ourMemos = memos.
            map(function (m) {
                return that._parseMemoData(m.Memo);
            }).
            filter(function (m) {
                return m.parsed_memo_type === 'beer2peer' && m.parsed_memo_format === 'json';
            });

        if (ourMemos.length === 1) {
            return ourMemos[0].parsed_memo_data;
        } else {
            return null;
        }
    },

    _connectToRemote: function () {
        var remote = this.remote = new Remote(Config.rippleOptions);

        remote.on('error', function (error) {
            console.log('remote error: ', error);
        });

        remote.connect(function (err) {
            if (err) {
                console.log("error connecting", err);
            }
        });
    }

};

RippleService._connectToRemote();

module.exports = RippleService;
