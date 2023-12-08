import { Config } from '@browserless.io/browserless';
export declare class FileSystem {
    private config;
    private fsMap;
    constructor(config: Config);
    /**
     * Appends contents to a file-path for persistance. File contents are
     * encrypted before being saved to disk. Reads happen via the in-memory
     * lookup of the internal map.
     *
     * @param path The filepath to persist contents to
     * @param newContent A string of new content to add to the file
     * @returns void
     */
    append: (path: string, newContent: string) => Promise<void>;
    /**
     * Reads contents from the local map, if any exist, or loads
     * from the file system and hydrates the cache for the particular filepath
     *
     * @param path The filepath of the contents to read
     * @returns Promise of the contents separated by newlines
     */
    read: (path: string) => Promise<string[]>;
}
