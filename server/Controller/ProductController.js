const productTable = require('../Models/ProductModel');

const addProduct = async (req,res)=>{
    try {
        const {name,description,price,quantity,category} = req.body 
        const pimage = req.file? req.file.filename: null
        const productDetails = new productTable({name,description,price,quantity,category, productimage: pimage})
        await productDetails.save()
        res.status(201).json({message: "Product added successfully", pdata: productDetails})
    } catch (error) {
        console.error("Error adding product:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getProducts = async (req,res)=>{
    try {
        const products = await productTable.find().populate('category')
        res.status(200).json({message: "Products retrieved successfully", pdata: products})
    } catch (error) {
        console.error("Error retrieving products:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, quantity, category } = req.body
        const product = await productTable.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        // update fields
        product.name = name
        product.description = description
        product.price = price
        product.quantity = quantity
        product.category = category
        // update image only if new file uploaded
        if (req.file) { product.productimage = req.file.filename }
        await product.save()
        const updatedProduct = await productTable.findById(id).populate('category')
        res.status(200).json({ message: "Product updated successfully", pdata: updatedProduct })
    } catch (error) {
        console.error("Error updating product:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const {id} = req.params
        const deletedProduct = await productTable.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({message: "Product not found"})
        }
        res.status(200).json({message: "Product deleted successfully", pdata: deletedProduct})
    } catch (error) {
        console.error("Error deleting product:", error)
        res.status(500).json({message: "Server error", error})
    }
}   

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productTable.findById(id).populate('category');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ pdata: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {addProduct, getProducts, editProduct, deleteProduct,getSingleProduct}