const API_URL = "http://localhost:3000/pets";
const table = document.getElementById("pets-table");
const tableHead = table.outerHTML;
let editPet = null;

// READ: method GET 
async function getAllPets() {
    try {
        let response = await fetch(API_URL);
        let data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
}

async function printAllPets() {
    let pets = await getAllPets();
    printPets(pets);
}

// SEARCH: 
async function searchPets() {
    try {
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value.toLowerCase();
        const species = document.getElementById("species").value;
        const date_of_birth = document.getElementById("date_of_birth").value;
        const sex = document.getElementById("sex").value;
        const owner = document.getElementById("owner").value.toLowerCase();
        const date_of_last_visit = document.getElementById("date_of_last_visit").value;

        let pets = await getAllPets();

        let filteredPets = pets.filter((pet) => {
            const matchesId = id ? pet.id == id : true;
            const matchesSpecies = species ? pet.species.trim().toLowerCase() === species.trim().toLowerCase() : true;
            const matchesName = name ? pet.name.toLowerCase().includes(name) : true;
            const matchesSex = sex ? pet.sex.includes(sex) : true;
            const matchesDate_of_birth = date_of_birth ? pet.date_of_birth.includes(date_of_birth) : true;
            const matchesOwner = owner ? pet.owner.toLowerCase().includes(owner) : true;
            const matchesDate_of_last_visit = date_of_last_visit ? pet.date_of_last_visit === date_of_last_visit : true;

            return matchesId && matchesSpecies && matchesName && matchesSex && matchesDate_of_birth && matchesOwner && matchesDate_of_last_visit;
        });

        printPets(filteredPets);

    } catch (error) {
        console.log("Error:", error);
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
}

function printPets(pets) {
    table.innerHTML = tableHead;

    if (pets.length === 0) {
        table.insertAdjacentHTML("beforeend", "<tr><td colspan='4'>No se han encontrado patitas</td></tr>");
        return;
    }

    pets.forEach((pet) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.name}</td>
            <td>${pet.species === "Gato" ? '<i class="fa-solid fa-cat"></i>' : '<i class="fa-solid fa-dog"></i>'}</td>
            <td>${formatDate(pet.date_of_birth)}</td>
            <td>${pet.sex}</td>
            <td>${pet.owner}</td>
            <td>${formatDate(pet.date_of_last_visit)}</td>
            <td><button data-id="${pet.id}" class="update-btn"><i class="fa-solid fa-arrows-rotate"></i></button></td>
            <td><button class="edit-btn" data-id="${pet.id}"><i class="fa-solid fa-pen-to-square"></i></button></td>
            <td><button id="delete-btn" class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", (event) => deletePet(pet.id, event));
        row.querySelector(".edit-btn").addEventListener("click", (event) => editPet(pet.id, event));
        row.querySelector(".update-btn").addEventListener("click", (event) => updateLastVisitDate(pet.id, event));
        table.appendChild(row);
    });
}

function clearForm() {
    document.getElementById("species_form").value = "";
    document.getElementById("date_of_birth_form").value = "";
    document.getElementById("date_of_last_visit_form").value = "";
    document.getElementById("name_form").value = "";
    document.getElementById("sex_form").value = "";
    document.getElementById("owner_form").value = "";
}

// Validation
function validateForm() {
    const species = document.getElementById("species_form").value.trim();
    const date_of_birth = document.getElementById("date_of_birth_form").value.trim();
    const date_of_last_visit = document.getElementById("date_of_last_visit_form").value.trim();
    const name = document.getElementById("name_form").value.trim();
    const sex = document.getElementById("sex_form").value.trim();
    const owner = document.getElementById("owner_form").value.trim();

    if (!species || !date_of_birth || !date_of_last_visit || !name || !sex || !owner) {
        alert("Por favor, rellena todos los campos.");
        return false;
    }
    return true;
}

document.addEventListener("click", async function (event) {
    const editBtn = event.target.closest(".edit-btn");
    if (!editBtn) return;

    const petId = editBtn.getAttribute("data-id");
    if (!petId) return;

    try {
        const response = await fetch(`${API_URL}/${petId}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const pet = await response.json();

        formPost.style.display = "block";
        document.querySelector(".create-form-title").textContent = "Cambiar datos";
        formSubmitBtn.textContent = "Guardar";

        document.getElementById("species_form").value = pet.species;
        document.getElementById("date_of_birth_form").value = pet.date_of_birth;
        document.getElementById("date_of_last_visit_form").value = pet.date_of_last_visit;
        document.getElementById("name_form").value = pet.name;
        document.getElementById("sex_form").value = pet.sex;
        document.getElementById("owner_form").value = pet.owner;

        formPost.setAttribute("data-id", petId);
        formPost.setAttribute("data-mode", "edit");
    } catch (error) {
        console.log("Error al cargar el animal:", error);
    }
});

openFormBtn.onclick = function () {
    clearForm();
    formPost.style.display = "block";
    document.querySelector(".create-form-title").textContent = "Crear nuevo animal";
    formSubmitBtn.textContent = "Crear";
    formPost.removeAttribute("data-id");
    formPost.setAttribute("data-mode", "create");
};

// Create form
formSubmitBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    const petId = formPost.getAttribute("data-id");
    const mode = formPost.getAttribute("data-mode");

    const updatedPet = {
        species: document.getElementById("species_form").value,
        date_of_birth: document.getElementById("date_of_birth_form").value,
        date_of_last_visit: document.getElementById("date_of_last_visit_form").value,
        name: document.getElementById("name_form").value,
        sex: document.getElementById("sex_form").value,
        owner: document.getElementById("owner_form").value
    };

    try {
        let response;
        if (mode === "edit" && petId) {
            response = await fetch(`${API_URL}/${petId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedPet)
            });
        } else if (mode === "create") {
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedPet)
            });
        } else {
            throw new Error("Modo no válido o ID faltante");
        }

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        alert(mode === "edit" ? "Datos actualizados correctamente" : "Nuevo animal creado correctamente");

        formPost.style.display = "none";
        formPost.removeAttribute("data-id");
        formPost.removeAttribute("data-mode");

        const updatedPets = await fetch(API_URL).then(res => res.json());
        printPets(updatedPets);

    } catch (error) {
        console.log("Error al procesar la solicitud:", error);
    }
});

// DELETE: method DELETE
async function deletePet(id, event) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error(`Error deleting film: ${response.status}`);

        event.target.closest("tr").remove();

        alert(`Las patitas ${id} se han eliminado con éxito`);
    } catch (error) {
        console.log("Error:", error);
    }
}

// UPDATE: Update last visit date
async function updateLastVisitDate(petId, event) {
    try {
        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(`${API_URL}/${petId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date_of_last_visit: today })
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const row = event.target.closest("tr");
        row.querySelector("td:nth-child(7)").textContent = formatDate(today);

        alert("Fecha de última visita actualizada correctamente");
    } catch (error) {
        console.log("Error al actualizar la fecha de última visita:", error);
    }
}

// Close form when clicking outside
document.addEventListener("click", function (event) {
    const formPost = document.getElementById("formPost");
    if (event.target === formPost) {
        formPost.style.display = "none";
    }
    
});
// Enlace de login

document.addEventListener("DOMContentLoaded", function() {
  // Verificar si hay un usuario activo
  const currentUser = localStorage.getItem("currentUser");
  
  // Elemento donde mostraremos el saludo al usuario
  const userGreeting = document.getElementById("user-greeting");
  
  if (currentUser && userGreeting) {
      // Cambiar "Hola Doctora" por "Hola [nombre de usuario]"
      userGreeting.textContent = `Hola,  ${currentUser}`;
  }
  
  // Manejador para cerrar sesión
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
      logoutButton.addEventListener("click", function() {
          // Eliminar el usuario actual del localStorage
          localStorage.removeItem("currentUser");
          // Redirigir a la página de login
          window.location.href = "index.html";
      });
  }
});