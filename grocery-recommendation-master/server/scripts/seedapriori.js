const seed = require("./seed");
const User = require('../models/user');
const Product = require('../models/product');
const Review = require("../models/review");
const Cart = require('../models/cart');
const Order = require('../models/order');
const moment = require("moment")
const { REVIEW_STATUS, CART_ITEM_STATUS } = require("../constants");
const seedProducts = seed.seedProducts
const getProductIdByName = seed.getProductIdByName
const seedUsers = seed.seedUsers
const userByEmail = seed.userByEmail

const seedCartsAndOrders = async () => {
    const users = await User.find({})
    const products = await Product.find({});
    const carts = [
        // User 1
        {
            products: [{
                product: getProductIdByName(products, 'sitaram_dahi'),
                quantity: 1,
                status: CART_ITEM_STATUS.Delivered,
            }],
            user: userByEmail(users, 'user1@gmail.com'),
            created: "2024-10-14"
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'amul_milk'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'dhakal_bread'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user1@gmail.com'),
            created: "2024-10-14"

        },
        // User 2
        {
            products: [
                {
                    product: getProductIdByName(products, 'merokishan_tomato'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'hulas_besan'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user2@gmail.com'),
            created: "2024-10-14"
        },
        // User 3
        {
            products: [
                {
                    product: getProductIdByName(products, 'sitaram_dahi'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'amul_milk'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'dhakal_bread'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user3@gmail.com'),
            created: "2024-10-14"
        },
        // User 4
        {
            products: [
                {
                    product: getProductIdByName(products, 'haldiram_garammasala'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user4@gmail.com'),
            created: "2024-10-14"
        },
        // User 5
        {
            products: [
                {
                    product: getProductIdByName(products, 'druk_soyasauce'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user5@gmail.com'),
            created: "2024-10-14"
        },
        // User 6
        {
            products: [
                {
                    product: getProductIdByName(products, 'amul_milk'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user6@gmail.com'),
            created: "2024-10-14"
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'sitaram_dahi'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user6@gmail.com'),
            created: "2024-10-14"
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'dhakal_bread'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user6@gmail.com'),
            created: "2024-10-14"
        }
    ]
    await Cart.remove({})
    await Order.remove({})
    try {
        for (let cart of carts) {
            const cartDb = new Cart(cart)
            await cartDb.save()
            const order = new Order({
                cart: cartDb.cart,
                user: cartDb.user,
                total: 100
            })
            await order.save()
        }
        console.log("Cart successfully added")
    } catch (err) {
        console.log("Cart addition error")
    }

}


const seedDatabase = async () => {
    await seedProducts()
    await seedUsers()
    await Review.remove({})
    await seedCartsAndOrders();
}

seedDatabase()