const express = require('express');
const app = express()
const cors = require('cors')
const mongoose =require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config();

app.use(cors())
app.use(express.json())

//connect to mongodb
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASS;
const uriID = process.env.MONGO_URI;
const uri = `mongodb+srv://${username}:${password}@${uriID}`;
try {
    mongoose.connect(uri);
    console.log('!!! Connected to DB');
} catch (error) {
    console.log('Failure ::::: ' + error)
}

//Register route
app.post('/api/register', async (req, res) =>{
    console.log(req.body);
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status: 'ok'})
    } catch (error) {
        console.log(error);
        res.json({status: 'error', error: 'Duplicate email'})
    }
})

//Login route
app.post('/api/login', async (req, res) =>{
        const user = await User.findOne({
            email: req.body.email,
        })
        if(!user){
            return res.json({status: 'error', error: 'Invalid login'});
        }

        const isPasswordValid = bcrypt.compare(req.body.password, user.password);

        if(isPasswordValid){
            const token = jwt.sign({
                name: user.name,
                email: user.email,
            }, 'secret123')
            return res.json({status: 'ok', user: token})}
        else
            return res.json({status: 'error', user: false})
})

//Dashboard route
app.get('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })

		return res.json({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

//listen to specific port
app.listen(1337, () =>{
    console.log('!!! Server stated on 1337')
})