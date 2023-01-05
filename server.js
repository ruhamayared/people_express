//Dependencies
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const { PORT = 3000, DATABASE_URL } = process.env

//Create application object
const app = express()

//Database connection
mongoose.connect(DATABASE_URL)

//Connection events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error))

//Model
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
})

const People = mongoose.model("People", PeopleSchema)

// MiddleWare
app.use(cors()) //To prevent cors errors, open access to all origins
app.use(morgan("dev")) //Logging
app.use(express.json()) //Parse json bodies

//Routes

//Index route
app.get("/people", async (req, res) => {
  try {
    //Send all people
    res.json(await People.find({}))
  } catch (error) {
    //Send error
    res.status(400).json(error)
  }
})

//Delete route
app.delete("/people/:id", async (req, res) => {
  try {
    res.json(await People.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

//Update route
app.put("/people/:id", async (req, res) => {
  try {
    res.json(await People.findByIdAndUpdate(req.params.id, req.body))
  } catch (error) {
    res.status(400).json(error)
  }
})

//Create route
app.post("/people", async (req, res) => {
  try {
    //Create one people
    res.json(await People.create(req.body))
  } catch (error) {
    //Send error
    res.status(400).json(error)
  }
})

//Show route
app.get("/people/:id", async (req, res) => {
  try {
    res.json(await People.findById(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

//Listener
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
