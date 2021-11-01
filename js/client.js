$(document).ready(function () {
    jQuery.support.cors = true;

    // Para los mejores clientes de la empresa

    $.ajax({
        url: "http://140.238.187.96:8080/api/Reservation/report-clients",
        type: "GET",
        cache: false,
        success: function (result) {
            var table = "<tr><th><span>ID Cliente</span></th><th>Nombre</th><th>Reservas Completadas</th></tr>";
            var reservaciones;
            var clientId;
            var clientName;
            var count = 0;
            $("#Top-Clientes").hide();
            $("#Best-Client tbody").empty();
            for (var i = 0; i < result.length; i++) {
                count = result[i]["total"];
                reservaciones = result[i]["client"]["reservations"];
                clientId = result[i]["client"]["idClient"];
                clientName = result[i]["client"]["name"];

                if(count > 0){
                    $("#Top-Clientes").show();
                    table += "<tr><td>"+ clientId +"</td><td>"+ clientName +"</td><td>"+ count +"</td>/tr>";
                    $("#Best-Client tbody").empty();
                    $("#Best-Client tbody").append(table);
                }
            }
            
        }
    })

    // GET para actualizar la tabla de clientes
    $("#upd-client").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Client/all";
        $("#client-table tbody").empty();
        $.ajax({            
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,

            success: function (result) {
                var i = 0;
                var id = 0;
                var nombre = "";
                var email = "";
                var edad = 0;
                var mensajes;
                var reservaciones;
                var salidaFila = "";
                
                $("#client-table tbody").empty();

                salidaFila = "<tr><th>ID Cliente</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Mensajes</th><th>Reservaciones</th><th class='accionTd'>Acción</th></tr>";
                $("#client-table tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    id = result[i]["idClient"];
                    nombre = result[i]["name"];
                    email = result[i]["email"];
                    edad = result[i]["age"];
                    mensajes = result[i]["messages"];
                    reservaciones = result[i]["reservations"];

                    for (var j = 0; j<reservaciones.length; j++){
                        if (JSON.stringify(reservaciones) != "[]"){
                            //delete reservaciones[j]["idReservation"];
                            delete reservaciones[j]["car"]["idCar"];
                            if(reservaciones[j]["car"]["gama"] != null){
                                delete reservaciones[j]["car"]["gama"]["idGama"];
                            }
                            for (var k = 0; k<reservaciones[j]["car"]["messages"].length;  k++){
                                delete reservaciones[j]["car"]["messages"][k]["idMessage"];
                            }
                        }
                    }
                    for (var j = 0; j<mensajes.length; j++){
                        if (JSON.stringify(mensajes) != "[]"){
                            delete mensajes[j]["idMessage"];
                            delete mensajes[j]["car"]["idCar"];
                            if(mensajes[j]["car"]["gama"] != null){
                                delete mensajes[j]["car"]["gama"]["idGama"];
                            }
                        }
                    }
                    mensajes = JSON.stringify(result[i]["messages"]);
                    reservaciones = JSON.stringify(result[i]["reservations"]);

                    salidaFila = "<tr><td>" + id + "</td><td>" +
                        nombre + "</td><td>" + email + "</td><td>" + edad + "</td><td>" + mensajes + "</td><td>" + 
                        reservaciones + "</td><td>" + "<button class='button del-button' onclick='deleteClient("+ result[i]["idClient"] +")'>Borrar</button>" + 
                        "<a href='#container-all' onclick='getId("+ result[i]["idClient"] +")'><button class='button' id='btn-abrir-popup' onclick='updateClient("+ result[i]["idClient"] +")'> Editar </button></a>" + "</td><tr>";

                    $("#client-table tbody").append(salidaFila);

                }//Fin del ciclo for


                        //Fin del selector success del AJAX
            }
        });
    })

    // POST para agregar un cliente
    $("#Agregar-Cliente").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Client/save";        
        var name = $("#Client-Name").val();
        var email = $("#Client-Email").val();
        var password = $("#Client-Password").val();
        var age = parseInt($("#Client-Age").val());
        if (name != "" && email != "" && password != "" && age != NaN){
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "email":email, "password":password, "age":age }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function () {
                    alert("Se ha agregado");
                    $("#Client-Name").val("");
                    $("#Client-Email").val("");
                    $("#Client-Password").val("");
                    $("#Client-Age").val("");
                }
            });
            return false;
        }
    })
})

// DELETE para eliminar un carro
function deleteClient(id){
    alert("El proceso de eliminar es satisfactorio si no hay reservaciones activas asociadas")
    var urlServicio = "http://140.238.187.96:8080/api/Client/";
    urlServicio += id;
    $.ajax({
        url: urlServicio,
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
    });   
}
// PUT para actualizar un carro
function updateClient(idClient){
    $("#btn-upd-client").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Client/update";
        var name = $("#Name-upd-client").val();
        var age = $("#Age-upd-client").val();
        var password = $("#Password-upd-client").val();
        if (name != "" && age != "" && password != ""){
            $.ajax({
                url: urlServicio,
                type: "PUT",
                data: JSON.stringify({ "idClient":idClient, "name":name, "age":age, "password":password}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                
                success: (function(){
                    idClient = 0;
                    $("#Name-upd-client").val("");
                    $("#Age-upd-client").val("");
                    $("#Password-upd-client").val("");
                })
            })
        }else{
            alert("Todos los campos son obligatorios");
        }
        
    })
    
}

//GET por id
function getId(id){
    var urlServicio = "http://140.238.187.96:8080/api/Client/";
    var name;
    var age;
    var password;
    $.ajax({
        url: urlServicio+id,
        type: "GET",

        success: (function(result){
            name = result["name"];
            age = result["age"];
            password = result["password"];

            $("#Name-upd-client").val(name);
            $("#Age-upd-client").val(age);
            $("#Password-upd-client").val(password);
        })
    })
}