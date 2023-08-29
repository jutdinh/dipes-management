const express = require('express');
const app = express();
const http = require('http');

const { Server } = require('socket.io');
const server = http.createServer(app);

const cors = require("cors");
const bodyparser = require('body-parser');

require('dotenv').config();

app.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
}));

app.use(bodyparser.json({ limit: "50mb" }));
app.use( express.static('public') );
app.use( cors() )

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });



// io.on("connection", (socket) => {  
//     socket.on("new-connected", (payload) => {
//         console.log(payload)
//     })
//     console.log("Connected")
// })

const { 
  Auth, 
  Projects, 
  Versions, 
  Log, 
  Tasks,
  Database, 
  // Tables, 
  Fields, 
  Api,
  UI,
  Activation
   } = require('./routes');

// const ConsumeApi = require('./controllers/ConsumeApi');

app.use('/auth', Auth )
app.use('/projects', Projects )
app.use('/tasks', Tasks );
app.use('/versions', Versions );
app.use('/logs', Log );
app.use('/db/tables', Database );
app.use('/db/fields', Fields );
app.use('/apis', Api );
app.use('/uis', UI );
app.use('/activation', Activation )

// app.get('/api/14EBA032522745649FEA16143F570413', (req, res) => {
//   res.send({ success: true, message: "This response is from remote server" })
// })

// app.post('/api/D5EF2DED2CE44A829BB315B2CB539A2B', (req, res) => {
//   res.send({ success: true, message: "Hello client", body: req.body })
// })

// app.use( async (req, res, next) => {
//   const { url } = req;
//   const api_id = url.split('/')[2]
//   const Consumer = new ConsumeApi();
//   await Consumer.consume( req, res, api_id )
// })

server.listen(process.env.PORT,  () => {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
