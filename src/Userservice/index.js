const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3002;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const multer = require('multer');
const fs = require('fs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const { strict } = require('assert');
const user = mongoose.model('User', { userName: String, password: String, email: String, favorite: Array, image: String, unit: String, sort: String});

const swaggerOptions = {
  swaggerDefinition:{
      info: {
          title: 'User Service',
          description: 'Manages User Data -Registers Users -Checks Login Data -Saves and deletes Asteroids for each User -Saves User specific options -Checks all saved Asteroids',
          version: '1',
          servers: ['https://193.197.231.179:3002']
      }
  },
  apis: ['index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// localhsot zu Mongo ändern
mongoose.connect('mongodb://mongo:27017/UserData', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
     next();
});

/**
 *  @swagger
 * /register:
 *  post:
 *      description: Use to register User
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: body 
 *                name: register
 *                description: The user to be registered
 *                schema:
 *                    type: object
 *                    required: 
 *                        -userName
 *                        -email
 *                        -password
 *                    properties:
 *                        userName:
 *                            type: string
 *                            default: Adrian
 *                        email:
 *                            type: string
 *                            default: adrian@email.com
 *                        password:
 *                            type: string
 *                            default: 1234                 
 */
app.post('/register', (req, res) => {
  var data = req.body;
  const name = user.exists({userName: data.userName}, function(err, result) {
    if(err) {
      console.log(err)
    }else{  
      console.log("Result: ", result)
      if(!result){
        let hpw = data.password;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(hpw, salt);
        data.password = hash;
        data.salt = salt;
        let Users = new user(data);
        Users.save().then(() => console.log("User saved in Database"));
        res.json({message: 'User registered!', email: data.email})
      }else{
        console.log("User already registered!");
        res.status(400);
        res.json({error: "User already registered!"});
      }
    }
  });    
});

/**
 *  @swagger
 * /login:
 *  get:
 *      description: Use to login User
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: query 
 *                name: userName
 *                required: true
 *                schema:
 *                  -type: string
 *                default: Adrian
 *              - in: query
 *                name: userPassword
 *                required: true
 *                schema:
 *                  -type: string
 *                default: 1234                      
 */
app.get('/login', (req, res) => {  
  user.findOne({userName: req.query.userName}, (error, result) => {
    if(error){
      console.log(error);
    }else{
      if(result == null){
        res.send("User does not exist!");
      }else{
        bcrypt.compare(req.query.userPassword, result.password, function(err, isMatch){
          if(err){
            throw err;
          }else if(!isMatch) {
            console.log(isMatch);
            console.log("Password doesn't match!");
            res.status(400);
            res.send("Password doesn't match!");
          }else{
            console.log(`${result.userName}`);
            console.log(`${result.password}`);
            res.json({message: 'User Login accepted!', result: result}) 
          }
        })
      }
    }
  });
});


/**
 *  @swagger
 * /favorite:
 *  put:
 *      description: Use to save Asteroid
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: body 
 *                name: favorite
 *                description: The Asteroid that will be saved
 *                schema:
 *                    type: object
 *                    required: 
 *                        -userName
 *                        -favorite               
 *                    properties:
 *                        userName:
 *                            type: string
 *                            default: Adrian
 *                        favorite:
 *                            type: string
 *                            default: 2001862                 
 */
app.put('/favorite', (req, res) => {
  var data = req.body;
  console.log(data.favorite)
  user.findOneAndUpdate(
    {userName: data.userName},
    { $push: {favorite: req.body.favorite}}
    , function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});


/**
 *  @swagger
 * /favorite:
 *  get:
 *      description: Use to return favorites
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: query 
 *                name: userName
 *                required: true
 *                schema:
 *                  -type: string
 *                default: Adrian                     
 */
app.get('/favorite', (req, res) => {
  var data = req.query;
  console.log(data.userName);
  user.findOne({userName: data.userName}, (error, result) => {
    if(error){
      console.log(error);
    }else{
      if(result == null){
        res.send("User does not exist!")
      }else{
        favorite = result.favorite
        console.log(typeof favorite);
        res.json(result.favorite);
      }
    }
  });
});


/**
 *  @swagger
 * /removefavorite:
 *  put:
 *      description: Use to remove Asteroid
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: body 
 *                name: removefavorite
 *                description: The Asteroid that will be removed
 *                schema:
 *                    type: object
 *                    required: 
 *                        -userName
 *                        -favorite               
 *                    properties:
 *                        userName:
 *                            type: string
 *                            default: Adrian
 *                        favorite:
 *                            type: string
 *                            default: 2001862                 
 */
app.put('/removefavorite', (req, res) => {
  var data = req.body;
  console.log(data.favorite)
  user.findOneAndUpdate(
    {userName: data.userName},
    { $pull: {favorite: data.favorite}}
    , function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});


/**
 *  @swagger
 * /globalfavorite:
 *  get:
 *      description: Use to return all saved Asteroids 
 *      response:
 *         '200':
 *              description: A successfull response             
 */
app.get('/globalfavorite', (req, res) => {
  user.find().distinct('favorite', function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});


/**
 *  @swagger
 * /useroption:
 *  get:
 *      description: Use to return the Option the user saved before
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: query 
 *                name: userName
 *                required: true
 *                schema:
 *                  -type: string
 *                default: Adrian                     
 */
app.get('/useroption', (req, res) => {
  var data = req.query;
  user.findOne(
    {userName: data.userName}, function(err, result){
      if(err){
        res.send(err);
      }else{
        res.send(result);
      }
    }
  );
});


/**
 *  @swagger
 * /useroption:
 *  put:
 *      description: Use to save user option
 *      response:
 *         '200':
 *              description: A successfull response
 *      parameters:
 *              - in: body 
 *                name: useroption
 *                description: The option that should be saved
 *                schema:
 *                    type: object
 *                    required: 
 *                        -userName
 *                        -image
 *                        -unit
 *                        -sort               
 *                    properties:
 *                        userName:
 *                            type: string
 *                            default: Adrian
 *                        image:
 *                            type: string
 *                            default: false
 *                        unit:
 *                            type: string
 *                            default: metric
 *                        sort:
 *                            type: string
 *                            default: name                  
 */
app.put('/useroption', (req, res) => {
  var data = req.body;
  user.findOneAndUpdate(
    {userName: data.userName},
    { image: data.image, unit: data.unit, sort: data.sort}, function(err, result){
      if(err){
        res.send(err);
      }else{
        res.send(result);
      }
    }
  );
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const storage = multer.diskStorage({
  destination: (req, file, callBack) =>  {
    callBack(null, "../frontend/src/assets/profile_pictures")
  },
  filename: (req, file, callBack) => {
    callBack(null, `profilePicture_${file.originalname}`)
  }
});

var upload = multer({storage: storage})

/**
 *  @swagger
 * /upload:
 *  post:
 *      description: Use to upload profile picture (Can´t be tested)
 *      response:
 *         '200':
 *              description: A successfull response                    
 */
app.post("/upload", upload.single('file' /* name attribute of <file> element in your form */), (req, res, next) => {
    var data = req.query;
    const file = req.file;

    var newpath = file.path;
    newpath = newpath.slice(0, -file.filename.length)
    newpath += data.userName+'.png';
    fs.rename(file.path, newpath, function(err) {
      if ( err ) console.log('ERROR: ' + err);
  });
    if(!file){
      const error = new Error('Please upload a file');
      error.httpStatusCode=400;
      return next(error);
    }

    res.send(file);
  }
);

/**
 *  @swagger
 * /image:
 *  delete:
 *      description: Use to delete profile picture (Can´t be tested)
 *      response:
 *         '200':
 *              description: A successfull response                    
 */
app.delete("/image", (req, res) => {
  const data = req.query;
  const filePath = "../frontend/src/assets/profile_pictures/"+data.userName + '.png'; 
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err)
      return
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://193.197.231.179:${port}`)
});