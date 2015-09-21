jest.dontMock('../src/components/Login.react');
jest.dontMock('keymirror');
jest.dontMock('../src/components/LoadingState');

describe('Login page', function () {
    var React = require('react/addons');
    var Login = require('../src/components/Login.react');
    var TestUtils = React.addons.TestUtils;

    var LoadingState = require('../src/components/LoadingState.js');
    var Config = require('../src/constants/Config');


    it('should have correct loading state', function () {
        var Mock = React.createClass({
            getValue: function () {
            },
            render: function () {
                return (<div />);
            }
        });

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={{}}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');
    });

    it('should change loading state on form submit', function () {
        var Mock = React.createClass({
            validate: function () {
            },
            isValid: function () {
                return true;
            },
            getValue: function () {
            },
            render: function () {
                return (<div />);
            }
        });

        var UserActions = {
            loginUser: function () {
            }
        };

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={UserActions}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(login.state.loadingState).toBe('LOADING');
    });

    it('should not change loading state on form submit for invalid secret', function () {
        var Mock = React.createClass({
            validate: function () {
            },
            isValid: function () {
                return false;
            },
            getValue: function () {
            },
            render: function () {
                return (<div />);
            }
        });

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={{}}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(login.state.loadingState).toBe('LOADED');
    });

    it('should call loginUser on form submit', function () {
        var getValueMock = jest.genMockFunction();
        getValueMock.mockReturnValueOnce('username').
            mockReturnValueOnce('secret');

        var Mock = React.createClass({
            validate: function () {
            },
            isValid: function () {
                return true;
            },
            getValue: getValueMock,
            render: function () {
                return (<div />);
            }
        });

        var loginUserMock = jest.genMockFunction();

        var UserActions = {
            loginUser: loginUserMock
        };

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={UserActions}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(loginUserMock).toBeCalledWith('username', 'secret');

    });

    it('should render a form with 7 children', function () {
        var Mock = React.createClass({
            validate: function () {
            },
            isValid: function () {
                return true;
            },
            getValue: function () {
            },
            render: function () {
                return (<div />);
            }
        });

        var login = TestUtils.renderIntoDocument(
            <Login
                LoadingState={LoadingState}
                Config={Config}
                UserActions={{}}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');

        expect(form.getDOMNode().children.length).toEqual(7);
    });

});
