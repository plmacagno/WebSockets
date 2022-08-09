const socket = io();

// Products form
const $formAddProduct = document.querySelector('#form-add-product');
const $listProducts = document.querySelector('#list-products');
const $nameInput = document.querySelector('#name-product');
const $priceInput = document.querySelector('#price-product');
const $imgInput = document.querySelector('#img-product');
const $tableProducts = document.querySelector('#table-products');

$formAddProduct.addEventListener('submit', e => {
	e.preventDefault();
	const newProduct = {
		name: $nameInput.value,
		price: $priceInput.value,
		img: $imgInput.value
	};
	socket.emit('newProduct', newProduct);
	e.target.reset();
	location.href = '/';
});

const renderProducts = products => {
	if (products.length > 0) $tableProducts.innerHTML = '';
	products.forEach(product => {
		$tableProducts.innerHTML += `
		<tr class="text-center">
			<td class="align-middle">${product.name}</td>
			<td class="align-middle">${product.price}</td>
			<td class="align-middle">
				<img src="${product.img}" alt="${product.name}" width="100px">
			</td>
		</tr>`;
	});
}

socket.on('products', products => {
	renderProducts(products);
});

socket.on("connect", () => {
	console.log("Conectado al servidor");
  });
  
  socket.on("UPDATE_MESSAGES", (msg, allMessages) => {
	// alert(msg);
	document.getElementById("posts").innerHTML = "";
	// for (let msg of allMessages) {
	//   appendMessage(msg);
	// }
	allMessages
	  .sort((a,b) => a.date - b.date)
	  .forEach(msg => appendMessage(msg));
  });
  
  socket.on("NEW_MESSAGE", (msg) => {
	appendMessage(msg);
  })
  
  function appendMessage(msg) {
	if (msg.nombre == '') return alert('Ingresa tu email');
	document.getElementById("posts").innerHTML += `
	  	<div>
			<b class="text-primary">${msg.nombre}</b>
			[<span style="color: brown;">${msg.date}</span>]
			: <i class="text-success">${msg.mensaje}</i>
		</div > `;
  }
  
  function enviarMensaje(){
	const nombre = document.getElementById("nombre").value;
	const mensaje = document.getElementById("mensaje").value;
  
	socket.emit("POST_MESSAGE", {nombre, mensaje});
  }
  
  function likeMessage(msgId) {
	socket.emit("LIKE_MESSAGE", msgId);
  }

// Chat form
/*const $chatForm = document.querySelector('#chat-form');
const $userEmail = document.querySelector('#user-email');
const $chatMessage = document.querySelector('#chat-message');
const $tableChat = document.querySelector('#table-chat');

$chatForm.addEventListener('submit', e => {
	e.preventDefault();
	if ($userEmail.value == '') return alert('Ingresa tu email');
	const newMessage = {
		userEmail: $userEmail.value,
		message: $chatMessage.value,
		date: new Date().toLocaleString()
	}
	socket.emit('newMessage', newMessage);
	e.target.reset();
});

const renderChat = messages => {
	if (messages.length > 0) $tableChat.innerHTML = '';
	messages.forEach(message => {
		$tableChat.innerHTML += `
		<div>
			<b class="text-primary">${message.userEmail}</b>
			[<span style="color: brown;">${message.date}</span>]
			: <i class="text-success">${message.message}</i>
		</div > `;
	})
	$chatMessage.focus();
}



socket.on('messages', messages => {
	renderChat(messages);
});*/