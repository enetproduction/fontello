import Path from 'path';
import Needle from 'needle';
import AdmZip from 'adm-zip';
import { FontelloTypes } from './Support/FontelloTypes';

export default class Fontello {

  private fOptions: FontelloTypes.Options;

  constructor(options: FontelloTypes.Options) {
    this.fOptions = options;
  }

  public async install(): Promise<void> {
    const sessionId = await this.getSessionId();
    const zip = await this.getZip(sessionId);

    // if css and font options are enabled - extract files to direct dirs
    if (this.fOptions.css && this.fOptions.font) {
      // get all entries from zip
      const files = zip.getEntries();

      files.forEach((file) => {
        // if the file is directory return
        // process only files
        if (file.isDirectory) {
          return;
        }

        // get dirname from file
        // remove fontello auto-generate name
        const dirName = Path.dirname(file.entryName).replace(/^fontello-[a-z0-9]+\//gm, '');
        
        // switch for dirname
        switch (dirName) {
          case FontelloTypes.FileType.CSS: {
            zip.extractEntryTo(file, this.fOptions.css!, false, true);
            return;
          }
          case FontelloTypes.FileType.FONT: {
            zip.extractEntryTo(file, this.fOptions.font!, false, true);
            return;
          }
          default: {
            // do nothing if file is upper switch cases
          }
        }
      });

      return;
    }

    // otherwise, extract files to process.cwd()
    zip.extractAllTo(process.cwd());
  }

  /**
   * Get API host
   * @returns string with Fontello API host
   * @private
   */
  private getHost(): string {
    // define base host
    let host = this.fOptions.host ?? FontelloTypes.Host;

    // if host ends with `/` then remove last slash from host
    if (host.endsWith('/')) {
      host = host.slice(0, -1);
    }

    return host;
  }

  /**
   * Send config to fontello api and get the session id from them
   * @returns string with fontello session id
   * @private
   */
  private async getSessionId(): Promise<string> {
    // define request url
    const url = this.getHost();

    // define request options for needle
    const options: Needle.NeedleOptions = {
      multipart: true,
    }

    if (this.fOptions.proxy) {
      options.proxy = this.fOptions.proxy;
    }

    // define data to send
    const data: Needle.BodyData = {
      config: {
        file: this.fOptions.config,
        content_type: 'application/json',
      },
    };

    const response = await Needle('post', url, data, options);

    if (response.statusCode !== 200) {
      throw new Error('[Fontello::getSessionId] Cannot get fontello session');
    }

    return response.body;
  }

  /**
   * Get zip with fontello files
   * @param sessionId the id of session to get fontello files
   * @return {AdmZip} AdmZip
   * @private
   */
  private async getZip(sessionId: string): Promise<AdmZip> {
    // define request url
    const url = `${this.getHost()}/${sessionId}/get`;

    // define request options for needle
    const options: Needle.NeedleOptions = {
      follow: 10,
    }

    if (this.fOptions.proxy) {
      options.proxy = this.fOptions.proxy;
    }

    const response = await Needle('get', url, options);

    if (response.statusCode !== 200) {
      throw new Error('[Fontello::getFiles] Cannot get fontello files');
    }

    return new AdmZip(response.body);
  }
}
