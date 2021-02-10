document.getElementById("run").addEventListener("click", () => {
    //condition if input field is empty
    if (document.getElementById("poke-id").value === "") {
        return;
    }
    onClick(document.getElementById("poke-id").value);
})
//on click show data for of previous evolutions
document.getElementById("prevEvo").addEventListener("click", () => {
    onClick(prevEvolution);
});
let prevEvolution;


function onClick(pokemon) {
    //gets value from input field (users enter pokemon ID or name)
    let searchValue = pokemon;


//here we start to work with data that we fetched by async function pokemonData

    //uses the pokemon data of the specific pokemon from the input for getting picture,name,moves,ID
    pokemonData(searchValue).then(pokemon => {

        //gets picture of the specific version of pokemon
        let imageURL = pokemon.sprites.front_default;
        //gets name
        let name = pokemon.name;

        //shuffles and gets first 4 random moves
        let fourMoves = pokemon.moves.sort(() => 0.5 - Math.random()).slice(0, 4);

        //gets ID
        let pokemonID = pokemon.id;
        //gets the URL of the previous evolution pokemon
        let speciesUrl = pokemon.species.url;


        //gets the data from the speciesURL
        data(speciesUrl).then(evolutionChain => {
                try {
                    prevEvolution = evolutionChain.evolves_from_species.name;    //gets name from evolves_from_species => save the value in variable "prevEvolution"
                } catch {
                    prevEvolution = "";                                          //if no previous evolution - no name appears
                }


                //gets picture of the previous evolution pokemon, that is related to the one which was originally researched via user input
                pokemonData(prevEvolution).then(prevEvolutionPoke => {
                    let prevEvoImgURL

                    try {
                        prevEvoImgURL = prevEvolutionPoke.sprites.front_default;               //gets pic (just front_default) from sprites => save the pic in variable "prevEvoImgURL"
                        document.getElementById("prevEvo").style.display = "block";
                    } catch {
                        prevEvoImgURL = "";                                                    //if no previous evolution - no picture appears
                        document.getElementById("prevEvo").style.display = "none";
                    }

                    //display data - which I get in the previous steps - in the HTML -> in the Pokedex
                    //show ID of pokemon from input
                    document.getElementById("show-id").innerText = pokemonID;

                    //show pic of pokemon from input
                    document.getElementById("actualEvoImg").setAttribute("src", imageURL);

                    //show name of pokemon from input, with capital first letter
                    document.querySelector(".name").innerText = name.charAt(0).toUpperCase() + name.slice(1);

                    //show name of the previous evolution  of the pokemon from input, with capital first letter
                    document.querySelector(".evolutions").innerText = prevEvolution.charAt(0).toUpperCase() + prevEvolution.slice(1);

                    //show picture of the previous evolution of the pokemon from input
                    document.getElementById("previousEvoImg").setAttribute("src", prevEvoImgURL);

                    //show 4 moves in the <p> tag section -> in the Pokedex blue boxes
                    //each move is with capital first letter
                    document.querySelectorAll(".move").forEach((p, index) => {
                        //condition for case if pokemon has less than 4 moves (ditto)
                        if (fourMoves[index] === undefined) {
                            p.innerText = " - ";
                        } else {
                            p.innerText = fourMoves[index].move.name.charAt(0).toUpperCase() + fourMoves[index].move.name.slice(1);
                        }
                    });

                })
            }
            , rej => {
                console.error(rej);
            });

    });
}


//gets the data from the specified URL (speciesUrl)
async function data(url) {
    const response = await fetch(url);
    return await response.json();
}

//gets data about pokemon
async function pokemonData(searchValue) {

    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + searchValue);
        return await response.json();
        //in case the user search for unknown pokemon
    } catch (e) {
        alert("Pokemon not found");
        throw e;
    }
}



