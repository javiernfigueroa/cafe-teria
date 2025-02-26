import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// SE NECESITA UNA QUERY QUE NOS TRAIGA TODOS LOS CLIENTES
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('aqui va la query');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});


// SE NECESITA UNA QUERY QUE INSERTE NUEVOS CLIENTES
router.post('/', async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const result = await pool.query(
            'aqui va la querya',
            [nombre, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar cliente' });
    }
});

export default router;
