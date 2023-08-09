const Cart = require("../models/Cart");
const Product = require('../models/Product')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/tokenVerification');

const router = require("express").Router();

//Create cart
router.post("/", verifyToken, async (req, res) => {
  console.log("Product =>", req.body)
  console.log("User ===>", req.user)
  const newCart = new Cart({userId: req.user._id});

  const thisProduct = await Product.findById(req.body.productId)

  try {
    const savedCart = await newCart.save();
    savedCart.products.push(req.body)
    savedCart.subtotal += thisProduct.price
    savedCart.total = savedCart.subtotal * savedCart.tax
    const returnedCart = await savedCart.save()
    res.status(200).json(returnedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});



//Update
router.put("/:id/:cartId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log("bODY ====>", req.body)
    const newProduct = {productId: req.body.productId, quantity: 1}
    console.log("New Product", newProduct)
    const cartToUpdate = await Cart.findById(req.params.cartId)

    

    console.log("cart to update", cartToUpdate)

    res.status(200).json('updating cart');
  } catch (err) {
    res.status(500).json(err);
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
    const cart = await Cart.findOne({ userId: req.params.id });
    console.log('Cart ===>', cart)
    if (!cart) {
      return res.status(201).json({message: 'Your cart is empty'})
    }
    res.status(200).json({cart, message: "This is your cart"});
  } catch (err) {
    res.status(500).json({message: "Your cart is empty"});
  }
});

//Get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;