/**
 * POST /add
 * Add user
 */

const multer = require('multer');
const sharp = require('sharp');
const admin = require('firebase-admin');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const path = require('path');

const database = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Configure multer upload.
 */
const upload = multer({
  fileFilter: function(req, file, cb) {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(
      'Error: File upload only supports the following filetypes - ' + filetypes
    );
  }
});

exports.index = [
  upload.single('avatar'),

  check('id').exists(),

  check('username')
    .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){9,}.*$/)
    .withMessage(
      'Has to be a combination of letters and numbers and longer than 8 digits'
    ),

  check('email')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage('Not a valid email')
    .trim()
    .normalizeEmail(),

  check('name')
    .isLength({ min: 1 })
    .withMessage('Give me one at least')
    .matches(/^([^0-9]*)$/)
    .withMessage('No número'),

  check('age')
    .exists()
    .toInt()
    .custom(value => value >= 10 && value <= 85)
    .withMessage('Between 10 and 85'),

  check('password')
    .matches(/^.*(?=.*[A-Z])[a-zA-Z0-9]+$/)
    .withMessage(
      'Has to contain letters and numbers with at least one Capital letter'
    ),

  check('biography', 'Cant be empty and has to have least 10 digits')
    .isLength({ min: 1 })
    .matches(/^([\s\S]*[0-9]){10,}.*$/),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    let gcsname = null;

    if (req.file) {
      gcsname = Date.now() + req.file.originalname;
      const file = bucket.file(gcsname);

      const stream = file.createWriteStream({
        metadata: { contentType: req.file.mimetype }
      });

      stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        file.makePublic();
      });

      sharp(req.file.buffer)
        .resize(250, 250)
        .max()
        .toBuffer(function(err, buf) {
          stream.end(buf);
        });
    }

    const user = { ...matchedData(req), avatar: gcsname, date: Date.now() };

    database
      .collection('users')
      .doc(user.id)
      .set(user);

    res.json(user);
  }
];
