export namespace FontelloTypes {

  export const Host = 'https://fontello.com';

  export enum FileType {
    CSS = 'css',
    FONT = 'font',
  }

  export interface Options {

    // path to fontello config file
    config: string;

    // path to css directory (optional). if provided, font option is expected.
    css?: string;

    // path to font directory (optional). if provided, css option is expected.
    font?: string;

    // address of fontello instance (optional).
    host?: string;

    // address of the proxy you are behind.
    proxy?: string;

    // verbose flag
    verbose?: boolean;
  }

}
