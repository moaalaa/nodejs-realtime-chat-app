// Paths

const path = require('path');
const publicPath = path.join(__dirname, '..', '/public');

// Modules                                  
const express = require('express');
const bodyParser = require('body-parser');
require('express-group-routes');

// Init Express App                         
const app = express();

// Port                                     
let port = process.env.PORT || 3000;

// Set App Static Directory
app.use(express.static(publicPath))
// Use Body Parser                          
app.use(bodyParser.json());

// Start Http Server
app.listen(port, () => console.log(`Server Started on Port ${port}`));

