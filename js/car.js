$(document).ready(function () {
    jQuery.support.cors = true;
    
    // Para actualizar el menu de selección de Gama
    $.ajax({
        url: "http://140.238.187.96:8080/api/Gama/all",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,

        success: function (result) {
            var gamaSelect = "<option hidden value=''>Seleccionar Gama</option>";  
            $("#Gama-Car").empty();
            $("#Gama-Car").append(gamaSelect);          
            for (var i = 0; i < result.length; i++) {
                gamaSelect += "<option value='"+ result[i]["idGama"] +"'>"+ result[i]["name"] +"</option>";
                $("#Gama-Car").empty();
                $("#Gama-Car").append(gamaSelect);

            }//Fin del for
        }
    })

    // GET para actualizar la tabla de carros
    $("#upd-table-car").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Car/all";
        $("#table-car tbody").empty();
        $.ajax({
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
        
            success: function (result) {
                var i = 0;
                var nombre = "";
                var marca = "";
                var año = 0;
                var descripcion = "";
                var gama;
                var mensajes;
                var reservaciones;
                var salidaFila = "";

                $("#table-car tbody").empty();

                salidaFila = "<tr><th>Nombre</th><th>Marca</th><th>Año</th><th>Descripción</th><th>Gama</th><th>Mensajes</th><th>Reservaciones</th><th class='accionTd'>Acción</th></tr>";
                $("#table-car tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    nombre = result[i]["name"];
                    marca = result[i]["brand"];
                    año = result[i]["year"];
                    descripcion = result[i]["description"];
                    gama = result[i]["gama"];
                    mensajes = result[i]["messages"];
                    reservaciones = result[i]["reservations"];
                    
                    for (var k = 0;  k<reservaciones.length;  k++){
                        if (JSON.stringify(reservaciones) != "[]"){
                            //delete reservaciones[k]["idReservation"];
                            //delete reservaciones[k]["client"]["idClient"];
                            delete reservaciones[k]["client"]["password"];
                            delete reservaciones[k]["client"]["age"];
                        }
                    }

                    for (var j = 0;  j<mensajes.length;  j++){
                        if (JSON.stringify(mensajes) != "[]"){
                            delete mensajes[j]["idMessage"]
                        }
                    }
                    if(gama != null){
                        if (JSON.stringify(gama) != "[]"){
                            delete gama["idGama"];
                        }
                    }
                    gama = JSON.stringify(result[i]["gama"]);
                    mensajes = JSON.stringify(result[i]["messages"]);
                    reservaciones = JSON.stringify(result[i]["reservations"]);
                    salidaFila = "<tr><td>" + nombre + "</td><td>" +
                        marca + "</td><td>" + año + "</td><td>" + descripcion + "</td><td>" +
                        gama + "</td><td>" + mensajes + "</td><td>" + reservaciones + "</td><td>" + "<button class='button del-button' onclick='deleteCar("+ result[i]["idCar"] +")'>Borrar</button>" + "<a href='#container-all' onclick='getId("+ result[i]["idCar"] +")'><button class='button' id='btn-abrir-popup' onclick='updateCar("+ result[i]["idCar"] +")'> Editar </button></a>" + "</td><tr>";

                    $("#table-car tbody").append(salidaFila);

                }//Fin del for
                            //Fin del selector success del AJAX
            }
        });
    })


    // POST para agregar un carro
    $("#Agregar-Carro").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Car/save";
        var name = $("#Name-Car").val();
        var marca = $("#Brand-Car").val();
        var año = parseInt($("#Year-Car").val());
        var descripcion = $("#Description-Car").val();
        var gama = $("#Gama-Car").val();
        if (name != "" && marca != "" && año != "" && descripcion != "" && gama != "") {
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "brand":marca, "year":año, "description":descripcion, "gama":{"idGama":gama} }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                    success: function () {
                        alert("Se ha agregado");
                        $("#Name-Car").val("");
                        $("#Brand-Car").val("");
                        $("#Year-Car").val("");
                        $("#Description-Car").val("");
                        $("#Gama-Car").val("");
                    }
            });  
            return false;
        } 
    })
})

// DELETE para eliminar un carro
function deleteCar(id){
    alert("El proceso de eliminar es satisfactorio si no hay reservaciones activas asociadas")
    var urlServicio = "http://140.238.187.96:8080/api/Car/";
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
function updateCar(idCarro){
    $("#btn-upd-car").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Car/update";
        var name = $("#Name-upd-car").val();
        var brand = $("#Brand-upd-car").val();
        var year = parseInt($("#Year-upd-car").val());
        var description = $("#Description-upd-car").val();
        if (name != "" && brand != "" && year != "" && description != ""){
            $.ajax({
                url: urlServicio,
                type: "PUT",
                data: JSON.stringify({ "idCar":idCarro, "name":name, "brand":brand, "year":year, "description":description}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                
                success: (function(){
                    idCarro = 0;
                    $("#Name-upd-car").val("");
                    $("#Brand-upd-car").val("");
                    $("#Year-upd-car").val("");
                    $("#Description-upd-car").val("");
                })
            })
        }else{
            alert("Todos los campos son obligatorios");
        }
        
    })
    
}


//GET por id
function getId(id){
    var urlServicio = "http://140.238.187.96:8080/api/Car/";
    var name;
    var brand;
    var year;
    var description;
    $.ajax({
        url: urlServicio+id,
        type: "GET",

        success: (function(result){
            name = result["name"];
            brand = result["brand"];
            year = result["year"];
            description = result["description"];

            $("#Name-upd-car").val(name);
            $("#Brand-upd-car").val(brand);
            $("#Year-upd-car").val(year);
            $("#Description-upd-car").val(description);
        })
    })
}