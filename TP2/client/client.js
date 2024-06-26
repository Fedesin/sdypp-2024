const args = process.argv.slice(2);
if (args.length > 1) {
	console.log('Uso: node client.js <ip_servidor_tareas_genericas>');
	process.exit(1);
}

const HOST_IP = args[0] ?? 'localhost';

const URL = `http://${HOST_IP}:3000/api/execute`;

async function callTask(url) {
	try {
		const sumParams = {
			image: 'fedesin31/tp2-task-suma',
			port: 5000,
			task: 'sum',
			tag: 'latest',
			params: [1, 2, 3, 4],
		};

		const multParams = {
			image: 'fedesin31/tp2-task-multiplicacion',
			port: 5001,
			task: 'multiplication',
			tag: 'latest',
			params: [1, 2, 3, 4],
		};

		console.log('Ejecutando tareas remotas...');

		const sumResponse = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(sumParams),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const multResponse = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(multParams),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const sumResult = await sumResponse.json();
		const multResult = await multResponse.json();

		return { sumResult, multResult };
	} catch (error) {
		console.log('E');
		console.error(error);
		return {
			time: new Date().toISOString(),
			status: 'ERROR',
			message: 'Error al ejecutar la tarea',
		};
	}
}

callTask(URL).then(({ sumResult, multResult }) => {
	console.log(sumResult);
	console.log(multResult);
});
