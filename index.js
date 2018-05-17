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
