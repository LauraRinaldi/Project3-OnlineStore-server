const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const cart = require("../models/Cart")

router.post("/create-checkout-session", async (req, res) => {
  console.log(req.body.cart, "hey");

  try {
    const lineItems = await Promise.all(
      req.body.cart.products.map(async (prod) => {
        const product = await stripe.products.create({
          name: `${prod.product.title}`,
        });
        console.log(product);
        const price = await stripe.prices.create({
          unit_amount: `${prod.product.price * 100}`,
          currency: "usd",
          // recurring: { interval: "month" },
          product: `${product.id}`,
        });
        return {
          price: price.id,
          quantity: 1,
        };
      })
    );
    console.log(lineItems);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success.html",
      cancel_url: "http://localhost:5173/cancel.html",
    });

    console.log(session.url);
    res.json(session.url);
  } catch (err) {
    console.log(err);
  }
  // const product = await stripe.products.create({
  //   name: "Gold Special",
  // });
  // console.log(product);
  // const price = await stripe.prices.create({
  //   unit_amount: 1299,
  //   currency: "usd",
  //   recurring: { interval: "month" },
  //   product: "prod_OQRTUZMzPNqYz2",
  // });
  // console.log(price);
});

module.exports = router;