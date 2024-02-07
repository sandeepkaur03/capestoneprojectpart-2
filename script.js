document.addEventListener("DOMContentLoaded", function () {
  const pokemonGallery = document.getElementById("pokemon-gallery");
  const loadMoreButton = document.getElementById("load-more");

  let offset = 0;
  const limit = 20;

  // Function to fetch pokemon data
  async function fetchPokemon(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data;
  }

  // Function to render pokemon thumbnails
  function renderPokemonThumbnails(pokemonList) {
    pokemonGallery.innerHTML = "";
    pokemonList.forEach(pokemon => {
      const pokemonThumb = document.createElement("div");
      pokemonThumb.classList.add("pokemon-thumb");
      pokemonThumb.innerHTML = `
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseUrl(pokemon.url)}.png" alt="${pokemon.name}">
        <p>${pokemon.name}</p>
      `;
      pokemonThumb.addEventListener("click", () => {
        displayPokemonDetails(pokemon.name);
      });
      pokemonGallery.appendChild(pokemonThumb);
    });
  }

  // Function to display pokemon details
  async function displayPokemonDetails(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();

    // Display pokemon details in modal
    const modal = document.getElementById("pokemon-details-modal");
    const modalContent = document.getElementById("pokemon-details");
    modalContent.innerHTML = `
      <h2>${data.name}</h2>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png" alt="${data.name}">
      <p>Abilities: ${data.abilities.map(ability => ability.ability.name).join(", ")}</p>
      <p>Types: ${data.types.map(type => type.type.name).join(", ")}</p>
    `;
    modal.style.display = "block";

    // Close modal on clicking close button
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Function to parse Pokemon ID from URL
  function parseUrl(url) {
    return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
  }

  // Event listener for Load More button
  loadMoreButton.addEventListener("click", async () => {
    offset += limit;
    const data = await fetchPokemon(offset, limit);
    renderPokemonThumbnails(data.results);
  });

  // Initial fetch and rendering of pokemon thumbnails
  (async () => {
    const data = await fetchPokemon(offset, limit);
    renderPokemonThumbnails(data.results);
  })();
});