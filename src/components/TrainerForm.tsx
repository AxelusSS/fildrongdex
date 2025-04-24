import React, { useState } from "react";
import Layout from "./Layout";
import type { Trainer } from "../types/trainer";
import { Button, Typography } from "@mui/material";
import user1 from "../assets/pokedexUser1.jpg";
import user2 from "../assets/pokedexUser2.jpg";
import user3 from "../assets/pokedexUser3.jpg";
import user4 from "../assets/pokedexUser4.jpg";

const avatarOptions = [user1, user2, user3, user4];

type Props = {
  trainers: Trainer[];
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
  onStart: () => void;
};

export default function TrainerForm({ trainers, setTrainers, onStart }: Props) {
  const [nameInput, setNameInput] = useState("");

  const handleAddTrainer = () => {
    if (!nameInput.trim() || trainers.length >= 4) return;

    const availableAvatars = avatarOptions.filter(
      (avatar) => !trainers.find((t) => t.avatar === avatar)
    );

    const randomAvatar =
      availableAvatars[
        Math.floor(Math.random() * availableAvatars.length)
      ];

    const newTrainer: Trainer = {
      id: Date.now(),
      name: nameInput.trim(),
      avatar: randomAvatar,
    };

    setTrainers((prev) => [...prev, newTrainer]);
    setNameInput("");
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTrainer();
    }
  };

  return (
    <Layout
      trainers={trainers}
      bottomInput={{
        placeholder:
          trainers.length >= 4
            ? "Nombre maximum de joueurs atteint"
            : "Entrez le nom d’un nouveau dresseur...",
        value: nameInput,
        onChange: (e) => setNameInput(e.target.value),
        onKeyDown: handleInputKeyPress,
        disabled: trainers.length >= 4,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <Typography variant="h4" gutterBottom>
          Bienvenue dans Fildrongdex
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Ajoutez jusqu’à 4 dresseurs pour commencer la partie.
        </Typography>
        {trainers.length >= 2 && (
          <Button variant="contained" color="success" onClick={onStart}>
            Démarrer le jeu
          </Button>
        )}
      </div>
    </Layout>
  );
}
