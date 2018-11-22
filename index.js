const rp = require('request-promise');

const EXCHANGE_RATE_URL = 'https://www.freeforexapi.com/api/live?pairs=USDTRY';
const IFTTT_URL = 'https://maker.ifttt.com/trigger/:color/with/key/cPZPx3NL8yzsJZ2WsMdFje';

module.exports = function (ctx, cb) {
    run(ctx, cb).then(cb.bind(null, null)).catch(cb);
};

async function run(ctx) {
    const newRate = await getExchangeRate();
    const oldRate = await getStoredExchangeRate(ctx);
    const switchToGreenColor = newRate >= oldRate;

    // fire and forget
    if (switchToGreenColor) {
        changeLights('green_alert');
    } else {
        changeLights('red_alert');
    }
    await updateExchangeRate(ctx, newRate);

    return {newRate, oldRate, switchToGreenColor};
}

async function getExchangeRate() {
    const exchangeResult = await rp(EXCHANGE_RATE_URL).json();
    if (exchangeResult && exchangeResult.rates &&
        exchangeResult.rates.USDTRY && exchangeResult.rates.USDTRY.rate) {
        return exchangeResult.rates.USDTRY.rate;
    }
    throw new Error('Body not recognized!');
}

async function updateExchangeRate(ctx, rate) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
        ctx.storage.set({rate}, {force: 1}, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function getStoredExchangeRate(ctx) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
        ctx.storage.get((error, data = {}) => {
            if (error) {
                reject(error);
            } else {
                resolve(data.rate || 0);
            }
        });
    });
}

async function changeLights(triggerColor) {
    const url = IFTTT_URL.replace(':color', triggerColor);
    try {
        await rp.post(url)
    } catch(err) {
        console.log('ifttt request is failed!', err);
    }
}
