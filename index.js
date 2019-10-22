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
        query = query.concat(" WHERE id = '",req.body.id,"'");
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
                alumno: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
        
    });
    connection.end();
});
app.get("/admin/add_alumno", (req,res) => {
     alumno = {id: '0', nombre: '', apellido: '',grado:'',seccion:'',tutor:''};
    if(req.session.auth){
        res.render("add_alumno",{
            tipo: "AÑADIR",
            alumno: alumno,
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
        var query = "SELECT * FROM alumnos WHERE id = '";
        query = query.concat(req.session.id_editar,"'");
        
        connection.query(query, function (error, results, fields) {
            if (error) throw error;

            if(req.session.auth){
                res.render("add_alumno",{
                    tipo: "EDITAR",
                    alumno: results[0],
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

app.post("/admin/add_alumno_post",(req,res) => {
        //Se creara conexion a base de datos PostgreSQL
   
    var connection = conectar();
    connection.connect();
    var query ="";
    if(req.body.id == 0){
        query = "INSERT INTO alumnos (nombre,apellido,grado,seccion,tutor) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.apellido,"','",req.body.grado,"','",req.body.seccion,"','",req.body.tutor,"')");
        console.log(query);
    }
    else{
        query = "UPDATE alumnos SET nombre ='";
        query = query.concat(req.body.nombre,"', apellido ='",req.body.apellido,"',grado ='",req.body.grado,"',seccion ='",req.body.seccion,"',tutor ='",req.body.tutor,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'");
    }
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/alumno");
    });
    connection.end();
});
app.post("/admin/edit_alumno_post",(req,res) => {
    req.session.id_editar = req.body.id;
    res.redirect("/admin/editar_alumno");
});
app.post("/admin/delete_alumno_post",(req,res) => {
    var connection = conectar();
    connection.connect();
     var query = "DELETE FROM alumnos WHERE id = '";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/alumno");
       
    });
    connection.end();
    
});
//Admin Alumno END////////////////////////////////////////////////////////////////////////
//Admin USUARIO BEGIN/////////////////////////////////////////////////////////////////////
app.get("/admin/usuario", (req,res) => {
    
    var connection = conectar();
    connection.connect();
    var query = "SELECT * FROM usuarios ";  
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(req.session.auth){
            res.render("ver_usuarios",{
                titulo: "Usuarios",
                usuarios: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
        
    });
    connection.end();
});
app.get("/admin/add_usuario", (req,res) => {
     usuario = {id: '0', user: '', password: '',tipo:''};
    if(req.session.auth){
        res.render("add_usuario",{
            tipo: "AÑADIR",
            usuarios: usuario,
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/admin/editar_usuario", (req,res) => {

    if(req.session.auth){
        var connection = conectar();
        connection.connect();
        var query = "SELECT * FROM usuarios WHERE id = '";
        query = query.concat(req.session.id_editar,"'");
        
        connection.query(query, function (error, results, fields) {
            if (error) throw error;

            if(req.session.auth){
                res.render("add_usuario",{
                    tipo: "EDITAR",
                    usuarios: results[0],
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

app.post("/admin/add_usuario_post",(req,res) => {
        //Se creara conexion a base de datos PostgreSQL
   
    var connection = conectar();
    connection.connect();
    var query ="";
    if(req.body.id == 0){
        query = "INSERT INTO usuarios (user,password,tipo) VALUES('";
        query = query.concat(req.body.user,"','",req.body.password,"','",req.body.tipo,"')");
        console.log(query);
    }
    else{
        query = "UPDATE usuarios SET user ='";
        query = query.concat(req.body.user,"', password ='",req.body.password,"',tipo ='",req.body.tipo,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'");
    }
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/usuario");
    });
    connection.end();
});
app.post("/admin/edit_usuario_post",(req,res) => {
    req.session.id_editar = req.body.id;
    res.redirect("/admin/editar_usuario");
});
app.post("/admin/delete_usuario_post",(req,res) => {
    var connection = conectar();
    connection.connect();
     var query = "DELETE FROM usuarios WHERE id = '";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/usuario");
       
    });
    connection.end();
    
});
//Admin Usuario END////////////////////////////////////////////////////////////////////////

//Admin CRUSOS BEGIN/////////////////////////////////////////////////////////////////////
app.get("/admin/curso", (req,res) => {
    
    var connection = conectar();
    connection.connect();
    var query = "SELECT * FROM cursos ";  
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(req.session.auth){
            res.render("ver_cursos",{
                titulo: "Cursos",
                curso: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
        
    });
    connection.end();
});
app.get("/admin/add_curso", (req,res) => {
     curso = {id: '0', nombre: '', grado: ''};
    if(req.session.auth){
        res.render("add_curso",{
            tipo: "AÑADIR",
            curso: curso,
            usuario : req.session.usuario
        });
    }else{
        res.redirect("/login");
    }

});
app.get("/admin/editar_curso", (req,res) => {

    if(req.session.auth){
        var connection = conectar();
        connection.connect();
        var connection2 = conectar();
        connection2.connect();
        var query = "SELECT * FROM cursos WHERE id = '";
        query = query.concat(req.session.id_editar,"'");
        
        connection.query(query, function (error, results2, fields) {
            if (error) throw error;
             var query2 = "SELECT * FROM rubricas WHERE id_curso = '";
             query2 = query2.concat(results2[0].id,"'");
             console.log(query2);
             connection2.query(query2, function (error, results, fields) {
                console.log(results);
                if(req.session.auth){
                    res.render("add_curso",{
                        tipo: "EDITAR",
                        curso: results2[0],
                        rubrica: results,
                        usuario : req.session.usuario
                    });
                }else{
                    res.redirect("/login");
                }
            });

            connection2.end();
            
        });
          
        connection.end();
    }else{
        res.redirect("/login");
    }

});

app.post("/admin/add_curso_post",(req,res) => {
        //Se creara conexion a base de datos PostgreSQL
   
    var connection = conectar();
    connection.connect();

    var connection2 = conectar();
    connection2.connect();
    var connection3 = conectar();
    connection3.connect();
    var query ="";
    if(req.body.id == 0){
        query = "INSERT INTO cursos (nombre,grado) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.grado,"')");
        
        var query_max ="SELECT Max(id) as 'max' FROM cursos";
        var query2;
        connection2.query(query_max, function (error, results, fields) {
            
            if(req.body.cant > 0)
            {
                query2 = "INSERT INTO rubricas (id_curso,item,sobresaliente,logrado,proceso,inicio) VALUES('";
                query2 = query2.concat((results[0].max+1),"','",req.body.i1,"','",req.body.rs1,"','",req.body.rl1,"','",req.body.rp1,"','",req.body.ri1,"')");
            }
            if(req.body.cant > 1)
            {
                
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i2,"','",req.body.rs2,"','",req.body.rl2,"','",req.body.rp2,"','",req.body.ri2,"')");
            
            }
            if(req.body.cant > 2)
            {
                
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i3,"','",req.body.rs3,"','",req.body.rl3,"','",req.body.rp3,"','",req.body.ri3,"')");
            
            }
            if(req.body.cant > 3)
            {
                
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i4,"','",req.body.rs4,"','",req.body.rl4,"','",req.body.rp4,"','",req.body.ri4,"')");
            
            }
            if(req.body.cant > 4)
            {
                
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i5,"','",req.body.rs5,"','",req.body.rl5,"','",req.body.rp5,"','",req.body.ri5,"')");
            
            }
            if(req.body.cant > 5)
            {
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i6,"','",req.body.rs6,"','",req.body.rl6,"','",req.body.rp6,"','",req.body.ri6,"')");
            
            }
            if(req.body.cant > 6)
            {
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i7,"','",req.body.rs7,"','",req.body.rl7,"','",req.body.rp7,"','",req.body.ri7,"')");
            
            }
            if(req.body.cant > 7)
            {
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i8,"','",req.body.rs8,"','",req.body.rl8,"','",req.body.rp8,"','",req.body.ri8,"')");
            
            }
            if(req.body.cant > 8)
            {
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i9,"','",req.body.rs9,"','",req.body.rl9,"','",req.body.rp9,"','",req.body.ri9,"')");
            
            }
            if(req.body.cant > 9)
            {
                query2 = query2.concat(",('",results[0].max+1,"','",req.body.i10,"','",req.body.rs10,"','",req.body.rl10,"','",req.body.rp10,"','",req.body.ri10,"')");
            
            }
            
            connection3.query(query2);
            connection3.end();
        });
        connection2.end();
        

    }
    else{
        query = "UPDATE cursos SET nombre ='";
        query = query.concat(req.body.nombre,"', grado ='",req.body.grado,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'");
    }
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/curso");
    });
    connection.end();
});
app.post("/admin/edit_curso_post",(req,res) => {
    req.session.id_editar = req.body.id;
    res.redirect("/admin/editar_curso");
});
app.post("/admin/delete_curso_post",(req,res) => {
    var connection = conectar();
    connection.connect();
     var query = "DELETE FROM cursos WHERE id = '";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/curso");
       
    });
    connection.end();
    
});

app.post("/admin/edit_rubrica_post",(req,res) => {
     var connection = conectar();
     connection.connect();
    
    var query = "UPDATE rubricas SET item ='";
        query = query.concat(req.body.i,"', sobresaliente ='",req.body.rs,"', logrado ='",req.body.rl,"', proceso ='",req.body.rp,"', inicio ='",req.body.ri,"'");
        query = query.concat(" WHERE id = '",req.body.id,"'");
    console.log(query);
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
            res.redirect("/admin/curso");
    });
    connection.end();
});
app.post("/admin/ver_rubrica_post", (req,res) => {

    if(req.session.auth){

        var connection2 = conectar();
        connection2.connect();
       
         var query2 = "SELECT * FROM rubricas WHERE id_curso = '";
         query2 = query2.concat(req.body.id,"'");
         connection2.query(query2, function (error, results, fields) {
            console.log(results);
            
            res.render("ver_rubricas",{
                tipo: "EDITAR",
                nombre: req.body.nombre,
                rubrica: results,
                usuario : req.session.usuario
            });
            
        });

        connection2.end();

    }else{
        res.redirect("/login");
    }

});
//Admin Rubrica END////////////////////////////////////////////////////////////////////////
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