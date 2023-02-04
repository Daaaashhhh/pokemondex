import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function App() {
  const [nameList, setNameList] = useState([]);
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pokemon, setPokemon] = useState({
    name: "",
    species: "",
    img: "",
    hp: "",
    attack: "",
    defense: "",
    type: "",
  });
  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/?limit=500")
      .then((response) => {
        const updatedNameList = response.data.results.map((item) => {
          return {
            name: item.name,
            url: item.url,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              item.url.split("/")[6]
            }.png`,
          };
        });
        setNameList(updatedNameList);
      });
  }, []);
  const searchPokemon = (item) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
      .then((response) => {
        setPokemon({
          name: item.name,
          species: response.data.species.name,
          img: response.data.sprites.front_default,
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        setPokemonChosen(true);
        setSelectedIndex(nameList.indexOf(item));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleNext = () => {
    if (selectedIndex < nameList.length - 1) {
      searchPokemon(nameList[selectedIndex + 1]);
    }
  };
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      searchPokemon(nameList[selectedIndex - 1]);
    }
  };

  // function handleClick() {
  //   window.location.href = "./App.js";
  // }
  return (
    <div className="App">
      <div className="Title-SearchBar">
        <h1>Pokemon Stats</h1>
        <input
          type="text"
          placeholder="Search your pokemon"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div className="content">
        <div className="left">
          {nameList
            .filter((item) => {
              if (search === "") {
                return item;
              } else if (
                item.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return item;
              }
            })
            .map((item) => {
              return (
                <div
                  className="nameContainer"
                  key={item.name}>
                  <button onClick={() => searchPokemon(item)}>
                    <img
                      src={item.img}
                      alt=""
                    />
                    <p>
                      {item.name.charAt(0).toUpperCase() +
                        item.name.slice(1).toLowerCase()}
                    </p>
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div className="right-content">
        <div className="right">
          {" "}
          {pokemonChosen ? (
            <>
              <h1>
                {pokemon.name.charAt(0).toUpperCase() +
                  pokemon.name.slice(1).toLowerCase()}
              </h1>
              <img
                src={pokemon.img}
                alt=""
              />
              <h3>
                Species:{" "}
                {pokemon.species.charAt(0).toUpperCase() +
                  pokemon.species.slice(1).toLowerCase()}
              </h3>
              <h3>Type: {pokemon.type}</h3>
              <h4>Hp: {pokemon.hp}</h4>
              <h4>Attack: {pokemon.attack}</h4>
              <h4>Defense: {pokemon.defense}</h4>
            </>
          ) : (
            <></>
          )}
          <div className="button-next">
            <button
              onClick={() => handlePrevious()}
              className="btn-group">
              Previous
            </button>
            <button
              onClick={() => handleNext()}
              className="btn-group">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
