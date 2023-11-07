const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')
const {productHome,getProducts,addProducts ,getProduct,updateProduct,deleteProduct} =require('../controllers/productController')

router.route('/').get(protect, productHome);
router.route('/products').get(protect, getProducts);
router.route('/products').post(protect, addProducts);
router.route('/products/:id').get(protect, getProduct);
router.route('/products/:id').patch(protect, updateProduct);
router.route('/products/:id').delete(protect, deleteProduct);




module.exports = router;


