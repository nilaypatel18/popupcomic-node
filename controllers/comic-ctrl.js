const Comic = require('../models/comic-model')
const Brand = require('../models/brand-model')
const Genre = require('../models/genre-model')
const Category = require('../models/category-model')

const path = require('path');
const fs = require('fs');
const convert = require('xml-js');

comicImport = async (req, res) => {
    const body = req.body
    let _path = body.path;
    //let filename = path.basename(path)
    const extension = path.extname(_path);
    //check file is exists or not
    if (fs.existsSync(_path) && '.xml' == extension) {
        let xml_key = body.key
        try {
            // read file
            const xmlFile = fs.readFileSync(_path, 'utf8');

            // parse xml file as a json object
            const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 4, alwaysArray: true }));
            //let jsonResponse = jsonData['EXPORT_FILE'];

            const exportData = jsonData.dataroot[0].EXPORT_FILE[xml_key];
            var xmlobj = {}
            for (const [key, value] of Object.entries(exportData)) {
                var xmlkey = key.toLowerCase()
                if ( 'full_title' == xmlkey ) {
                    let title = value[0]._text[0]
                    title = title.replace(/ *\([^)]*\) */g, '')
                    xmlobj[xmlkey] = title
                } else if ( 'brand_code' == xmlkey ) {
                    let brand_code = value[0]._text[0];
                    let brand = await Brand.findOne({ code: brand_code })
                    xmlobj[xmlkey] = brand ? brand._id : null
                } else if ( "genre" == xmlkey ){
                    let genre_code = value[0]._text[0];
                    let genre = await Genre.findOne({ code: genre_code })
                    xmlobj[xmlkey] = genre ? genre._id : null
                } else if ( "category" == xmlkey ){
                    let category_code = value[0]._text[0];
                    let category = await Category.find({ code: category_code })
                    const category_ids = []
                    category.map((cat)=>{
                        console.log(cat._id)
                        category_ids.push(cat._id)
                    })
                    xmlobj[xmlkey] = category_ids ? category_ids : ''
                } else {
                    xmlobj[xmlkey] = value[0]._text[0]
                }
            
            }
            //console.log(xmlobj) //.populate("brand_code category") // for listing in response
            await Comic.findOne({ diamd_no: xmlobj.diamd_no }).exec((err, comic) => {
                console.log(comic)
                if ( comic ) {
                    updateComic( comic, xmlobj, res )
                } else {
                    createComic( xmlobj, res )
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: error.code })
        }

    } else {
        return res.status(404).json({ message: `please check file path and file must be .xml formate` })
    }
}
createComic = (xmlobj, res) => {
    const comic = new Comic(xmlobj)

    if (!comic) {
        return res.status(400).json({ message: err })
    }

    comic
        .save()
        .then(() => {
            return res.status(201).json({
                id: comic._id,
                message: 'comic added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'comic not created!',
            })
        })
}
updateComic = (comic, xmlobj, res) => {

    for (const [comic_key, comic_value] of Object.entries(xmlobj)) {
        comic[comic_key] = comic_value
    }
    comic
        .save()
        .then(() => {
            return res.status(200).json({
                id: comic._id,
                message: 'comic updated!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error,
                message: 'comic not updated!',
            })
        })
}
module.exports = { comicImport }