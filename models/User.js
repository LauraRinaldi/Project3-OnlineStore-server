const { Schema, model } = require('mongoose');

const userSchema = new Schema(

    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String, required: true },
        isAdmin: {
            type: Boolean,
            dafault: false,
        },
    },
    {   timestamps: true }
);

  module.exports = model("User", userSchema);