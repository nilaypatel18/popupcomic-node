const express = require('express')

const FileCtrl = require('../controllers/file-ctrl')
const BrandCtrl = require('../controllers/brand-ctrl')
const Auth = require('../controllers/authmiddleware-ctrl')

const router = express.Router()

router.get('/files', Auth, FileCtrl.getFilesList)
router.post('/files/extract', Auth, FileCtrl.getExtractFile)
router.post('/files/uploadImage', Auth, FileCtrl.uploadImage)

module.exports = router