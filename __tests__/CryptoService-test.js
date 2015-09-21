/**
 * Created by greimel on 21/09/15.
 */
jest.autoMockOff();

describe('Login page', function () {
    var CryptoService = require('../src/services/CryptoService');

    var mock = (function() {
        var store = {};
        return {
            getItem: function(key) {
                return store[key];
            },
            setItem: function(key, value) {
                store[key] = value.toString();
            },
            clear: function() {
                store = {};
            }
        };
    })();
    Object.defineProperty(window, 'localStorage', { value: mock });

    it('should encrypt a secret', function () {
        var secret = "secret";
        var pin = "12345";
        var account = "account";
        CryptoService.encryptSecret(secret, pin, account);
        expect(localStorage.getItem("secret")).toBeDefined();
    });

    it('should decrypt an encrypted secret', function () {
        var secret = "secret";
        var pin = "12345";
        var account = "account";
        CryptoService.encryptSecret(secret, pin, account);

        var decryptedSecret = CryptoService.decryptSecret(pin);

        expect(decryptedSecret).toBe(secret);
    });
});
