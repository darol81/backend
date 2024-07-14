require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

/* Models */
const Person = require("./models/person");

const requestLogger = (request, response, next) => 
{
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
}

/* Middlewares */
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

//app.use(requestLogger);
/* Morgan middleware */
morgan.token("body", request => 
{
    return JSON.stringify(request.body);
});
  
/* Tiny format + token */
const tiny_format = `:method :url :status :res[content-length] - :response-time ms :body`;
app.use(morgan(tiny_format));

/* Defined data */

let persons = 
[
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
];

/* ROUTES, main */

/*
app.get("/", (request, response) => 
{

});

*/

/* ROUTES, post */

app.post("/api/persons", (request, response) => 
{  
    const body = request.body;

    if (!body.name || !body.number) 
    {
        return response.status(400).json({ error: "name or number missing." });
    }

    if(persons.map(person => person.name).some(name => name === body.name))
    {
        return response.status(409).json({ error: "name must be unique." });
    }
    
    const person = new Person
    ({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => 
    {
        response.json(savedPerson);
    });
});
    

/* GET routes */

app.get("/info", (request, response) => 
{   
    date_time = new Date();
    info = `<p>Phonebook has info for ${persons.length} people</p>
            <p>${date_time}</p>`;
    response.send(info);
});

app.get("/api/persons", (request, response) => 
{
    //response.json(persons);
    Person.find({}).then(people => 
    {
        response.json(people);
    });
    
});
   

app.get("/api/persons/:id", (request, response) => 
{
    Person.findById(request.params.id).then(person => 
    {
        response.json(person);
    });
});
    
/* ROUTES, delete */
app.delete("/api/persons/:id", (request, response) => 
{
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

const unknownEndpoint = (request, response) => 
{
    response.status(404).send({ error: "unknown endpoint" });
}
  
app.use(unknownEndpoint);

/* Pääohjelma */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => 
{
    console.log(`Server running on port ${PORT}`);
});