const Product = require('../models/Product');
const User = require('../models/User')

async function getAll() {
    let products = await Product.find({}).lean();
    return products;
}

function getOne(id) {
    return Product.findById(id).lean();
}

function create(data, userId) {
    let product = new Product({ ...data, creator: userId });
    return product.save();
}

function updateOne(productId, productData) {
    return Product.updateOne({ _id: productId }, productData);
}

function deleteOne(productId) {
    return Product.deleteOne({ _id: productId });
}

function updateDbArray(Document, id, arrayName, element) {
    return Document.findById(id)
        .then(document => {
            document[arrayName].push(element);
            return document.save();
        })
}

function getPopulated(id) {
    return Product.findById(id)
        .populate('buddies')
        .lean();
}

module.exports = {
    updateDbArray,
    getAll,
    getOne,
    getPopulated,
    create,
    updateOne,
    deleteOne,
    //getAllSold
}

//bonnus
// function getAllSold(userId) {
//     return Product.find({ creator: userId }).lean();
// }
