const API_URL = "http://localhost:3000/pets";
const table = document.getElementById("pets-table");
const tableHead = table.outerHTML;
let editPet = null;

// READ: método GET 
async function getAllPets() {
  try {
    let response = await fetch(API_URL);
    let data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error HTTP: ${error.status}`);
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
    const owner  = document.getElementById("owner").value.toLowerCase();
    const date_of_last_visit = document.getElementById("date_of_last_visit").value;

    let pets = await getAllPets();

    let filteredPets = pets.filter((pet) => {
      const matchesId = id ? pet.id == id : true;
      const matchesSpecies = species
        ? pet.species.trim().toLowerCase() === species.trim().toLowerCase()
        : true;
      const matchesName = name ? pet.name.toLowerCase().includes(name) : true;
      const matchesSex = sex ? pet.sex.includes(sex) : true;
      const matchesDate_of_birth = date_of_birth
        ? pet.date_of_birth.includes(date_of_birth)
        : true;
      const matchesOwner = owner ? pet.owner.toLowerCase().includes(owner) : true;
      const matchesDate_of_last_visit = date_of_last_visit
        ? pet.date_of_last_visit === date_of_last_visit
        : true;
      
      return (
        matchesId &&
        matchesSpecies &&
        matchesName &&
        matchesSex &&
        matchesDate_of_birth &&
        matchesOwner &&
        matchesDate_of_last_visit
      );
    });

    printPets(filteredPets);

  } catch (error) {
    console.log("Error:", error);
  }
}

// Función para crear un nuevo pet (POST)
async function createNewPet(petData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petData),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    alert("Patitas añadidas con éxito");
    await printAllPets();
    closeModalAndReset();
  } catch (error) {
    console.log("Error:", error);
  }
}

// Función para actualizar un pet existente (PUT)
async function updatePet(petData) {  
  try {
    const response = await fetch(`${API_URL}/${petData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petData)
    });
    if (!response.ok) throw new Error(`Error updating pet: ${response.status}`);
    alert(`Patitas ${petData.id} actualizadas con éxito`);
    await printAllPets();
    closeModalAndReset();
  } catch (error) {
    console.log("Error:", error);
  }
}

// Función que maneja el envío del formulario (creación o actualización)
async function handleSubmit() {
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

  const petData = { species, date_of_birth, date_of_last_visit, name, sex, owner };

  if (editPet) {
    // Modo edición: incluimos el id y actualizamos
    petData.id = editPet.id;
    await updatePet(petData);
  } else {
    // Modo creación: añadimos un nuevo pet
    await createNewPet(petData);
  }
}

// Función para cerrar el modal y resetear el formulario
function closeModalAndReset() {
  formPost.style.display = "none";
  editPet = null;
  document.getElementById("species_form").value = "";
  document.getElementById("date_of_birth_form").value = "";
  document.getElementById("date_of_last_visit_form").value = "";
  document.getElementById("name_form").value = "";
  document.getElementById("sex_form").value = "";
  document.getElementById("owner_form").value = "";
  document.querySelector(".create-form-title").textContent = "Crear nuevas patitas";
  document.querySelector(".create-form-button button").textContent = "Añadir Patitas";
}

// Función para abrir el modal en modo edición y cargar los datos del pet
function openEditModal(pet) {
  editPet = pet;
  formPost.style.display = "block";
  document.getElementById("species_form").value = pet.species;
  document.getElementById("date_of_birth_form").value = pet.date_of_birth;
  document.getElementById("date_of_last_visit_form").value = pet.date_of_last_visit;
  document.getElementById("name_form").value = pet.name;
  document.getElementById("sex_form").value = pet.sex;
  document.getElementById("owner_form").value = pet.owner;
  document.querySelector(".create-form-title").textContent = "Editar Patitas";
  document.querySelector(".create-form-button button").textContent = "Guardar cambios";
}

// Función que imprime la tabla de pets
function printPets(pets) {
  table.innerHTML = tableHead;
  
  if (pets.length === 0) {
    table.insertAdjacentHTML("beforeend", "<tr><td colspan='10'>No se han encontrado patitas</td></tr>");
    return;
  }

  pets.forEach((pet) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.name}</td>
      <td>${
        pet.species === "Gato"
          ? '<i class="fa-solid fa-cat"></i>'
          : '<i class="fa-solid fa-dog"></i>'
      }</td>
      <td>${pet.date_of_birth}</td>
      <td>${pet.sex}</td>
      <td>${pet.owner}</td>
      <td>${pet.date_of_last_visit}</td>
      <td><button class="update-btn"><i class="fa-solid fa-arrows-rotate"></i></button></td>
      <td><button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
      <td><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
    `;
    row.querySelector(".delete-btn").addEventListener("click", (event) => deletePet(pet.id, event));
    row.querySelector(".edit-btn").addEventListener("click", () => openEditModal(pet));
    table.appendChild(row);
  });
}

// DELETE: método DELETE
async function deletePet(id, event) {  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Error deleting pet: ${response.status}`);
    event.target.closest("tr").remove();
    alert(`Las patitas ${id} se han eliminado con éxito`);
  } catch (error) {
    console.log("Error:", error);
  }
}

// --- Control del Modal ---

const openFormBtn = document.getElementById("openFormBtn");
const formPost = document.getElementById("formPost");
const closeFormBtn = document.getElementById("closeFormBtn");

// Al abrir el modal para crear un pet nuevo
openFormBtn.onclick = function() {
  editPet = null;
  formPost.style.display = "block";
  document.getElementById("species_form").value = "";
  document.getElementById("date_of_birth_form").value = "";
  document.getElementById("date_of_last_visit_form").value = "";
  document.getElementById("name_form").value = "";
  document.getElementById("sex_form").value = "";
  document.getElementById("owner_form").value = "";
  document.querySelector(".create-form-title").textContent = "Crear nuevas patitas";
  document.querySelector(".create-form-button button").textContent = "Añadir Patitas";
};

// Cerrar el modal al pulsar la X
closeFormBtn.onclick = function() {
  closeModalAndReset();
};

// Cerrar el modal si se hace click fuera del contenido
window.onclick = function(event) {
  if (event.target === formPost) {
    closeModalAndReset();
  }
};
