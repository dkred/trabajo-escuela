let form = document.querySelector("form");
let user = document.querySelector("#usuario");
let pass = document.querySelector("#pass");
let extra  = document.querySelector("#extra");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(user.value=="" || pass.value == ""){
        extra.innerHTML = "<div class=\"chip red white-text\">\n" +
            "Algunos campos vacios, favor de completarlos." +
            "                                <i class=\"close material-icons\">close</i>\n" +
            "                            </div>";
        user.value="";
        pass.value="";
        user.focus();
    }else{
        let xhr = new XMLHttpRequest();
        let params = "user=" + user.value + "&pass=" + pass.value;
        xhr.open("POST","/login");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.addEventListener("error", e => {
            extra.innerHTML = "<div class=\"chip red white-text\">\n" +
                "Ocurrio un error, intente mas tarde." +
                "                                <i class=\"close material-icons\">close</i>\n" +
                "                            </div>";
            user.value="";
            pass.value="";
        });
        xhr.addEventListener("readystatechange", e => {
            if(xhr.readyState == 3){
                extra.innerHTML = "<div class=\"chip yellow black-text\">\n" +
                    "Cargando..." +
                    "                                <i class=\"close material-icons\">close</i>\n" +
                    "                            </div>";
                user.value="";
                pass.value="";
            }
            if(xhr.readyState == 4 && xhr.status == 200){
                let respuesta = JSON.parse(xhr.response);
                if(respuesta.status == 1){
                    extra.innerHTML = "<div class=\"chip green black-text\">\n" +
                        "Completado." +
                        "                                <i class=\"close material-icons\">close</i>\n" +
                        "                            </div>";
                    user.value="";
                    pass.value="";
                    setTimeout(() => {
                        window.location.replace("/");
                    },10);
                }else{
                    extra.innerHTML = "<div class=\"chip red black-text\">\n" +
                        respuesta.status +
                        "                                <i class=\"close material-icons\">close</i>\n" +
                        "                            </div>";
                    user.value="";
                    pass.value="";
                }

            }
        });

        xhr.send(params);
    }
});