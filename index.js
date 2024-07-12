
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

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
    
    const person = 
    {
        name: body.name,
        number: body.number,
        id: String(Math.floor(Math.random() * 100000000))
    }
    persons = persons.concat(person);    
    response.json(person);
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
    response.json(persons);
});
   

app.get("/api/persons/:id", (request, response) => 
{
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    
    if(person)
    {    
        response.json(person);
    } 
    else 
    {    
        response.status(404).end();
    }
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
  
  app.use(unknownEndpoint)

/* Pääohjelma */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => 
{
    console.log(`Server running on port ${PORT}`);
});