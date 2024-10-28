const http = require('http');
const assert = require('assert');
const server = require('./app');


const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  assert.strictEqual(res.statusCode, 200);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    assert.strictEqual(data, 'Hello World');
    console.log('Test passed');

    server.close();
  });
});


req.on('error', (error) => {
  console.error(error);
  server.close();
});

req.end();
