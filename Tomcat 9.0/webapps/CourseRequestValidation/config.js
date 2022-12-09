const valueWrapper = (initialValue) => {
    const dictionary = {}
    dictionary["Student, Brian"] = 1915982
    dictionary["DT"] = "DT"
    dictionary["Fal 2010 (woebegon)"] = 2019
    const result = dictionary[initialValue]
    if (result === undefined) throw `unknown value: ${initialValue}`
    return result
}
