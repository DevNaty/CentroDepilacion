//controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = require('../config/db');


exports.register = async (req, res) => {
    const { email, password, rol, idCentro } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await sql.connect(config);

        await pool.request()
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, hashedPassword)
            .input('Rol', sql.NVarChar, rol)
            .input('ID_Centro', sql.Int, idCentro)
            .query(`
                INSERT INTO Usuarios (Email, PasswordHash, Rol, ID_Centro)
                VALUES (@Email, @PasswordHash, @Rol, @ID_Centro)
            `);

        res.status(201).json({ message: 'Usuario creado' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`
                SELECT ID_Usuario, PasswordHash, Rol, ID_Centro
                FROM Usuarios 
                WHERE Email = @Email
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];

        const match = await bcrypt.compare(password, user.PasswordHash);

        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { 
                id: user.ID_Usuario, 
                rol: user.Rol,
                idCentro: user.ID_Centro
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            token,
            usuario: {
                id: user.ID_Usuario,
                rol: user.Rol,
                idCentro: user.ID_Centro
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};