const Usuario = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si existen errores

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()});
    }

    //extraer email y pasword

    const {email, password} = req.body;


    try{
        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({msg : 'El usuario ya existe'});
        }

        //Crear el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);


        await usuario.save();

        //Crear y firmar el jwt
        const payload = {
            usuario:{
                id: usuario.id
            }

        };

        //Firmar
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, (error, token) => {
            if(error) throw error;
             res.json({token});
        });

    } catch (error){
        console.log(error);
        res.status(400, "Tenemos un error");
    }
}