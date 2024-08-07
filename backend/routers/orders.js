const Order = require('../models/order.js')
const OrderItem = require('../models/orderItem.js')
const express = require("express")
const router = express.Router()

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user','name').sort({'orderDate': -1})
    
    // if !category

    res.send(orderList)
})

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
    
    // if !category

    res.send(order)
})

router.post('/', async (req, res) => {
    
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()

        return newOrderItem._id
    }))

    const orderItemsPromise = await orderItemsIds
    let totalPrice = await Promise.all(orderItemsPromise.map(async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const price = orderItem.product.price * orderItem.quantity
        return price
    }))

    totalPrice = totalPrice.reduce((x,y) => x+y, 0)

    let order = new Order({
        orderItems: orderItemsPromise,
        shippingAddress: req.body.shippingAddress,
        city: req.body.city,
        country: req.body.country,
        phone: req.body.orderItems,
        status: req.body.orderItems,
        orderPrice: totalPrice,
        user: req.body.user
    })
    
    order = await order.save()
    
    // if !order

    res.send(order)
})

router.put('/:id', async (req,res) => {
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid category id')
    }
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new : true }
    )

    if (!order) return res.status(400).send('the order cannot be found')

    res.send(order)
})

router.delete('/:id', (req, res) => {

    Order.findByIdAndDelete(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({success: true, message: 'The order is deleted'})
        } else {
            return res.status(404).json({success: false, message: 'order not found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

router.get('/user/:id', async (req, res) => {
    const userOrderHistory = await Order.find({user: req.params.id})
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
    .sort({'orderDate': -1})
    
    // if !category

    res.send(userOrderHistory)
})



module.exports = router