const pokemonContainer = document.querySelector(".pokemon-container");//constante que se  le asigna un elemento html tipo div que hace de contenedor
const spinner = document.querySelector("#spinner");// se le asigna un id selector que hace de spinner o rueda de carga
const previous = document.querySelector("#previous");// id  anterior que hace de boton
const next = document.querySelector("#next");// id que hace de boton  para moverse a la siguiente lista de pokemones

let limit = 8;// el limite de pokemones para listar
let offset= 1;// para indicar el incio  del pokemon a traer para en listar

previous.addEventListener("click", () => {// evento del boton anterior
  if (offset != 1) {// si offset es diferente a 1 es porque hay mas de nueve pokemones
    offset -= 9;// se le restan 9 para asi mostrar los 9 anteriores pokemones
    removeChildNodes(pokemonContainer);// remover los elementos html en este caso los pokemones mostrados en dicho contenedor (cada pokemon es un contenedor)
    fetchPokemons(offset, limit);//para traer la API los pokemones que se indican segun offset y limit
  }
});

next.addEventListener("click", () => {//evento para el boton siguente
  offset += 9;//se incrementa offset en 9 para que traiga de POKE API los siguientes 9 pokemones
  removeChildNodes(pokemonContainer);// se remueve los elementos actuales de la pagina html para mostrar los 9  siguientes pokemones extraidos de la API
  fetchPokemons(offset, limit);// para traer los datos de la API des el inicio de partida offset hasta el limit con valor de 9
});
let arreglo=[];// arreglo con los datos extraidos de la API
let mantiene;
function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())//then devuelve una promesa si todo resolve, en el caso  contrario seria reject y ocupa un catch y se pasa a formato json
    .then((data) => {
      
      arreglo.push(data);
     
      if(arreglo.length==9){//para ordenar los datos cada vez que hay nueve elementos en el arreglo
        for(i=0;i<8;i++){
          for(j=0;j<8;j++){
            if(arreglo[j].id>arreglo[j+1].id){
              mantiene=arreglo[j];
              arreglo[j]=arreglo[j+1];
              arreglo[j+1]=mantiene;
            }
          }
        }
        for(indice=0;indice<9;indice++){//crear las nueve tarjetas llamando al metodo createPokemon
          createPokemon(arreglo[indice]);
        }
        arreglo=[];// resetear los datos
      }
      //createPokemon(data);
      spinner.style.display = "none";// es el spinner no activo
    });
}

function fetchPokemons(offset, limit) {//se encarga de iterar la lista de pokemones a buscar, empezando desde offset
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    
    fetchPokemon(i);//pasamos el id del pokemon a mostrar en la pokedex
  }
}

function createPokemon(pokemon) {// crear el contenedor con el pokemon a mostrar
  const flipCard = document.createElement("div");// para girar la carta del pokemon a mostrar.
  flipCard.classList.add("flip-card");// se crea una clase para trabajar con el contenedor del pokemon y generar el efecto de girar o bien cara trasera

  const cardContainer = document.createElement("div");// va hacer de contenedor del pokemon
  cardContainer.classList.add("card-container");//se crea una clase para dar estilos

  flipCard.appendChild(cardContainer);// le agregamos el contenedor es decir el div flipcard contiene a card container

  const card = document.createElement("div");// creamos un div que hace de carta
  card.classList.add("pokemon-block");//le agregamos una clase  para bloquear pokemon

  const spriteContainer = document.createElement("div");// es el contenedor del sprite o imagen del pokemon
  spriteContainer.classList.add("img-container");//le agregamos una clase para dar estilo al contenedor
  

  const sprite = document.createElement("img");// creamos un img de html para crear para trabajar con el sprite del pokemon
  sprite.src = pokemon.sprites.front_default;////obteniendo la direccion de la imagen del pokemon obtenido de la API

  spriteContainer.appendChild(sprite);//al contenedor le agregamos la imagen del pokemon

  const number = document.createElement("p");// creamos un  elemento p para agregar el numero del pokemon
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;//padStart permite concatener 3 0s al nunmero del pokemon

  const name = document.createElement("p");// para agregar el nombre del pokemon
  name.classList.add("name");
  name.textContent = pokemon.name;
//agregamos los elementos  al div card
  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  const cardBack = document.createElement("div");//la parte trasera de la carta
  cardBack.classList.add("pokemon-block-back");//se le agrega una clase para dar estilo

  cardBack.appendChild(progressBars(pokemon.stats));//le agregamos los elementos de la parte trasera de la carta llamando a la funcion en cargada de hacer dicha funcionalidad

  //agregamos los elementos al contenedor carta y al contenedor del pokemon
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);//flipCard contiene a cardContainer
}

function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {//para mostrar tres stats del pokemon
    const stat = stats[i];//arreglo con las stats y se le agrega a stat

    const statPercent = stat.base_stat / 2 + "%";//porcentaje de estadistica
    const statContainer = document.createElement("stat-container");//contenedor de stat
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");// nombre de la stat
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");// contener el progreso que va en la barra de porcentaje o progreso
    progress.classList.add("progress");

    //fornmato de la barra de progeso
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;//agregamos el stat  en la barra de porcentaje

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

function removeChildNodes(parent) {// mientras el div tenga elementos anidados es decir sus nodos, se repite el ciclo los elimina
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);
