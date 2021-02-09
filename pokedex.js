document.getElementById("run").addEventListener("click", () => {
    console.log("click")
    document.getElementById("target").innerText = "";
    let searchValue = document.getElementById("poke-id").value;

    const pokeTemplate = document.getElementById("tpl-poke").content;

    pokemonData(searchValue).then(pokemon => {
            console.log(pokemon)

            let imageURL = pokemon.sprites.front_default;
            let name = pokemon.name;
            let fourMoves = [];
                let moves = pokemon.moves.slice(0,4);
                    moves.forEach(move => fourMoves.push(move.move.name));


            let pokemonID = pokemon.id;
            let speciesUrl = pokemon.species.url;

            console.log()
            data(speciesUrl).then(evolutionChain => {
                let prevEvolution;

                try {
                    prevEvolution = evolutionChain.evolves_from_species.name;
                } catch {
                    prevEvolution = "";
                }

                let pokeHTML = pokeTemplate.cloneNode(true);

                pokeHTML.getElementById("show-id").innerText = pokemonID;
                pokeHTML.getElementById("actualEvoImg").setAttribute("src",imageURL) ;
                pokeHTML.querySelector(".name").innerText = name;
                pokeHTML.querySelector(".evolutions").innerText = prevEvolution;
                pokeHTML.getElementById("previousEvoImg").setAttribute("src",pokemon.species);
                pokeHTML.querySelectorAll(".move").forEach((p ,index) => {
                    p.innerText= fourMoves[index];
                    if(fourMoves[index] === undefined){
                        p.innerText = " - ";
                    }
                });



                document.getElementById("target").appendChild(pokeHTML);
            })
        }
        , rej => console.error(rej))
});

async function evolutionData(pokemonID) {
    const response = await fetch("https://pokeapi.co/api/v2/evolution-chain/" + pokemonID);
    return await response.json();
}

async function data(url) {
    const response = await fetch(url);
    return await response.json();
}

async function pokemonData(searchValue) {

    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + searchValue);
    console.log(response)
    return await response.json();
}




