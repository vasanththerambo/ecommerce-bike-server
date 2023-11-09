const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');

require("dotenv").config()

const PORT = process.env.PORT || 5000

const conenctDb = require('./config/db')
const { notFound,
    errorHandler,
    multerError } = require('./middleware/errorMiddleware')

const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const productRoutes = require('./routes/productRoutes')

// connect to mongodb using mongoose
conenctDb();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/storage/images', express.static('storage/images'));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/product', productRoutes);


app.get('/', (req, res) => {
    res.status(200).json({message:"Server Home page"})
})

app.use(notFound);
app.use(errorHandler);
app.use(multerError);

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})
