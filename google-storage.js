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

const Storage = require('@google-cloud/storage');

//  In order to test against GCLOUD STORAGE, you will need to set:
// export GOOGLE_APPLICATION_CREDENTIALS="path/to/json"

class GoogleStorage {
  constructor(project_id, bucket_name) {
    this.project_id = project_id;
    this.bucket_name = bucket_name;
  }

  store(id, f) {
    if (this.get_bucket()) {
      const n = `${id}.ubl`;
      console.log(`> storing file (name=${n})`);
      return this.bucket.file(n).save(f);
    } else {
      console.log('! no bucket configured, not storing');
      return Promise.reject();
    }
  }

  get(id) {
    if (this.get_bucket()) {
      return this.bucket.file(`${id}.ubl`).download();
    }

    return Promise.reject();
  }

  get_bucket() {
    this.bucket = this.bucket || this.maybe_connect_bucket(this.project_id, this.bucket_name);

    return this.bucket;
  }

  maybe_connect_bucket(project_id, bucket_name) {
    if (project_id) {
      console.log(`# connecting to bucket (project_id=${project_id}; bucket_name=${bucket_name})`);
      const st = new Storage({ projectId: project_id });
      return st.bucket(bucket_name);
    } else {
      console.log(`! no project id was specified, set env var GCLOUD_PROJECT_ID`);
    }
  }
}

module.exports = GoogleStorage;