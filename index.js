 const express = require('express');
 const cors = require('cors');
 const app = express();
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require('dotenv').config()
 const port = process.env.PORT || 5000;

 //middleware
 app.use(cors())
 app.use(express.json())


   

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b1f0ncj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

    const classesCollection = client.db("sportsDB").collection("classes");
    const instructorsCollection = client.db("sportsDB").collection("instructors");
    const addClassCollection = client.db("sportsDB").collection("addClass");
    const usersCollection = client.db("sportsDB").collection("users");
   
//user relatate api
 app.post('/users', async(req, res) => {
  const user = req.body;
  const query = {email:user.email}
  const existuser = await usersCollection.findOne(query)
  if(existuser){
    return res.send({massege :'user already exist'})
  }
  const result = await usersCollection.insertOne(user)
  res.send(result)
 });

 app.get('/users', async(req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result)
 })

 app.delete('/users/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await addClassCollection.deleteOne(query)
  res.send(result)
})

app.patch('/users/admin/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const updateDoc = {
    $set: {
      role: 'admin' 
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send(result)
})



  app.get('/classes', async(req,res) => {
        const result = await classesCollection.find().toArray();
        res.send(result)
  })
  app.get('/instructors', async(req, res) => {
        const result = await instructorsCollection.find().toArray()
        res.send(result)
  })


 // addclass api used
  app.post('/addClass', async(req,res) => {
        const item = req.body;
        const result = await addClassCollection.insertOne(item)
        res.send(result)
      })

      app.get('/addClass',  async(req,res) => {
        const email = req.query.email;
        if(!email){
          res.send([]);
        }
         

        const query = {email: email}
          const result = await addClassCollection.find(query).toArray();
          res.send(result) 
  });

  app.delete('/addClass/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await addClassCollection.deleteOne(query)
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);






 app.get('/', (req, res ) => {
        res.send('sports summer is run')
 });

 app.listen(port, () => {
        console.log(`spots summer camp : ${port}`)
 })