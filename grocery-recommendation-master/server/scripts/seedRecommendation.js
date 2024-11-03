const seed = require("./seed");
const User = require('../models/user');
const Product = require('../models/product');
const Review = require("../models/review");
const Cart = require('../models/cart');
const Order = require('../models/order');
const { REVIEW_STATUS, CART_ITEM_STATUS } = require("../constants");
const seedProducts = seed.seedProducts
const getProductIdByName = seed.getProductIdByName
const seedUsers = seed.seedUsers
const userByEmail = seed.userByEmail

//3,4 and 5 star
const addAmulMilkReviews = async (products, users) => {
    const reviews = [
        {
            product: getProductIdByName(products, "amul_milk"),
            user: userByEmail(users, "user1@gmail.com"),
            rating: 3,
            status: REVIEW_STATUS.Approved
        },
        {
            product: getProductIdByName(products, "amul_milk"),
            user: userByEmail(users, "user2@gmail.com"),
            rating: 4,
            review: "The product is good",
            status: REVIEW_STATUS.Approved
        },
        {
            product: getProductIdByName(products, "amul_milk"),
            user: userByEmail(users, "user2@gmail.com"),
            rating: 5,
            status: REVIEW_STATUS.Approved
        }
    ]

    try {
        const res = await Review.insertMany(reviews)
        console.log("Amul milk review added")
    } catch (err) {
        console.log("Review addition error", err)
    }
}

// 3 and 4. moderate review
const addAmulButterReviews = async (products, users) => {
    const reviews = [
        {
            product: getProductIdByName(products, "amul_butter"),
            user: userByEmail(users, "user1@gmail.com"),
            rating: 3,
            review: "The product is pretty good",
            status: REVIEW_STATUS.Approved
        },
        {
            product: getProductIdByName(products, "amul_butter"),
            user: userByEmail(users, "user2@gmail.com"),
            rating: 4,
            status: REVIEW_STATUS.Approved
        },
    ]

    try {
        const res = await Review.insertMany(reviews)
        console.log("Amul butter review added")
    } catch (err) {
        console.log("Review addition error", err)
    }
}

// 3 and 4. really good reviews
const addSitaramDahiReviews = async (products, users) => {
    const reviews = [
        {
            product: getProductIdByName(products, "sitaram_dahi"),
            user: userByEmail(users, "user1@gmail.com"),
            rating: 3,
            review: "The product is damn good. It is amazing",
            status: REVIEW_STATUS.Approved
        },
        {
            product: getProductIdByName(products, "sitaram_dahi"),
            user: userByEmail(users, "user2@gmail.com"),
            rating: 4,
            review: "Absolutely amazing. Buy it right now.",
            status: REVIEW_STATUS.Approved
        },
    ]

    try {
        const res = await Review.insertMany(reviews)
        console.log("Sitaram review added")
    } catch (err) {
        console.log("Review addition error", err)
    }
}


const addUser1And2Transaction = async (products, users) => {
    const carts = [
        {
            products: [
                {
                    product: getProductIdByName(products, 'safal_ghee'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'amul_butter'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'amrit_oil'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user1@gmail.com')
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'merokishan_tomato'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'haldiram_garammasala'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'europeanbakery_bread'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user1@gmail.com')
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'safal_ghee'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },

                {
                    product: getProductIdByName(products, 'amul_butter'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'amrit_oil'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user2@gmail.com')
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'merokishan_tomato'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'urban_sausage'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'local_eggs'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user2@gmail.com')
        },
        {
            products: [
                {
                    product: getProductIdByName(products, 'merokishan_tomato'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'urban_sausage'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'amul_butter'),
                    quantity: 2,
                    status: CART_ITEM_STATUS.Delivered
                },
                {
                    product: getProductIdByName(products, 'safal_ghee'),
                    quantity: 1,
                    status: CART_ITEM_STATUS.Delivered
                },
            ],
            user: userByEmail(users, 'user3@gmail.com')
        },

    ]
    await Cart.remove({});
    await Order.remove({});
    try {
        for (let cart of carts) {
            const cartDb = new Cart(cart);
            await cartDb.save();
            const order = new Order({
                cart: cartDb.cart,
                user: cartDb.user,
                total: 100
            });
            await order.save();
        }
        console.log('Cart successfully added');
    } catch (err) {
        console.log('Cart addition error');
    }
}

const seedDatabase = async () => {
    await seedProducts()
    await seedUsers()
    const products = await Product.find({});
    const users = await User.find({})
    await Review.remove({})
    await addAmulMilkReviews(products, users)
    await addAmulButterReviews(products, users)
    await addSitaramDahiReviews(products, users)
    await addUser1And2Transaction(products, users)
}

seedDatabase()