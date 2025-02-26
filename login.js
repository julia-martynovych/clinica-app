// Verificar si hay cookies aceptadas
document.addEventListener("DOMContentLoaded", function() {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted === null) {
        document.getElementById("cookie-modal").style.display = "block";
    }
    
    // Comprobar si hay datos guardados
    if (localStorage.getItem("rememberedUser")) {
        const userData = JSON.parse(localStorage.getItem("rememberedUser"));
        document.getElementById("username").value = userData.username;
        document.getElementById("password").value = userData.password;
        document.getElementById("remember-user").checked = true;
    }
});

// Manejo de cookies
document.getElementById("accept-cookies").addEventListener("click", function() {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookie-modal").style.display = "none";
});

document.getElementById("reject-cookies").addEventListener("click", function() {
    localStorage.setItem("cookiesAccepted", "false");
    document.getElementById("cookie-modal").style.display = "none";
});

// Login
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-user").checked;
    
    // Verificar credenciales
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    
    if (storedUsers[username] && storedUsers[username].password === password) {
        // Guardar datos si se seleccionó "recordar"
        if (rememberMe) {
            localStorage.setItem("rememberedUser", JSON.stringify({
                username: username,
                password: password
            }));
        } else {
            localStorage.removeItem("rememberedUser");
        }
        // Guardar el nombre de usuario activo para mostrar en la página principal
        localStorage.setItem("currentUser", username);
        
        // Redireccionar a la página principal
        window.location.href = "main.html";
    } else {
        document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos";
    }
});

// Mostrar modal de registro
const registerModal = document.getElementById("register-modal");
document.getElementById("register-link").addEventListener("click", function(event) {
    event.preventDefault();
    registerModal.style.display = "block";
});

// Cerrar modal al hacer clic en la X
document.querySelector(".close").addEventListener("click", function() {
    registerModal.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", function(event) {
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
});

// Registro de usuario
document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const registerError = document.getElementById("register-error");
    
    // Validaciones
    if (newPassword !== confirmPassword) {
        registerError.textContent = "Las contraseñas no coinciden";
        return;
    }
    
    // Obtener usuarios existentes o crear nuevo objeto
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    
    // Verificar si el usuario ya existe
    if (storedUsers[newUsername]) {
        registerError.textContent = "El usuario ya existe";
        return;
    }
    
    // Guardar nuevo usuario
    storedUsers[newUsername] = {
        password: newPassword
    };
    
    localStorage.setItem("users", JSON.stringify(storedUsers));
    
    // Mensaje de éxito y cerrar modal
    alert("Usuario registrado con éxito");
    registerModal.style.display = "none";
    
    // Rellenar el formulario de login con los datos del nuevo usuario
    document.getElementById("username").value = newUsername;
    document.getElementById("password").value = newPassword;
});