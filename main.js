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
        console.log(sex)
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

        let petExists = pets.some(p => p.name === pet.name && p.date_of_birth === pet.date_of_birth);
        if (petExists) {
            console.log("Esas patitas ya existen");
            return;
        }

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
           <td>${pet.species === "Gato" ? '<i class="fa-solid fa-cat"></i>' : '<i class="fa-solid fa-dog"></i>'}</td>
            <td>${pet.date_of_birth}</td>
            <td>${pet.sex}</td>
            <td>${pet.owner}</td>
            <td>${pet.date_of_last_visit}</td>
            <td><button id="update-btn" class="update-btn"><i class="fa-solid fa-arrows-rotate"></i></button></td>
            <td><button id="edit-btn" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
            <td><button id="delete-btn" class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", (event) => deleteFilm(pet.id, event));
        row.querySelector(".edit-btn").addEventListener("click", () => {
            editPet = pet;
            
         });
        table.appendChild(row);
    });
   
    
}
