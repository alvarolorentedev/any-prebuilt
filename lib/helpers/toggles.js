const isRefactor = () => { 
    if(process.env.IS_REFACTOR == "true")
        return true 
    return false
}

module.exports = { isRefactor }