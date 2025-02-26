import express from 'express';
import cors from 'cors';
import clientesRouter from './routes/clientesRoutes.js';
import pedidosRouter from './routes/pedidosRoutes.js';
import productosRouter from './routes/productosRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRouter);
app.use('/pedidos', pedidosRouter);
app.use('/productos', productosRouter);

app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
