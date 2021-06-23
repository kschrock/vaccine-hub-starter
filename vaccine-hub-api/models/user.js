const bcrypt = require("bcrypt")
const {UnauthorizedError, BadRequestError} = require("../utils/errors")
const db = require("../db")
const { BCRYPT_WORK_FACTOR } = require("../config")

class User {


    static async makePublicUser(user){
        return{
            id : user.id,
            email : user.email,
            createdAt : user.posting_date
        }
    }

    static async login(credentials){
        // user should submit their email and password
        // if and othe fields are missing, throw an error
        const requiredFeilds = ["email", "password"]
        requiredFeilds.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        // lookup the user in the db by email
        // if a user is found, compare the submitted password
        const user = await User.fetchUserByEmail(credentials.email)
        if(user){
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if(isValid){
                return User.makePublicUser(user)
            }
        }
        // with the password in the db
        // if there is a match, return the user
        //
        // if any of these goes wrong, thow an error
        throw new UnauthorizedError("Invalid email/password combo")

    }

    static async fetchUserByEmail(email){
        if(!email){
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }

    static async register(credentials){
        // user should submit their email, pw, resvp status, and # of guests
        const requiredFeilds = ["email", "password","first_name", "last_name", "location"]
        requiredFeilds.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        
        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email")
        }
         // make sure no user already exists in the system with that email
        // if one does, throw an error
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate Email: ${credentials.email}`)
        }
        // take the users password, and hash it
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)

        // take the users email, and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase()
        const result = await db.query(`
        INSERT INTO users (
            email,
            password,
            first_name,
            last_name,
            location
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, posting_date ;
        `, [lowercasedEmail, hashedPassword, credentials.first_name, credentials.last_name, credentials.location])
        // create a new user in the db with all their info
        const user = result.rows[0]
        // return the user
        return user
    }
}

module.exports = User