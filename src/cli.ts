#!/usr/bin/env node
import Fontello from './main';
import { program } from 'commander';
import { isDir } from './Helpers/IsDir';
import { FontelloTypes } from './Support/FontelloTypes';

program
  .version('1.0.1')
  .usage('[command] [options]')
  .requiredOption('--config [path]', 'path to fontello config. defaults to ./config.json')
  .option('--css [path]', 'path to css directory (optional). if provided, --font option is expected.')
  .option('--font [path]', 'path to font directory (optional). if provided, --css option is expected.')
  .option('--host [host]', 'address of fontello instance (optional).')
  .option('--proxy [host]', 'address of the proxy you are behind.')
  .option('--verbose', 'address of the proxy you are behind.', false)

program
  .command('install')
  .description('download fontello. without --css and --font flags, the full download is extracted.')
  .action(() => {
    // get options from command
    const options = program.opts() as FontelloTypes.Options;

    if (options.css && options.font) {
      if (!isDir(options.css)) {
        console.error('--css path provided is not a directory.');
        process.exit(1);
      }
      if (!isDir(options.font)) {
        console.error('--font path provided is not a directory.');
        process.exit(1);
      }
    }

    const gFontello = new Fontello({
      config: options.config || 'fontello.config.json',
      css: options.css,
      font: options.font,
      host: options.host,
      proxy: options.proxy,
    });

    return gFontello.install();
  });

program.parse(process.argv);
