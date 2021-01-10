const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// api/proyectos
//Crear un proyecto
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligario').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// api/proyectos  Obtener los proyectos de un usuario
router.get('/',
    auth,  
    proyectoController.obtenerProyectos
);

//Modificar un proyecto
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligario').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
);


module.exports = router;