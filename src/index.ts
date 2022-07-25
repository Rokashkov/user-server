// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./extended-types/global.d.ts" />

import express from 'express'
import cookieParser from 'cookie-parser'
import dotEnv from 'dotenv'
import router from './routes/router'
import errorMiddleware from './middlewares/errorMiddleware'

dotEnv.config()

if (process.env.NODE_ENV === 'production') {
	process.env.DATABASE_URL = 'postgresql://vladimir:89235275785Lol!@localhost:5432/app'
	process.env.API_DOMAIN = 'http://45.147.178.215:5000/api'
	process.env.CLIENT_DOMAIN = 'http://45.147.178.215:8080'
}

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

app.listen(PORT, (): void => {
	console.log(`Server has been started on PORT: ${ PORT } in ${ process.env.NODE_ENV } mode...`)
	console.log(process.env.API_DOMAIN)
})