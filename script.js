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

// Función para leer los elementos de tarea desde el almacenamiento local
function readTodoItems() {
    todo.forEach(element => {
        let li = document.createElement("li");
        let style = element.status ? "style='text-decoration: line-through'" : ""; // Estilo si está completada
        const todoItems = `
            <div ${style} title="Haz doble clic para completar" ondblclick="completeTodoItem(this)">${element.item}</div>
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

// Función para guardar la tarea actualizada
function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item == todoValue.value) {
            IsPresent = true; // Verificar si la tarea ya está en la lista
        }
    });

    if (IsPresent) {
        setAlertMessage("¡Este elemento ya está en la lista!");
        return; // Salir de la función
    }

    todo.forEach((element) => {
        if (element.item == updateText.innerText.trim()) {
            element.item = todoValue.value; // Actualizar el texto
        }
    });
    setLocalStorage(); // Actualizar el almacenamiento local

    updateText.innerText = todoValue.value; // Actualizar el texto en el DOM
    addUpdate.setAttribute("onclick", "createTodoItem()"); // Cambiar la función del botón
    addUpdate.setAttribute("src", "/images/plus.png"); // Restablecer la imagen del botón
    todoValue.value = ""; // Limpiar el campo de entrada
    setAlertMessage("¡Elemento de tarea actualizado con éxito!"); // Mensaje de éxito
}

// Función para actualizar una tarea existente
function updateTodoItem(e) {
    const itemText = e.parentElement.parentElement.querySelector("div").innerText; // Obtener el texto de la tarea
    todoValue.value = itemText; // Establecer el texto en el campo de entrada
    addUpdate.setAttribute("onclick", "updateOnSelectionItems()"); // Cambiar la función del botón
    updateText = e.parentElement.parentElement.querySelector("div"); // Guardar referencia al texto actualizado
}

// Función para eliminar una tarea
function deleteTodoItem(e) {
    const deleteValue = e.parentElement.parentElement.querySelector("div").innerText; // Obtener el texto de la tarea
    if (confirm(`¿Estás seguro de que deseas eliminar "${deleteValue}"?`)) {
        e.parentElement.parentElement.remove(); // Eliminar el elemento de la lista
        todo = todo.filter(element => element.item !== deleteValue); // Filtrar la tarea del array
        setLocalStorage(); // Actualizar el almacenamiento local
        setAlertMessage("¡Elemento de tarea eliminado con éxito!"); // Mensaje de éxito
    }
}

// Función para completar una tarea
function completeTodoItem(e) {
    e.parentElement.querySelector("div").style.textDecoration = "line-through"; // Marcar como completada
    todo.forEach(element => {
        if (e.parentElement.querySelector("div").innerText.trim() === element.item) {
            element.status = true; // Cambiar el estado a completada
        }
    });
    setLocalStorage(); // Actualizar el almacenamiento local
    setAlertMessage("¡Elemento de tarea completado con éxito!"); // Mensaje de éxito
}
