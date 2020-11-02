// https://www.npmjs.com/package/i2c

const i2c = require('i2c');
const addr = 0x8;
const wire = new i2c(addr, {device: '/dev/i2c-1'});

const strToBytes = (str) => (new Buffer(str, "binary"));

wire.write(strToBytes("t85"), (err) => {
  console.log('write err:', err);
});

