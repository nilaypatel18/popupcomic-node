const User = require('../models/user-model')
const jwt = require("jsonwebtoken");

module.exports =  async function (req, res, next) {
    //const token = req.header("token");
    const bearerHeader = req.headers['authorization']
    //check bearer
    if (typeof bearerHeader == 'undefined') {
        return res.status(401).json({ success: false, message: "Authorization is missing" });
    }

    try {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]
        const decoded = jwt.verify( token, "popupcomics" );
        req.user = decoded.user;
        req.token = token;
        req.user_id = decoded.user.id
        let user_id = decoded.user.id
        await User.findOne({_id: user_id}, (err, user) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            
            const userToken = (user.token) ? user.token : false ;
            
            if( !userToken ){
                return res.status(404).json({  success: false, message: `You must be login to access this api` })
            }else{
                next()
            }
        
        }) 
        
    } catch (e) {
        console.error(e);
        return res.status(500).send({ success:false, message: "Invalid Token" });
    }
};