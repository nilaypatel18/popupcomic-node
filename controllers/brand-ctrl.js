const Brand = require('../models/brand-model')
const csv = require('csv-parser')
const fs = require('fs');

uploadBrand = async (req, res) => {
    const body = req.body
    const xls_file = body.path
    const allBrand = []
    //console.log(xls_file)
    await fs.createReadStream( xls_file )
        .pipe( csv() )
        .on('data', (row) => {
            let row_data ={
                name: row.name.trim(),
                code: row.code.trim()
            }
            console.log(row_data)
            allBrand.push( row_data )
        })
        .on('end', () => {
            console.log(allBrand)
            Brand.insertMany(allBrand, function (err, data) {
                if (err) throw err;
                return res.status(200).json({ message: "all brands added" })
            });
            console.log('CSV file successfully processed');
        });
    
}

updateBrand = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Movie not found!',
            })
        }
        movie.name = body.name
        movie.time = body.time
        movie.rating = body.rating
        movie
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: movie._id,
                    message: 'Movie updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Movie not updated!',
                })
            })
    })
}
module.exports = {
    uploadBrand,
    updateBrand,
    //deleteMovie,
    //getBrands,
    //getBrandById,
}