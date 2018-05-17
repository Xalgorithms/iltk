const invoice = require('ubl/src/xa/ubl/invoice');
const GoogleStorage = require('./google-storage');
const LocalTempStorage = require('./local-temp-storage');
const Functions = require('./functions');
const uuidv4 = require('uuid/v4');

const VALID_FORMATS = ['ubl', 'json'];

/*
Example config
{
  project_id: '211290057486',
  bucket_name: 'lichen-documents',
  document_storage_location: 'google-storage',
  firebase_function_url: 'https://us-central1-lichen-ui.cloudfunctions.net/',
}
*/
class Documents {
  constructor(config) {
    const {project_id, bucket_name, document_storage_location, firebase_function_url} = config;

    this.document_storage_location = document_storage_location || 'local-tmp';
    this.locations = {
      'google-storage': new GoogleStorage(project_id, bucket_name),
      'local-tmp'     : new LocalTempStorage(),
    };
    this.functions = new Functions(firebase_function_url);
  }

  get(id, fmt) {
    return new Promise((resolve, reject) => {
      if (!VALID_FORMATS.includes(fmt)) {
        return reject();
      }
      this.with_location((loc) => {
        loc.get(id)
        .then((data) => {
          const content = data[0].toString('utf8');

          if (fmt === 'json') {
            invoice.parse(content, (inv) => {
              resolve(JSON.stringify(inv));
            })
          } else {
            resolve(content);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    });
  };

  create(token, f) {
    const id = uuidv4();

    return new Promise((resolve, reject) => {
      this.functions.document(token, `/documents/${id}`).then(() => {
        this.with_location((loc) => {
          loc.store(id, f)
          .then(() => {
            resolve(id);
          })
          .catch(() => {
            reject();
          });
        })
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  with_location(fn) {
    const k = this.document_storage_location;
    if (this.locations[k]) {
      return fn(this.locations[k]);
    }

    console.log(`! invalid storage location (key=${k})`);
  }
}

module.exports = Documents;
