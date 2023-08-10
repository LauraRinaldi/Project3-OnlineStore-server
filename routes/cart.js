const Cart = require("../models/Cart");
const Product = require('../models/Product')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/tokenVerification');
// const { default: ProductPreview } = require("../../client/src/components/Productpreview");

const router = require("express").Router();

//Create cart
router.post("/", verifyToken, async (req, res) => {
  console.log("Product =>", req.body)
  console.log("User ===>", req.user)
  const newCart = new Cart({userId: req.user._id});

  const thisProduct = await Product.findById(req.body.productId)

  try {
    const savedCart = await newCart.save();
    savedCart.products.push({productId: req.body.productId, size: req.body.size, quantity: req.body.quantity})
    savedCart.subtotal += thisProduct.price * req.body.quantity
    savedCart.total = savedCart.subtotal * savedCart.tax
    const returnedCart = await savedCart.save()
    res.status(200).json(returnedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});



//Update
router.post("/:id/:cartId", verifyTokenAndAuthorization, async (req, res) => {
  console.log("Update information ++++++", req.body)
  try {
    const thisProduct = await Product.findById(req.body.productId)
    console.log("bODY ====>", req.body)

    console.log("THIS product ?????????", thisProduct)
    
    // const newProduct = {productId: req.body.productId, quantity: 1}
    // console.log("New Product", newProduct)
    const cartToUpdate = await Cart.findById(req.params.cartId)

    
    cartToUpdate.products.push({productId: req.body.productId, size: req.body.size, quantity: req.body.quantity})

    cartToUpdate.subtotal += thisProduct.price * req.body.quantity
    cartToUpdate.total = cartToUpdate.subtotal * cartToUpdate.tax

    console.log("cart to update", cartToUpdate)

    const cart = await cartToUpdate.save()


    res.status(200).json(cart);
  } catch (err) {
    console.log("Updated Error", err)
    res.redirect(307, '/cart')
    // res.status(500).json(err);
  }
});

//Delete
router.delete("/:id/", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user cart
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const thisCart = await Cart.findOne({ userId: req.params.id });
    if (thisCart) {
      let productIds = thisCart.products.map((product) => product.productId)
      console.log("Array ====>", productIds)
      let products = productIds.map((id) => Product.findById(id))
      let finishedProducts = await Promise.all(products)
      console.log("Products ===>", finishedProducts)
      let newProducts = []
      finishedProducts.forEach((product, i) => {
        let newProduct = {product, quantity: thisCart.products[i].quantity, size: thisCart.products[i].size}
        newProducts.push(newProduct)
      })
      const cart = {...thisCart._doc}
      cart.products = newProducts
      // cart.products = newProducts
      // const newCart = await cart.save()
      // console.log("New Cart ===>", newCart)
      console.log("NewProducts ====>", newProducts)
      res.status(200).json(cart); 
    } else {  
        return res.status(201).json({message: 'Your cart is empty'})
    }
    
  } catch (err) {
    res.status(500).json({message: "Your cart is empty"});
  }
});

//Get all cart, 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;