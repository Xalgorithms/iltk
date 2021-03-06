// Copyright 2018 Hayk Pilosyan <hayk.pilos@gmail.com>
// This file is part of Interlibr, a functional component of an
// Internet of Rules (IoR).
// ACKNOWLEDGEMENTS
// Funds: Xalgorithms Foundation
// Collaborators: Don Kelly, Joseph Potvin and Bill Olders.
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License. You may
// obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

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