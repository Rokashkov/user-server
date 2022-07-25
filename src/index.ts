// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./extended-types/global.d.ts" />

import express from 'express'
import cookieParser from 'cookie-parser'
import dotEnv from 'dotenv'
import router from './routes/router'
import errorMiddleware from './middlewares/errorMiddleware'

dotEnv.config()

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

app.listen(PORT, (): void => {
	console.log(`Server has been started on PORT: ${ PORT }...`)
})