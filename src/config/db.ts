const mongoose = require("mongoose");

const DB_URI = 'mongodb://localhost:37017/nodeapi';

mongoose.connect(DB_URI,
    {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

export const db = mongoose.connection;