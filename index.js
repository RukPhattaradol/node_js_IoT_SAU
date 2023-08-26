const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb+srv://rukphattaradol:Xi3xerzx%402543@cluster0.nknks7r.mongodb.net/", {
    useNewUrlParser: true, // Note the correction here, it's 'useNewUrlParser'
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const users = [];

const { MongoClient } = require("mongodb");
const uri ="mongodb+srv://rukphattaradol:Xi3xerzx%402543@cluster0.nknks7r.mongodb.net/";

app.get("/api/id/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("mydb").collection("users").findOne({ "udata.id": id });
  await client.close();
  res.status(200).send({
    status: "ok",
    user: user,
  });
});

app.get("/api/username/:username", async (req, res) => {
  const username = req.params.username;
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client
    .db("mydb")
    .collection("users")
    .findOne({ "udata.username" : username });
  await client.close();
  res.status(200).send({
    status: "ok",
    user: user,
  });
});

app.get("/api/users/getall", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db("mydb").collection("users").find({}).toArray();
  await client.close();
  res.status(200).send(users);
});

app.post("/api/register", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const totalUsers = await client.db("mydb").collection("users").countDocuments();
  const id = totalUsers + 1;
  const udata = {
    id: id,
    fname: req.body.fname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  await client.db("mydb").collection("users").insertOne({udata})
  users.push(udata);
  await client.close();
  console.log("User : ", udata);
  res.status(200).send({
    "status_code": 200,
    "massege": "Registered",
    "detail": udata
  })
})

/*app.post("/api/register", async (req, res) => {
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  const totalUsers = await client.db("mydb").collection("users").countDocuments();
  const id = totalUsers + 1;
  await client.db("mydb").collection("users").insertOne({
    id: id,
    fname: user.fname,
    username: user.username,
    email: user.email,
    password: user.password,
  });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is created",
    user: user,
  });
});*/

app.put("/api/update", async (req, res) => {
  const user = req.body;
  const id = user.udata.id;

  const client = new MongoClient(uri);
  await client.connect();
  const users = await client
    .db("mydb")
    .collection("users")
    .updateOne(
      { "udata.id" : id },
      {
        $set: {
          "udata.fname": user.udata.fname,
          "udata.username": user.udata.username,
          "udata.email": user.udata.email,
          "udata.password": user.udata.password,
        },
      }
    );
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + user.id + " is updated successfully",
    user: user,
  });
});

app.delete('/api/delete', async(req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('users').deleteOne({'udata.id': id});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+id+" is deleted"
  });
})

app.listen(port, () => {
  console.log("server listening on port " + port);
  
});