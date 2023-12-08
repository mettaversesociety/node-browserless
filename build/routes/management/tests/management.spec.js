import { Browserless, Config, Metrics } from '@browserless.io/browserless';
import { expect } from 'chai';
describe('Management APIs', function () {
    let browserless;
    const start = ({ config = new Config(), metrics = new Metrics(), } = {}) => {
        config.setToken('6R0W53R135510');
        browserless = new Browserless({ config, metrics });
        return browserless.start();
    };
    afterEach(async () => {
        await browserless.stop();
    });
    it('allows requests to /config', async () => {
        await start();
        await fetch('http://localhost:3000/config?token=6R0W53R135510').then(async (res) => {
            expect(res.headers.get('content-type')).to.equal('application/json; charset=UTF-8');
            expect(res.status).to.equal(200);
        });
    });
    it('allows requests to /metrics', async () => {
        await start();
        await fetch('http://localhost:3000/metrics?token=6R0W53R135510').then(async (res) => {
            expect(res.headers.get('content-type')).to.equal('application/json; charset=UTF-8');
            expect(res.status).to.equal(200);
        });
    });
    it('allows requests to /metrics/total', async () => {
        await start();
        await fetch('http://localhost:3000/metrics/total?token=6R0W53R135510').then(async (res) => {
            expect(res.headers.get('content-type')).to.equal('application/json; charset=UTF-8');
            expect(res.status).to.equal(200);
        });
    });
    it('allows requests to /sessions', async () => {
        await start();
        await fetch('http://localhost:3000/sessions?token=6R0W53R135510').then(async (res) => {
            expect(res.headers.get('content-type')).to.equal('application/json; charset=UTF-8');
            expect(res.status).to.equal(200);
        });
    });
});
