jest.dontMock('../src/components/Login.react');
jest.dontMock('keymirror');
jest.dontMock('../src/components/LoadingState');

describe('Login page', function () {
    it('should have correct loading state', function () {
        var React = require('react/addons');
        var Login = require('../src/components/Login.react');
        var TestUtils = React.addons.TestUtils;

        var LoadingState = require('../src/components/LoadingState.js');
        var Config = require('../src/constants/Config');
        var UserActions = {
            loginUser: function() {}
        };

        var RippleSecretInput = React.createClass({
            validate: function() {},
            isValid: function() {return true;},
            getValue: function() {},
            render: function () {
                return (<div />);
            }
        });
        var Progress = React.createClass({
            render: function () {
                return (<div />);
            }
        });
        var RaisedButton = React.createClass({
            render: function () {
                return (<div />);
            }
        });
        var UsernameInput = React.createClass({
            validate: function() {},
            isValid: function() {return true;},
            getValue: function() {},
            render: function () {
                return (<div />);
            }
        });

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={UserActions}
                >
                <RippleSecretInput />
                <Progress />
                <RaisedButton />
                <UsernameInput />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(login.state.loadingState).toBe('LOADING');


    });

});
