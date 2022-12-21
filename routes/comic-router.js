const express = require('express')

const ComicCtrl = require('../controllers/comic-ctrl')
const BrandCtrl = require('../controllers/brand-ctrl')
const GenreCtrl = require('../controllers/genre-ctrl')
const Auth = require('../controllers/authmiddleware-ctrl')

const router = express.Router()

router.post('/comics/import', Auth, ComicCtrl.comicImport)
router.post('/brand/upload', BrandCtrl.uploadBrand)
router.post('/genre/upload', GenreCtrl.uploadGenre)

module.exports = router