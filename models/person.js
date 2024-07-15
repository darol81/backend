const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(result => 
{
    console.log("Connected to MongoDB.");

}).catch( (error) => 
{
    console.log("Error connecting to MongoDB:", error.message);
});

const personSchema = new mongoose.Schema
({
    name: { type: String, minlength: 3, required: true },
    number: 
    {
        type: String,
        validate: 
        {
            validator: function(v) 
            {
                const parts = val.split("-");
                const pattern1 = /^\d{2,3}$/;  // Eka osa, 2-3 numeroa 
                const pattern2 = /^\d+$/;      // Toka osa: Tarkistetaan että sisältää numeroita
                return (parts.length === 2 && pattern1.test(parts[0]) && pattern2.test(parts[1]) && val.length >= 8);
            },       
            required: [true, "Phone number required."]
        }
    }
});

personSchema.set('toJSON', 
{
    transform: (document, returnedObject) => 
    {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);

