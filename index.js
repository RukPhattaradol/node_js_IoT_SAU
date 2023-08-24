const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("server listening on port " + port);
  
});


const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://rukphattaradol:Xi3xerzx%402543@cluster0.nknks7r.mongodb.net/";

app.get("/api/id/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("mydb").collection("users").findOne({ id: id });
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
    .findOne({ username: username });
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
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").insertOne({
    id: user.id,
    fname: user.fname,
    username: user.username,
    email: user.email,
    password: user.password,
  });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + user.id + " is created",
    user: user,
  });
});

app.put("/api/update", async (req, res) => {
  const user = req.body;
  const id = user.id;
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client
    .db("mydb")
    .collection("users")
    .updateOne(
      { id: id },
      {
        $set: {
          fname: user.fname,
          username: user.username,
          email: user.email,
          password: user.password,
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
  await client.db('mydb').collection('users').deleteOne({'id': id});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+id+" is deleted"
  });
})
