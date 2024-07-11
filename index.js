const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ye8t7hu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const AlltrainerCollection = client.db('FitnessPalDB').collection('allTrainer')
    const ReviewCollection = client.db('FitnessPalDB').collection('reviews')
    const SubscribersCollection = client.db
    ('FitnessPalDB').collection('subscriber')

    const UsersCollection = client.db('FitnessPalDB').collection('users')

    const PaymentCollection = client.db('FitnessPalDB').collection('payment')
    const AddNewClassesCollection = client.db('FitnessPalDB').collection('addclasses')
    const AddNewForumsCollection = client.db('FitnessPalDB').collection('addforum')

    // subscriber related api
    app.post('/subscriber',async(req,res) =>{
      const subscriber = req.body;
      const result = await SubscribersCollection.insertOne(subscriber);
      res.send(result);
      
    })
    app.get('/subscriber',async(req,res) =>{
      const result =await SubscribersCollection.find().toArray();
      res.send(result)
  })

    // allTrainer related API
    app.post('/allTrainer',async(req,res) =>{
      const allTrainer = req.body;
      const result = await AlltrainerCollection.insertOne(allTrainer);
      res.send(result);
      
    })
    app.get('/allTrainer',async(req,res) =>{
        const result =await AlltrainerCollection.find().toArray();
        res.send(result)
    })
    
   
  
      app.get('/users/trainer/:email', async(req,res)=>{
        const email = req.params.email;
        // if(email !== req.decoded.email){
        //   return res.status(403).send({message: 'unauthorized access'})
        // }
  
        const query = {email: email};
        const user = await AlltrainerCollection.findOne(query);
        let trainer = false;
        if(user){
          trainer = user?.role === 'trainer';
        }
        res.send({ trainer });
  
      })
  

       // Trainer added ar jonno
       app.patch('/users/trainer/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const updatedDoc = {
          $set: {
            role: 'trainer'
          }
        }
        const result = await AlltrainerCollection.updateOne(filter, updatedDoc);
        res.send(result);
      })
    // app.get('/TrainerAll',async(req,res) =>{
    //   const result =await AlltrainerCollection.find().toArray();
    //   res.send(result)
    // })

    app.get('/allTrainer/:id',async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result =await AlltrainerCollection.findOne(query)
      res.send(result);
    })

  

    app.delete('/allTrainer/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await AlltrainerCollection.deleteOne(query);
      res.send(result)
    })
    
    // review related API
    app.get('/reviews',async(req,res) =>{
        const result =await ReviewCollection.find().toArray();
        res.send(result)
    })

    // user related API
    app.post('/users',async(req,res) =>{
      const Users = req.body;
      const result = await UsersCollection.insertOne(Users);
      res.send(result);
      
    })
  //  payment related API
  app.post('/payment',async(req,res) =>{
    const newObj = req.body;
    const result = await PaymentCollection.insertOne(newObj);
    res.send(result);
    
  })
  app.get('/payment',async(req,res) =>{
    const result =await PaymentCollection.find().toArray();
    res.send(result)
})
  // add a classes API
  
  app.post('/addclasses',async(req,res) =>{
    const newObj = req.body;
    const result = await AddNewClassesCollection.insertOne(newObj);
    res.send(result);
    
  })
//   app.get('/addclasses',async(req,res) =>{
//     const result =await AddNewClassesCollection.find().toArray();
//     res.send(result)
// })
app.get('/addclasses',async(req,res) =>{
  const {search} = req.query;
  console.log(search);
  let query = {}
  if(search){
    query = {
      classesName: {$regex: search, $options: 'i'}
    };
  }
  const cursor =AddNewClassesCollection.find(query);
  const result =await cursor.toArray();
  console.log(result)
  res.send(result)

})

// add furam ar jonno

app.post('/addAnewFuram',async(req,res) =>{
  const newObj = req.body;
  const result = await AddNewForumsCollection.insertOne(newObj);
  res.send(result);
  
})

// newforum gate
app.get('/addAnewFuram',async(req,res) =>{
  const result =await AddNewForumsCollection.find().toArray();
  res.send(result)
})

  

    

    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('Fitness Pal is running')
})

app.listen(port,() =>{
    console.log(`Fitness Pal is running on port ${port}`)
})