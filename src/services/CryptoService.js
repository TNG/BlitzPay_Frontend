/**
 * Created by greimela on 21/09/15.
 */
'use strict';

var CryptoJS = require("crypto-js");


var CryptoService = {
    encryptSecret: function(secret, pin, account) {
        var salt = CryptoJS.lib.WordArray.random(128 / 8);
        var key = CryptoJS.PBKDF2(pin, salt, {keySize: 128 / 32, iterations: 100});
        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var secretEncrypted = CryptoJS.AES.encrypt(secret, key, {'iv': iv});

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
            return secretDecrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return false;
        }
    }
};
module.exports = CryptoService;
