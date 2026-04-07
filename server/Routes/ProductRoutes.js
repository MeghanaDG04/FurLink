const express = require('express');
const { addProduct, getProducts, editProduct, deleteProduct, getSingleProduct} = require('../Controller/ProductController');

const route = express.Router()
const upload = require("../Middleware/ImageUpload");

route.post("/addproduct", upload.single('productimage'), addProduct)

//route.post('/addproduct', addProduct)
route.get('/getproducts', getProducts)
route.put('/editproduct/:id',upload.single('productimage'), editProduct)
route.delete('/deleteproduct/:id', deleteProduct)
route.get('/getsingleproduct/:id', getSingleProduct)

module.exports = route