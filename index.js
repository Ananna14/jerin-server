const express = require('express')
const { MongoClient, ServerApiVersion, Long } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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
      const database = client.db('jerin_parlor');
      const addServiceCollection = database.collection('services');
      const detailsCollection = database.collection('details');
      const reviewCollection = database.collection('review');
      const bookingCollection = database.collection('booking');
      //services GET
      app.get('/services', async(req, res)=>{
          const coursor = addServiceCollection.find({});
          const service = await coursor.toArray();
         res.send({data:service});
        })
        //services  POST
        app.post('/services', async(req, res)=>{
            const service = req.body;
            // console.log('hit the post');
            const result = await addServiceCollection.insertOne(service);
            // console.log(result);
            res.send(result)
            // res.send('post hitted')
      })
      //GET Single service Load
      app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('get load single service', id);
        const query = {_id: ObjectId(id)};
        const service = await addServiceCollection.findOne(query);
        res.json(service);
      })
      //PAY_SINGLE_SERVICE_LOAD
      app.get('/booking/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await bookingCollection.findOne(query);
        res.json(result);
      })
      // DELETE-API
      app.delete('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id) };
        const result = await bookingCollection.deleteOne(query);
        // console.log('deleted product',)
        res.json(result);
      })
    //   Review-GET
  app.get('/review', async(req, res)=>{
    const cursor = reviewCollection.find({})
    const result = await cursor.toArray()
    res.send(result);
      })
      //Review-POST
      app.post('/review', async(req, res)=>{
        const result = await reviewCollection.insertOne(req.body);
        // (console.log(result))
        res.send(result);
      })
  // id-deye-service-choose //DETAILS GET
      app.get('/details/:id', async(req, res)=>{
          console.log(req.params.id)
          const result = await detailsCollection
          .find({_id: ObjectId(req.params.id) })
          .toArray();
          // console.log(result)
      })
         //BOOKING_sERVICE_GET
         app.get('/booking', async(req, res) =>{
           const email = req.query.email;
           const query = { email: email }
           console.log(query);
           const cursor = bookingCollection.find(query);
           const booking = await cursor.toArray();
           res.json(booking);
         })
      //BOOKING_sERVICE_POST
      app.post('/booking', async(req, res)=>{
        const cards = req.body;
        // console.log(cards);
        // res.json({ message: 'hello' })
        const result = await bookingCollection.insertOne(cards);
        // console.log(result);
       
        res.json(result);
      })
      //UPDATE-user
      app.put('/booking/:id', async(req, res)=>{
        const id = req.params.id;
        const payment = req.body;
        const filter = {_id: ObjectId(id)};
        const updateDoc = {
          $set: {
            payment: payment
          }
        };
        const result = await bookingCollection.updateOne(filter, updateDoc);
        res.json(result);
      })
      // Payment 2nd-step
      app.post('/create-payment-intent', async(req, res)=>{
        const paymentInfo = req.body;
        const amount = paymentInfo.price * 100;
        const paymentIntent = await stripe.paymentIntents.create({
             currency: 'usd',
             amount: amount,
             payment_method_types: ['card']
        });
        res.json({ clientSecret: paymentIntent.client_secret})
      })
      
      // try{
      //   console.log(error);
      // } catch (error) {
      //   console.log(error);
      // }
      
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