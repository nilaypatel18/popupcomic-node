const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comic = new Schema(
    {
        diamd_no: { type: String, required: true },
        stock_no: { type: String, required: true },
        full_title: { type: String, required: true },
        main_desc: { type: String, required: true },
        variant_desc: { type: String, required: false },
        series_code: { type: String, required: true },
        issue_no: { type: String, required: false },
        issue_seq_no: { type: String, required: false },
        max_issue: { type: String, required: false },
        price: { type: Number, required: true },
        publisher: { type: String, required: true },
        upc_no: { type: String, required: false },
        cards_per_pack: { type: String, required: false },
        pack_per_box: { type: String, required: false },
        discount_code: { type: String, required: false },
        increment: { type: String, required: false },
        prnt_date: { type: String, required: false },
        foc_vendor: { type: String, required: false },
        ship_date: { type: String, required: false },
        srp: { type: String, required: false },
        category: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: false,
            default: null
         }],
        genre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'genres',
            required: false,
            default: null
        },
        brand_code: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'brands',
            required: false,
            default: null
        },
        mature: { type: String, required: false },
        adult: { type: String, required: false },
        oa: { type: String, required: false },
        caut1: { type: String, required: false },
        caut2: { type: String, required: false },
        caut3: { type: String, required: false },
        resol: { type: String, required: false },
        note_price: { type: String, required: false },
        page: { type: String, required: false },
        writer: { type: String, required: false },
        artist: { type: String, required: false },
        cover_artist: { type: String, required: false },
        foc_date: { type: String, required: false },
        previewhtml: { type: String, required: false },
        imagepath: { type: String, required: false },
        slug: { type: String },
    },
    { timestamps: true },
)
Comic.pre('save', async function (next) {
    this.slug = slugify(this.full_title);
    next();
});

function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

module.exports = mongoose.model( 'comics', Comic )