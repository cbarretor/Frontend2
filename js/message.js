$(document).ready(function () {
    jQuery.support.cors = true;
    
    // Para actualizar el menu de selección del cliente
    $.ajax({
        url: "http://140.238.187.96:8080/api/Client/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
    
        success: function (result) {    
            var clientSelect = "<option hidden value=''>Seleccionar Cliente</option>";   
            $("#Client-Message").empty();
            $("#Client-Message").append(clientSelect);  
            for (var i = 0; i < result.length; i++) {     
                clientSelect += "<option value='"+ result[i]["idClient"] +"'>"+ result[i]["name"] +"</option>";
                $("#Client-Message").empty();
                $("#Client-Message").append(clientSelect);
    
            }//Fin del for
        }
    })

    // Para actualizar el menu de selección del Carro
    $.ajax({
        url: "http://140.238.187.96:8080/api/Car/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        
        success: function (result) {    
            var carSelect = "<option hidden value=''>Seleccionar Carro</option>";  
            $("#Car-Message").empty();
            $("#Car-Message").append(carSelect);

            for (var i = 0; i < result.length; i++) {
                carSelect += "<option value='"+ result[i]["idCar"] +"'>"+ result[i]["name"] +"</option>";
                $("#Car-Message").empty();
                $("#Car-Message").append(carSelect);
    
            }//Fin del for
        }
    })

    // GET para actualizar la tabla de Mensaje
    $("#upd-message").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Message/all";
        $("#Message-Table tbody").empty();
        $.ajax({
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,

            success: function (result) {
                var i = 0;
                var mensaje = "";
                var car;
                var client;
                var salidaFila = "";

                $("Message-Table tbody").empty();

                salidaFila = "<tr><th>Mensaje</th><th>Carro</th><th>Cliente</th><th class='accionTd'>Acción</th></tr>";
                $("#Message-Table tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    mensaje = result[i]["messageText"];
                    car = result[i]["car"];
                    client = result[i]["client"];

                    if (JSON.stringify(car) != "[]"){
                        delete car["idCar"];
                        if(car["gama"] != null) {
                            delete car["gama"]["idMessage"];
                        }
                    }
                    if (JSON.stringify(client) != "[]"){
                        //delete client["idClient"];
                        delete client["password"];
                        delete client["age"];
                    }

                    car = JSON.stringify(result[i]["car"]);
                    client = JSON.stringify(result[i]["client"]);

                    salidaFila = "<tr><td>" + mensaje + "</td><td>" +
                        car + "</td><td>" + client + "</td><td>" + "<button class='button del-button' onclick='deleteMessage("+ result[i]["idMessage"] +")'>Borrar</button>" + 
                        "<a href='#container-all' onclick='getId("+ result[i]["idMessage"] +")'><button class='button' id='btn-abrir-popup' onclick='updateMessage("+ result[i]["idMessage"] +")'> Editar </button></a>" + "</td><tr>";

                    $("#Message-Table tbody").append(salidaFila);

                }//Fin del for


                //Fin del selector success del AJAX
            }
        });
    })

    // POST para agregar un mensaje
    $("#Agregar-Mensaje").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Message/save";
        var message = $("#Message").val();
        var client = $("#Client-Message").val();
        var car = $("#Car-Message").val();   
        if (message != "" && client != "" && car != "") {
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "messageText":message, "client":{"idClient":client}, "car":{"idCar":car}}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function () {
                    alert("Se ha agregado");
                    $("#Message").val("");
                    $("#Client-Message").val("");
                    $("#Car-Message").val("");
                }
            });
            return false;
        }
    })
})

// DELETE para eliminar un carro
function deleteMessage(id){
    alert("El proceso de eliminar es satisfactorio si no hay reservaciones activas asociadas")
    var urlServicio = "http://140.238.187.96:8080/api/Message/";
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
function updateMessage(idMessage){
    $("#btn-upd-message").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Message/update";
        var message = $("#Text-upd-message").val();
        if (message != "" ){
            $.ajax({
                url: urlServicio,
                type: "PUT",
                data: JSON.stringify({ "idMessage":idMessage, "messageText":message}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                
                success: (function(){
                    idMessage = 0;
                    $("#Text-upd-message").val("");
                })
            })
        }else{
            alert("Todos los campos son obligatorios");
        }
        
    })
    
}

//GET por id
function getId(id){
    var urlServicio = "http://140.238.187.96:8080/api/Message/";
    var message;
    $.ajax({
        url: urlServicio+id,
        type: "GET",

        success: (function(result){
            message = result["messageText"];
            $("#Text-upd-message").val(message);
        })
    })
}