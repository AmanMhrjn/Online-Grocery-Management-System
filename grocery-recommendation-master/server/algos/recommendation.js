const Category = require('../models/category');
const Product = require('../models/product');
const Review = require("../models/review");
const setupDB = require('../utils/db');
const analyze = require("./sentiment/sentiment");

const getAverage = (array) => {
    if (array.length === 0) return undefined
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}
const linearInterpolation = (value, r1, r2) => {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

const getRatingAndSentimentScore = (reviews) => {
    const ratings = reviews.map(r => r.rating);
    const averageRating = getAverage(ratings);
    let sentimentScore = 0;
    reviews.forEach(element => {
        if (element.review)
            sentimentScore += analyze(element.review)
    });
    return {
        averageRating,
        sentimentScore
    }
}

const getRecommendedProductsInCategory = async (categorySlug) => {
    await setupDB()
    const category = await Category.findOne({ slug: `${categorySlug}` })

    console.log("Category is", category)
    const products = category.products
    const output = await getRecommendedProducts(products)
    return output
}

const getRecommendedProducts = async (products) => {
    const productsWithReviews = []
    for (const id of products) {
        const product = await Product.findById(id);
        const reviews = await Review.find({ product: id })
        product.reviews = reviews
        const { averageRating, sentimentScore } = getRatingAndSentimentScore(reviews)
        productsWithReviews.push({
            product,
            reviews,
            averageRating,
            sentimentScore
        })

    }

    const maxSentimentScore = Math.max(...productsWithReviews.map(o => o.sentimentScore))

    for (const product of productsWithReviews) {
        const { averageRating, sentimentScore } = product;
        let finalScore = 0;

        const interpolatedRatingScore = linearInterpolation(averageRating, [0, 5], [0, 8])
        const interpolatedSentimentScore = linearInterpolation(sentimentScore, [-3, maxSentimentScore], [0, 2])

        console.log("Interpolated rating is", averageRating, interpolatedRatingScore)
        console.log("Interpolated sentiment score is", sentimentScore, interpolatedSentimentScore)

        finalScore += interpolatedRatingScore
        finalScore += interpolatedSentimentScore

        // If the product's average rating is below 2.5, assign a negative score and skip it
        if (averageRating < 2.5) {
            finalScore = -2
        }
        if (isNaN(finalScore)) {
            finalScore = 0
        }
        product.interpolatedRatingScore = interpolatedRatingScore
        product.interpolatedSentimentScore = interpolatedSentimentScore
        product.finalScore = finalScore

    }

    // Sort products by final score in descending order
    const recommendedProducts = productsWithReviews.sort((a, b) => {
        return b.finalScore - a.finalScore
    })

    


    //Result information of each product ----
    console.log("PRoducts are", recommendedProducts)
    const output = recommendedProducts.map(p => ({
        name: p.product.name,
        slug: p.product.slug,
        description: p.product.description,
        imageUrl: p.product.imageUrl,
        price: p.product.price,
        totalReviews: p.reviews.length,
        averageRating: p.averageRating
    }))
    return output
}
getRecommendedProductsInCategory("dairy")
module.exports = {
    getRecommendedProductsInCategory,
    getRecommendedProducts
}