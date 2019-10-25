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
app.post("/admin/buscar_docente_post", (req,res) => {
    req.session.buscar_profesor = req.body.buscar;
    res.redirect("/admin/docente");
});
app.post("/admin/buscar_curso_post", (req,res) => {
    req.session.buscar_curso = req.body.buscar;
    res.redirect("/admin/curso");
});
app.post("/admin/buscar_alumno_post", (req,res) => {
    req.session.buscar_alumno = req.body.buscar;
    res.redirect("/admin/alumno");
});

app.get("/admin/docente", (req,res) => {
    
    var connection = conectar();
    connection.connect();
    var query;
    if(req.session.buscar_profesor){
        query = "SELECT * FROM profesores WHERE nombre LIKE '%"+req.session.buscar_profesor+"%' ";
    }
    else{
        query = "SELECT * FROM profesores ";
    }
    
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
     profesor = {id: '0', nombre: '', apellido: '', password: ''};
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
        query = "INSERT INTO profesores (nombre,apellido,password) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.apellido,"','",req.body.password,"')");
    }
    else{
        query = "UPDATE profesores SET nombre ='";
        query = query.concat(req.body.nombre,"', apellido ='",req.body.apellido,"', password ='",req.body.password,"'");
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
    var query ;
    if(req.session.buscar_alumno){
        query = "SELECT * FROM alumnos WHERE nombre LIKE '%"+req.session.buscar_alumno+"%' ";
    }
    else{
        query = "SELECT * FROM alumnos ";
    }
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
     alumno = {id: '0', nombre: '', apellido: '',grado:'',seccion:'',tutor:'',password:''};
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
        query = "INSERT INTO alumnos (nombre,apellido,grado,seccion,tutor,password) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.apellido,"','",req.body.grado,"','",req.body.seccion,"','",req.body.tutor,"','",req.body.password,"')");
        
    }
    else{
        query = "UPDATE alumnos SET nombre ='";
        query = query.concat(req.body.nombre,"', apellido ='",req.body.apellido,"',grado ='",req.body.grado,"',seccion ='",req.body.seccion,"',tutor ='",req.body.tutor,"',seccion ='",req.body.password,"'");
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
    var query; 
    if(req.session.buscar_curso){
        query = "SELECT * FROM cursos WHERE nombre LIKE '%"+req.session.buscar_curso+"%' "; 
    }
    else{
        query = "SELECT * FROM cursos "; 
    }
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
    var connection = conectar();
    connection.connect();
    var query = "SELECT * FROM profesores";
    var curso = {id: '0', nombre: '', grado: '',secciones: '',profesor:''};
    connection.query(query, function (error, results, fields) {
        if(req.session.auth){
            
            res.render("add_curso",{
                tipo: "AÑADIR",
                curso: curso,
                profesor: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });
    connection.end();

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
             var query2 = "SELECT * FROM profesores";
             
             connection2.query(query2, function (error, results, fields) {
                
                if(req.session.auth){
                    res.render("add_curso",{
                        tipo: "EDITAR",
                        curso: results2[0],
                        profesor: results,
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
        query = "INSERT INTO cursos (nombre,grado,secciones,profesor) VALUES('";
        query = query.concat(req.body.nombre,"','",req.body.grado,"','",req.body.secciones,"','",req.body.profesor,"')");
        
        var query_max ="SELECT Max(id) as max FROM cursos";
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
        query = query.concat(req.body.nombre,"', grado ='",req.body.grado,"', secciones ='",req.body.secciones,"', profesor ='",req.body.profesor,"'");
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

    var connection = conectar();
    connection.connect();
     var query = "SELECT * FROM cursos WHERE profesor='";
    query = query.concat(req.session.usuario,"'");
    
    connection.query(query, function (error, results, fields) {
        if(req.session.auth){
            res.render("profesor",{
                titulo: "Panel Profesor",
                profe: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });

});
app.get("/profesor/cursos", (req,res) => {

    var connection = conectar();
    connection.connect();
     var query = "SELECT * FROM cursos WHERE profesor='";
    query = query.concat(req.session.usuario,"'");
    
    connection.query(query, function (error, results, fields) {
        if(req.session.auth){
            res.render("profesor_cursos",{
                titulo: "Panel Profesor",
                profe: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });

});
app.post("/profesor/secciones", (req,res) => {

    var connection = conectar();
    connection.connect();
     var query = "SELECT * FROM cursos WHERE id='";
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
        var secciones = results[0].secciones;
        secciones = secciones.slice(0, -1);
         var array = secciones.split(",");
        if(req.session.auth){
            res.render("profesor_secciones",{
                titulo: "Panel Profesor",
                secciones: array,
                curso: results[0],
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });

});
app.post("/profesor/notas", (req,res) => {

        req.session.curso = req.body.curso;
        req.session.grado = req.body.grado;
        req.session.seccion = req.body.seccion;
        
        if(req.session.auth){
            res.redirect("/profesor/alumnos");
        }else{
            res.redirect("/login");
        }
});
app.get("/profesor/alumnos", (req,res) => {

    var connection = conectar();
    connection.connect();
    var connection2 = conectar();
    connection2.connect();
    var connection3 = conectar();
    connection3.connect();
    var query = "SELECT * FROM alumnos WHERE grado ='";
    query = query.concat(req.session.grado,"'and seccion = '",req.session.seccion,"'");
    connection.query(query, function (error, results, fields) { 

        var query2 = "SELECT * FROM rubricas WHERE id_curso ='";
        query2 = query2.concat(req.session.curso,"'");
         connection2.query(query2, function (error, results2, fields) { 
            
            var query = "SELECT * FROM notas WHERE id_curso ='";
            query = query.concat(req.session.curso,"'");
            connection3.query(query, function (error, results3, fields) { 
                if(req.session.auth){
                    res.render("profesor_alumnos",{
                        titulo: "Panel Profesor",
                        curso: req.session.curso,
                        alumno: results,
                        examen: results2,
                        notas: results3,
                        usuario : req.session.usuario
                    });
                }else{
                    res.redirect("/login");
                }
            });
        });
    });
});
app.post("/profesor/post_notas", (req,res) => {

    var connection = conectar();
    connection.connect();
    var connection2 = conectar();
    connection2.connect();
    var query = "SELECT * FROM notas WHERE id_alumno ='";
    query = query.concat(req.body.id_alumno,"'and id_curso = '",req.body.id_curso,"'");
    var query2;
    var notas = "";
    if(req.body.cant > 0)
    {
        notas = notas.concat(req.body.n0,",");
    }
    if(req.body.cant > 1)
    {
        notas = notas.concat(req.body.n1,",");
    }
    if(req.body.cant > 2)
    {
        notas = notas.concat(req.body.n2,",");
    }
    if(req.body.cant > 3)
    {
       notas = notas.concat(req.body.n3,",");
    }
    if(req.body.cant > 4)
    {
        notas = notas.concat(req.body.n4,",");
    }
    if(req.body.cant > 5)
    {
        notas = notas.concat(req.body.n5,",");
    }
    if(req.body.cant > 6)
    {
        notas = notas.concat(req.body.n6,",");
    }
    if(req.body.cant > 7)
    {
        notas = notas.concat(req.body.n7,",");
    }
    if(req.body.cant > 8)
    {
        notas = notas.concat(req.body.n8,",");
    }
    if(req.body.cant > 9)
    {
        notas = notas.concat(req.body.n9,",");
    }
    //sacar ultima coma
    notas = notas.slice(0, -1);
    connection.query(query, function (error, results, fields) {
        
        if(results.length > 0){//hay elementos solo editar
           
            var query2 = "UPDATE notas SET nota = '";
            query2 = query2.concat(notas,"'");
            query2 = query2.concat(" WHERE id = '",req.body.id,"'");
            connection2.query(query2);
            
        }
        else{
            var query3;
            query3 = "INSERT INTO notas (id_curso,nota,id_alumno) VALUES('"; 
            query3 = query3.concat(req.body.id_curso,"','",notas,"','",req.body.id_alumno,"')");
            connection2.query(query3);
            
        }
        if(req.session.auth){
            res.redirect("/profesor/alumnos");
        }else{
            res.redirect("/login");
        }
    });
});


app.get("/estudiante", (req,res) => {
    var connection = conectar();
    connection.connect();
    var connection2 = conectar();
    connection2.connect();
    var query;
    query = "SELECT * from alumnos WHERE id = "; 
    query = query.concat(req.session.id_usuario);
    
    query2 = "SELECT * from notas,cursos WHERE cursos.id = notas.id_curso AND notas.id_alumno = "; 
    query2 = query2.concat(req.session.id_usuario);
    
    connection.query(query, function (error, results, fields) { 
        connection2.query(query2, function (error, results2, fields) { 
            var c = 0;
            results2.forEach(function(notas) {
              var array = notas.secciones.split(",");
              var promedio = 0;
              var cont = 0 ;
              var n1 = 0;
              array.forEach(function(nt){
                cont++;
                promedio =  parseInt(nt)+ promedio;
              });
              promedio = promedio/cont;
              c++;

            });
            
            if(req.session.auth){
                res.render("estudiante",{
                    titulo: "Panel Estudiante",
                    usuario : req.session.usuario,
                    datos:results,
                    notas:results2
                });
            }else{
                res.redirect("/login");
            }
        });  
    });

});
app.get("/estudiante/rubrica", (req,res) => {
        var connection = conectar();
    connection.connect();
     var query = "SELECT cursos.nombre, cursos.id FROM cursos, alumnos WHERE alumnos.grado = cursos.grado AND alumnos.id ='"
    query = query.concat(req.session.id_usuario,"'");
    
    connection.query(query, function (error, results, fields) {
        
        if(req.session.auth){
            res.render("alumno_cursos",{
                titulo: "Panel Alumno",
                alumno: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });


});
app.post("/estudiante/ver_rubrica", (req,res) => {
        var connection = conectar();
    connection.connect();
     var query = "SELECT * FROM rubricas WHERE id_curso ='"
    query = query.concat(req.body.id,"'");
    
    connection.query(query, function (error, results, fields) {
       
        if(req.session.auth){
            res.render("alumno_rubricas",{
                titulo: "Panel Alumno",
                rubrica: results,
                usuario : req.session.usuario
            });
        }else{
            res.redirect("/login");
        }
    });


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
    var connection = conectar();
    connection.connect();
    var connection2 =conectar();
    connection2.connect();
    var connection3 =conectar();
    connection3.connect();
    var tipo = "ninguno";
    var resultados = 0;

    var query = "SELECT * FROM usuarios WHERE user='";
    query = query.concat(req.body.user,"' AND password = '",req.body.pass,"'");
    
    connection.query(query, function (error, results, fields) {
        if (error) throw error;

        if(results.length == 1){

            req.session.tipo = "administrador";
            req.session.auth = 1;
            req.session.usuario = results[0].user;
            res.send({
                status : 1,
                nombre : results[0].user
            });
        }else{
            var query = "SELECT * FROM profesores WHERE nombre='";
            query = query.concat(req.body.user,"' AND password = '",req.body.pass,"'");
            
            connection2.query(query, function (error, results, fields) {
                if(results.length == 1){

                    req.session.tipo = "profesor";
                    req.session.auth = 1;
                    req.session.usuario = results[0].nombre;
                    res.send({
                        status : 1,
                        nombre : results[0].user
                    });
                }else{
                    var query = "SELECT * FROM alumnos WHERE nombre='";
                    query = query.concat(req.body.user,"' AND password = '",req.body.pass,"'");
                    
                    connection3.query(query, function (error, results, fields) {
                        if(results.length == 1){

                            req.session.tipo = "estudiante";
                            req.session.auth = 1;
                            req.session.usuario = results[0].nombre;
                            req.session.id_usuario =results[0].id;
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
                }
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