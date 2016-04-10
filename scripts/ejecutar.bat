@echo off
SET M2_HOME=../aplications/maven
SET M2=%M2_HOME%/bin
SET PATH=%M2%;%M2_HOME%

if "%PROCESSOR_ARCHITECTURE%" == "x86" ( 
	SET PATH=%PATH%;aplications/mongodb32bits/bin;aplications/nodejs32bits;
) ELSE (
	SET PATH=%PATH%;aplications/mongodb/bin;aplications/nodejs;
)

start mongod.exe --dbpath=aplications/data/db

start npm start

cd Recommender
start mvn exec:java -Dexec.mainClass=Server
cd ..