import { createLogger } from '@browserless.io/browserless';
import lighthouse from 'lighthouse';
const debug = createLogger('http:performance:child');
debug(`Child init`);
const send = (msg) => process.send && process.send(msg);
const start = async ({ url, config, options }) => {
    try {
        debug(`Child got payload, starting lighthouse`);
        const results = await lighthouse(url, options, config);
        send({
            data: results?.lhr,
            event: 'complete',
        });
    }
    catch (error) {
        send({
            error,
            event: 'error',
        });
    }
};
process.on('message', (payload) => {
    const { event } = payload;
    if (event === 'start') {
        return start(payload);
    }
    return;
});
send({ event: 'created' });
