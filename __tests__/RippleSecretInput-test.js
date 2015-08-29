jest.dontMock('../src/components/RippleSecretInput');

describe('Login page', function () {


    it('should call validate on form key up', function () {

        var React = require('react/addons');
        //var TextField = require('material-ui').TextField;
        var RippleSecretInput = require('../src/components/RippleSecretInput');
        var TestUtils = React.addons.TestUtils;

        var RippleService = {
            isSecretValid: function () {
                return true;
            }
        };

        var input = TestUtils.renderIntoDocument(
            <RippleSecretInput RippleService={RippleService}/>
        );

        expect(input.state.errorText).toBe('');

        //var field = TestUtils.findRenderedDOMComponentWithTag(input, TextField);
        //TestUtils.Simulate.keyUp(field);
        //
        //expect(input.state.errorText).toBe('invalid');

    });


});
