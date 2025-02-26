import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// SE NECESITA UNA QUERY QUE NOS TRAIGA LOS PRODUCTOS
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(' aqui va la querys ');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

export default router;
