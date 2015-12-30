var express = require('express');
var http = require('http');
var router = express.Router();

var i = 0;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', function(req, res) {
   //El modulo 'fs' (File System) que provee Nodejs nos permite manejar los archivos
    var fs = require('fs');

    var path = req.files.archivo.path;
    var newPath = 'fotos/carpetaArchivos'+i+".jpg";
    i++;

    var is = fs.createReadStream(path);
    var os = fs.createWriteStream(newPath);

    is.pipe(os);

    is.on('end', function() {
        //eliminamos el archivo temporal+
        fs.unlinkSync(path)
    });
   
    res.send('¡archivo subido!');
})

router.get('/city/search/:location', function(req, resp){
    var listaCadena = "";
    
    http.get("http://nominatim.openstreetmap.org/search.php?city=Zaragoza&format=json", function(res) {
        res.on('data', function(data){
            listaCadena+=data.toString('utf8');
            /*var lista = [];
            data = data.toString('utf8');
            var json = JSON.parse(data);
            
            for (i=0;i<json.length;i++){
                if(json[i].type=='city'){
                    lista.push(json[i]);
                }
            }
            
            resp.json(lista);*/
        });                
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
    
    console.log("==> "+listaCadena);
    var json = JSON.parse(listaCadena);
            
    for (i=0;i<json.length;i++){
        if(json[i].type=='city'){
            lista.push(json[i]);
        }
    }
            
    resp.json(lista);

})


module.exports = router;
