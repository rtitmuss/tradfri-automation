const { discoverGateway, TradfriClient, TradfriErrorCodes } = require ("node-tradfri-client");

const identity = 'tradfri_1541006932558';
const psk = 'UUS1PKV1wDGry5wv';

async function connectWithGateway() {
    const discoveredGateway = await(discoverGateway());

    const tradfri = new TradfriClient(discoveredGateway.name);

    try {
        await tradfri.connect(identity, psk);
    } catch (e) {
        switch (e.code) {
            case TradfriErrorCodes.ConnectionTimedOut: {
                console.log('The gateway is unreachable or did not respond in time');
                break;
            }
            case TradfriErrorCodes.AuthenticationFailed: {
                console.log('The provided credentials are not valid. You need to re-authenticate'
                    + ' using authenticate()');
                break;
            }
            case TradfriErrorCodes.ConnectionFailed: {
                console.log('An unknown error happened while trying to connect');
                break;
            }
        }
    }

    return tradfri;
}

module.exports = connectWithGateway;
