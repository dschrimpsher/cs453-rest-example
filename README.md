# Example Node/Express RESTFul Server

## Running
This server consists of a simple node.js server with a set of routes for customers
GET /customers - fetch all customers
POST /customers - create a new customer

You can see how its structure in the customers.yaml openapi 3.0 spec. 

To run, 
```shell
docker-compose build 
```
this will express image and pull the mongo image if need be. 
```shell
docker-compose up
```
This will start the two containers (express app & mongo)

To make sure its working got to [http://localhost:3000/customers](http://localhost:3000/customers)

You can creat a new customer with curl 
```shell
curl -X POST --location "http://localhost:3000/customers" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d "{
          \"name\": \"Bob Frog\",
          \"age\": 29,
          \"city\": \"Boston\",
          \"country\": \"USA\"
        }"
```

And to fetch customers
```shell
curl -X GET --location "http://localhost:3000/customers"
```

To close the containers, you can hit ctrl^c in the terminal you started it in or 
```shell
docker-compose down -v 
```
## Express explanation

The express server is fairly simple to setup
```javascript
// Import & create the express app
const express = require('express');
const app = express();
// Parses json as middleware 
app.use(express.json())

// Get a list of customers
app.get('/customers', (req, res) => {
  db.collection('customers').find().toArray().then((docs) => {
    res.json(docs);
  }).catch(err => {
    console.error('Failed to fetch documents from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// Create a new customer
app.post('/customers', (req, res) => {
  const body = req.body
  console.log(body);
  db.collection('customers').insertOne(body).then((docs) => {
    res.status(201).send({success: true});
  }).catch(err => {
    console.error('Failed to insert customer to MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// Once the DB is connected the server will start
app.listen(3000, () => {
  dbConnect().then (() => {
    console.log('Server is running on port 3000');
  });
});
```

Setting up the DB connection is also fairly straightforward if you understand promises
```javascript
const { MongoClient } = require('mongodb');
const uri = 'mongodb://mongo:27017/mydatabase';

// Connects to the DB docker image (mongo)
// then inserts dummy data into the Customer Collection, in case you don't have one.
async function dbConnect() {
// Connect to MongoDB
  const client = await MongoClient.connect(uri);
  console.log('Connected to MongoDB');
  db = await client.db('mydatabase');
  const result = await db.collection('customers').insertOne(
    {
      name: 'John Doe',
      age: 30,
      city: 'New York',
      country: 'USA',
    }
  );
  console.log(result);
}
```

