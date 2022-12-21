const Category = require('../models/category-model')

const csv = require('csv-parser')
const fs = require('fs');

const buildAncestors = async (id, parent_id) => {
    let ancest = [];
    try {
        let parent_category = await Category.findOne({ "_id": parent_id }, { "name": 1, "slug": 1, "ancestors": 1 }).exec();
        if (parent_category) {
            const { _id, name, slug } = parent_category;
            const ancest = [...parent_category.ancestors];
            ancest.unshift({ _id, name, slug })
            const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": ancest } });
        }
    } catch (err) {
        console.log(err.message)
    }
}

createCategory = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Category',
        })
    }
    let parent = req.body.parent ? req.body.parent : null;
    // const category = new Category(body)
    const category = new Category({ name: req.body.name, parent })
    if (!category) {
        return res.status(400).json({ success: false, error: err })
    }


    try {
        let newCategory = await category
            .save()
            .then(() => {
                buildAncestors(category._id, parent)
                return res.status(201).json({
                    success: true,
                    id: category._id,
                    message: 'category created!',
                    response: `Category ${category._id}`
                })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'category not created!',
                })
            })

    } catch (err) {
        res.status(500).send(err);
    }

}

getCategories = async ( req,res ) => {
    await Category.find({}, (err, categories) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!categories.length) {
            return res
                .status(404)
                .json({ success: false, error: `categorys not found` })
        }
        return res.status(200).json({ success: true, data: categories })
    }).catch(err => console.log(err))
}

uploadCategory = async ( req, res ) => {
    const body = req.body
    const csv_file = body.path
    const allCategory = []
    //console.log(xls_file)
    await fs.createReadStream(csv_file)
        .pipe(csv())
        .on('data', (row) => {
            let row_data = {
                name: row.name.trim(),
                code: row.code.trim()
            }
            console.log(row_data)
            allCategory.push(row_data)
        })
        .on('end', () => {
            console.log(allCategory)
            Category.insertMany(allCategory, function (err, data) {
                if (err) throw err;
                return res.status(200).json({ message: "all category added" })
            });
            console.log('CSV file successfully processed');
        });
}
module.exports = {
    createCategory,
    getCategories,
    uploadCategory,
    //updateMovie,
    // deleteMovie,
    // getMovies,
    // getMovieById, 
}