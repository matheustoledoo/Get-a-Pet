const mongoose = require('mongoose')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Connection with MongoDB was Complete')
}

main().catch((err) => console(err))

module.exports = mongoose