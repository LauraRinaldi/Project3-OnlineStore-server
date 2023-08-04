const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(

    {
        title: { type: String, required: true, unique: true},
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array },
        size: { type: Array },
        price: {type: Number, required: true },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = model('Product', ProductSchema)