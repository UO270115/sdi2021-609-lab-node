//Módulos
let express = require("express");
let app = express();

//Variables
app.set("port", 8081);

app.get("/usuarios", function (req, res){
    console.log("Depurar aquí");
    res.send("Ver usuarios");
});

app.get("/canciones", function (req, res){
    res.send("Ver canciones");
});

//lanzar el servidor
app.listen(app.get('port'), function(){
    console.log("Servidor activo");
});