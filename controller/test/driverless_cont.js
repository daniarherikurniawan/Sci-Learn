var serialport = require('serialport');
var SerialPort = serialport;


// portName = '/dev/cu.usbmodem1421'
// var myPort = new SerialPort(portName, {
//    baudRate: 9600,
//    // look for return and newline at the end of each data packet:
//    parser: serialport.parsers.readline("\n")
//  });

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
   console.log(data);
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

module.exports = { 
	setSpeed: function(speed){
 		// list serial ports:
 		ports_str = '';
		serialport.list(function (err, ports) {
		   	// myPort.write(speed);
		});
	},
	
	getUpdate: function(res){
		myPort.on('data', function (data) {
		  console.log('Data: ' + data);
		  res.send(data);
		});
	},

 	setStreet: function(street ){
 		// list serial ports:
 		ports_str = '';
		serialport.list(function (err, ports) {
		  ports.forEach(function(port) {
		  	console.log(port.comName)
		    ports_str += port.comName;
		  });
		   	// myPort.write(street);
		});
	},

	

 	turnLeft: function(req, res ){
 		// list serial ports:
 		ports_str = '';
		serialport.list(function (err, ports) {
		  ports.forEach(function(port) {
		  	console.log(port.comName)
		    ports_str += port.comName;
		  });
			// res.send("on port: "+ portName);
		   	// myPort.write('l');
		});
	},
	turnRight: function(req, res ){
 		// list serial ports:
 		ports_str = '';
		serialport.list(function (err, ports) {
		  ports.forEach(function(port) {
		  	console.log(port.comName)
		    ports_str += port.comName;
		  });
			// res.send("on port: "+ portName);
		   	// myPort.write('r');
		});
	}
}
