const Cart = require('../models/cart');
const Product = require('../models/product');
const { getRecommendedProducts } = require("../algos/recommendation")
const setupDB = require('../utils/db');
//setupDB()
const aggregateProductsOfAllUser = async () => {
    try {
        const aggregatedData = await Cart.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $unwind: '$products' // Unwind the products array
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails' // Unwind the productDetails array
            },
            {
                $group: {
                    _id: '$user.email',
                    user: { $first: '$user.email' },
                    products: { $push: '$productDetails' } // Push productDetails instead of products
                }
            },
            {
                $project: {
                    _id: 0,
                    user: 1,
                    products: 1
                }
            }
        ]);

        return aggregatedData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const calculateSimilarity = (arr1, arr2) => {
    // Convert arrays to sets to remove duplicate elements
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    // Find the intersection of the sets
    const intersection = new Set([...set1].filter(value => set2.has(value)));

    // Calculate jaccard similarity percetage
    const similarityPercentage = (intersection.size / set1.size) * 100;

    // Return the similarity percentage
    return similarityPercentage;
}

const findSimilarProductsFromAggregation = (aggregatedProducts, email) => {
    const SIMILARITY_THRESHOLD = 80 // Percentage
    const MINIMUM_BOUGHT = 2
    const currentUser = aggregatedProducts.find(p => p.user == email)
    if (!currentUser) return []
    const currentUserProducts = currentUser.products.map(p => `${p.slug}`)
    if (currentUserProducts.length < MINIMUM_BOUGHT) return []
    console.log("Current user aggregated products are", currentUserProducts)
    const currentUserProductsSet = new Set(currentUserProducts)
    const output = []
    for (let pr of aggregatedProducts) {
        if (pr.user === email) continue
        const otherUserProducts = pr.products.map(p => `${p.slug}`);
        console.log(`Similarity threshold with ${pr.user}`, calculateSimilarity(currentUserProducts, otherUserProducts))
        if (calculateSimilarity(currentUserProducts, otherUserProducts) < SIMILARITY_THRESHOLD) continue
        const filteredProducts = otherUserProducts.filter(pr => !currentUserProductsSet.has(pr))
        output.push(...filteredProducts)
    }
    return output
}


const getProductsSlugs = async (names) => {
    const output = []
    for (let name of names) {
        const product = await Product.findOne({ slug: name })
        output.push(product._id)
    }
    return output

}
const getTailoredRecommendation = async (email) => {
    // await setupDB()
    const aggregatedProducts = await aggregateProductsOfAllUser()
    console.log("Aggregated products are", aggregatedProducts)
    const similarProducts = findSimilarProductsFromAggregation(aggregatedProducts, email)
    console.log("Similar products are", similarProducts)
    const similarProductsIds = await getProductsSlugs(similarProducts)
    const recommendedProducts = getRecommendedProducts(similarProductsIds)
    return recommendedProducts

}
//getTailoredRecommendation("user3@gmail.com")
module.exports = getTailoredRecommendation