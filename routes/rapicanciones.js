module.exports = function (app, gestorBD) {
    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({error: "se ha producido un error"})
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });

    app.get("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({error: "se ha producido un error"})
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });

    app.delete("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        let cancion_id = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;
        let errors = new Array();
        usuarioEsAutorCancion(usuario, cancion_id, function(isAutor) {
            if(isAutor){
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        errors.push("se ha producido un error al intentar eliminar la canción");
                        res.status(500);
                        res.json({errores: errors})
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));
                    }
                });
            }else{
                res.status(413);
                errors.push("El usuario no tiene permisos para eliminar la canción");
                res.json({errores: errors});
            }
        });
    });

    app.post("/api/cancion", function (req, res) {
        let cancion = {nombre: req.body.nombre, genero: req.body.genero, precio: req.body.precio, autor: res.usuario}
        validarDatosCrearCancion(cancion, function(errors){
            if(errors !== null && errors.length > 0){
                res.status(403);
                res.json({errores: errors});
            }else{
                gestorBD.insertarCancion(cancion, function (id) {
                    if (id == null) {
                        errors.push("Se ha producido un error");
                        res.status(500);
                        res.json({errores: errors})
                    } else {
                        res.status(201);
                        res.json({mensaje: "canción insertada", _id: id})
                    }
                });
            }
        });
    });

    app.put("/api/cancion/:id", function (req, res) {
        let cancion = {nombre: req.body.nombre, genero: req.body.genero, precio: req.body.precio, autor: res.usuario};
        validarDatosActualizarCancion(cancion, function(errors){
            if(errors !== null && errors.length > 0){
                res.status(403);
                res.json({errores: errors});

            }else {
                let cancion_id = gestorBD.mongo.ObjectID(req.params.id);
                let usuario = res.usuario;
                let errors = new Array();
                usuarioEsAutorCancion(usuario, cancion_id, function (isAutor) {
                    if (isAutor) {
                        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
                        gestorBD.modificarCancion(criterio, cancion, function (result) {
                            if (result == null) {
                                errors.push("Usuario no autorizado para modificar el contenido de la canción");
                                res.status(500);
                                res.json({errores: errors})
                            } else {
                                res.status(200);
                                res.json({mensaje: "canción modificada", _id: req.params.id})
                            }
                        });
                    } else {
                        res.status(413);
                        errors.push("El usuario no tiene permisos para modificar la canción");
                        res.json({errores: errors});
                    }
                });
            }
        });
    });

    app.post("/api/autenticar", function (req, res) {
        let seguro = app.get("crypto").createHmac("sha256", app.get("clave")).update(req.body.password).digest("hex");
        let criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                });
            } else {
                let token = app.get("jwt").sign({usuario: criterio.email, tiempo: Date.now() / 1000}, "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                });
            }
        });
    });

    function validarDatosCrearCancion(cancion, funcionCallback){
        let errors = new Array();
        if(cancion.nombre === null || typeof cancion.nombre === "undefined" || cancion.nombre === ""){
            errors.push("El nombre de la canción no puede estar vacío");
        }
        if(cancion.genero === null || typeof cancion.genero === "undefined" || cancion.genero === ""){
            errors.push("El género de la canción no puede estar vacío");
        }
        if(cancion.precio === null || typeof cancion.precio === "undefined" || cancion.precio === "" || cancion.precio < 0){
            errors.push("El precio de la canción no puede estar vacío o ser negativo");
        }
        if(errors.length <= 0 ){
            funcionCallback(null);
        }else{
            funcionCallback(errors);
        }
    };

    function validarDatosActualizarCancion(cancion, funcionCallback){
        let errors = new Array();
        if (cancion.nombre !== null && (typeof cancion.nombre === "undefined" || cancion.nombre === "")){
            errors.push("El nombre de la canción no puede estar vacío");
        }
        if (cancion.genero !== null && (typeof cancion.genero === "undefined" || cancion.genero === "")){
            errors.push("El género de la canción no puede estar vacío");
        }
        if (cancion.precio !== null && (typeof cancion.precio === "undefined" || cancion.precio === "" || cancion.precio < 0)){
            errors.push("El precio de la canción no puede estar vacío o ser negativo");
        }
        if(errors.length <= 0 ){
            funcionCallback(null);
        }else{
            funcionCallback(errors);
        }
    };

    function usuarioEsAutorCancion(usuario, cancionId, funcionCallback){
        let criterio = {"_id": cancionId};
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones !== null) {
                if (canciones[0].autor === usuario) {
                    funcionCallback(true);
                } else {
                    funcionCallback(false);
                }
            }
        });
    };
};