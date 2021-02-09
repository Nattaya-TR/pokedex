
document.getElementById("run").addEventListener("click", () => {
    console.log("click")

    //gets value from input field (users enter pokemon ID or name)
    let searchValue = document.getElementById("poke-id").value;

//here we start to work with data that we fetched by async function pokemonData

    //uses the pokemon data of the specific pokemon from the input for getting picture,name,moves,ID
    pokemonData(searchValue).then(pokemon => {

        //gets picture of the specific version of pokemon
        let imageURL = pokemon.sprites.front_default;
        //gets name
        let name = pokemon.name;
        //array to store only 4 moves (I choose simply just first 4)
        let fourMoves = [];
        //gets the first 4 moves from pokemon.moves array (API)
        let moves = pokemon.moves.slice(0, 4);
        //put each move one by one into new created array above "let fourMoves"
        moves.forEach(move => fourMoves.push(move.move.name));
        //gets ID
        let pokemonID = pokemon.id;
        //gets the URL of the previous evolution pokemon
        let speciesUrl = pokemon.species.url;


        //gets the data from the speciesURL
        data(speciesUrl).then(evolutionChain => {
                let prevEvolution;

                try {
                    prevEvolution = evolutionChain.evolves_from_species.name;    //gets name from evolves_from_species => save the value in variable "prevEvolution"
                } catch {
                    prevEvolution = "";                                          //if no previous evolution - no name appears
                }


                //gets picture of the previous evolution pokemon, that is related to the one which was originally researched via user input
                pokemonData(prevEvolution).then(prevEvolutionPoke => {
                    let prevEvoImgURL

                    try {
                        prevEvoImgURL = prevEvolutionPoke.sprites.front_default; //gets pic (just front_default) from sprites => save the pic in variable "prevEvoImgURL"
                    } catch {
                        prevEvoImgURL = "";                                      //if no previous evolution - no picture appears
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
                        p.innerText = fourMoves[index].charAt(0).toUpperCase() + fourMoves[index].slice(1);
                        //condition for case if pokemon has less than 4 moves (ditto)
                        if (fourMoves[index] === undefined) {
                            p.innerText = " - ";
                        }
                    });

                })
            }
            , rej => console.error(rej))
    });

    //gets the data from the specified URL (speciesUrl)
    async function data(url) {
        const response = await fetch(url);
        return await response.json();
    }
    //gets data about pokemon
    async function pokemonData(searchValue) {

        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + searchValue);
        console.log(response)
        return await response.json();
    }

})


