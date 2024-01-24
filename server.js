const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb").MongoClient;
const json2csv = require("json2csv").parse;
const fs = require("fs");
const path = require("path");

// const JSON2CSVParser = require("json2csv/JSON2CSVParser");

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Change this to match your client's origin.
  })
);
async function exportToCSV() {
  try {
    // const data = await SpacebarPressEvent.find().lean().exec(); // Ensure this returns the desired data
    // const data2 = await Participant.find().lean().exec();
    // const data3 = await Questionnaire.find().lean().exec();
    // const csv = json2csv(data);
    // fs.writeFileSync(`output.csv${subject}`, csv); // Use 'await' and 'fs.promises.writeFile()' for proper async handling
    // const csv2 = json2csv(data2);
    // fs.writeFileSync(`output2.csv${subject}`, csv2);
    // const csv3 = json2csv(data3);
    // fs.writeFileSync(`output3.csv${subject}`, csv3);
    // console.log("Exported");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Exporting collection: ${collectionName}`);
      const documents = await mongoose.connection.db
        .collection(collectionName)
        .find({})
        .toArray();
      const csv = json2csv(documents); // Use json2csv directly here
      fs.writeFileSync(`${collectionName}.csv`, csv);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
app.use(bodyParser.json());
setInterval(() => {
  exportToCSV();
}, 10000);
// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect(
  "mongodb+srv://tylerforgione26:HMsXmBEcR9QOL4Tp@spaceshipcluster.0qqoxqa.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.use(express.static(path.join(__dirname, "public")));
app.get("/short-16", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});
app.get("/short-1", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});
app.get("/short-2-15", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});
app.get("/long-1", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});
app.get("/long-2", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});
app.get("/long-3", (req, res) => {
  res.sendFile(path.join(__dirname, "public/please.html"));
});

app.get("/setup/short-16", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});
app.get("/setup/short-1", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});
app.get("/setup/short-2-15", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});
app.get("/setup/long-1", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});
app.get("/setup/long-2", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});
app.get("/setup/long-3", (req, res) => {
  res.sendFile(path.join(__dirname, "public/setup.html"));
});

// Define a MongoDB schema and model for your data
const participantSchema = new mongoose.Schema({
  subject: String,
  age: String,
  gender: String,
  handedness: String,
});

const Participant = mongoose.model("Participant", participantSchema);

// Set up a route to handle form submissions
app.post("/submit-form", (req, res) => {
  console.log("it work");
  const formData = req.body;
  const id = req.body.subject;
  console.log(id);

  // Create a new participant document
  const participant = new Participant(formData);

  // Save the data to the database using Promises
  participant
    .save()
    .then(() => {
      res.status(200).json({ id: id });
    })
    .catch((err) => {
      console.error("Error saving data:", err);
      res.status(500).send("Internal Server Error");
    });
});

// Define a Mongoose model for spacebar press events
const SpacebarPressEvent = mongoose.model("SpacebarPressEvent", {
  id: String,
  timestamp: Number,
});

// Route to receive and store spacebar press events
app.post("/submit-spacebar-press", async (req, res) => {
  const { id, timestamp } = req.body;
  time = req.body.event.timestamp;
  console.log(req.body.event.timestamp);

  try {
    // Create a new SpacebarPressEvent document and save it to the database
    const spacebarPressEvent = new SpacebarPressEvent({ id, timestamp: time });
    await spacebarPressEvent.save();
    console.log("Spacebar press event saved successfully");
    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to save spacebar press event:", error);
    res.status(500).send("Failed to save spacebar press event");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define a schema for the questionnaire answers
const questionnaireSchema = new mongoose.Schema({
  id: String,
  answer: String,
  qTime: Number,
});

// Create a model based on the schema
const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to handle saving questionnaire answers
app.post("/submit-answer", async (req, res) => {
  try {
    const { id, answer, qTime } = req.body;
    console.log(id);

    // Create a new Questionnaire instance
    const questionnaire = new Questionnaire({
      id,
      answer,
      qTime,
    });

    // Save the questionnaire data to MongoDB
    await questionnaire.save();

    res.status(200).send("Questionnaire answer saved successfully");
  } catch (error) {
    console.error("Error saving questionnaire answer:", error);
    res.status(500).send("Internal Server Error");
  }
});

const scoreSchema = new mongoose.Schema({
  id: String,
  score: Number,
});

// Create a model based on the schema
const finalScore = mongoose.model("finalScore", scoreSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to handle saving questionnaire answers
app.post("/submit-score", async (req, res) => {
  try {
    const { id, score } = req.body;
    console.log(score);

    // Create a new Questionnaire instance
    const fscore = new finalScore({
      id,
      score,
    });

    // Save the questionnaire data to MongoDB
    await fscore.save();

    res.status(200).send("Questionnaire answer saved successfully");
  } catch (error) {
    console.error("Error saving questionnaire answer:", error);
    res.status(500).send("Internal Server Error");
  }
});
