module.exports = function (app, swig, gestorBD) {
    app.post("/comentarios/:cancion_id", function(req, res){
        let comentario = {
            autor: req.session.usuario,
            texto: req.body.texto,
            cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
        }
        gestorBD.insertarComentario(comentario, function (id) {
            if (id == null) {
                res.send("Error al insertar un comentario");
            } else {
                //res.send("Comentario Insertado " + id);
                res.redirect("/cancion/" + req.params.cancion_id);
            }
        });
    });
    app.get("/comentario/borrar/:id", function(req, res){
        let criterio = {"_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.eliminarComentario(criterio,function(comentario){
            res.redirect("/cancion/" + req.params.id);
        });
    });
}