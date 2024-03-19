const net = require('net');
const http = require('http');

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
if (args.length !== 2) {
	console.log(
		'Uso: node program.js <ip_servidor_registro> <puerto_servidor_registro> '
	);
	process.exit(1);
}

const serverAddress = { host: 'localhost', port: 0 };
const remoteAddress = { host: args[0], port: parseInt(args[1]) };

// Crear servidor
const server = net.createServer((socket) => {
	console.log(
		'Cliente conectado desde',
		socket.remoteAddress + ':' + socket.remotePort
	);

	socket.on('data', (data) => {
		console.log('Mensaje recibido del cliente:', data.toString());
		// Respondemos al cliente
		const message = JSON.stringify({
			sended: new Date().toISOString(),
			message: `Saludos desde el servidor ${serverAddress.host}:${serverAddress.port}`,
		});
		socket.write(message);
	});

	socket.on('error', (err) => {
		console.error('Error en el cliente:', err.message);
	});
});

server.listen(0, serverAddress.host, () => {
	serverAddress.port = server.address().port;
	console.log(
		`Servidor TCP escuchando en ${serverAddress.host}:${serverAddress.port}`
	);
});

// Crear cliente y conectarse a servidor de contactos
function connectToContactServer() {
	const client = new net.Socket();

	client.connect(remoteAddress, () => {
		console.log(
			'Conexión establecida con servidor el servidor de contactos.'
		);
		const message = JSON.stringify({
			port: serverAddress.port,
			host: serverAddress.host,
		});
		client.write(message);
	});

	client.on('data', (data) => {
		console.log('Mensaje recibido desde el servidor:', data.toString());
		const { status, message, nodes } = JSON.parse(data.toString());
		if (status === 'OK') {
			console.log(message);
			if (params.nodes.length > 0) {
				console.log('Enviando saludos a los nodos...');
				handleHandshakes(nodes);
			} else {
				console.log(
					'Este es el primer nodo registrado en el servidor de contactos!'
				);
			}
		}

		if (status === 'ERROR') {
			console.log(message);
		}
	});

	client.on('error', () => {
		console.log(
			'Error en la conexión con el servidor de contactos. Intentando reconectar...'
		);
		setTimeout(connectToContactServer, 10000);
	});
}

// Envío de saludo a lista de nodos
function handleHandshakes(nodes) {
	nodes.map((node) => {
		connectToNode(node);
	});
}

// Crear cliente y conectarse al otro nodo
function connectToNode(node) {
	const client = new net.Socket();
	try {
		client.connect(node, () => {
			console.log('Conexión establecida con nodo ', node);
			const message = JSON.stringify(
				{
					sended: new Date().toISOString(),
					message: `Hola, soy un cliente tipo C. Conectado desde ${serverAddress.host}:${serverAddress.port}`,
				},
				null,
				2
			);
			client.write(message);
		});
	} catch (error) {
		console.error(
			`El nodo ${node} no está disponible. Error en la conexión`
		);
	}

	client.on('data', (data) => {
		console.log('Mensaje recibido desde el nodo ', node);
		console.log(data.toString());
		client.end();
	});

	client.on('error', (error) => {
		console.error('Error en la conexión con nodo ', node);
	});
}

connectToContactServer();