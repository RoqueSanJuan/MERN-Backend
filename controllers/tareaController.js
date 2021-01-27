const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');

const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({errores : errores.array() })
    }

    //Extraer el proyecto y verificar si existe


    try{
        const { proyecto } = req.body;
        //Extraer el proyecto y verificar si existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Crear una tarea
        const tarea = new Tarea(req.body);
        
        await tarea.save();
        res.json(tarea);


    } catch (error){
        console.log(error);
        res.status(500).send('Existe un error');
    }
};


//Obtener las tareas por proyectos
exports.obtenerTareas = async (req, res)=>{

    //Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({errores : errores.array() })
    }

    try{
        const { proyecto } = req.query;

        //Extraer el proyecto y verificar si existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Obtener las tareas del proyecto
        const tareas = await Tarea.find({ proyecto });
        return res.json({tareas});


    } catch (error){
            console.log(error);
            return res.status(500).send('Existe un error');
    }
};

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {


    //Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({errores : errores.array() })
    }

    try {
        const { proyecto, nombre, estado } = req.body;
        //Extraer el proyecto
        let existeProyecto = await Proyecto.findById(proyecto);
        let tarea = await Tarea.findById(req.params.id);

        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Verificar que exista la tarea
        if(!tarea) {
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        //Crear una tarea con la nueva info
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;


        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id }, nuevaTarea, { new:true });

        return res.json({tarea});


        

    } catch (error) {
        console.log(error);
        return res.status(500).send('Existe un error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {


    try {
        

        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);
        //Extraer el proyecto y verificar si existe
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto pertenece al usuario
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Verificar que exista la tarea
        if(!tarea) {
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        //Elimnar la tarea pasada por tarametro
        await Tarea.findOneAndDelete({_id : req.params.id});
        return res.json({msg: 'Tarea Eliminada'});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Existe un error');
    }


}
