"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Card values and suits for the deck
const SUITS = ['♠', '♥', '♦', '♣']
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export default function Home() {
  const [playerDeck, setPlayerDeck] = useState([])
  const [computerDeck, setComputerDeck] = useState([])
  const [playerCard, setPlayerCard] = useState(null)
  const [computerCard, setComputerCard] = useState(null)
  const [gameStatus, setGameStatus] = useState('Press Start to begin')
  const [scores, setScores] = useState({ player: 0, computer: 0 })

  // Initialize and shuffle deck
  const initializeDeck = () => {
    let deck = []
    for (let suit of SUITS) {
      for (let value of VALUES) {
        deck.push({ suit, value })
      }
    }
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }

  // Start new game
  const startGame = () => {
    const deck = initializeDeck()
    const halfDeck = Math.ceil(deck.length / 2)
    setPlayerDeck(deck.slice(0, halfDeck))
    setComputerDeck(deck.slice(halfDeck))
    setPlayerCard(null)
    setComputerCard(null)
    setScores({ player: 0, computer: 0 })
    setGameStatus('Game started! Draw a card.')
  }

  // Draw cards
  const drawCards = () => {
    if (playerDeck.length === 0) {
      setGameStatus('Game Over!')
      return
    }

    const pCard = playerDeck[0]
    const cCard = computerDeck[0]
    
    setPlayerCard(pCard)
    setComputerCard(cCard)
    
    setPlayerDeck(playerDeck.slice(1))
    setComputerDeck(computerDeck.slice(1))

    // Compare cards
    const result = compareCards(pCard, cCard)
    updateScore(result)
  }

  // Compare cards to determine winner
  const compareCards = (playerCard, computerCard) => {
    const cardValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    }
    
    if (cardValues[playerCard.value] > cardValues[computerCard.value]) {
      setGameStatus('You win this round!')
      return 'player'
    } else if (cardValues[playerCard.value] < cardValues[computerCard.value]) {
      setGameStatus('Computer wins this round!')
      return 'computer'
    } else {
      setGameStatus('It\'s a tie!')
      return 'tie'
    }
  }

  // Update score
  const updateScore = (winner) => {
    if (winner === 'player') {
      setScores(prev => ({ ...prev, player: prev.player + 1 }))
    } else if (winner === 'computer') {
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }))
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Card War</h1>
          <p className="text-slate-300">{gameStatus}</p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-8">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Player: {scores.player}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Computer: {scores.computer}
          </Badge>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-2 gap-8">
          {/* Player Side */}
          <div className="space-y-4">
            <h2 className="text-xl text-center text-white">Your Card</h2>
            <div className="flex justify-center">
              <Card className={`w-48 h-64 flex items-center justify-center ${
                playerCard?.suit === '♥' || playerCard?.suit === '♦' 
                  ? 'text-red-500' 
                  : 'text-slate-900'
              }`}>
                {playerCard ? (
                  <div className="text-4xl font-bold">
                    {playerCard.value}{playerCard.suit}
                  </div>
                ) : (
                  <div className="text-slate-400">No card</div>
                )}
              </Card>
            </div>
          </div>

          {/* Computer Side */}
          <div className="space-y-4">
            <h2 className="text-xl text-center text-white">Computer's Card</h2>
            <div className="flex justify-center">
              <Card className={`w-48 h-64 flex items-center justify-center ${
                computerCard?.suit === '♥' || computerCard?.suit === '♦' 
                  ? 'text-red-500' 
                  : 'text-slate-900'
              }`}>
                {computerCard ? (
                  <div className="text-4xl font-bold">
                    {computerCard.value}{computerCard.suit}
                  </div>
                ) : (
                  <div className="text-slate-400">No card</div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            size="lg"
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700"
          >
            Start New Game
          </Button>
          <Button 
            size="lg"
            onClick={drawCards}
            disabled={playerDeck.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Draw Cards
          </Button>
        </div>

        {/* Deck Status */}
        <div className="text-center text-slate-300">
          Cards remaining: {playerDeck.length}
        </div>
      </div>
    </main>
  )
}