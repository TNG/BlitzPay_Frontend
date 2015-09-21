'use strict';

var React = require('react');
var mui = require('material-ui');
var CircularProgress = mui.CircularProgress;


module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <p>{this.props.message}</p>
                <CircularProgress mode = "indeterminate" />
            </div>
        );
    }
});