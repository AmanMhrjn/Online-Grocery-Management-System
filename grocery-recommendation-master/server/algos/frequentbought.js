const setupDB = require('../utils/db');
const Cart = require('../models/cart');
const Product = require('../models/product');
const apriori = require("./apriori/fppattern");
//setupDB()
const getProductsByUser = async () => {
    try {
        console.log("Get products is called")
        const result = await Cart.aggregate([
            {
                $unwind: "$products"
            },
            {
                $addFields: {
                    createdDate: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$created"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        user: "$user",
                        createdDate: {
                            $concat: [
                                { $substr: ["$createdDate", 0, 7] }, // Extract YYYY-MM
                                "-", // Separator
                                { $cond: [{ $lte: [{ $dayOfMonth: "$created" }, 15] }, "FirstHalf", "SecondHalf"] } // Determine FirstHalf or SecondHalf
                            ]
                        }
                    },
                    products: { $addToSet: "$products.product" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    createdDate: "$_id.createdDate",
                    user: "$user.email",
                    products: 1
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    createdDate: 1,
                    user: 1,
                    products: {
                        $concat: [
                            { $toString: "$productDetails.sku" }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: { createdDate: "$createdDate", user: "$user" },
                    products: { $addToSet: "$products" }
                }
            },
            {
                $project: {
                    _id: 0,
                    createdDate: "$_id.createdDate",
                    user: "$_id.user",
                    products: 1
                }
            }
        ]);
        return result
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
const SUPPORT_COUNT_PERCENTAGE = 0.4 // 40% percentage
const aprioriAlgo = async () => {
    await setupDB()
    console.log("Algo is called")
    const productsByUsers = await getProductsByUser();
    console.log("Products by users are", productsByUsers)

    const candidateSets = productsByUsers.map(pr => pr.products.map(pr => `${pr}`));
    const totalProducts = candidateSets.length

    const supportCount = SUPPORT_COUNT_PERCENTAGE * totalProducts
    console.log("Candidate sets are", candidateSets)
    const association = apriori(candidateSets, 2)
    return association
}


const findFrequentOfAProduct = async (sku) => {
    console.log("Product is", sku)
    const assocation = await aprioriAlgo();
    console.log("Assocation is", assocation, sku)

    const productAssocation = assocation.find(assoc => assoc.antecedent.length === 1 && assoc.antecedent[0] === `${sku}`)
    console.log("Product association is", sku)
    const frequentProducts = []
    if (productAssocation) {
        for (let item of productAssocation.consequent) {
            console.log("Item is ", item)
            const product = await Product.findOne({ sku: item })
            frequentProducts.push(product)
        }
    }
    console.log("Product assocation is", frequentProducts)
    return frequentProducts


}

// findFrequentOfAProduct("sitaram_dahi")
module.exports = findFrequentOfAProduct