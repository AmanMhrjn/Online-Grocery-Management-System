const AWS = require('aws-sdk');
const multer = require("multer");
const keys = require('../config/keys');
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public"))
  },
  dest: path.join(__dirname, "../public"),
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
})
const upload = multer({ storage })
exports.upload = upload;
