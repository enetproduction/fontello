#!/usr/bin/env node
// add cli
// TODO: rewrite this file
import Fontello from './main';
import path from 'path';

const fontello = new Fontello({
  config: path.resolve(path.join(__dirname, 'config.json')),
  css: path.resolve(path.join(process.cwd(), 'dist', 'css')),
  font: path.resolve(path.join(process.cwd(), 'dist', 'font')),
});

try {
  fontello.install();
} catch (err) {
  console.error('[CLI]', err);
}
