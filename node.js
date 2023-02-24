const express = require('express');
const body_parser = require('body-parser');
const mysql = require('mysql');
let path = require('path');
const app = express();
app.use(express.static(path.join(__dirname,'./public')));
app.use(body_parser.urlencoded({extended:false}));

let port = 5000;

const db = mysql.createConnection({
    database:'wuiproject',
    user: 'root',
    host:'localhost',
    password:'lucky2005b',
    port:3306
})
db.connect((err)=>{
    if(err) console.log(err);
    else console.log('connected to database successfully');
})

app.get('/',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'./index.html'));
    console.log('user on landing page');
})
app.get('/signup',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'/signup.html'));
});
app.get('/signin',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'/signin.html'));
    console.log('user logging in');
})
app.post('/userdata',(req,res)=>{
    let username = req.body.username;
    let email = req.body.email;
    let password1 = req.body.password1;
    let password2 = req.body.password2;
    if(password1 === password2){
        let password = password1;
    
    let querry = `INSERT INTO USER (username,email,password) VALUES ('${username}','${email}','${password}')`;

    db.query(querry,(err)=>{
        if(err) console.log(err);
        else console.log('data inserted');
    })
    res.status(200).redirect('/signin');
}else res.status(400).send('your passwords don\'t match');
});
app.post('/login',(req,res)=>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    let query = `SELECT * FROM user WHERE username = ?`;
    db.query(query,[username],(err,results)=>{
        if(err) console.log(err);
        else if(results.length>0){
            for(let i = 0;i<results.length;i++){
                if(results[i].username == username && results[i].email == email && results[i].password == password){
                    res.status(200).send('The home page is about to be released');
                }else res.status(400).send('invalid inputs');
            }
        }
    })

})

app.listen(port,()=>{
    console.log('the server is running on port '+port);
})