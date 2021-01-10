// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioControllers');
const { check } = require('express-validator');

//Crear un usuario
//    "nombre":"Roque",
//    "email":"roque@email.com",
//    "password":"password"
//    "Token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoiNWZmYjQyNTA0MGNkZmQ0MmM4MTViMzEwIn0sImlhdCI6MTYxMDMwMjAzMiwiZXhwIjoxNjEwMzM4MDMyfQ.F0JqvtdmHMmZOmwBxpXMRPvEIrmlctkaccP7G_YibPI"

// api/usuarios
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo 6 caracteres').isLength({min: 6})
    ],
    usuarioController.crearUsuario
);

module.exports = router;