const express = require('express')
const Tought = require('../models/Tought')
const router = express.Router()
//help
const checkAuth = require('../helpers/auth').checkAuth

//Controller
const ToughtController = require('../controllers/ToughtController')

router.get('/add',checkAuth, ToughtController.createTought)
router.post('/add',checkAuth, ToughtController.createToughtSave)
router.get('/edit/:id',checkAuth, ToughtController.update)
router.post('/edit',checkAuth, ToughtController.updateSave)
router.get('/dashboard',checkAuth, ToughtController.dashboard)
router.post('/destroy',checkAuth, ToughtController.destroy)
router.get('/', ToughtController.showToughts)

module.exports = router