import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Obtener todos los pedidos con detalles
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.id AS pedido_id, c.nombre AS cliente, pr.nombre AS producto, d.cantidad, d.subtotal
            FROM pedidos p
            JOIN clientes c ON p.clientes_id = c.id
            JOIN detalle_del_pedido d ON p.id = d.pedidos_id
            JOIN productos pr ON d.productos_id = pr.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
    const { clientes_id, productos } = req.body;
    try {
        const pedidoResult = await pool.query(
            'INSERT INTO pedidos (clientes_id) VALUES ($1) RETURNING id',
            [clientes_id]
        );
        const pedido_id = pedidoResult.rows[0].id;

        // Insertar los productos en detalle_del_pedido
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
