//Node server for hgt-to-stl program
//Listens on port 8081
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var exec = require('child_process').exec;
var config = require('./config');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(8080);

var counter = 0;

app.post("/",function(req,res){
	var b = req.body;
	//lat, long, width, height, verticalscale, rot, waterDrop, baseHeight

	var zipname  = "./stls/terrain-"+counter;
	var filename = "./stls/rawmodel-"+counter+".stl";

	var command = "./elevstl "+b.lat+" "+b.lng+" "+b.boxSize/3+" "
			+b.boxSize/3+" "+b.vScale+" "+b.rotation+" "+b.waterDrop+" "+b.baseHeight+" "+b.boxScale+" > "+filename;
	command += "; zip -q "+zipname+" "+filename+"; rm "+filename;
	console.log(command);

  //console.log(command);
	exec(command, function(error,stdout,stderr){
				 console.log(stderr||"STL created");
				 //
				 res.type("application/zip");
				 res.download(zipname+".zip");
			 });
	counter++;
	//res.render("preview.ejs",{filename:"/test.stl",width:b.boxSize/3,height:b.boxSize/3});
});

app.get("/test.stl",function(req,res){
	fs.readFile("test.stl",function(err,data){
		console.log(err);
		res.setHeader('Content-disposition', 'attachment; filename=' + "test.stl");
	  res.setHeader('Content-type', "application/sla");
	  res.writeHead(200);
		res.end(data);
	})
});
