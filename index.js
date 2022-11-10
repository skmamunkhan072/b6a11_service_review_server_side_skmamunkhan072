const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb uri
const uri = process.env.HOME_KITCHEN_SERVICES_DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection = client
      .db("home_kitchen_service_data")
      .collection("services_data");

    const serviceClientReviewCollection = client
      .db("home_kitchen_service_data")
      .collection("ServiceClientReview");

    // jwt token create
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      res.send({ token });
    });

    //   all data
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // services post
    app.post("/services/:id", async (req, res) => {
      const { serviceReviewCardId } = req.body;

      let query = {};
      if (serviceReviewCardId) {
        query = {
          serviceReviewCardId: serviceReviewCardId,
        };
      }
      const cursor = serviceClientReviewCollection.find(query);
      const servicesPostReview = await cursor.toArray();
      res.send(servicesPostReview);
    });

    // clint  review post
    app.post("/reviewadd", async (req, res) => {
      const reviewAddData = req.body;
      const result = await serviceClientReviewCollection.insertOne(
        reviewAddData
      );
      res.send(result);
    });

    // client Review
    app.post("/review", async (req, res) => {
      const { email } = req.body;
      let query = {};
      if (email) {
        query = {
          email,
        };
      }
      const cursor = serviceClientReviewCollection.find(query);
      const servicesPostReview = await cursor.toArray();
      res.send(servicesPostReview);
    });

    // client review data deleter
    app.delete("/review", async (req, res) => {
      const { email, id } = req.body;
      // console.log(email, id);
      const query = { _id: ObjectId(id) };
      const result = await serviceClientReviewCollection.deleteOne(query);
      console.log(result);
      // res.send(result);
    });
    // dfsdfd
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running home kitchen  Server");
});

app.listen(port, () => {
  console.log("Listening damo to port", port);
});
