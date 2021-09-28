//Author : Felix Jacob 

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition:{
        info: {
            title: 'Asteroid Service',
            description: 'Der Asteroid Service ist eine Node/Express App zur Verwaltung der gespeicherten Asteroiden der User:Innen. Der Service verfügt über zwei REST - Schnittstellen.',
            version: '1',
            servers: ['https://193.197.231.179:3001']
        }
    },
    apis: ['index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect('mongodb://mongo:27017/nasaTry2', {useNewUrlParser: true, useUnifiedTopology: true});

const Asteroid = mongoose.model('Asteroid', { // Schema der gespeicherten Asteroiten 
    nasaId: String,
    name: String,
    distance: String,
    diameter: String,
    date: String,
    link: String,
    potentially_hazardous: String, 
    close_approach_date: String, 
    relative_velocity: String,
    miss_distance: String,
    is_sentry_object: String,
    orbit_class: String
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

/**
 *  @swagger
 * /InsertAsteroid:
 *  post:
 *      description: Diese Schnittstelle wird verwendet um die Daten für die gespeicherten Asteroiden einer User:In zu erhalten. <br> Hierfür wird ein Array mit den IDs der gespeicherten Asteroiden in der Request mitgeschickt. <br> Anschließend werden alle Asteroiden mit den entsprechenden IDs aus der Datenbank ausgelesen. <br> Die Asteroiden werden in einem gemeinsamen Objekt zurückgeliefert.
 
 *      responses:
 *         '200':
 *              description: Antwort bei Erfolg
 *      parameters:
 *              - in: body 
 *                name: asteroid
 *                description: Objekt mit Informationen zu einzufügenden Asteroiden
 *                schema:
 *                  type: object
 *                  required:
 *                      -nasaId
 *                  properties:
 *                      nasaId: 
 *                          type: string 
 *                      name:   
 *                          type: string
 *                      distance: 
 *                          type: string
 *                      diameter: 
 *                          type: string
 *                      date: 
 *                          type: string
 *                      link: 
 *                          type: string
 *                      potentially_hazardous: 
 *                          type: string
 *                      close_approach_date: 
 *                          type: string
 *                      relative_velocity: 
 *                          type: string
 *                      miss_distance: 
 *                          type: string
 *                      is_sentry_object: 
 *                          type: string
 *                      orbit_class: 
 *                          type: string
 *                      
 */

app.post('/InsertAsteroid', (req,res) => { //bekommt asteroiten geschickt und versucht ihn in db einzufügen, wenn ein Asteroid mit der selben ID bereits existiert wird die message 'asteroid existiert schon zurückgelifert' un nichts weiteres geschieht 
    let newAsteroid = new Asteroid(req.body);
    Asteroid.findOne({nasaId: newAsteroid.nasaId}, (err, Result) =>{
        if(err){       
            res.send(err);
        }
        if(Result == null){
            newAsteroid.save((err,Asteroid) => {
                if(err){
                    res.send(err);
                }
                else {
                    res.json(Asteroid);
                }
            });
        }else{
            res.json({message: 'id existiert schon'});
        }
    })
})

/**
 *  @swagger
 * /AsteroidInfo:
 *  get:
 *      description: Diese Schnittstelle wird verwendet um die Daten für die gespeicherten Asteroiden einer User:In zu erhalten. <br> Hierfür wird ein Array mit den IDs der gespeicherten Asteroiden in der Request mitgeschickt. <br> Anschließend werden alle Asteroiden mit den entsprechenden IDs aus der Datenbank ausgelesen. <br> Die Asteroiden werden in einem gemeinsamen Objekt zurückgeliefert. 
 *      responses:
 *         '200':
 *              description: Antwort bei Erfolg
 *      parameters:
 *              - in: query 
 *                name: asteroidIDs
 *                description: Array mit den IDs der abzufragenden Asteroiden
 *                schema:
 *                  -type: object
 *                default: 
 *                      
 */

app.get('/AsteroidInfo', async (req,res)  => { // Liefert alle gespeicherten Asteroiden in einem Array zurück 
    let savedAsteroids = {};
    for(let i=0; i<req.query.array.length; i++){
        if(i>0){
            await Asteroid.findOne({nasaId:req.query.array[i]}, (err, Result) => {
                if(err){
                    res.send(err);
                }
                else{
                    savedAsteroids[i] = Result;
                    if(i == req.query.array.length-1){
                        res.json(savedAsteroids);
                    }
                }
            }); 
        }
    }
});

//app.get('/', async (req, res) => {
//    res.send('ja');
//})

app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
})
