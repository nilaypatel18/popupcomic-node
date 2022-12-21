

const path = require('path');
const fs = require('fs');
const decompress = require('decompress');
//joining path of directory 
const directoryPath = path.join(__dirname, '../uploads/');
//const directoryPath = path.join(__dirname, '../uploads/');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
    accessKeyId: 'AKIAWAJYLDONJ4G3V3NJ',
    secretAccessKey: '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',
    region: 'eu-west-1'
});

getFilesList = async (req, res) => {
    var files_ = [];
    
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach( async (file) => {
            var file_info = {};
            let file_path = directoryPath + file;
            if (fs.existsSync(file_path)) {
                const extension = path.extname(file);
                
                if (extension == '.zip') {
                    
                    var check_file = fs.statSync(file_path);
                    if (check_file.isFile()) {
                        file_info['name'] = file;
                        file_info['path'] = file_path;
                        file_info['extract'] = false;
                        file_info['xml_path'] = '';
                        file_info['json_path'] = '';
                    
                    }
                    
                    
                    try {
                        //check zip name folrder is present or not in same directory
                        let zipfolder = path.basename(file, extension);
                        zipfolderPath = directoryPath + zipfolder;
                        if (fs.existsSync(zipfolderPath)){
                            var check_file = fs.statSync(zipfolderPath);
                            if (check_file.isDirectory()) {
                                file_info['extract'] = true;
                                //read folder to check have xml file or not
                                zipfiles = fs.readdirSync(zipfolderPath);
                                zipfiles.forEach(file => {
                                    
                                    if (path.extname(file) == ".xml") {
                                        let filePath = zipfolderPath + "\\" + file;
                                        file_info['xml_path'] = filePath;
                                    
                                    }
                                    if (path.extname(file) == ".json") {
                                        let filePath = zipfolderPath + "\\" + file;
                                        file_info['json_path'] = filePath;
                                        
                                    }
                                })

                            } 
                        }
                    } catch (error) {
                        console.log(error)
                        console.log(error.code)
                    }
                
                    files_.push(file_info);
                }
            }
            // Do whatever you want to do with the file
            // console.log()
        });
        if (!files_.length) {
            return res
                .status(404)
                .json({ success: false, error: `files not found` })
        }else{
            return res.status(200).json({ success: true, data: files_ })
        }
        
    });
}
getExtractFile = async (req, res) => {
    const body = req.body
    const extension = path.extname(body.path)
    const filename = path.basename(body.path, extension)
    
    if ( extension != '.zip' ){
        return res.status(400).json({
            success: false,
            error: 'You must provide a zip file',
        })
    }
    var decompressPath = directoryPath + filename;
   
    const xmlfile = [];
    const imageFile = [];
    await decompress(body.path , decompressPath ).then(files => {
        files.map( file => {
            //console.log(file)
            var ext = path.extname(file.path)
            if (ext == '.xml') {
                let filePath = decompressPath+"\\"+file.path
                let filename = path.basename(file.path)
                let newfilePath = decompressPath + "\\" + filename
                fs.rename(filePath, newfilePath, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                })
                xmlfile.push(filePath)
            } else if (ext == '.jpg' || ext == '.png' || ext == '.jpeg'){
              
                imageFile.push(decompressPath + "\\" + file.path)
                /*  */
            }
        })
        
    });
    if (imageFile.length > 0) {
        var image_json_path = decompressPath + "\\" + 'product_image.json';
        fs.writeFile(image_json_path, JSON.stringify(imageFile), 'utf-8', function (err) {
            if (err) throw err
            console.log('Done!')
        })
    }
    
    if (!xmlfile.length){
        return res
            .status(200)
            .json({ success: true, message: `Zip is successfully extract` } )
    }
    return res.status(200).json({ success: true, message: `Zip is successfully extract` })
}
uploadImage = async (req, res) => {
    const body = req.body
    //let image_path = body.image_path;
    let json_file = body.json_path;
    let current_index = body.current_index
    var _return = {}
    try{
    //check file is exixts or not
        if (fs.existsSync( json_file ) ) {
            let image_json_file = fs.readFileSync(json_file);
            let image_json = JSON.parse( image_json_file );
            
            let total_index = image_json.length - 1
            var percetage = ( current_index / total_index ) * 100
                    
            let image_path = image_json[current_index]
            
            _return['current_index'] = current_index
            _return['progress_percentage'] = percetage.toFixed(2);
            _return['total_record'] = total_index
            
            
            
            let filename = path.basename(image_path)
            let file_key = 'nodetest/'+filename; // bucketurl for upload image
            
            const readStream = fs.createReadStream(image_path);
            const params = {
                Bucket: 'darksidecomics', // pass your bucket name
                Key: file_key, // file will be saved as testBucket/contacts.csv
                Body: readStream
            };

            try{

                const uploadS3 = await s3.upload(params, function (s3Err, data) {
                    if(s3Err) throw s3Err
                    return data
                }).promise();
                
                if (uploadS3.Location){
                    //_return['message'] = `${filename} - uploaded`
                    let response_message = `${filename} - uploaded`
                    _return['completed'] = ( total_index == current_index ) ? true : false
                    console.log(uploadS3.Location)    
                    return res.status(200).json({ success: true, data: _return, message: response_message })
                }
            }catch(error){
                let message = error.code+': '+error.originalError.message
                return res
                    .status(404)
                    .json({ success: false, error: message })
            }
        }else{
            return res.status(404).json({ success: false, message: 'json url not found' })
        }
    }catch( error ){
        return res.status(500).json({ success:false , message: error })
    }

}

module.exports = { getFilesList, getExtractFile, uploadImage }