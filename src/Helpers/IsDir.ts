import Fs from 'fs';
import Mkdirp from 'mkdirp';


/**
 * Check if path is directory
 * if dir not exists then create it
 */
export function isDir(path: string): boolean {
  try {
    return Fs.statSync(path).isDirectory();
  } catch (error) {
    Mkdirp.sync(path);
    return true;
  }
}
