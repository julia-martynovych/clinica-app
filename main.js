const API_URL = "http://localhost:3000/pets";
const table = document.getElementById("pets-table");
const tableHead = table.outerHTML;
let editPet = null;

// READ: method GET 
async function getAllPets(){
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
    printPets(pets)
}

// SEARCH: 
async function searchPets() {
    try {
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value.toLowerCase();
        const species = document.getElementById("species").value;
        const date_of_birth = document.getElementById("date_of_birth").value;
        const sex = document.getElementById("sex").value;
        const owner  = document.getElementById("owner").value.toLowerCase();
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

// CREATE: metod POST
async function addPet(pet) {
    try {
        
        let pets = await getAllPets();

        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pet)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        console.log("Patitas añadidas con exito");
    } catch (error) {
        console.log("Error:", error);
    }
}

// New Pet
async function addPet() {
    const species = document.getElementById("species_form").value;
    const date_of_birth = document.getElementById("date_of_birth_form").value;
    const date_of_last_visit = document.getElementById("date_of_last_visit_form").value;
    const name = document.getElementById("name_form").value.trim();
    const sex = document.getElementById("sex_form").value;
    const owner = document.getElementById("owner_form").value.trim();

    if (!species || !date_of_birth || !date_of_last_visit || !name || !sex || !owner) {
        alert("Por favor rellena todos los campos");
        return;
    }

    const newPet = { species, date_of_birth, date_of_last_visit, name, sex, owner };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPet),
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        alert("Patitas añadidas con éxito");
        await printAllFilms();

        // Clean
       
        document.getElementById("species_form").value = "";
        document.getElementById("date_of_birth_form").value = "";
        document.getElementById("date_of_last_visit_form").value = "";
        document.getElementById("name_form").value = "";
        document.getElementById("sex_form").value = "";
        document.getElementById("owner_form").value = "";
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
            <td><button id="update-btn" class="update-btn"><i class="fa-solid fa-arrows-rotate"></i></button></td>
            <td><button id="edit-btn" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
            <td><button id="delete-btn" class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", (event) => deletePet(pet.id, event));
        row.querySelector(".edit-btn").addEventListener("click", (event) => editPet(pet.id, event));
        
        
        table.appendChild(row);
    });
   
    
}

// UPDATE: metod PUT

// async function updatePet(pet) {  
//     try {
//         const response = await fetch(`${API_URL}/${id}`, {
//             method: "PUT",
//             body: JSON.stringify(pet)
//         });

//         if (!response.ok) throw new Error(`Error updating pet: ${response.status}`);

//         console.log(`Pet ${pet.id} updated successfully`);
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
// READ: Obtener una película por ID (GET)
// async function getOneFilm(id) {
//   try {
//     const response = await fetch(`${API_URL}/${id}`);
//     const data = await response.json();
//     console.log("Película cargada:", data);
//     return data;
//   } catch (error) {
//     console.error("Error al obtener la película:", error);
//   }
// }
// Cargar una película en el formulario para editarla
// async function editPet(id) {
//   const pet = await fetch(`${API_URL}/${id}`);
//   if (pet) { 
//     document.getElementById("species_form").value = "pet.species";
//     document.getElementById("date_of_birth_form").value = "pet.date_of_birth";
//     document.getElementById("date_of_last_visit_form").value = "pet.date_of_last_visit";
//     document.getElementById("name_form").value = "pet.name";
//     document.getElementById("sex_form").value = "pet.sex";
//       document.getElementById("owner_form").value = "pet.owner";
      
//     currentFilmId = id; // Cambiar a modo edición
//     document.getElementById("submitBtn").textContent = "Guardar Cambios ✔";
//     document.getElementById("cancelEditBtn").style.display = "inline";
//     document.getElementById("formTitle").textContent = "Editar Película";
//   }
// }

// // Reiniciar el formulario a su estado por defecto (modo creación)
// function resetForm() {
//   document.getElementById("formPost").reset();
//   currentFilmId = null;
//   document.getElementById("submitBtn").textContent = "Añadir :film_frames:";
//   document.getElementById("cancelEditBtn").style.display = "none";
//   document.getElementById("formTitle").textContent = "Añadir :film_frames:";
// }

// // Cancelar la edición y restablecer el formulario
// function cancelEdit() {
//   resetForm();
// }
// // Variable global para controlar el modo: null = creación, o contiene el id en modo edición.
// let currentFilmId = null;

// // Asignamos el evento de submit al formulario
// document.getElementById("formPost").addEventListener("submit", handleFormSubmit);
// // Con esta funcion manejamos el formulario 
// async function handleFormSubmit(event) {
//   event.preventDefault();
//   // Si currentFilmId tiene valor, estamos en modo edición, sino en modo creación.
//   if (currentFilmId) {
//     await updateFilm(currentFilmId);
//   } else {
//     await createFilm();
//   }
//   printFilms();
//   resetForm();
// } 

// // UPDATE: Actualizar una película (PUT)
// async function updateFilm(id) {
//   // const Id = document.getElementById("filmId").value;
//   const Title = document.getElementById("filmTitle").value;
//   const Year = document.getElementById("filmYear").value;
//   const Director = document.getElementById("filmDirector").value;
//   const data = { Title, Year, Director };

//   try {
//     const response = await fetch(`${API_URL}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     });
   
//     const result = await response.json();
//     console.log("Película actualizada:", result);
//     alert("Película actualizada correctamente");
//   } catch (error) {
//     console.error("Error al actualizar la película:", error);
//     alert("Hubo un error al actualizar la película");
//   }
// }

const openFormBtn = document.getElementById("openFormBtn");
const formPost = document.getElementById("formPost");
const closeFormBtn = document.getElementById("closeFormBtn");


openFormBtn.onclick = function() {
    formPost.style.display = "block";
}


closeFormBtn.onclick = function() {
    formPost.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === formPost) {
        formPost.style.display = "none";
    }
}

// DELETE: metod DELETE

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
