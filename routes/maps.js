var express = require('express');
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


module.exports = router;
