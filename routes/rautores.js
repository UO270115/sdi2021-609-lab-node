const url = require("url");

module.exports = function (app, swig) {

    var autores = filtrarRoles(null);

    app.get("/autores/agregar", function (req, res) {
        let roles = ["cantante", "batería", "guitarrista", "bajista", "teclista"];
        let respuesta = swig.renderFile("views/autores-agregar.html", {
            roles: roles
        });
        res.send(respuesta);
    });

    app.post("/autor", function (req, res) {
        let respuesta = "";

        //if(typeof req.body.nombre === "undefined" || req.body.nombre === null){
        if (Object.keys(req.body.nombre).length === 0) {
            respuesta += "Nombre: no enviado en la petición" + "<br>";
        } else {
            respuesta += "Nombre: " + req.body.nombre + "<br>";
        }

        //if(typeof req.body.grupo === 'undefined' || req.body.grupo === null){
        if (Object.keys(req.body.grupo).length === 0) {
            respuesta += "Grupo: no enviado en la petición" + "<br>";
        } else {
            respuesta += "Grupo: " + req.body.grupo + "<br>";
        }

        //if(typeof req.body.rol === 'undefined' || req.body.rol === null){
        if (Object.keys(req.body.rol).length === 0) {
            respuesta += "Rol: no enviado en la petición" + "<br>";
        } else {
            respuesta += "Rol: " + req.body.rol + "<br>";
        }

        res.send(respuesta);
    });

    app.get("/autores", function (req, res) {
        let respuesta = swig.renderFile("views/autores.html", {
            autores: autores
        })

        autores = filtrarRoles(null);

        res.send(respuesta);
    });

    app.get("/autores/filtrar/:rol", function (req, res) {
        autores = filtrarRoles(req.params.rol);
        res.redirect("/autores");
    });

    app.get("/autores/*", function (req, res) {
        res.redirect("/autores");
    });

    function filtrarRoles(rol){
        let autores = [
            {
                "nombre": "Andre",
                "grupo": "Grupo1",
                "rol": "cantante"
            },
            {
                "nombre": "Edward",
                "grupo": "Grupo1",
                "rol": "guitarrista"
            },
            {
                "nombre": "Enrique",
                "grupo": "Grupo1",
                "rol": "bajista"
            }, {
                "nombre": "Miguel",
                "grupo": "Grupo1",
                "rol": "teclista"
            },
            {
                "nombre": "Andre",
                "grupo": "Grupo2",
                "rol": "cantante"
            },
            {
                "nombre": "Edward",
                "grupo": "Grupo2",
                "rol": "guitarrista"
            },
            {
                "nombre": "Enrique",
                "grupo": "Grupo2",
                "rol": "bajista"
            }, {
                "nombre": "Miguel",
                "grupo": "Grupo2",
                "rol": "teclista"
            }
            ,
            {
                "nombre": "Andre",
                "grupo": "Grupo3",
                "rol": "cantante"
            },
            {
                "nombre": "Edward",
                "grupo": "Grupo3",
                "rol": "guitarrista"
            },
            {
                "nombre": "Enrique",
                "grupo": "Grupo3",
                "rol": "bajista"
            }, {
                "nombre": "Miguel",
                "grupo": "Grupo3",
                "rol": "teclista"
            }
        ];

        if(rol !== null){
            return autores.filter(autor => autor.rol === rol);
        }
        return autores;
    }
}