const   express     = require('express'),
        app         = express(),
        path        = require('path'),
        PORT        = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('*', (req,res) => {
    res.send('Error');
});

app.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`);
});