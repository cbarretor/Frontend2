$(document).ready(function () {
    jQuery.support.cors = true; 

    // GET para actualizar la tabla de Gamas
    $("#upd-gama").click(function (){
        var urlServicio = "http://140.238.187.96:8080/api/Gama/all";
        $("#gama-table tbody").empty();
        $.ajax({
            url: urlServicio,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,

            success: function (result) {
                var i = 0;
                var nombre = "";
                var descripcion = "";
                var car;
                var salidaFila = "";

                $("#gama-table tbody").empty();

                salidaFila = "<tr><th>Nombre</th><th>Descripción</th><th>Carros</th><th class='accionTd'>Acción</th></tr>";
                $("#gama-table tbody").append(salidaFila);

                for (i = 0; i < result.length; i++) {
                    nombre = result[i]["name"];                    
                    descripcion = result[i]["description"];
                    car = result[i]["cars"];

                    for (var j = 0; j<car.length;  j++){
                        if (JSON.stringify(car) != "[]"){
                            delete car[j]["idCar"]
                            //delete car[j]["gama"]["idGama"];
                            for (var k = 0; k < car[j]["reservations"].length;  k++){
                                //delete car[j]["reservations"][k]["idReservation"]
                                //delete car[j]["reservations"][k]["client"]["idGama"];
                                delete car[j]["reservations"][k]["client"]["password"];
                                delete car[j]["reservations"][k]["client"]["age"];
                            }
                            for (var k = 0; k<car[j]["messages"].length;  k++){
                                delete car[j]["messages"][k]["idMessage"];
                            }
                        }
                    }
                    
                    car = JSON.stringify(car);

                    salidaFila = "<tr><td>" + nombre + "</td><td>" + descripcion + "</td><td>" +
                        car + "</td><td>" + "<button class='button del-button' onclick='deleteGama("+ result[i]["idGama"] +")'>Borrar</button>" + 
                        "<a href='#container-all' onclick='getId("+ result[i]["idGama"] +")'><button class='button' id='btn-abrir-popup' onclick='updateGama("+ result[i]["idGama"] +")'> Editar </button></a>" + "</td><tr>";

                    $("#gama-table tbody").append(salidaFila);

                }//Fin del for
            }
        })
    })

    // POST para agregar una gama
    $("#Add-Gama").click(function (){
        var urlServicio = "http://140.238.187.96:8080/api/Gama/save";
        var name = $("#Name-Gama").val();
        var description = $("#Description-Gama").val();
        if (name != "" && description != ""){
            $.ajax({
                url: urlServicio,
                type: "POST",
                data: JSON.stringify({ "name":name, "description":description}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                success: function(){
                    alert("Se ha agregado");
                    $("#Name-Gama").val("");
                    $("#Description-Gama").val("");
                }
            });   
            return false;
        }
    })
})

// DELETE para eliminar una Gama
function deleteGama(id){
    alert("El proceso de eliminar es satisfactorio si no hay reservaciones activas asociadas")
    var urlServicio = "http://140.238.187.96:8080/api/Gama/";
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
function updateGama(idGama){
    $("#btn-upd-gama").click(function () {
        var urlServicio = "http://140.238.187.96:8080/api/Gama/update";
        var name = $("#Name-upd-gama").val();
        var description = $("#Description-upd-gama").val();
        if (name != "" && description != ""){
            $.ajax({
                url: urlServicio,
                type: "PUT",
                data: JSON.stringify({ "idGama":idGama, "name":name, "description":description}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                
                success: (function(){
                    idGama = 0;
                    $("#Name-upd-gama").val("");
                    $("#Description-upd-gama").val("");
                })
            })
        }else{
            alert("Todos los campos son obligatorios");
        }
        
    })
    
}


//GET por id
function getId(id){
    var urlServicio = "http://140.238.187.96:8080/api/Gama/";
    var name;
    var description;
    $.ajax({
        url: urlServicio+id,
        type: "GET",

        success: (function(result){
            name = result["name"];
            description = result["description"];
            
            $("#Name-upd-gama").val(name);
            $("#Description-upd-gama").val(description);
        })
    })
}