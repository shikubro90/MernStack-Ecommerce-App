const express = require('express')
const { requireSignIn, isAdmin } = require('../middlewares/auth')
const router = express.Router()

const {
  createCategory,
  update,
//   getCollections,
  remove,
  list,
  read,
} = require('../controllers/category')

router.post('/category', requireSignIn, isAdmin, createCategory)
router.put('/update-category/:categoryId', requireSignIn, isAdmin, update)
// router.get('/get-collections', requireSignIn, isAdmin, getCollections)
router.delete('/remove/:categoryId', requireSignIn, isAdmin, remove)
router.get('/list', list)
router.get('/category/:slug', read)

module.exports = router
