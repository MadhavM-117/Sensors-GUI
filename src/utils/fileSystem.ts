import fs from 'fs';

export const readdir = fs.promises.readdir;

export const readFile = fs.promises.readFile;

export function exists (path: string):Promise<boolean> {
    return new Promise((resolve) => {
        fs.exists(path, (e: boolean) => {
            resolve(e);
        })
    });
}