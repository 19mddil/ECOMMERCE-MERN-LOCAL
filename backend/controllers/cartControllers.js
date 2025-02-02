const _ = require('lodash');
const { CartItem } = require('../models/cartItem');

module.exports.createCartItem = async (req, res) => {
    let { price, product } = _.pick(req.body, ['price', 'product']); // may be this product means product id.
    const item = await CartItem.findOne({
        user: req.user._id, //came from authorize middleware
        product: product
    });
    if (item) return res.status(400).send("Item already exists in the Cart");
    let cartItem = new CartItem({
        price: price,
        product: product,
        user: req.user._id
    });
    console.log(req.body);
    const result = await cartItem.save();
    res.status(201).send({
        message: "Added to cart successfully",
        data: result
    })

}

module.exports.getCartItem = async (req, res) => {
    try {

        const cartItems = await CartItem.find({
            user: req.user._id
        })
            .populate('product', 'name')
            .populate('user', 'name')
        return res.status(200).send(cartItems);
    } catch (err) {
        console.log(err);
    }
}

module.exports.updateCartItem = async (req, res) => {
    const { _id, count } = _.pick(req.body, ["_id", "count"]);
    userId = req.user._id;
    await CartItem.updateOne(
        {
            _id: _id,
            user: userId
        },
        {
            count: count
        }
    );
    return res.status(200).send("Item updated!!");
}

module.exports.deleteCartItem = async (req, res) => {
    const _id = req.params.id;
    userId = req.user._id;
    await CartItem.deleteOne({
        _id: _id,
        user: userId
    })
    return res.status(200).send("Deleted");
}