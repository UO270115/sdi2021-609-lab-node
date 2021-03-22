const url = require("url");

module.exports = function (app, swig) {

    app.get("/autores/agregar", function(req, res){
        let respuesta = swig.renderFile("views/autores-agregar.html",{});
        res.send(respuesta);
    });

    app.post("/autor", function(req,res){
        let respuesta = "";

        //if(typeof req.body.nombre === "undefined" || req.body.nombre === null){
        if(Object.keys(req.body.nombre).length === 0){
            respuesta += "Nombre: no enviado en la petición" + "<br>";
        }else{
            respuesta += "Nombre: " + req.body.nombre + "<br>";
        }

        //if(typeof req.body.grupo === 'undefined' || req.body.grupo === null){
        if(Object.keys(req.body.grupo).length === 0){
            respuesta += "Grupo: no enviado en la petición" + "<br>";
        }else{
            respuesta += "Grupo: " + req.body.grupo + "<br>";
        }

        //if(typeof req.body.rol === 'undefined' || req.body.rol === null){
        if(Object.keys(req.body.rol).length === 0){
            respuesta += "Rol: no enviado en la petición" + "<br>";
        }else{
            respuesta += "Rol: " + req.body.rol + "<br>";
        }

        res.send(respuesta);
    });

    app.get("/autores", function(req,res){
        let autores = [
            {
                "nombre": "Andre",
                "grupo": "Grupo",
                "rol": "Cantante"
            },
            {
                "nombre": "Edward",
                "grupo": "Grupo",
                "rol": "Guitarrista"
            },
            {
                "nombre": "Enrique",
                "grupo": "Grupo",
                "rol": "Bajista"
            },{
                "nombre": "Miguel",
                "grupo": "Grupo",
                "rol": "Bajista"
            }
        ];

        let respuesta = swig.renderFile("views/autores.html", {
            autores: autores
        })

        res.send(respuesta);
    });

    app.get("/autores/*", function(req,res){
        res.redirect("/autores");
    });
}