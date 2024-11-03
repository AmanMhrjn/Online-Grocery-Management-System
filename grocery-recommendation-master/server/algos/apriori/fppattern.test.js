const apriori = require("./fppattern")

describe("FPPattern", () => {
    it("should return the correct output for given input", () => {
        const input = [
            ["1", "2", "5"],
            ["2", "4"],
            ["2", "3"],
            ["1", "2", "4"],
            ["1", "3"],
            ["2", "3"],
            ["1", "3"],
            ["1", "2", "3", "5"],
            ["1", "2", "3"],
        ]

        const minSupport = 2;
        const output = apriori(input, minSupport, null)
        console.log("Output is", output)
        expect(output.length).toBe(12)
        expect(output[0].antecedent).toStrictEqual(['3'])
        expect(output[0].consequent).toStrictEqual(['1', '2'])
    })
})