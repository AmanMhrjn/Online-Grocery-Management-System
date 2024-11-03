const analyze = require("./sentiment")

describe("Sentiment", () => {
    it("should return proper score", () => {
        const input1 = "The product is good. Absolutely amazing"
        expect(analyze(input1)).toEqual(7)
        const input2 = "The product isn't good"
        expect(analyze(input2)).toEqual(-3)
    })
})