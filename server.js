const express = require('express');
const { MongoClient } = require('mongodb');
const getCustomerInfo = require('./client');

// Create an Express application
const app = express();
let db;
// MongoDB connection URI
const uri = 'mongodb://mongo:27017/mydatabase';

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

app.use(express.json())


// Define a route handler for the root path
app.get('/customers', (req, res) => {
  db.collection('customers').find().toArray().then((docs) => {
    res.json(docs);
  }).catch(err => {
    console.error('Failed to fetch documents from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

app.get('/customers/:name', async (req, res) => {
  try {
    const customer = await db.collection('customers').findOne({ name: req.params.name });
    const soapCustomerInfo = await getCustomerInfo({name: customer.name});
    res.json({
      ...customer,
      ...soapCustomerInfo,
    });
  } catch (err) {
    console.error('Failed to fetch documents from MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/customers', (req, res) => {
  const body = req.body
  console.log(body);
  db.collection('customers').insertOne(body).then((docs) => {
    res.status(201).send({ success: true });
  }).catch(err => {
    console.error('Failed to insert customer to MongoDB:', err);
    res.status(500).send('Internal Server Error');
  })
});

// Start the server on port 3000
app.listen(3000, () => {
  dbConnect().then(() => {
    console.log('Server is running on port 3000');
  });
});

