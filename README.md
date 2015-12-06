# Instalación del proyecto

## Paso 1: instalar mongodb

Lo primero que tenemos que hacer es instalar mongodb. Los pasos para la instalación de mongodb depeden del tipo de sistema operativo que disponemos. Por esto no vamos a entrar en detalle de como se instala y vamos a seguir el tutorial disponible en la web oficial:

* Linux: https://docs.mongodb.org/manual/administration/install-on-linux/ 
* Windows: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/ 
* Max OS: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/ 

## Paso 2: instalar Nodejs y NPM

Vamos en la web oficial de nodejs (https://nodejs.org) y descargamos e instalamos el ejecutable. En el caso de Windows la instalación es igual que la de cualquier otro programa. Para más información visite https://nodejs.org/en/download/. 

A continuación tenemos que instalar el gestor de paquetes NPM. En el caso de Windows vamos en la web oficial (https://www.npmjs.com/) y nos descargamos e instalamos el ejecutable. En el caso de Linux ejecutamos el siguiente comando en la consola:

    sudo apt-get install npm

## Paso 3: instalar git
Git es un sistema distribuido de control de versiones. Para la instalación de este nos descargamos el ejecutable de https://git-scm.com/downloads y seguimos los pasos que nos indica este. 

## Paso 4: clonar el proyecto de github e instalarlo

A continuacion tenemos que clonar el proyecto del Simulador de github. Para esto abrimos una consola y nos situamos en el directorio donde queremos clonar el proyecto. A continuacion ejecutamos el siguiente comando:

    git clone https://github.com/slavcho87/Simulator

Vemos que se ha creado un directorio llamado Simulator. Lo primero que tenemos que hacer es bajarnos todas las dependencias del proyecto. Por esto ejecutamos el siguiente comando:

    npm install

Una vez que nos hemos clonado el proyecto y descargado las dependencias de este podemos arrancar el servidor mediante el siguiente comando:

    npm start
    
De esta forma tenemos arrancamos el servidor en el puerto 81 y para acceder tenemos que abrir un navegador web y acceder en localhost:81. Si queremos modificar el puerto donde se ejecuta el serividor tenemos que editar el fichero app.js diposponible en el directorio raiz del proyecto y buscar la sigueinte linea de codigo:

    var port = process.env.PORT || 81;
    
En este caso el número 81 indica el puerto donde se va a ejecutar el servidor. Asi que cambiando esta variable poniendo el puerto donde queremos que se ejecute el servidor y tenemos el puerto modificado. Lo unico que tenemos que hacer es reiniciar el serividor.
