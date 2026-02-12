'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GameType = '2048' | 'wordle';

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>('2048');

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Game Selector */}
      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700" style={{ padding: '16px' }}>
        <motion.button
          onClick={() => setActiveGame('2048')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeGame === '2048'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          2048
        </motion.button>
        <motion.button
          onClick={() => setActiveGame('wordle')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeGame === 'wordle'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Wordle
        </motion.button>
      </div>

      {/* Game Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeGame === '2048' && (
            <motion.div
              key="2048"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Game2048 />
            </motion.div>
          )}
          {activeGame === 'wordle' && (
            <motion.div
              key="wordle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Wordle />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 2048 Game Component
function Game2048() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initializeGrid = useCallback(() => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }, []);

  const addRandomTile = useCallback((grid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }, []);

  useEffect(() => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [initializeGrid]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotate = (matrix: number[][]) => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    };

    let rotated = newGrid;
    if (direction === 'right') rotated = newGrid.map(row => [...row].reverse());
    if (direction === 'up') rotated = rotate(newGrid);
    if (direction === 'down') rotated = rotate(newGrid.map(row => [...row].reverse()));

    for (let i = 0; i < 4; i++) {
      const row = rotated[i].filter(val => val !== 0);
      const merged: number[] = [];
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          merged.push(row[j] * 2);
          newScore += row[j] * 2;
          if (row[j] * 2 === 2048 && !won) setWon(true);
          j++;
        } else {
          merged.push(row[j]);
        }
      }
      while (merged.length < 4) merged.push(0);
      if (JSON.stringify(rotated[i]) !== JSON.stringify(merged)) moved = true;
      rotated[i] = merged;
    }

    if (direction === 'right') rotated = rotated.map(row => [...row].reverse());
    if (direction === 'up') rotated = rotate(rotate(rotate(rotated)));
    if (direction === 'down') rotated = rotate(rotated.map(row => [...row].reverse()));

    if (moved) {
      addRandomTile(rotated);
      setGrid(rotated);
      setScore(newScore);
      
      // Check game over
      let canMove = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (rotated[i][j] === 0) canMove = true;
          if (i < 3 && rotated[i][j] === rotated[i + 1][j]) canMove = true;
          if (j < 3 && rotated[i][j] === rotated[i][j + 1]) canMove = true;
        }
      }
      if (!canMove) setGameOver(true);
    }
  }, [grid, score, gameOver, won, addRandomTile]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: 'bg-gray-200 text-gray-800',
      4: 'bg-gray-300 text-gray-800',
      8: 'bg-orange-200 text-orange-900',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-red-200 text-red-900',
      64: 'bg-red-300 text-red-900',
      128: 'bg-yellow-200 text-yellow-900',
      256: 'bg-yellow-300 text-yellow-900',
      512: 'bg-green-200 text-green-900',
      1024: 'bg-green-300 text-green-900',
      2048: 'bg-blue-400 text-white',
    };
    return colors[value] || 'bg-blue-500 text-white';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            2048
          </motion.h2>
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            <motion.div 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              key={score}
              initial={{ scale: 1.2, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {score}
            </motion.div>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {(won || gameOver) && (
            <motion.div 
              className={`mb-4 p-4 rounded-lg text-center ${won ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div 
                className={`text-lg font-bold ${won ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
              >
                {won ? 'You Win!' : 'Game Over!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-2 grid grid-cols-4 gap-2">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}-${cell}`}
                className={`aspect-square rounded flex items-center justify-center text-2xl font-bold ${
                  cell === 0
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : getTileColor(cell)
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 25,
                  delay: (i * 4 + j) * 0.02
                }}
                whileHover={cell !== 0 ? { scale: 1.05 } : {}}
              >
                {cell !== 0 && cell}
              </motion.div>
            ))
          )}
        </div>

        <motion.div 
          className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Use arrow keys to play
        </motion.div>

        <motion.button
          onClick={() => {
            setGrid(initializeGrid());
            setScore(0);
            setGameOver(false);
            setWon(false);
          }}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          New Game
        </motion.button>
      </div>
    </div>
  );
}

// Wordle Game Component
function Wordle() {
  const WORDS = ['APPLE', 'BRAVE', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GLASS', 'HEART', 'IMAGE', 'JAZZY'];
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver || guesses.length >= 6) return;

    if (e.key === 'Enter' && currentGuess.length === 5) {
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      
      if (currentGuess.toUpperCase() === word) {
        setWon(true);
        setGameOver(true);
      } else if (newGuesses.length >= 6) {
        setGameOver(true);
      }
      
      setCurrentGuess('');
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (e.key.match(/[a-zA-Z]/) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  }, [currentGuess, guesses, word, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const getLetterColor = (letter: string, position: number, guess: string) => {
    if (word[position] === letter) return 'bg-green-500 text-white';
    if (word.includes(letter)) return 'bg-yellow-500 text-white';
    return 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Wordle</h2>

        <AnimatePresence>
          {(won || gameOver) && (
            <motion.div 
              className={`mb-4 p-4 rounded-lg text-center ${won ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div 
                className={`text-lg font-bold ${won ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
              >
                {won ? 'You Win!' : `Game Over! The word was ${word}`}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className="flex gap-2 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
            >
              {[...Array(5)].map((_, j) => {
                const guess = guesses[i];
                const letter = guess ? guess[j] : i === guesses.length ? currentGuess[j] : '';
                const color = guess ? getLetterColor(letter, j, guess) : 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600';
                
                return (
                  <motion.div
                    key={j}
                    className={`w-12 h-12 rounded flex items-center justify-center text-xl font-bold ${color}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25,
                      delay: letter ? (i * 5 + j) * 0.05 : 0
                    }}
                    whileHover={letter ? { scale: 1.1 } : {}}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Type to guess a 5-letter word
        </motion.div>

        <motion.button
          onClick={() => {
            const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
            setWord(randomWord);
            setGuesses([]);
            setCurrentGuess('');
            setGameOver(false);
            setWon(false);
          }}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          New Game
        </motion.button>
      </div>
    </div>
  );
}