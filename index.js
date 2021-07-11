const   express     = require('express'),
        app         = express(),
        ejsMate     = require('ejs-mate'),
        path        = require('path'),
        PORT        = process.env.PORT || 3000;

require('./db/conn');
const   Register    = require('./models/signup');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

app.post('/signup', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword) {
            const registerEmployee = new Register({
                username: req.body.username,
                email: req.body.email,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            });

            const registered = await registerEmployee.save();
            res.status(201).render('login');
        }
        else {
            res.send(`password didn't match`);
        }
        // console.log(req.body.username);
        // res.send(req.body.username);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

/*************************************************************************************************************************/
app.get('/doctor/availability', (req, res) => {
    res.send('availability');
});

app.get('/doctor/:ID', (req, res) => {
    const id = req.params.ID;
    res.send(`Lawda doctor ${id}`);
});



/*************************************************************************************************************************/

app.get('*', (req,res) => {
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`);
});