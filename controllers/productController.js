const { Router } = require('express');

const isAuthenticated = require('../middlewares/isAuthenticated');

const productService = require('../services/productService');

const errorCompiler = require('./helpers/errorCompiler');

const router = Router();

const User = require('../models/User');

const Product = require('../models/Product');

router.get('/', (req, res) => {
    productService.getAll()
        .then(products => {
            if (res.locals.isAuthenticated) {
                res.render('./users/home', { title: 'Browse', products })
            } else {
                res.render('./guests/home', { title: 'Browse', products });
            }
        })
        .catch((error) => {
            const errors = errorCompiler(error);
            if (res.locals.isAuthenticated) {
                res.render('./users/home', { errors })
            } else {
                res.render('./guests/home', { errors });
            }
        })
});

router.get('/products/create', (req, res) => {
    res.render('./users/create', { title: 'Create' });
});

router.post('/products/create', (req, res) => {
    const productData = req.body;
    const user = req.user;
    productData.createdOn = new Date();
    productService.create(productData, user._id)
        .then((createdProduct) => {
            res.redirect('/');
        })
        .catch((error) => {
            const errors = errorCompiler(error);
            console.log(`Create unsuccessful: ${errors[0].message}`)
            res.render('./users/create', { errors })
        })
});

router.get('/products/:productId/details', isAuthenticated, (req, res) => {
    productService.getOne(req.params.productId)
        .then(product => {
            if (req.user._id == String(product.creator._id)) {
                product.isCreator = true;
            } else if (product.buyers.includes(req.user._id)) {
                product.bought = true;
            }
            res.render('./users/details', { title: 'Product Details', product })
        })
        .catch(err => { throw err });
});


router.get('/products/:productId/edit', (req, res) => {
    productService.getOne(req.params.productId)
        .then(product => {
            res.render('./users/edit', { title: 'Edit Product', product });
        })
        .catch(err => { throw err });
});

router.post('/products/:productId/edit', (req, res) => {
    productService.updateOne(req.params.productId, req.body)
        .then(response => {
            res.redirect(`/products/${req.params.productId}/details`);
        })
        .catch((error) => {
            const errors = errorCompiler(error);
            console.log(`Edit unsuccessful: ${errors[0].message}`)
            res.render('./users/create', { errors })
        })
});


router.get('/products/:productId/delete', isAuthenticated, (req, res) => {
    productService.deleteOne(req.params.productId)	
    .then(result => res.redirect('/'))
});



//bonuses

router.get('/users/:_id/profile', (req, res) => {
    productService.getAllSold(req.params._id)
        .then(products => {
            const user = req.user;
            user.totalProfit = products.reduce((totalProfit, product) => {
                totalProfit += product.price;
                return totalProfit;
            }, 0);
            user.offers = products.reduce((offers, product) => {
                offers += product.buyers.length;
                return offers
            }, 0);
            res.render('./users/profile', { user, products });
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send('Not Found')
        })

})

router.get('/products/:productId/buy', (req, res) => {
    const id = req.params.productId;
    const buyerId = req.user._id;
    productService.updateDbArray(Product, id, 'buyers', buyerId)
        .then(result => {
            res.redirect(`/products/${id}/details`);
        })

});

router.get('/products/:productId/book', async (req, res) => {
    const hotelId = req.params.productId;
    const buyerId = req.user._id;
    try {
        await productService.updateDbArray(Product, hotelId, 'bookedBy', buyerId);
        await productService.updateDbArray(User, buyerId, 'bookedHotels', hotelId);
        const change = await Product.updateOne({ _id: hotelId }, 
            { $inc: { freeRooms: -1 } });
        res.redirect(`/products/${hotelId}/details`);
    } catch (error) {
        console.log(error)
        const errors = errorCompiler(error);
        res.render('./users/details', { errors })
    }
});

module.exports = router;
