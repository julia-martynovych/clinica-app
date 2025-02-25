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
        const species = document.getElementById("species").value.toLowerCase();
        const name = document.getElementById("name").value.toLowerCase();
        const sex = document.getElementById("sex").value.toLowerCase();
        const date_of_birth = document.getElementById("date_of_birth").value.toLowerCase();
        const owner  = document.getElementById("owner").value.toLowerCase();
        const date_of_last_visit = document.getElementById("date_of_last_visit").value.toLowerCase();

        let pets = await getAllPets();

      
        let filteredPets = pets.filter((pet) => {
            const matchesId = id ? pet.id == id : true;
            const matchesSpecies = species ? pet.species.includes(species) : true;
            const matchesName = name ? pet.name.toLowerCase().includes(name) : true;
            const matchesSex = sex ? pet.sex.includes(sex) : true;
            const matchesDate_of_birth = date_of_birth ? pet.date_of_birth.includes(date_of_birth) : true;
            const matchesOwner = owner ? pet.owner.toLowerCase().includes(owner) : true;
            const matchesDate_of_last_visit = date_of_last_visit ? pet.date_of_last_visit.includes(date_of_last_visit) : true;
            
            return matchesId && matchesSpecies && matchesName && matchesSex && matchesDate_of_birth && matchesOwner && matchesDate_of_last_visit;
        });

      
        printPets(filteredPets);

    } catch (error) {
        console.log("Error:", error);
    }
}

function printPets(pets) {
    table.innerHTML = tableHead;

    
    if (pets.length === 0) {
        table.insertAdjacentHTML("beforeend", "<tr><td colspan='4'>No se encuentran animales</td></tr>");
        return;
    }

    pets.forEach((pet) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.name}</td>
            <td>${pet.species}</td>
            <td>${pet.date_of_birth}</td>
            <td>${pet.sex}</td>
            <td>${pet.owner}</td>
            <td>${pet.date_of_last_visit}</td>
            <td><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
            <td><button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", (event) => deleteFilm(pet.id, event));
        row.querySelector(".edit-btn").addEventListener("click", () => {
            editPet = pet;
            
         });
        table.appendChild(row);
    });
   
    
}
