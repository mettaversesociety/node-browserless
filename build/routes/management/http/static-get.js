import { APITags, HTTPManagementRoutes, Methods, NotFound, ServerError, contentTypes, createLogger, fileExists, mimeTypes, } from '@browserless.io/browserless';
import { createReadStream } from 'fs';
import path from 'path';
const debug = createLogger('http:static');
const verbose = createLogger('http:static:verbose');
const pathMap = new Map();
const streamFile = (res, file, contentType) => new Promise((resolve, reject) => {
    if (contentType) {
        verbose(`Setting content-type ${contentType}`);
        res.setHeader('Content-Type', contentType);
    }
    return createReadStream(file)
        .on('error', (error) => {
        if (error) {
            debug(`Error finding file ${file}, sending 404`);
            pathMap.delete(file);
            return reject(new NotFound(`No handler or file found for resource ${file}`));
        }
    })
        .on('end', resolve)
        .pipe(res);
});
const route = {
    accepts: [contentTypes.any],
    auth: false,
    browser: null,
    concurrency: false,
    contentTypes: [contentTypes.any],
    description: `Serves static files inside of this "static" directory. Content-types will vary depending on the type of file being returned.`,
    handler: async (req, res) => {
        const { _config: getConfig } = route;
        const { pathname } = req.parsed;
        const fileCache = pathMap.get(pathname);
        if (fileCache) {
            return streamFile(res, fileCache.path, fileCache.contentType);
        }
        if (!getConfig) {
            throw new ServerError(`Couldn't load configuration for request`);
        }
        const config = getConfig();
        const file = path.join(config.getStatic(), pathname);
        const indexFile = path.join(file, 'index.html');
        const filePath = (await Promise.all([
            fileExists(file).then((exists) => (exists ? file : undefined)),
            fileExists(indexFile).then((exists) => exists ? indexFile : undefined),
        ])).find((_) => !!_);
        if (!filePath) {
            throw new NotFound(`No handler or file found for resource ${pathname}`);
        }
        verbose(`Found new file "${filePath}", caching path and serving`);
        const contentType = mimeTypes.get(path.extname(filePath));
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        // Cache the assets location so we don't have to
        // do stat checks again when requests come back
        pathMap.set(pathname, {
            contentType,
            path: filePath,
        });
        return streamFile(res, filePath, contentType);
    },
    method: Methods.get,
    path: HTTPManagementRoutes.static,
    tags: [APITags.management],
};
export default route;
