// // // const express = require("express");
// // // const app = express();
// // // const cors = require("cors");
// // // const http = require('http');
// // // const mongoose = require('mongoose');
// // // require('dotenv').config();
// // // const IxoraRouter = require("./Router/Ixora.router");
// // // const socket = require('./socket');
// // // const path = require("path");

// // // const port = process.env.PORT || 8000;
// // // // app.use(cors());
// // // app.use(cors({
// // //   origin: ['https://ixorah.com',"http://localhost:3000"]
// // // }));

// // // app.use(express.json());

// // // app.use("/uploads",express.static(path.join(__dirname, "uploads"))
// // // );

// // // const server = http.createServer(app);
// // // const io = socket.init(server);

// // // mongoose.connect(process.env.DATABASE, {
// // //   useNewUrlParser: true,
// // //   useUnifiedTopology: true,
// // // }).then(() => console.log('MongoDB connected'))
// // //   .catch(err => console.log(err));

// // // app.use("/Ixora", (req, res, next) => {
// // //   req.io = io;
// // //   next();
// // // }, IxoraRouter);

// // // server.listen(port, () => {
// // //   console.log(`Server running on port ${port}`);
// // // });

// // const express = require("express");
// // const app = express();
// // const cors = require("cors");
// // const http = require('http');
// // const mongoose = require('mongoose');
// // require('dotenv').config();
// // const IxoraRouter = require("./Router/Ixora.router");
// // const socket = require('./socket');
// // const path = require("path");

// // const port = process.env.PORT || 8000;

// // app.use(cors({
// //   origin: ['https://ixorah.com', 'http://localhost:3000', 'http://localhost:5173'],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // app.use(express.json());

// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // const server = http.createServer(app);
// // const io = socket.init(server);

// // mongoose.connect(process.env.DATABASE, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // }).then(() => console.log('MongoDB connected'))
// //   .catch(err => console.log(err));

// // // Ensure CORS is applied to all routes
// // // app.use((req, res, next) => {
// // //   res.header("Access-Control-Allow-Origin", req.headers.origin); // Allow requests from all origins
// // //   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
// // //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
// // //   next();
// // // });

// // app.use("/Ixora", (req, res, next) => {
// //   req.io = io;
// //   next();
// // }, IxoraRouter);

// // server.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });

// const express = require("express");
// const app = express();
// const cors = require("cors");
// const http = require('http');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const IxoraRouter = require("./Router/Ixora.router");
// const socket = require('./socket');
// const path = require("path");
 
// const port = process.env.PORT || 8000;
 
 
// app.use(cors({
//   origin: ['https://ixorah.com', "https://www.ixorah.com", "http://localhost:3000"],
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }));
 
 
// app.options('*', cors({
//   origin: ['https://ixorah.com', "https://www.ixorah.com", "http://localhost:3000"]
// }));
 
// app.use(express.json());
 
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
// const server = http.createServer(app);
// const io = socket.init(server);
 
// mongoose.connect(process.env.DATABASE, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
 
// app.use("/Ixora", (req, res, next) => {
//   req.io = io;
//   next();
// }, IxoraRouter);
 
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
 

const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const IxoraRouter = require("./Router/Ixora.router");
const socket = require('./socket');
const path = require("path");

const port = process.env.PORT || 8000;

app.use(cors({
  origin: ['https://ixorah.com', "https://www.ixorah.com", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors({
  origin: ['https://ixorah.com', "https://www.ixorah.com", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);
const io = socket.init(server);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use("/Ixora", (req, res, next) => {
  req.io = io;
  next();
}, IxoraRouter);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

