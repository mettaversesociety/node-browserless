import { Config, IResourceLoad } from '@browserless.io/browserless';
export declare class Monitoring {
    private config;
    private log;
    constructor(config: Config);
    getMachineStats: () => Promise<IResourceLoad>;
    overloaded: () => Promise<{
        cpuInt: number | null;
        cpuOverloaded: boolean;
        memoryInt: number | null;
        memoryOverloaded: boolean;
    }>;
}
