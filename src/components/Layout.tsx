import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { Trainer } from "../types/trainer";
import logo from "../assets/pokeball.png";

type LayoutProps = {
  trainers: Trainer[];
  children: React.ReactNode;
  bottomInput?: {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    disabled?: boolean;
  };
};

export default function Layout({ trainers, children, bottomInput }: LayoutProps) {
  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw" overflow="hidden">
      
      {/* Top Bar */}
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
          {Array.from({ length: 4 }).map((_, index) => {
            const trainer = trainers[index];
            return (
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
                      Score: 0
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="#aaa">
                    Vide
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Right Content Area */}
        <Box display="flex" flexDirection="column" flex="1" height="100%">
          
          {/* Main Content */}
          <Box flex="1" p={4} overflow="auto" bgcolor="#1a1a1a" color="white">
            {children}
          </Box>

          {/* Bottom Bar */}
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            height="70px"
            bgcolor="#2a2a2a"
            borderTop="4px solid #444"
            px={4}
            py={2}
            display="flex"
            alignItems="center"
            width="100%"
            >
            {bottomInput && (
                <TextField
                fullWidth
                placeholder={bottomInput.placeholder}
                value={bottomInput.value}
                onChange={bottomInput.onChange}
                onKeyDown={bottomInput.onKeyDown}
                disabled={bottomInput.disabled}
                variant="outlined"
                sx={{
                    backgroundColor: "#333",
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#666",
                    },
                    "&:hover fieldset": {
                        borderColor: "#999",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#bbb",
                    },
                    },
                    width: "100%",
                }}
                />
            )}
            </Box>
        </Box>
      </Box>
    </Box>
  );
}
