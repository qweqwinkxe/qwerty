const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const manufacturers = await prisma.manufacturer.findMany();
        res.json(manufacturers);
    } catch (error) {
        console.error('Ошибка при получении производителей:', error);
        res.status(500).json({ message: 'Ошибка при получении производителей', error });
    }
});

module.exports = router;
