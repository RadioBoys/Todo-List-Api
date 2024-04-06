const express = require('express')
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3030;

const router = require('./src/route/indexRoute.js');
const db = require('./src/connection/connection.js');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'src')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './src/views'));

// Engine handlebars;
app.engine('handlebars', handlebars.engine({
    // extname: '.hbs',    
    defaultLayout: 'main',
}));
router(app);
db.connect();


app.listen(port, () => console.log('Listening on port ' + port));