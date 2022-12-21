const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Brand = new Schema(
    {
        code: { type: String, required: true },
        name: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model( 'brands', Brand )