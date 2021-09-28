const express =require('express');
const bodyparser = require('body-parser');
const axios = require('axios');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { response } = require('express');
const app = express();
const port = 3000;

// How to use swagger with nodejs
// Extended https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition:{
        info: {
            title: 'NASA Integration Service',
            description: 'Integrates the Asteroids APIs (NASA and SBDB) and delivers the data to the Frontend',
            version: '1',
            servers: ['https://193.197.231.179:3000']
        }
    },
    apis: ['server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyparser.json());
//app.use(cors);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });
const api_key = 'yVVNaUrbe3OG4Cm03O2IZmb8dr9xoQrUZUso5CK4';

/**
 * @swagger
 * /nasa/neo/{startdate}/{enddate}:
 *  get:
 *      description: Use to request all astereoids between start- and end-date (max. 7 days)
 *      responses: 
 *          '200':
 *              description: A successful response
 *      parameters:  
 *            - in: path
 *              name: startdate
 *              description: startdate from the requested timespan
 *              required: true
 *              schema:
 *                  type: date
 *                  format: string
 *              default: 2021-06-05
 *            - in: path
 *              name: enddate
 *              description: enddate from the requested timespan
 *              required: true
 *              schema:
 *                  type: date
 *                  format: string
 *              default: 2021-06-07
 */
app.get('/nasa/neo/:startdate/:enddate', async (req, res) => {
    // 193.197.231.179:3000/nasa/neo/2020-06-05/2020-06-06
    const start_date = req.params.startdate;
    const end_date = req.params.enddate;
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+start_date+'&end_date='+end_date+'&api_key='+api_key;
    
    const response = await axios.get(url);
    //console.log(response.data['near_earth_objects']);
    res.json(response.data);
});

/**
 * @swagger
 * /nasa/lookup/{id}:
 *  get:
 *      description: Use to request an asteroid after a specific id with more data
 *      responses: 
 *          '200':
 *              description: A successful response
 *      parameters:  
 *            - in: path
 *              name: id
 *              description: startdate from the requested timespan
 *              required: true
 *              schema:
 *                  type: string
 *              default: 2001862
 *            
 */
app.get('/nasa/lookup/:id', async (req, res) => {
    const id = req.params.id;
    const url = 'https://api.nasa.gov/neo/rest/v1/neo/'+id+'?api_key='+api_key;

    const response = await axios.get(url);

    // const close_dates = response.data['close_approach_data'];
    // close_dates.forEach(element => {
    //     console.log(element['close_approach_date']);
    // }); 
    //console.log(response.data);
    res.json(response.data);
});

app.get('/nasa/browse/:id', async (req, res) => {
    //2001862
    const id = req.params.id;
    const url = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key='+api_key;

    const response = await axios.get(url);
    const asteroids = response.data['near_earth_objects']

    for (let asteroid of asteroids){
        if(asteroid['id'] == id){
            console.log('i was here');
            console.log(asteroid);
            break;
        }
    }

    res.json(response.data);
});

/**
 * @swagger
 * /nasa/sbdb/spk/{id}:
 *  get: 
 *      description: Use to request additional data from asteroid
 *      responses: 
 *          '200':
 *              description: A successful response
 *      parameters:  
 *            - in: path
 *              name: id
 *              description: requested id
 *              required: true
 *              schema:
 *                  type: date
 *                  format: string
 *              default: 2001862 
 */
app.get('/nasa/sbdb/spk/:id', async (req, res) => {
    //2001862
    
    const id = req.params.id;
    //if(id.length <= 7){
        //const url = 'https://ssd-api.jpl.nasa.gov/sbdb.api?spk='+id;
        
        const url = 'https://ssd-api.jpl.nasa.gov/sbdb.api?sstr='+id;

        const response = await axios.get(url)
        .then(resp => {
            //console.log(id);
            //console.log(response.data);
            if(resp.status==200){
                res.status(200);
                res.json(resp.data);
            }else{
                res.status(202);
                res.json(resp.data);
            }
        })
        .catch(error => {
            console.log(id);
            console.log("error"+ error);
            //console.log(error.data);
            console.log(error.message)
            res.status(202);
            res.json({message: 'not available'});
        });
        
        //const asteroids = response.data['object']

        //res.json(response.data);
    // }else{
    //     res.status(202);
    //     res.json({message: 'not available'});
    // }
    
});

app.listen(port, () => console.log('App running on port', port))
