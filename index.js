const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");
const multerupload = multer({ dest: 'tmp/' })
const Documents = require('./documents');

const documents = new Documents({
  project_id: '211290057486',
  bucket_name: 'lichen-documents',
  document_storage_location: 'google-storage',
  firebase_function_url: 'https://us-central1-lichen-ui.cloudfunctions.net/',
});

router.get('/:id.:format', (req, res) => {
  const {id, format} = req.params.format;

  documents.get(id, format).then((content) => {
    res.json({ status: 'ok', content });
  }).catch((err) => {
    res.status(404).json({ status: 'invalid_format', reason: `format not in expected list (format=${fmt}; list=${VALID_FORMATS.join(', ')})` });
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  documents.get(id, 'json').then((content) => {
    res.json({ status: 'ok', content });
  }).catch(() => {
    res.status(404).json({ status: 'err' });
  });
});

router.post('/', multerupload.any(), (req, res) => {
  const file = req.files[0];
  fs.readFile(file.path, 'utf-8', (err, f) => {
    if (err) {
      return res.status(404).json({ status: 'err' });
    }

    documents.create(req.header('X-Lichen-Token'), f).then((id) => {
      res.json({ id: id });
    }).catch(() => {
      res.status(404).json({ status: 'err' });
    });;
  });
});

app.use(cors());
app.use('/v1/documents', router);

app.listen(4000, () => console.log('Example app listening on port 4000!'))
