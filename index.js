const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express();
const port =process.env.PORT || 5000;

// middle-ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojutr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
      await client.connect();
      const database = client.db('jerin_parlor')
      const addServiceCollection = database.collection('services')
      const detailsCollection = database.collection('details')
      //services GET
      app.get('/services', async(req, res)=>{
          const coursor = addServiceCollection.find({});
          const service = await coursor.toArray();
         res.send(service);
        })
        //services  POST
        app.post('/services', async(req, res)=>{
            const service = req.body;
            // console.log('hit the post');
            const result = await addServiceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
            // res.send('post hitted')
      })
  
      app.get('/details/:id', async(req, res)=>{
          console.log(req.params.id)
          const result = await detailsCollection
          .find({_id: ObjectId(req.params.id) })
          .toArray();
          console.log(result)

            // console.log(req.params.id)
            // const id = req.params.id;
            // const query = { _id: ObjectId(id) };
            // const tutor = await detailsCollection.findOne(query);
            // console.log(tutor)
            // res.send(tutor);

      })
      //DETAILS POST
      
    } finally {
        //   await client.close();
        }
      }
      run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Running my CRUD Server');
});

app.listen(port, ()=>{
    console.log('Running server on port', port)
})