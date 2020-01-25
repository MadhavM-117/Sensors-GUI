import util from 'util';
import fs from 'fs';

export const readdir = util.promisify(fs.readdir);

export const readFile = util.promisify(fs.readFile);

export function exists (path: string):Promise<boolean> {
    return new Promise((resolve) => {
        fs.exists(path, (e: boolean) => {
            resolve(e);
        })
    });
}