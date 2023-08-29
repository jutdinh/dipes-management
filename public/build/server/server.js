const express = require('express');
const app = express();
const http = require('http');

const { Server } = require('socket.io');
const server = http.createServer(app);

const cors = require("cors");
const bodyparser = require('body-parser');

require('dotenv').config();

const Activation = require('./controllers/Activation')

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

const { Auth, Projects, Versions, Logs, Tasks, Tables, Fields, Api, UI } = require('./routes');

const ConsumeApi = require('./controllers/ConsumeApi');

app.use('/auth', Auth )

app.use(async (req, res, next) => {
  const isProductActivated = await Activation.activationCheck()
  if( isProductActivated ){
    next()
  }else{
    res.status(200).send({ success:false, content: "Product has not been activated yet", status: "" })
  }
})
// app.use('/projects', Projects )
// app.use('/tasks', Tasks );
app.use('/versions', Versions );
// app.use('/logs', Logs );
// app.use('/db/tables', Tables );
// app.use('/db/fields', Fields );
app.use('/apis', Api );
// app.use('/uis', UI );

app.use( async (req, res, next) => {
  const { url } = req;
  const api_id = url.split('/')[2]
  console.log(api_id)
  const Consumer = new ConsumeApi();
  await Consumer.consume( req, res, api_id )
})

server.listen(process.env.PORT,  () => {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
