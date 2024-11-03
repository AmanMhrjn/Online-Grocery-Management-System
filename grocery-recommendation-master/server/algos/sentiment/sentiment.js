const wordsScore = require("./words-score");
const negators = require("./negators")


const tokenize = (input) => {
    return input
        .toLowerCase()
        .replace(/\n/g, ' ')
        .replace(/[.,\/#!?$%\^&\*;:{}=_`\"~()]/g, ' ')
        .replace(/\s\s+/g, ' ')
        .trim()
        .split(' ');
}

const scoreAfterNegatorAnalyze = (tokens, index, score) => {
    if (index === 0) return score
    const prevToken = tokens[index - 1];
    if (negators[prevToken.toLowerCase()]) {
        return -score
    }
    return score
}

// Core analyze algorithm
const analyze = (sentence) => {
    const tokens = tokenize(sentence)
    let i = tokens.length;
    let score = 0;
    while (i--) {
        var word = tokens[i]
        if (!Object.prototype.hasOwnProperty.call(wordsScore, word)) continue;
        let tokenScore = wordsScore[word]
        tokenScore = scoreAfterNegatorAnalyze(tokens, i, tokenScore)
        score += tokenScore
    }
    return score
}

console.log(analyze("The product is good. Absolutely amazing"))
console.log(analyze("The product isn't good"))
console.log(analyze("The product is good"))
console.log(analyze("Don't buy it"))
console.log(analyze("buy it"))

module.exports = analyze