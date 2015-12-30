var express = require('express');
var http = require('http');
var request = require('request');
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

/*
 * Search city by name
 */
router.get('/city/search/:location', function(req, resp){
    var city = req.params.location;
    
    request('http://nominatim.openstreetmap.org/search.php?city='+city+'&format=json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var lista = [];
            var json = JSON.parse(body);
            
            for (i=0;i<json.length;i++){    
                if(json[i].type=='city'){    
                    lista.push(json[i]);
                }
            }

            resp.json(lista);
        }
    })    
})

module.exports = router;
