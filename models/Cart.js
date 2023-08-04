const { Schema, model } = require('mongoose');

const CartSchema = new Schema(

    {
        userId: { type: String, required: true },
        products: [
        {
            productId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    },
    { timestamps: true }
);

module.exports = model('Cart', CartSchema)