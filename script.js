// Obtener elementos del DOM
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

// Inicializar el almacenamiento local
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

// Función para crear un nuevo elemento de tarea
function createTodoItem() {
    if (todoValue.value === "") {
        setAlertMessage("¡Por favor, ingresa tu tarea!");
        todoValue.focus(); // Enfocar el campo de entrada
        return; // Salir de la función
    }

    // Verificar si la tarea ya existe
    let isPresent = todo.some(element => element.item === todoValue.value);
    if (isPresent) {
        setAlertMessage("¡Este elemento ya está en la lista!");
        return; // Salir de la función
    }

    // Crear un nuevo elemento de lista
    let li = document.createElement("li");
    const todoItems = `
        <div title="Haz doble clic para completar" ondblclick="completeTodoItem(this)">${todoValue.value}</div>
        <div>
            <img class="edit todo-controls" onclick="updateTodoItem(this)" src="images/pencil.png" />
            <img class="delete todo-controls" onclick="deleteTodoItem(this)" src="images/delete.png" />
        </div>`;
    
    li.innerHTML = todoItems; // Agregar contenido al elemento de lista
    listItems.appendChild(li); // Añadir el nuevo elemento a la lista

    // Agregar la tarea al array y actualizar el almacenamiento local
    todo.push({ item: todoValue.value, status: false });
    setLocalStorage();
    setAlertMessage("¡Elemento de tarea creado con éxito!"); // Mensaje de éxito
    todoValue.value = ""; // Limpiar el campo de entrada
}

// Función para guardar en el almacenamiento local
function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo)); // Guardar el array como JSON
}

// Función para mostrar mensajes de alerta
function setAlertMessage(message) {
    todoAlert.innerText = message; // Establecer el mensaje
    setTimeout(() => {
        todoAlert.innerText = ""; // Limpiar el mensaje después de 3 segundos
    }, 3000);
}