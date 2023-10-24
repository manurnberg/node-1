import express from 'express';
import { usersRouter } from '../src/routes/users';
import { productsRouter } from '../src/routes/products';
import { db } from '../src/config/db'

const app = express();
const port = 8080;

//Middlewares
app.use(express.json());

// Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.get('/', (req,res) => {
    res.send('Hello World');
})


db.on('error', (error: Error) => {
    console.log(`Connection error: ${error}`);
});

db.on('open', () => {
    console.log(`Connection successfull`);
    const server = app.listen(port, () => {
        console.log(`Running on port ${port}`);
    })

    process.on('SIGINT', () => {
        console.log('Aplicación cerrada. Desconectando la base de datos y cerrando el servidor...');
        server.close(() => {
          db.connection.close(() => {
            process.exit(0);
          });
        });
      });
})



