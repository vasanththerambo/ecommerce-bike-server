const asyncHandler = require('express-async-handler')

const productModel = require('../models/productModel')

const productHome = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "product home page" });
});

const getProducts = asyncHandler(async (req, res) => {
    
    const products = await productModel.find();

    // check whether any products exists or not

    if (products.length != 0) {
        res.status(200).json({ data: products });
    }
    else {
        res.status(404);
        throw new Error('No Products Found');
    }

});

const addProducts = asyncHandler(async (req, res) => {
    const newProduct = req.body;
    
    // create new product in db

    const product = await productModel.create(newProduct);

    if (product) {
        res.status(200).json({ data: product });
    }
    else {
        res.status(400);
        throw new Error('Invalid Product');

    }

});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // access product with specified id
    const product = await productModel.findById(id);
    
    // check whether the specified product exists or not
    if (product) {
        res.status(200).json({ data: product });
    }
    else {
        res.status(404);
        throw new Error('Profile Does Not Exist')
    }

});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    // update the current product from req.body

    await productModel.findByIdAndUpdate(id,product);
    
    // access the updated product
    const updatedProduct = await productModel.findById(id);

    // check the updation status and return the same
    if (updatedProduct) {
        res.status(200).json({ data: updatedProduct });
    }
    else {
        res.status(404);
        throw new Error('Product Does not Exist');
    }

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // delete the current product

    await productModel.findByIdAndDelete(id);
    
    // check whether the deleted product exists or not

    const deletedProduct = await productModel.findById(id);

    if (!deletedProduct) {
        res.status(202).json({ _id: id });
    }
    else {
        res.status(400);
        throw new Error("Delete Failed");
    }
})


module.exports = { productHome, getProducts, addProducts, getProduct, updateProduct, deleteProduct }



