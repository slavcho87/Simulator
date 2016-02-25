# Instalación del proyecto

## Paso 1: instalar mongodb

Lo primero que tenemos que hacer es instalar mongodb. Los pasos para la instalación de mongodb depeden del tipo de sistema operativo que disponemos. Por esto no vamos a entrar en detalle de como se instala y vamos a seguir el tutorial disponible en la web oficial:

* Linux: https://docs.mongodb.org/manual/administration/install-on-linux/ 
* Windows: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/ 
* Max OS: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/ 

## Paso 2: instalar Nodejs y NPM

Vamos en la web oficial de nodejs (https://nodejs.org) y descargamos e instalamos la version v0.12.4. En el caso de Windows la instalación es igual que la de cualquier otro programa. Para más información visite https://nodejs.org/en/download/. 

A continuación tenemos que instalar el gestor de paquetes NPM. En el caso de Windows vamos en la web oficial (https://nodejs.org/en/download/) y nos descargamos e instalamos el ejecutable. En el caso de Linux ejecutamos el siguiente comando en la consola:

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
    
### Paso 4.1: Configuraciones basicas del simulador (baseConfig.json)   
    
En el fichero baseConfig.json disponemos de las siguientes basicas para el simulador como el puerto donde se ejecuta el servidor y la localizacion de la base de datos. Si editamos el fichero baseConfig.json veremos que tiene el siguiente contenido:

    {
        "port": 81,
        "locationDB": "localhost",
        "nameDB": "simulator"
    }
    
Las variables del fichero baseConfig.json tienen el siguiente significado:

* port: es el puerto donde se va a ejecutar el servidor
* locationDB: es la localizacion donde se va a ejecutar mongodb.  
* nameDB: es el nombre del esquema de la base de datos donde nos conectamos.

Dichas configuraciones son importantes ya que de esta forma tenemos la opción de llevarnos la base de datos en un servidor diferente para darle más potencia.

## Paso 5: Instalación del recomendador

### Paso 5.1: Instalar Apache maven

Antes de todo tenemos que instalar Apache maven que es un gestor de paquetes. Por lo tanto vamos en la web oficial (https://maven.apache.org/) y descargamos y descomprimimos el ficheros compromido. A continuación tenemos que añadir en la variable PATH la dirección de la carpeta donde hemos descomprimido maven. Para ver que maven se haya instalado correctamente ejecutamos el siguiente comando:

    mvn -v

De esta forma comprobamos la version de maven que tenemos instalado. Tenemos que ver una salida como la siguiente:

    Apache Maven 3.2.5 (12a6b3acb947671f09b81f49094c53f426d8cea1; 2014-12-14T18:29:23+01:00)
    Maven home: C:\maven
    Java version: 1.7.0_79, vendor: Oracle Corporation
    Java home: C:\Program Files (x86)\Java\jdk1.7.0_79\jre
    Default locale: es_ES, platform encoding: Cp1252
    OS name: "windows 8.1", version: "6.3", arch: "x86", family: "windows"

### Paso 5.2: Compilar el recomendador

Una vez que hayamos instalado maven correctamente tenemos que compilar el recomendador. Por esto ejecutamos el ficheros compilarRecommender que se encuentra en la carpeta scripts. Existen dos versiones: uno para Windows y otro para Linux.

### Paso 5.3: Configuraciones basicas del recomendador (configs/baseConfig.txt)
 
Si editamos el fichero configs/baseConfig.txt podemos ver que tiene el siguiente formato:

    <config>
      <host>http://localhost</host>
      <port>81</port>
      <hostMongo>localhost</hostMongo>
      <portMongo>27017</portMongo>
      <nameDB>simulator</nameDB>
    </config>

* host: es la dirección donde se ejecuta el simulador. En el ejempo este se está ejecutando en local
* port: es el puerto donde se ejecuta el simulador. En el ejemplo este se ejecuta en el puerto 81
* hostMongo: es la dirección de la base de datos. En el ejemplo esta se está ejecutando en local
* portMongo: es el puerto donde se ejecuta la base de datos.
* nameDB: es el nombre del equema de la base de datos

### Paso 5.4: Ejecutar el recomendador

Para ejecutar el recomendar tenemos que ejecutar el ficheros ejecutarRecommender que se encuentra en la carpeta scripts. Existe dos versiones de este fichero: uno para Windows y otro para Linux.