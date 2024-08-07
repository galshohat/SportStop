const express = require("express")
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


router.post('/signup', async (req, res) => {

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 5),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country
    })
    

    user = await user.save()
    
    // if !category

    res.send(user)
})

router.post('/login', async (req, res) => {
    
    const secretkey = process.env.secretkey
    const user = await User.findOne({email: req.body.email})
    let expireCookies = '10d'
    
    if (!user){
        return res.send('The user not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        if (req.body.remmember){
            expireCookies = '30m'
        }
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secretkey,
            {expiresIn: expireCookies}
        )
        
        res.send({user: user.email, token: token})
    } else {
        res.send('invalid password!')
    }
})

router.get('/', async (req, res) => {
    const user = await User.find().select('-password')
    
    // if !category

    res.send(user)
})

router.get('/:id', async (req, res) => {
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid user id')
    }

    const user = await User.findById(req.params.id).select('-password')
    
    if(!user) {
        return res.status(400).send('Invalid user id')
    }

    res.send(user)
})


router.put('/:id', async (req,res) => {
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid user id')
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            city: req.body.city,
            country: req.body.country
        },
        { new : true }
    )

    if (!user) return res.status(400).send('the user cannot be found')

    res.send(user)
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({success: true, message: 'The user is deleted'})
        } else {
            return res.status(404).json({success: false, message: 'user not found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

module.exports = router