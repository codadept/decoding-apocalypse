const e = require('express');

require('dotenv').config();
// can add {path: "path of the dotenv file"} but default it looks for .env

const   express         = require('express'),
        app             = express(),
        ejsMate         = require('ejs-mate'),
        path            = require('path'),
        PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY,
        SECRET_KEY      = process.env.SECRET_KEY,
        stripe          = require('stripe')(SECRET_KEY),
        server          = require('http').createServer(app),
        io              = require('socket.io')(server),
        doctors         = require('./database/doctors'),
        users           = require('./database/users'),
        PORT            = process.env.PORT || 3000;


// ==================== CHAT SECTION =======================

io.on('connection', socket => {
    socket.on('send-message', (data, id) => {
        if(id === ""){
            socket.broadcast.emit('recieve-message', data);
        }
        else{
            socket.to(id).emit('recieve-message', data);
        }
    })

    socket.on('join-room', id => {
        socket.join(id);
    })
})

// =========================================================

app.set("view engine","ejs")

// require('./db/conn');
// const   Register    = require('./models/signup');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/doctors', (req, res) => {
    res.render('doctor', {doctors});
});

app.get('/doctors/:doctorID', async (req, res) => {
    const {doctorID} = req.params;
    const doctor = await doctors.find(doctor => doctor.id === doctorID);
    res.render('profile',{doctor});
});

app.get('/doctors/:doctorID/appointment', (req, res) => {
    res.render('appointment');
});

app.get('/contactus', (req, res) => {
    res.render('contactus');
});

app.get('/doctors/:doctorID/appointment/payment',(req,res)=>
{
   res.render('payment',{
       key: PUBLISHABLE_KEY
   })
})

app.post('/doctors/:doctorID/appointment/payment',(req,res)=>{
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'TeleMedico',
        address:{
            line1: 'Kiron Housing complex, Adabari Tiniali',
            postal_code : '781012',
            city: 'Guwahati',
            state : 'Assam',
            country: 'India'
        }

})
   .then((customer)=>{
       return stripe.charges.create({
           amount:39900,
           description: 'Consultation Charges',
           currency: 'INR',
           customer:customer.id
       })
   })
   .then((charge)=>{
       console.log(charge)
       res.redirect("/")
       
   })
   .catch((err)=>{
       res.send(err)
   })
})

app.get('/doctors/:doctorID/chat', async (req,res)=>{
    const {doctorID} = req.params;
    const doctor = await doctors.find(doctor => doctor.id === doctorID);
    res.render('chat', {doctor});
})

app.get('/specialities', (req, res) => {
    res.render('specialities');
});

app.get('/specialities/:specialitiesName', (req, res) => {
    const {specialitiesName} = req.params;
    const specialityName = specialitiesName.charAt(0).toUpperCase() + specialitiesName.slice(1);
    const filteredDoctors = doctors.filter(d => d.speciality.includes(specialityName));
    res.render('speciality', {doctors: filteredDoctors, specialityName});
});

app.get('/login/patient', (req, res)=> {
    res.render('loginAsPat');
});

app.post('/login/patient', async (req, res)=> {
    const {email, password} = req.body;
    const user = await users.find(user => user.email === email);
    if(user && user.password == password){
        res.redirect('/doctors');
    }
    else{
        res.redirect('/login/patient');
    }
});

app.get('/signup/patient', (req, res) => {
    res.render('signup');
});

app.post('/signup/patient', async (req, res) => {
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

app.get('/login/doctor', (req, res) => {
    res.render('loginAsDoc');
});

app.post('/login/doctor', async (req, res) => {
    const {username, password} = req.body;
    const doctor = await doctors.find(doctor => doctor.username === username);
    if (doctor && doctor.password == password){
        console.log('You are logged in!');
        res.redirect(`/doctors/${doctor.id}`);
    }
    else{
        console.log('Wrong awaz')
        res.redirect('/login/doctor');
    }
});

app.get('*', (req,res) => {
    res.render('error');
});

server.listen(PORT, () => {
    console.log(`THE SERVER IS RUNNING ON PORT ${PORT}`);
});