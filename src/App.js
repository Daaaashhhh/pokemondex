// App.js
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonModal from './PokemonModal';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import './PokemonModal.css';

function App() {
  const itemsPerPage = 10;
  const [nameList, setNameList] = useState([]);
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pokemon, setPokemon] = useState({
    name: '',
    species: '',
    img: '',
    hp: '',
    attack: '',
    defense: '',
    type: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon/?limit=500')
      .then((response) => {
        const updatedNameList = response.data.results.map((item) => {
          return {
            name: item.name,
            url: item.url,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              item.url.split('/')[6]
            }.png`,
          };
        });
        setNameList(updatedNameList);
      });
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
        setShowModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredNameList = nameList.filter((item) => {
    if (search === '') {
      return true;
    } else {
      return item.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  const totalItems = filteredNameList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentNameList = filteredNameList.slice(startIndex, endIndex);

  return (
    <div className="App">
      <div className="Title-SearchBar">
        <h1 className="header">Pokemon Stats</h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search your pokemon"
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="content">
        <div className="left">
          {currentNameList.map((item) => (
            <div
              className="nameContainer"
              key={item.name}>
              <button onClick={() => searchPokemon(item)}>
                <img
                  src={item.img}
                  alt=""
                />
                <p>{item.name}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: '-100vh' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100vh' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}>
          <PokemonModal
            pokemon={pokemon}
            onClose={handleCloseModal}
          />
        </motion.div>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
