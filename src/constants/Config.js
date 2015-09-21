'use strict';

var Config = {
    rippleOptions: {
        trace: false,
        trusted: true,
        local_signing: true,
        servers: [
            {host: 's-west.ripple.com', port: 443, secure: true}
        ]
    },

    //bankAccount: "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q", //SnapSwap.eu
    bankAccount: "r4ra6AucpstFoEopgq93bvJdGFSNHFakLY",  //Bernhard

    serverOptions: {
        url: 'http://blitzpay.biz',
        port: '3000'
    }
};

module.exports = Config;
