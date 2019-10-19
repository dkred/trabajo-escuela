const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('views'));
app.set("view engine","ejs");

app.use(session({
    secret: "sdnjasfgaskfujbasgufjkig",
    resave: true,
    saveUninitialized: true
}));
function conectar(){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'tarea'
    });
    return connection;
}
app.get("/", (req,res) => {
    if(req.session.auth){
        if(req.session.tipo == 'administrador') {
            res.redirect("/admin");
       }
       if(req.session.tipo == 'profesor') {
            res.redirect("/profesor");
       }
       if(req.session.tipo == 'estudiante') {
            res.redirect("/estudiante");
       }
        
    }else{
        res.redirect("/login");
    }

});
app.get("/admin", (req,res) => {
    if(req.session.auth){
        res.render("admin",{
            titulo: "Panel Administrador",
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});

//panel Admin Docente BEGIN////////////////////////////////////////////////////////////////////////
app.get("/admin/docente", (req,res) => {
    
    var connection = conectar();
    connection.connect();
    var query = "SELECT * FROM profesores ";
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(req.session.auth){
            res.render("ver_docentes",{
                titulo: "Docentes",
                profesor: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
        
    });
    connection.end();
});
app.get("/admin/add_docente", (req,res) => {
     profesor = {id: '0', nombre: '', apellido: '',curso:'',grado:'',seccion:''};
    if(req.session.auth){
        res.render("add_docente",{
            tipo: "AÑADIR",
            profesor: profesor,
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/admin/editar_docente", (req,res) => {

    if(req.session.auth){
        var connection = conectar();
        connection.connect();
        var query = "SELECT * FROM profesores WHERE id = '";
        query = query.concat(req.session.id_editar,"'");
        
        connection.query(query, function (error, results, fields) {
            if (error) throw error;

            if(req.session.auth){
                res.render("add_docente",{
                    tipo: "EDITAR",
                    profesor: results[0],
                    usuario : req.session.usuario
                });
            }else{
                res.redirect("/login");
            }
            
        });
          
        connection.end();
    }else{
        res.redirect("/login");
    }

});

app.post("/admin/add_docente_post",(req,res) => {
        //Se creara conexion a base de datos PostgreSQL
   
    var connection = conectar();
    connection.connect();
    var query ="";
    if(req.body.id == 0){
        query = "INSERT INTO profesores (nombre,apellido,curso,grado,seccion) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.apellido,"','",req.body.curso,"','",req.body.grado,"','",req.body.seccion,"')");
    }
    else{
        query = "UPDATE profesores SET nombre ='";
        query = query.concat(req.body.nombre,"', apellido ='",req.body.apellido,"',curso ='",req.body.curso,"',grado ='",req.body.grado,"',seccion ='",req.body.seccion,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'")
    }
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/docente");
    });
    connection.end();
});
app.post("/admin/edit_docente_post",(req,res) => {
    req.session.id_editar = req.body.id;
    res.redirect("/admin/editar_docente");
});
app.post("/admin/delete_docente_post",(req,res) => {
    var connection = conectar();
    connection.connect();
     var query = "DELETE FROM profesores WHERE id = '";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/docente");
       
    });
    connection.end();
    
});
//Admin Docente END/////////////////////////////////////////////////////////////////////////
//Admin Alumno BEGIN/////////////////////////////////////////////////////////////////////
app.get("/admin/alumno", (req,res) => {
    
    var connection = conectar();
    connection.connect();
    var query = "SELECT * FROM alumnos ";
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(req.session.auth){
            res.render("ver_alumnos",{
                titulo: "Alumnos",
                profesor: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
        
    });
    connection.end();
});
app.get("/admin/add_alumno", (req,res) => {
     profesor = {id: '0', nombre: '', apellido: '',grado:'',seccion:'',tutor:''};
    if(req.session.auth){
        res.render("add_alumno",{
            tipo: "AÑADIR",
            profesor: profesor,
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/admin/editar_alumno", (req,res) => {

    if(req.session.auth){
        var connection = conectar();
        connection.connect();
        var query = "SELECT * FROM profesores WHERE id = '";
        query = query.concat(req.session.id_editar,"'");
        
        connection.query(query, function (error, results, fields) {
            if (error) throw error;

            if(req.session.auth){
                res.render("add_docente",{
                    tipo: "EDITAR",
                    profesor: results[0],
                    usuario : req.session.usuario
                });
            }else{
                res.redirect("/login");
            }
            
        });
          
        connection.end();
    }else{
        res.redirect("/login");
    }

});

app.post("/admin/add_docente_post",(req,res) => {
        //Se creara conexion a base de datos PostgreSQL
   
    var connection = conectar();
    connection.connect();
    var query ="";
    if(req.body.id == 0){
        query = "INSERT INTO profesores (nombre,apellido,curso,grado,seccion) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.apellido,"','",req.body.curso,"','",req.body.grado,"','",req.body.seccion,"')");
    }
    else{
        query = "UPDATE profesores SET nombre ='";
        query = query.concat(req.body.nombre,"', apellido ='",req.body.apellido,"',curso ='",req.body.curso,"',grado ='",req.body.grado,"',seccion ='",req.body.seccion,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'")
    }
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/docente");
    });
    connection.end();
});
app.post("/admin/edit_docente_post",(req,res) => {
    req.session.id_editar = req.body.id;
    res.redirect("/admin/editar_docente");
});
app.post("/admin/delete_docente_post",(req,res) => {
    var connection = conectar();
    connection.connect();
     var query = "DELETE FROM profesores WHERE id = '";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/docente");
       
    });
    connection.end();
    
});
//Admin Alumno END////////////////////////////////////////////////////////////////////////
app.get("/profesor", (req,res) => {
    if(req.session.auth){
        res.render("profesor",{
            titulo: "Panel Profesor",
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/estudiante", (req,res) => {
    if(req.session.auth){
        res.render("estudiante",{
            titulo: "Panel Estudiante",
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});

app.get("/login",(req,res) => {
    if(req.session.auth){
       if(req.session.tipo == 'admin') {
            res.redirect("/admin");
       }
       if(req.session.tipo == 'profesor') {
            res.redirect("/profesor");
       }
       if(req.session.tipo == 'estudiante') {
            res.redirect("/estudiante");
       }

    }else{
        res.render("login",{
            titulo: "Login"
        });
    }
});
app.post("/login",(req,res) => {
    //Se creara conexion a base de datos PostgreSQL
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'tarea'
    });
    connection.connect();
    var tipo = "ninguno";
    var resultados = 0;
    var query = "SELECT * FROM usuarios WHERE user='";
    query = query.concat(req.body.user,"' AND password = '",req.body.pass,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(results.length == 1){
            req.session.tipo = results[0].tipo;
            req.session.auth = 1;
            req.session.usuario = results[0].user;
            res.send({
                status : 1,
                nombre : results[0].user
            });
        }else{
            res.send({
                status : "Datos incorrectos"
            });
        }
    });
      
    connection.end();
    
});

app.get("/salir",(req,res) => {
    req.session.auth = null;
    req.session.nombre = null;
    res.redirect("/");
});
    
app.listen(8888,() => {
    console.log("Corriendo en el puerto 8888");
});