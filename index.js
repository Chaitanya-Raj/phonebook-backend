require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

morgan.token("data", function getData(req) {
  if (req.method === "POST") return JSON.stringify(req.body);
  else return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${Person.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person.toJSON());
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  // if (
  //   persons.find(
  //     (person) => person.name.toLowerCase() === body.name.toLowerCase()
  //   )
  // ) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson.toJSON());
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
