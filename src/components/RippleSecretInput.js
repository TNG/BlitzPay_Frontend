/**
 * Created by kknauf on 10.07.15.
 */

'use strict';

var React = require('react');
var TextField = require('material-ui').TextField;

var RippleService = require('../services/RippleService');

var RippleSecretInput = React.createClass({


    getInitialState: function () {
        return {
            errorText: ''
        };
    },

    isValid: function () {
        return RippleService.isSecretValid(this.refs.secret.getValue());
    },

    getValue: function () {
        return this.refs.secret.getValue();
    },

    validate: function () {
        if (this.isValid()) {
            this.setState({errorText: ''});
        } else {
            this.setState({errorText: 'Invalid Secret'});
        }
    },

    render: function () {
        return (
            <TextField
                type="password"
                ref="secret"
                onKeyUp={this.validate}
                floatingLabelText="Ripple Secret"
                errorText={this.state.errorText}
                style={{width: '18em'}}
                />
        );
    }
});

module.exports = RippleSecretInput;
