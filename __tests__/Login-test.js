jest.dontMock('../src/components/Login.react');
jest.dontMock('keymirror');
jest.dontMock('../src/components/LoadingState');

describe('Login page', function () {
    var React = require('react/addons');
    var Login = require('../src/components/Login.react');
    var TestUtils = React.addons.TestUtils;

    var LoadingState = require('../src/components/LoadingState.js');
    var Config = require('../src/constants/Config');
    var mockStorage = {
        setItem: function() {},
        clear: function() {},
        getItem: function() {},
        length: 0
    };

    beforeEach(function () {
        var store = {};

        spyOn(mockStorage, 'getItem').andCallFake(function (key) {
            return store[key];
        });
        spyOn(mockStorage, 'setItem').andCallFake(function (key, value) {
            return store[key] = value + '';
        });
        spyOn(mockStorage, 'clear').andCallFake(function () {
            store = {};
        });
    });

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
                LocalStorage={mockStorage}
                >
                <Mock />
                <Mock />
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
                LocalStorage={mockStorage}
                >
                <Mock />
                <Mock />
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
                LocalStorage={mockStorage}
                >
                <Mock />
                <Mock />
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
                LocalStorage={mockStorage}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(loginUserMock).toBeCalledWith('username', 'secret', '');

    });

    it('should include the provided PIN into userLogin function', function () {
        var getValueMock = jest.genMockFunction();
        getValueMock.mockReturnValueOnce('username')
            .mockReturnValueOnce('secret')
            .mockReturnValueOnce('123456');

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
                LocalStorage={mockStorage}
                remember={true}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(loginUserMock).toBeCalledWith('username', 'secret', '123456');
    });

    it('should show an error if the PIN is too short', function () {
        var getValueMock = jest.genMockFunction();
        getValueMock.mockReturnValueOnce('username')
            .mockReturnValueOnce('secret')
            .mockReturnValueOnce('1234');

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
                LocalStorage={mockStorage}
                remember={true}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        expect(login.state.loadingState).toBe('LOADED');

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');
        TestUtils.Simulate.submit(form);

        expect(login.state.pinErrorText).toBe('The PIN must have at least 5 digits.');
        expect(loginUserMock.mock.calls.length).toBe(0);
    });

    it('should render a form with 10 children', function () {
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
                LocalStorage={mockStorage}
                >
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
                <Mock />
            </Login>
        );

        var form = TestUtils.findRenderedDOMComponentWithTag(login, 'form');

        expect(form.getDOMNode().children.length).toEqual(10);
    });

});
