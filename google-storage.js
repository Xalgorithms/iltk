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