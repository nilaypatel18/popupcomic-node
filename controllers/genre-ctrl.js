const Genre = require('../models/genre-model')
const csv = require('csv-parser')
const fs = require('fs');

uploadGenre = async (req, res) => {
    const body = req.body
    const csv_file = body.path
    const allGenre = []
    
    fs.createReadStream( csv_file )
    .pipe(csv())
    .on('data', (row) => {
        let row_data = {
            name: row.name.trim(),
            code: row.code.trim()
        }
        console.log(row_data)
        allGenre.push(row_data)
    })
    .on('end', () => {
        Genre.insertMany(allGenre, function (err, data) {
            if (err) throw err;
            return res.status(200).json({ message: "all genre added" })
        });
        console.log('CSV file successfully processed');
    });

}
module.exports = { uploadGenre }