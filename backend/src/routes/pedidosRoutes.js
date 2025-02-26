import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// SE NECESITA UNA QUERY QUE NOS TRAIGA LOS PEDIDOS CON TODO EL DETALLE
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            // aqui va la query <
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

router.post('/', async (req, res) => {
    const { clientes_id, productos } = req.body;
    try {
        const pedidoResult = await pool.query(
            'INSERT INTO pedidos (clientes_id) VALUES ($1) RETURNING id',
            [clientes_id]
        );
        const pedido_id = pedidoResult.rows[0].id;
        for (let producto of productos) {
            await pool.query(
                'INSERT INTO detalle_del_pedido (pedidos_id, productos_id, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
                [pedido_id, producto.productos_id, producto.cantidad, producto.subtotal]
            );
        }

        res.status(201).json({ message: 'Pedido creado', pedido_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

export default router;
