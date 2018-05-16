const fs = require('fs');
const path = require('path');

const tmp = '/tmp';
class LocalTempStorage {
  constructor() {}

  store(id, f) {
    return new Promise((resolve, reject) => {
      const fn = path.join(tmp, `${id}.ubl`);
      fs.writeFile(fn, f, (err) => {
        if(err) {
          return reject(err);
        }
        resolve(id);
      });
    });
  }

  get(id) {
    fs.readFile(path.join(tmp, `${id}.ubl`), function(err, data) {
      if(err) {
        return reject(err);
      }
      resolve([data]);
    });
  }
}

module.exports = LocalTempStorage;