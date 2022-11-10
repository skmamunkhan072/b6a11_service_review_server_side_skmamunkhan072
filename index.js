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
      console.log(reviewAddData);
      const result = await serviceClientReviewCollection.insertOne(
        reviewAddData
      );
      res.send(result);
    });
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
