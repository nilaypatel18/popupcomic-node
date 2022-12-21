const express = require('express')
const bodyParser =  require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const db = require('./db')

const movieRouter = require('./routes/movie-router')
const userRouter = require('./routes/user-router')
const fileRouter = require('./routes/file-router')
const categoryRouter = require('./routes/category-router')
const comicRouter = require('./routes/comic-router')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(bodyParser.json())

db.on('error',console.error.bind(console,'MongoDB connection error:'))

app.get('/', (req,res) => {
    res.send('Hello world!')
})

app.use('/api', movieRouter)
app.use('/api', userRouter)
app.use('/api', fileRouter)
app.use('/api', categoryRouter)
app.use('/api', comicRouter)


app.get( '/auth', (req, res) =>{
    res.json({
        message : 'Welcome to API'
    });
})

app.post('/auth/posts', verfiyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', ( err, authData ) => {

    })
    res.json({
        message: 'Post created'
    });
})

app.post( '/auth/login', ( req, res ) => {
    
    const  user = {
        id: 1,
        name: 'ansari',
        email : 'vivid.ansari@gmail.com'
    }
    jwt.sign({user}, 'secretKey', (err, token) => {
        res.json({
            token 
        })
    })
})
//verifiy token
function verfiyToken( req, res, next ){
    //get authentication header
    const bearerHeader = req.headers['authorization']
    //check bearer
    if (typeof bearerHeader != 'undefined' ){
        //split at space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        //forbidden
        res.status(403).json({
            message : 'access token is required'
        })
    }
}

generateValidationError = (validation_error) => {
    const validation = []
    var i = 0;
    for (const [field, value] of Object.entries(validation_error)) {
        let err = value.msg
        //validation[i] = value.msg
        ++i
        validation.push(err)
    }
    return Object.assign({}, validation) 
}


app.listen( apiPort, () => console.log(`Server running on port ${apiPort}`))