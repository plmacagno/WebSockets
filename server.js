const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const events = require("./routes/socket_events");
const { engine } = require('express-handlebars');
const { router, products, messages } = require('./routes/router.js');
const fs = require('fs');
const Contenedor = require("./utils/contenedor");
const contenedor = new Contenedor("./data.json");
//const messages = contenedor.getAll();

const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

app.use(express.static('views'));

app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use('/', router);

io.on('connection', socket => {
	io.sockets.emit('products', products);
	io.sockets.emit(
		events.UPDATE_MESSAGES,
    "Bienvenido al WebSocket",
    messages
	);
	socket.on('newProduct', newProduct => {
		products.push(newProduct);
		io.sockets.emit('products', products);
	})

	socket.on(events.POST_MESSAGE, (msg) => {
		const _msg = {
		  ...msg, 
	//	  socket_id: socket.id,
	//	  likes: 0,
		  date: new Date().toLocaleString(),
		};
		contenedor.save(_msg);
		io.sockets.emit(events.NEW_MESSAGE, _msg);
	  });
	
	  socket.on(events.LIKE_MESSAGE, (msgId) => {
		const msg = contenedor.getById(msgId);
//		msg.likes++; // Incrementa el numero de likes
		contenedor.updateById(msgId, msg); // Actualiza el mensaje en el contenedor
		io.sockets.emit(
		  events.UPDATE_MESSAGES,
		  "Los mensajes se actualizaron",
		  contenedor.getAll() // Enviar el nuevo contenedor, array de mensajes
		);
	  });
	});
/*	socket.on('newMessage', newMessage => {
		messages.push(newMessage);
		fs.writeFileSync('./chat/chat.txt', JSON.stringify(messages));
		io.sockets.emit('chat', messages);
	})
});*/

const PORT = 8080;
const server = httpserver.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', () => console.log(`Error: ${err}`));