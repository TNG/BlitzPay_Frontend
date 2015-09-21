/**
 * Created by greimela on 21/09/15.
 */
'use strict';

var RippleService = require('../services/RippleService');
var CryptoJS = require("crypto-js");


var CryptoService = {
    encryptSecret: function(secret, pin) {
        var salt = CryptoJS.lib.WordArray.random(128 / 8);
        var key = CryptoJS.PBKDF2(pin, salt, {keySize: 128 / 32, iterations: 100});
        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var secretEncrypted = CryptoJS.AES.encrypt(secret, key, {'iv': iv});
        var account = RippleService.getAccountFromSecret(secret);

        localStorage.setItem("salt", salt);
        localStorage.setItem("iv", iv);
        localStorage.setItem("secret", secretEncrypted);
        localStorage.setItem("account", account);
    },

    decryptSecret: function decryptSecret(pin) {
        var salt = CryptoJS.enc.Hex.parse(localStorage.getItem("salt"));
        var iv = CryptoJS.enc.Hex.parse(localStorage.getItem("iv"));
        var secretEncrypted = localStorage.getItem("secret");

        var key = CryptoJS.PBKDF2(pin, salt, {keySize: 128 / 32, iterations: 100});
        var secretDecrypted = CryptoJS.AES.decrypt(secretEncrypted, key, {'iv': iv});

        try {
            var secret = secretDecrypted.toString(CryptoJS.enc.Utf8);
            if (RippleService.isSecretValid(secret)) {
                return secret;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
};
module.exports = CryptoService;
