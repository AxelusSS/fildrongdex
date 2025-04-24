import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { Trainer } from "../types/trainer";
import axios from "axios";
import logo from "../assets/pokeball.png";

type GameScreenProps = {
  trainers: Trainer[];
};

export default function GameScreen({ trainers }: GameScreenProps) {
    const timeLimit = 30; // set le timer
    const [countdown, setCountdown] = useState(10);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [pokemonInput, setPokemonInput] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [gen1Pokemons, setGen1Pokemons] = useState<any[]>([]);
    const [correctPokemons, setCorrectPokemons] = useState<any[]>([]);
    const [scores, setScores] = useState<number[]>(trainers.map(() => 0));
    const [pokemonError, setPokemonError] = useState<string>("");
    const [winner, setWinner] = useState<any>(null);

  useEffect(() => {
    const fetchGen1Pokemons = async () => {
      try {
        const response = await axios.get("https://tyradex.vercel.app/api/v1/gen/1"); //set la génération
        setGen1Pokemons(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon : ", error);
      }
    };
    fetchGen1Pokemons();
  }, []);
  useEffect(() => {
    if (countdown === 0) {
      setGameStarted(true);
      setTimeLeft(timeLimit);
    } else if (countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [countdown]);
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
        if (currentPlayer < trainers.length - 1) {
          setCorrectPokemons([]);
          setPokemonInput("");
          setPokemonError("");
          setCurrentPlayer(currentPlayer + 1);
          setTimeLeft(timeLimit);
        } else {
          setIsGameOver(true);
          const maxScore = Math.max(...scores);
          const winnerIndex = scores.indexOf(maxScore);
          setWinner(trainers[winnerIndex]);
          setCorrectPokemons([]);
          setPokemonInput("");
          setPokemonError("");
        }
      }
      
  }, [gameStarted, timeLeft, currentPlayer]);
  const verifyPokemon = (pokemonName: string) => {
    const normalizedInput = pokemonName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return gen1Pokemons.some(
      (pokemon) =>
        pokemon.name.fr
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === normalizedInput
    );
  };
  const isPokemonAlreadyAdded = (pokemonName: string) => {
    const normalizedInput = pokemonName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return correctPokemons.some(
      (pokemon) =>
        pokemon.name.fr
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === normalizedInput
    );
  };
  const handlePokemonSubmit = () => {
    if (verifyPokemon(pokemonInput)) {
      if (isPokemonAlreadyAdded(pokemonInput)) {
        setPokemonError("duplicate");
      } else {
        const pokemon = gen1Pokemons.find(
          (poke) =>
            poke.name.fr
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase() === pokemonInput
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
        );
        if (pokemon) {
          setCorrectPokemons([...correctPokemons, pokemon]);
          const newScores = [...scores];
          newScores[currentPlayer] += 1;
          setScores(newScores);
          setPokemonInput("");
          setPokemonError("");
        }
      }
    } else {
      setPokemonError("notFound");
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw" overflow="hidden">
<Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#111"
        color="white"
        px={3}
        py={2}
        height="60px"
        flexShrink={0}
        width="100%"
      >
        <img
            src={logo}
            alt="Pokeball logo"
            style={{
            width: '30px',
            height: '30px',
            marginRight: '8px',
            }}
        />
        <Typography variant="h6">Fildrongdex</Typography>
        <Typography
            variant="subtitle1"
            noWrap
            sx={{
                maxWidth: "70%",
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
            }}
            >
            Challenge tes amis sur la 1er génération
        </Typography>
      </Box>

      {/* Main Zone: Sidebar + Content + Bottom */}
      <Box display="flex" flex="1" overflow="hidden">
        {/* Sidebar */}
        <Box
          width="16.66%"
          minWidth="150px"
          bgcolor="#222"
          color="white"
          display="flex"
          flexDirection="column"
          height="calc(100vh - 60px)"
        >
          {trainers.map((trainer, index) => (
            <Box
              key={index}
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              borderBottom={index < 3 ? "1px solid #444" : "none"}
              p={1}
            >
              {trainer ? (
                <>
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    style={{
                      borderRadius: "50%",
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      marginBottom: "8px",
                      border: "2px solid #555",
                    }}
                  />
                  <Typography fontWeight="bold" fontSize="1rem" color="white">
                    {trainer.name}
                  </Typography>
                  <Typography variant="caption" color="#ccc">
                    Score: {scores[index]} {/* Affichage du score du joueur */}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="#aaa">
                  Vide
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Right Content Area */}
        <Box display="flex" flexDirection="column" flex="1" height="100%">
          {/* Main Content */}
          <Box flex="1" p={4} overflow="auto" bgcolor="#1a1a1a" color="white">
            {!gameStarted && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="h4" color="white">
                  {`Starting in: ${countdown}`}
                </Typography>
              </Box>
            )}

            {gameStarted && !isGameOver ? (
              <Typography variant="h4">Dresseur {trainers[currentPlayer]?.name} à toi de jouer!</Typography>
            ) : isGameOver ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={6}>
                  <img
                    src={winner?.avatar}
                    alt={winner?.name}
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "4px solid gold",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography variant="h4" color="white" gutterBottom>
                    🏆 Félicitations {winner?.name} !
                  </Typography>
                  <Typography variant="h6" color="white">
                    Tu gagnes la partie avec {Math.max(...scores)} points !
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h4"></Typography>
            )}

            {/* Affichage des Pokémon corrects saisis */}
            <Box display="flex" flexWrap="wrap" justifyContent="center">
              {correctPokemons.map((pokemon, index) => (
                <Box key={index} m={1} p={1} bgcolor="#333" borderRadius="8px">
                  <img
                    src={pokemon.sprites.regular}
                    alt={pokemon.name.fr}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                  <Typography variant="body2" color="white" textAlign="center">
                    {pokemon.name.fr}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom Bar */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handlePokemonSubmit();
            }}
            height="70px"
            bgcolor="#2a2a2a"
            borderTop="4px solid #444"
            px={4}
            py={2}
            display="flex"
            alignItems="center"
            width="100%"
          >
        <TextField
            fullWidth
            placeholder="Enter Pokémon name"
            variant="outlined"
            value={pokemonInput}
            onChange={(e) => setPokemonInput(e.target.value)}
            disabled={isGameOver || !gameStarted}
            sx={{
                backgroundColor: "#333",
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                "& fieldset": {
                    borderColor:
                    pokemonError === "duplicate"
                        ? "orange"
                        : pokemonError === "notFound"
                        ? "red"
                        : "green",
                },
                "&:hover fieldset": {
                    borderColor:
                    pokemonError === "duplicate"
                        ? "orange"
                        : pokemonError === "notFound"
                        ? "red"
                        : "green",
                },
                "&.Mui-focused fieldset": {
                    borderColor:
                    pokemonError === "duplicate"
                        ? "orange"
                        : pokemonError === "notFound"
                        ? "red"
                        : "green",
                },
                },
            }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
