//controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const crypto = require('crypto');   
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
exports.recuperarPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query(`
                SELECT ID_Usuario
                FROM Usuarios
                WHERE Email = @Email
            `);

        // Por seguridad, respondemos igual aunque no exista
        if (result.recordset.length === 0) {
            return res.status(200).json({
                message: "Se enviarán instrucciones de recuperación a la dirección de correo proporcionada si existe en nuestro sistema"
            });
        }

        const usuario = result.recordset[0];

        // Generamos un token aleatorio
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Vence en 15 minutos
        const expira = new Date(Date.now() + 15 * 60 * 1000);

        await pool.request()
            .input('ID_Usuario', sql.Int, usuario.ID_Usuario)
            .input('ResetToken', sql.VarChar, resetToken)
            .input('ResetTokenExpira', sql.DateTime, expira)
            .query(`
                UPDATE Usuarios
                SET ResetToken = @ResetToken,
                    ResetTokenExpira = @ResetTokenExpira
                WHERE ID_Usuario = @ID_Usuario
            `);
        res.status(200).json({
    message: "Se enviarán instrucciones de recuperación a la dirección de correo proporcionada si existe en nuestro sistema"
});

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const pool = await sql.connect(config);

        // Buscar usuario con ese token
        const result = await pool.request()
            .input('ResetToken', sql.VarChar, token)
            .query(`
                SELECT ID_Usuario, ResetTokenExpira
                FROM Usuarios
                WHERE ResetToken = @ResetToken
            `);

        if (result.recordset.length === 0) {
            return res.status(400).json({
                message: "Token inválido"
            });
        }

        const usuario = result.recordset[0];

        // Verificar vencimiento
        if (new Date() > usuario.ResetTokenExpira) {
            return res.status(400).json({
                message: "El enlace de recuperación ha expirado"
            });
        }

        // Hashear nueva contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Actualizar contraseña y limpiar token
        await pool.request()
            .input('ID_Usuario', sql.Int, usuario.ID_Usuario)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .query(`
                UPDATE Usuarios
                SET PasswordHash = @PasswordHash,
                    ResetToken = NULL,
                    ResetTokenExpira = NULL
                WHERE ID_Usuario = @ID_Usuario
            `);

        res.status(200).json({
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};