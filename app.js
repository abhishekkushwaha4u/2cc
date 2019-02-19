const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs")

// require all model funcs
const {
    CreateUser,
    ReadUser,
    DeleteUser,
    UpdateUser
} = require("./schema") 

// handle post requests
app.use(bp.json());
app.use(bp.urlencoded({extended:false}));

/**
 * 
 * Connect to DB-
 * 1. require mongoose ( ORM ) Object Relational Mapper
 * 2. connect to DB
 * 3. create a schema
 * 4. create CRUD
 * 5. export functions
 */

 // 1. Connect to DB and use new flag for urlparser
mongoose.connect("mongodb+srv://admin:admin123@personal-incubator-mtqwu.mongodb.net/test?retryWrites=true", {useNewUrlParser:true})

// 2. Check if connected
mongoose.connection.once("connected", ()=>{
    console.log("Connected to DB")
}).on("error", (err)=>{
    console.log(err)
    console.log("Error connecting to DB")
})

// test route
app.get("/", (req,res)=>{
    res.json({
        message:"hello world"
    })
})

// handle user creation
app.post("/register", async (req,res)=>{
    // call DB func
    res.json( await CreateUser(req.body) )
})


// handle user read
app.post("/read", async (req,res)=>{
    // call DB func
    res.json( await ReadUser(req.body) )
})



// handle user delete
app.post("/delete", async (req,res)=>{
    // call DB func
    res.json( await DeleteUser(req.body) )
})


// handle user update
app.post("/update", async (req,res)=>{
    // call DB func
    res.json( await UpdateUser({
        username:req.body.username
    }, req.body.update) )
})

/**
 * 1. exists or not?
 * 2. if yes, hash password and compare
 */
app.post("/login", async (req,res)=>{
    users = await ReadUser({username:req.body.username})
    if(users.length < 1) {
        return res.json({err:"No user"})
    } 

    if(users[0].password == bcrypt.hashSync(req.body.password, 10)) {
        return res.json({messaage:"Logged in !"})
    }
    return res.json({err:"wrong password"})

})

// listen
app.listen(3000, ()=>console.log("Listening..."))
