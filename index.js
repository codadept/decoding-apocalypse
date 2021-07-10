const   express     = require('express'),
        app         = express(),
        ejsMate     = require('ejs-mate'),
        path        = require('path'),
        PORT        = process.env.PORT || 3000;


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/doctor', (req, res) => {
    res.render('doctor');
});

app.get('/appointment', (req, res) => {
    res.render('appointment');
});

app.get('/specialities', (req, res) => {
    res.render('specialities');
});

app.get('/login', (req, res)=> {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('*', (req,res) => {
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`);
});