/**
 * 1. create schema
 * 2. create model
 * 3. using model, create CRUD (create read update delete) functions
 * 4. export em
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

let UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    country:String
})

let userModel = mongoose.model("user", UserSchema)


/**
 * 1. check if user already exists or not?
 * 2. if user DNE
 *      2.1 hash user password
 *      2.2 create
 *    else throw error
 * 
 */
module.exports.CreateUser = async (data) =>{
    
    // does user exist?
    user = await userModel.find({"username":data.username})
    if(user.length > 0){
        return {err:"User already exists"}
    }

    // if not, hash password and save

    pw = hash(data.password)

    return await userModel.create({
        username:data.username,
        password:pw,
        name: data.name,
        country : data.country
    })
    // .then((user)=>{

    // }).catch((err)=>{

    // })
} 


/**
 * query format-
 * 
 * {
 *      "username":"angad"
 * }
 */
module.exports.ReadUser = async (query)=>{
    return await userModel.find(query)
}

module.exports.DeleteUser = async (query)=>{
    return await userModel.findOneAndDelete(query)
}





module.exports.UpdateUser = async (user, update) =>{
    return await userModel.findOneAndUpdate(user, update)
} 

let hash = (password)=>{
    return bcrypt.hashSync(password, 10)
}