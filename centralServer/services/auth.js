const jwt = require('jsonwebtoken')
const secret = "Varun@123"

function setUser(user){
 return jwt.sign({
    _id : user._id,
    name : user.name,
    email : user.email,
 }, secret)
}

function verifyUser(token){
   return jwt.verify(token, secret)
}

module.exports = {setUser, verifyUser};