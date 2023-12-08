import { createLogger, } from '@browserless.io/browserless';
import si from 'systeminformation';
export class Monitoring {
    config;
    log = createLogger('hardware');
    constructor(config) {
        this.config = config;
    }
    getMachineStats = async () => {
        const [cpuLoad, memLoad] = await Promise.all([
            si.currentLoad(),
            si.mem(),
        ]).catch((err) => {
            this.log(`Error checking machine stats`, err);
            return [null, null];
        });
        const cpu = cpuLoad ? cpuLoad.currentLoadUser / 100 : null;
        const memory = memLoad ? memLoad.active / memLoad.total : null;
        return {
            cpu,
            memory,
        };
    };
    overloaded = async () => {
        const { cpu, memory } = await this.getMachineStats();
        const cpuInt = cpu && Math.ceil(cpu * 100);
        const memoryInt = memory && Math.ceil(memory * 100);
        this.log(`Checking overload status: CPU ${cpuInt}% Memory ${memoryInt}%`);
        const cpuOverloaded = !!(cpuInt && cpuInt >= this.config.getCPULimit());
        const memoryOverloaded = !!(memoryInt && memoryInt >= this.config.getMemoryLimit());
        return {
            cpuInt,
            cpuOverloaded,
            memoryInt,
            memoryOverloaded,
        };
    };
}
