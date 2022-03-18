// 1 - Declaramos express
const express = require('express');
const app = express();

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({
	extended: false
}));
//Usaremos json
app.use(express.json()); 

//3- Declaramos la ruta absoluta de dotenv
const dotenv = require('dotenv');
dotenv.config({
	path: './env/.env'
});

//4 -definimos la ruta absoluta de los directorios css, js y img
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

//5 - Establecemos el motor de plantillas
app.set('view engine', 'ejs');

//6 - Establecemos el hash a utilizar (MD5)
var md5 = require('md5');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// 8 - Importamos el archivo de conexion a la base de datos
const connection = require('./config/config');
const {
	reduceRight
} = require('async');

//9 - establecemos las rutas
app.get('/login', (req, res) => {
	res.render('login.html');
});


const puerto = process.env.PORTNUMBER;
var idusuario;
var nivelusuario;
var datos;
var array;


//10 - Metodo para la autenticacion y las llamadas de datos a las vistas
app.post('/auth', async (req, res) => {
	const user = req.body.user;
	const pass = req.body.pass;
	const reporte = req.body.reg_reporte;
	const enviar = req.body.reg_enviar;
	const exportar = req.body.exportar;
	if (user && pass) {
		connection.query('SELECT * FROM administrador WHERE nombre_admin = ? AND password_admin = ?', [user, md5(pass)], async (error, results, fields) => {
			if (results.length == 0) {
				res.render('login.html', {
					alert: true,
					alertTitle: "Error",
					alertMessage: "Usuario y/o contraseña incorrecta",
					alertIcon: 'error',
					showConfirmButton: true,
					timer: false,
					ruta: 'login'
				});
		
			} else {
				//creamos una var de session y le asignamos true si INICIO SESSION      
				req.session.loggedin = true;
				req.session.name = results[0].nombre_admin;
				nombreusuario = results[0].nombre_completo;
				idusuario = results[0].id_admin;
				nivelusuario = results[0].nivel_admin;
				res.render('login.html', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon: 'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: '',
					resultado : array,
					titulos: array
				});
			}
			res.end();
		});
	}

	// procedimiento para la llamada de datos
	if (reporte && enviar) {
		var sql = 'SELECT * FROM ' + reporte;
		connection.query(sql, function (error, results, fields) {
			if (results.length != 0) {
				comprobacion = true;
				res.render('index.html', {
					login: true,
					name: req.session.name,
					nombre: nombreusuario,
					resultado: results,
					titulos: Object.keys(results[0]),
					data: datos,
				});
			} else {
				res.render('index.html', {
					alert: true,
					alertTitle: "Error",
					alertMessage: "Debe seleccionar un reporte",
					alertIcon: 'error',
					showConfirmButton: false,
					timer: false,
					ruta: ''
				});
			}
			res.end();
		});
	}
});

//11 - Método para llenar el select box con la llamada a las vistas
app.get('/', (req, res) => {
	if (req.session.loggedin) {
		var sql = "SELECT table_name AS vista,REPLACE(table_name, 'administrativo_', ' ') AS nombre FROM information_schema.tables where table_type='VIEW' AND table_name LIKE '" + process.env.VIEWNAME +"'";
		connection.query(sql, function (err, data, fields) {
			if (err) throw err;
			datos = data;
			res.render('index.html', {
				login: true,
				name: req.session.name,
				nombre: nombreusuario,
				data: datos,
				resultado : array,
				titulos : array
			});
		});

	} else {
		res.render('index.html', {
			login: false,
			name: 'Debe iniciar sesión',
		});
	}
	//res.end();
});




//12- función para limpiar la caché luego del logout
app.use(function (req, res, next) {
	if (!req.user)
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	next();
});


//13- FUncion para destruír la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
		res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});

//14- Metodo para imprimir el puerto en el que nos estamoms conectando
app.listen(puerto, (req, res) => {
	console.log('Servidor en linea corriendo en el puerto: ' + puerto);
});