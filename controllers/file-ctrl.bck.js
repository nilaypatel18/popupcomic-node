const path = require('path');

const decompress = require('decompress');
//joining path of directory 
const directoryPath = path.join(__dirname, '../uploads/');
//const directoryPath = path.join(__dirname, '../uploads/');
const { promisify } = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);


getFilesList = async (req, res) => {
    var files_ = [];
    //passsing directoryPath and callback function
    await readdir(directoryPath, async (err, files) => {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            var file_info = {};
            let file_path = directoryPath + file;
            const extension = path.extname(file);
            if (extension == '.zip') {
                console.log(file_path);
                var check_file = fs.statSync(file_path);
                if (check_file.isFile()) {
                    file_info['name'] = file;
                    file_info['path'] = file_path;
                    file_info['extract'] = false;
                    /*  files_.push({
                         name: file,
                         path: ,
                         extract: false
                     }); */
                }
                //check zip name folrder is present or not in same directory
                let zipfolder = path.basename(file, extension);
                zipfolderPath = directoryPath + zipfolder;
                var check_file = fs.statSync(zipfolderPath);
                console.log(zipfolder);
                if (check_file.isDirectory()) {
                    file_info['extract'] = true;
                    //read folder to check have xml file or not
                    fs.readdir(zipfolderPath, async (err, files) => {
                        //  console.log(file_info);
                        files.map(async function (file) {
                            // console.log(file);
                            // console.log(file_info);
                            var ext = path.extname(file);
                            // console.log(ext);
                            if (ext == '.xml') {
                                let filePath = zipfolderPath + "\\" + file;
                                //console.log(filePath);
                                file_info['xml_path'] = filePath;
                            }
                            // console.log(file_info);
                        });
                    });
                    console.log(file_info);
                }

                files_.push(file_info);
            }
            console.log('finalarr');
            console.log(files_);
            if (!files_.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `files not found` })
            }
            return res.status(200).json({ success: true, data: files_ })
            // Do whatever you want to do with the file
            // console.log()
        });

    });

    console.log('endprocess')
    console.log(files_details);
    const files_arr = await readZipFile(files_)
    console.log('after await')
    console.log(files_arr)

}
getExtractFile = async (req, res) => {
    const body = req.body
    const extension = path.extname(body.path)
    const filename = path.basename(body.path, extension)

    if (extension != '.zip') {
        return res.status(400).json({
            success: false,
            error: 'You must provide a zip file',
        })
    }
    var decompressPath = directoryPath + filename;

    const xmlfile = [];
    await decompress(body.path, decompressPath).then(files => {
        files.map(file => {
            var ext = path.extname(file.path)
            if (ext == '.xml') {
                let filePath = decompressPath + "\\" + file.path
                xmlfile.push(filePath)
            }
        })
        console.log(xmlfile)

    });
    console.log('---- bhar-----')
    console.log(xmlfile)
    if (!xmlfile.length) {
        return res
            .status(404)
            .json({ success: false, error: `xml file not found in zip` })
    }
    return res.status(200).json({ success: true, data: xmlfile })
}
readZipFile = async (file_arr) => {
    console.log(file_arr)
    console.log('in read file function')
}
module.exports = { getFilesList, getExtractFile }