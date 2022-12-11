const valueWrapper = (initialValue) => {
    const dictionary = {}
    dictionary["Student, Brian"] = 1915982
    dictionary["Student, Sa"] = 1915982
    dictionary["Student, Sb"] = 1915983
    dictionary["Student, Sc"] = 1915984
    dictionary["DT"] = "DT"
    dictionary["Fal 2010 (woebegon)"] = 191

    dictionary["CHM 101"] = "CO1"
    dictionary["BIOL 101"] = "CO2"
    dictionary["MBIO 101"] = "CO3"

    dictionary["name_of_CO1"] = "CHM 101"
    dictionary["name_of_CO2"] = "BIOL 101"
    dictionary["name_of_CO3"] = "MBIO 101"

    if (initialValue in dictionary) return dictionary[initialValue]
    else {
        console.error(`${initialValue} not in dictionary`)
    }
}
