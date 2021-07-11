const   express     = require('express'),
        app         = express(),
        ejsMate     = require('ejs-mate'),
        path        = require('path'),
        PORT        = process.env.PORT || 3000;

// payment
//  const express = require ('express')
const bodyParser = require('body-parser')
// const path = require('path')
const PUBLISHABLE_KEY= "pk_test_51JBiU5SJBe5jYsGLwOdsjgmSnqR8AKvILaC3k0Op9c5eZK7VzkP79UkMg412bm12iCEd3QUAus5QcIZUHeU5yX7q00H7MKT1vY"
const SECRET_KEY = "sk_test_51JBiU5SJBe5jYsGLa9klAQPVbX2CYIS62RmnW2kAYqWR6TRXllzs1Iv2yGlszmEx6YRsqzXNqR1xZx74Z5L2tN8I00Zr1kYJlb"
const stripe =require('stripe')(SECRET_KEY)
// const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.set("view engine","ejs")

// const PORT = process.env.PORT|| 3000

app.get('/payment',(req,res)=>
{
   res.render('payment',{
       key: PUBLISHABLE_KEY
   })
})

 app.post('/payment',(req,res)=>{
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

// app.listen(PORT,()=>{
//     console.log(`App is listening on ${PORT}`)
// })

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