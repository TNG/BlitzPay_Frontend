/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var Router = require('react-router');
var {Route, RouteHandler, Link } = Router;
var Mui = require('material-ui');

var {Colors, Spacing, Typography} = Mui.Styles;

var LeftNav = Mui.LeftNav;
var AppBar = Mui.AppBar;
var Tabs = Mui.Tabs;
var Tab = Mui.Tab;

var UserActions = require('../actions/UserActions');


var Header = React.createClass({

    render: function () {

        var menuItems = [];

        menuItems.push({route:'admin', text: 'Admin'});
        if (this.props.user.name !== '') {
            menuItems.push({ route:'join', text: 'Logout' });
        } else {
            menuItems.push({ route:'join', text: 'Login' });
        }

        var headerStyle = {
            textAlign: 'left'
        };
        var headerBoxStyles  = {
                color: Typography.textFullWhite,
                backgroundColor: Colors.lightBlue700,
                paddingLeft: Spacing.desktopGutter,
                paddingTop: '0px',
                paddingBottom: '12px',
                marginBottom: '8px',
                backgroundImage: 'url("images/4303131832_b9e1de6614_z.jpg")', // by JD Hancock https://flic.kr/p/7yfFb9
                backgroundSize: '100%'
            };
        var headerNameStyles  = {
            fontSize: '24px',
            lineHeight: Spacing.desktopKeylineIncrement + 'px',
            fontWeight: Typography.fontWeightLight
        };
        var balanceListStyles = {
            margin: 0,
            paddingLeft: '12px'
        };
        var balanceListItemStyles = {
            listStyleType: 'none'
        };

        var header = (
                <div style={headerBoxStyles}>
                    <div style={headerNameStyles}>
                        {this.props.user.name}
                    </div>
                    Balance:
                    <ul style={balanceListStyles}>
                    {this.props.user.balances.map(function(b) {
                        return <li style={balanceListItemStyles}>{b.to_human({min_precision: 2, precision: 2})} {b.currency().to_human()}</li>;
                    })}
                    </ul>
                </div>
            );

        return(
            <div style={headerStyle}>
                <AppBar title='BlitzPay'
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={this.toggleLeftNav}
                    />
                <LeftNav ref='leftNav' docked={false} menuItems={menuItems} onChange={this.onLeftNavChange} header = {header} />

                <Tabs>
                    <Tab label="Pay" route="join" onActive={this._onActive} />
                    <Tab label="Get Paid" route="create" onActive={this._onActive} />
                    <Tab label="History" route="query" onActive={this._onActive} />
                </Tabs>
            </div>
    );
    },

    toggleLeftNav: function() {
        this.refs.leftNav.toggle();
    },

    onLeftNavChange: function(e, key, payload) {
        if(payload.text === 'Logout') {
            UserActions.logout();
        }
        this.context.router.transitionTo(payload.route);
    },

    _onActive: function(tab){
        this.context.router.transitionTo(tab.props.route);
    }

});

Header.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Header;
