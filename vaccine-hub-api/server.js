const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { BadRequestError, NotFoundError } = require("./utils/errors")
const { PORT } = require("./config")
const authRoutes = require("./routes/auth")

const app = express()

app.use(morgan("tiny")) //log request info
app.use(express.json()) //parse incoming request bodies with JSON payloads
app.use(cors()) //enables cross-origin resource sharing for all origins

app.use("/auth", authRoutes)


/* Handle all 404 errors that weren't matched by a route */
app.use((req, res, next) => {
    return next(new NotFoundError())
})

/* Generic error handler - anything that is unhandled will be handled here */
app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message
  
    return res.status(status).json({
      error: { message, status },
    })
  })

app.listen(PORT, ()=> {
    console.log(`🚀 Server listening on port ` + PORT)
 })