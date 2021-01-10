const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');


// api/tareas
//Crear una tarea
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligario').not().isEmpty(),
        check('proyecto', 'El proyecto es obligario').not().isEmpty(),
    ],
    tareaController.crearTarea
);

// api/tareas
//Obtener tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas

)

// api/tareas
//Actualizar Tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

// api/tareas
//Eliminar Tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;