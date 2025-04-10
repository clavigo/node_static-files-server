'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  return http.createServer(async (req, res) => {
    // eslint-disable-next-line no-console
    console.log('REQ URL:', req.url);

    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid file path');

      return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);

    // eslint-disable-next-line no-console
    console.log('URL:', url.pathname);

    if (url.pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end();

      return;
    }

    if (!url.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('All routes must starts with /file/');

      return;
    }

    const requestedPath = url.pathname.replace('/file/', '');

    const realPath = path.join('public', requestedPath);

    try {
      const file = fs.readFileSync(realPath, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
}

module.exports = {
  createServer,
};
