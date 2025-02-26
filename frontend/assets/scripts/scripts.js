const API_URL = "http://localhost:3000"; // si ustedes levantan el backend en otro puerto deben cambiar esto

async function cargarClientes() {
    const response = await fetch(`${API_URL}/clientes`);
    const clientes = await response.json();

    let dropdown = document.getElementById("clientesDropdown");
    dropdown.innerHTML = '<option value="">Selecciona un cliente</option>';
    clientes.forEach(cliente => {
        dropdown.innerHTML += `<option value="${cliente.id}">${cliente.nombre}</option>`;
    });
}

// Cargar productos en el dropdown
async function cargarProductos() {
    const response = await fetch(`${API_URL}/productos`);
    const productos = await response.json();

    let dropdown = document.getElementById("productosDropdown");
    dropdown.innerHTML = '<option value="">Selecciona un producto</option>';
    productos.forEach(producto => {
        dropdown.innerHTML += `<option value="${producto.id}" data-precio="${producto.precio}">${producto.nombre}</option>`;
    });
}

// Cargar pedidos en la tabla
async function cargarPedidos() {
    const response = await fetch(`${API_URL}/pedidos`);
    const pedidos = await response.json();

    let tabla = document.getElementById("pedidosTable");
    tabla.innerHTML = "";
    pedidos.forEach(pedido => {
        let row = `<tr>
            <td>${pedido.pedido_id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.producto}</td>
            <td>${pedido.cantidad}</td>
            <td>$${pedido.subtotal.toFixed(2)}</td>
        </tr>`;
        tabla.innerHTML += row;
    });
}

// Registrar nuevo cliente
async function registrarCliente() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;

    if (!nombre || !email) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    });

    alert("Cliente registrado con éxito.");
    cargarClientes();

    nombre.value = "";
    email.value = ""
}

// Crear un pedido
async function crearPedido() {
    const clientesDropdown = document.getElementById("clientesDropdown");
    const productosDropdown = document.getElementById("productosDropdown");
    const cantidadInput = document.getElementById("cantidad");

    const clientes_id = clientesDropdown.value;
    const productos_id = productosDropdown.value;
    const cantidad = parseInt(cantidadInput.value);
    const precio = parseFloat(productosDropdown.options[productosDropdown.selectedIndex].dataset.precio);

    if (!clientes_id || !productos_id || cantidad <= 0) {
        alert("Debes seleccionar un cliente, un producto y una cantidad válida.");
        return;
    }

    const subtotal = cantidad * precio;

    await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clientes_id,
            productos: [{ productos_id, cantidad, subtotal }]
        })
    });

    alert("Pedido creado con éxito.");
    cargarPedidos();

    clientesDropdown.value = "";
    productosDropdown.value = "";
    cantidadInput.value = "";
}

// Cargar datos iniciales al abrir la página
cargarClientes();
cargarProductos();
cargarPedidos();
