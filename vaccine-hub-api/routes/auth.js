const express = require("express")
const router = express.Router()
const User = require("../models/user")

router.post("/login", async (req, res, next) =>{
    try {
    // take the users email and password and attempting to authenticate them
        
    } catch (error) {
        next(error)
    }
})

router.post("/register", async (req, res, next) =>{
    try {
    // take the users email, password, rsvp status, and the number
    // of guests and creates a new user in our database
    } catch (error) {
        next(error)
    }
})


module.exports = router