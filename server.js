const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const albumRouter = require('./routes/albums');
const singerRouter = require('./routes/singers');
const singeruserRouter = require('./routes/singerUser');
const albumuserRouter = require('./routes/albumUser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: false
  })
);
app.use(methodOverride('_method'));

mongoose.set('useUnifiedTopology', true);
// mongoose.set('debug', true);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', error => console.log);
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/albums', albumRouter);
app.use('/singers', singerRouter);
app.use('/singersuser', singeruserRouter);
app.use('/albumsuser', albumuserRouter);

app.listen(process.env.PORT || 3001);
