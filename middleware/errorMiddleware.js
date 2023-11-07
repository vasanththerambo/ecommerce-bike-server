const multer = require('multer')
const notFound = (err, req, res, next) => {
    
    const statusCode = res.statusCode;
    res.status(statusCode).json({ message: err.message });

}

const errorHandler = (req,res,next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);

}

const multerError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        
        const statusCode = err.statusCode;
        res.status(statusCode).json({ message: err.message });
    }
    else {
        res.status(409).json({ message: 'Unknown Error' });
    }
}

module.exports = {
    notFound,
    errorHandler,
    multerError
}
