const API_URL = "http://localhost:3000/pets";
const table = document.getElementById("pets-table");
const tableHead = table.outerHTML;
let editPet = null;


async function printAllFilms() {
    let films = await getAllFilms();
    printFilms(films)
}

// SEARCH: 
async function searchFilms() {
    try {
        const year = document.getElementById("year").value;
        const director = document.getElementById("director").value.toLowerCase();
        const title = document.getElementById("title").value.toLowerCase();

        let films = await getAllFilms();

      
        let filteredFilms = films.filter((film) => {
            const matchesYear = year ? film.year == year : true;
            const matchesDirector = director ? film.director.toLowerCase().includes(director) : true;
            const matchesTitle = title ? film.title.toLowerCase().includes(title) : true;
            
            return matchesYear && matchesDirector && matchesTitle;
        });

      
        printFilms(filteredFilms);

    } catch (error) {
        console.log("Error:", error);
    }
}

function printFilms(films) {
    table.innerHTML = tableHead;

    
    if (films.length === 0) {
        table.insertAdjacentHTML("beforeend", "<tr><td colspan='4'>No films found</td></tr>");
        return;
    }

    films.forEach((film) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${film.id}</td>
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.director}</td>
            <td><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
            <td><button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button></td>
        `;
        row.querySelector(".delete-btn").addEventListener("click", (event) => deleteFilm(film.id, event));
        row.querySelector(".edit-btn").addEventListener("click", () => {
            editFilm = film;
            
         });
        table.appendChild(row);
    });
   
    
}
