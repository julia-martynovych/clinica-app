const API_URL = "http://localhost:3000/pets";
const table = document.getElementById("pets-table");
const tableHead = table.outerHTML;
let editPet = null;


async function printAllFilms() {
    let films = await getAllFilms();
    printFilms(films)
}