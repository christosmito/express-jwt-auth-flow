const mongoose = require("mongoose");

const app = require("./index");

// mongoose.connect('mongodb+srv://christos:RWNgslzlcYCpAAZA@cluster0.rx7oj.mongodb.net/myGroceryTest?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://groceryDB:ED4FhZVdfP6VHzXV@cluster0-bjjsz.mongodb.net/groceryDB?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection
.once('open', function() {
    console.log("Connected to DB");
})
.on('error', error => {
    console.warn('Warning', error);
});

// ED4FhZVdfP6VHzXV

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});

module.exports = server;

// server.close(function () {
//     console.log("The server was closed");
//     mongoose.connection.close(function() {
//         console.log("The connection with DB was closed");
//     })
// });
