// Obtener elementos del DOM
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

// Inicializar el almacenamiento local
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

// Función para crear un nuevo elemento de tarea
function createTodoItem() {
    if (todoValue.value.trim() === "") {
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
        <input type="checkbox" class="todo-checkbox" onchange="toggleComplete(this)" />
        <div class="todo-text">${todoValue.value}</div>
        <div>
            <img class="edit todo-controls" onclick="updateTodoItem(this)" src="images/pencil.png" />
            <img class="delete todo-controls" onclick="deleteTodoItem(this)" src="images/delete.png" />
        </div>`;
    
    li.innerHTML = todoItems; // Agregar contenido al elemento de lista
    listItems.appendChild(li); // Añadir el nuevo elemento a la lista

    // Agregar la tarea al array y actualizar el almacenamiento local
    todo.push({ item: todoValue.value, status: false });
    setLocalStorage(); // Asegúrate de que esta función esté correctamente implementada
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

// Función para leer los elementos de tarea desde el almacenamiento local
function readTodoItems() {
    listItems.innerHTML = ""; // Limpiar la lista actual
    todo.forEach(item => {
        let li = document.createElement("li");
        const todoItems = `
            <input type="checkbox" class="todo-checkbox" onchange="toggleComplete(this)" ${item.status ? 'checked' : ''} />
            <div class="todo-text" style="text-decoration: ${item.status ? 'line-through' : 'none'};">${item.item}</div>
            <div>
                <img class="edit todo-controls" onclick="updateTodoItem(this)" src="images/pencil.png" />
                <img class="delete todo-controls" onclick="deleteTodoItem(this)" src="images/delete.png" />
            </div>`;
        
        li.innerHTML = todoItems; // Agregar contenido al elemento de lista
        listItems.appendChild(li); // Añadir el nuevo elemento a la lista
    });
}

// Cargar tareas desde el almacenamiento local al iniciar
readTodoItems();

// Variable global para almacenar el elemento que se está editando
let updateText = null;

// Función para guardar la tarea actualizada
function UpdateOnSelectionItems() {
    const newValue = todoValue.value.trim(); // Obtener el nuevo valor y eliminar espacios
    let isPresent = todo.some(element => element.item === newValue); // Verificar si el nuevo valor ya existe

    if (isPresent) {
        setAlertMessage("¡Este elemento ya está en la lista!");
        return; // Salir de la función
    }

    // Actualizar el texto de la tarea existente
    todo.forEach(element => {
        if (element.item === updateText.innerText.trim()) {
            element.item = newValue; // Actualizar el texto
        }
    });

    console.log("Tareas después de actualizar:", todo); // Mostrar el estado del array después de la actualización
    setLocalStorage(); // Actualizar el almacenamiento local

    updateText.innerText = newValue; // Actualizar el texto en el DOM
    addUpdate.setAttribute("onclick", "createTodoItem()"); // Cambiar la función del botón
    addUpdate.setAttribute("src", "/images/plus.png"); // Restablecer la imagen del botón
    todoValue.value = ""; // Limpiar el campo de entrada
    setAlertMessage("¡Elemento de tarea actualizado con éxito!"); // Mensaje de éxito
}



function updateTodoItem(e) {
    // Eliminar la clase de edición de todas las tareas
    const allItems = document.querySelectorAll('#list-items li div');
    allItems.forEach(item => item.classList.remove('editing'));

    const itemText = e.parentElement.parentElement.querySelector("div").innerText; // Obtener el texto de la tarea
    todoValue.value = itemText; // Establecer el texto en el campo de entrada
    updateText = e.parentElement.parentElement.querySelector("div"); // Guardar referencia al texto actualizado
    updateText.classList.add('editing'); // Añadir clase de edición al elemento

    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()"); // Cambiar la función del botón
    addUpdate.setAttribute("src", "/images/refresh.png"); // Cambiar la imagen del botón a refrescar
    todoValue.focus(); // Enfocar el campo de entrada
}



// Función para eliminar una tarea
function deleteTodoItem(e) {
    const deleteValue = e.parentElement.parentElement.querySelector(".todo-text").innerText.trim(); // Obtener el texto de la tarea y eliminar espacios
    console.log("Intentando eliminar:", deleteValue); // Mostrar el texto que se intenta eliminar
    if (confirm(`¿Estás seguro de que deseas eliminar "${deleteValue}"?`)) {
        // Filtrar la tarea del array
        todo = todo.filter(element => element.item.trim() !== deleteValue); // Comparar sin espacios
        console.log("Tareas después de eliminar:", todo); // Mostrar el estado del array después de la eliminación
        setLocalStorage(); // Actualizar el almacenamiento local

        // Eliminar el elemento de la lista
        e.parentElement.parentElement.remove(); 
        setAlertMessage("¡Elemento de tarea eliminado con éxito!"); // Mensaje de éxito
    }
}

//Funcionar para manejar el cambio de estado
function toggleComplete(checkbox) {
    const todoTextElement = checkbox.parentElement.querySelector('.todo-text');
    const todoItemText = todoTextElement.innerText;

    todo.forEach(element => {
        if (element.item === todoItemText) {
            element.status = checkbox.checked; // Actualiza el estado
            todoTextElement.style.textDecoration = checkbox.checked ? 'line-through' : 'none'; // Cambia el estilo
        }
    });

    setLocalStorage(); // Actualizar el almacenamiento local
}
