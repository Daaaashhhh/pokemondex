// PokemonModal.js
import React from 'react';
import { motion } from 'framer-motion';
import './PokemonModal.css'; // Import the CSS file for modal styles

const PokemonModal = ({ pokemon, onClose, className }) => {
  const modalVariants = {
    hidden: { opacity: 0, y: '-100vh' },
    visible: { opacity: 100, y: 100 },
  };
  return (
    <motion.div
      className="modal"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden">
      <div className="modal-content">
        <span
          className="close"
          onClick={onClose}>
          &times;
        </span>
        <h1>
          {pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1).toLowerCase()}
        </h1>
        <img
          src={pokemon.img}
          alt={pokemon.name}
          className="pokemon-image"
        />
        <h3>Species: {pokemon.species}</h3>
        <h3>Type: {pokemon.type}</h3>
        <h4>Hp: {pokemon.hp}</h4>
        <h4>Attack: {pokemon.attack}</h4>
        <h4>Defense: {pokemon.defense}</h4>
      </div>
    </motion.div>
  );
};

export default PokemonModal;
