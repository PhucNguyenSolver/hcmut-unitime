const valueWrapper = (initialValue) => {
    const dictionary = {}
    dictionary["Student, Brian"] = 1915982
    dictionary["Student, Sa"] = 1915982
    dictionary["Student, Sb"] = 12
    dictionary["Student, Sc"] = 1915984
    dictionary["DT"] = "DT"
    dictionary["Fal 2010 (woebegon)"] = 191
    const result = dictionary[initialValue]
    if (result !== undefined) return result
    console.error(`unknown value: ${initialValue}`)
    return null
}
