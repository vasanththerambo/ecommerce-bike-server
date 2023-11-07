const mongoose =require('mongoose');

const conenctDb = async() => {
    
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_URL, {
            useUnifiedTopology:true,
            useNewUrlParser: true,
        })

        console.log(`database connected : ${conn.connection.host}`);
    }
    catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);

    }
}

module.exports = conenctDb
