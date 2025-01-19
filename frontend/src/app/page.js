"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { creatures } from '@/lib/creatures'
import { rollDice, formatDice } from '@/lib/dice'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'

export default function Home() {
  const [playerDeck, setPlayerDeck] = useState([])
  const [computerDeck, setComputerDeck] = useState([])
  const [playerCard, setPlayerCard] = useState(null)
  const [computerCard, setComputerCard] = useState(null)
  const [selectedTrait, setSelectedTrait] = useState(null)
  const [gameStatus, setGameStatus] = useState('Press Start to begin')
  const [scores, setScores] = useState({ player: 0, computer: 0 })
  const [rollResults, setRollResults] = useState(null)
  const [roundPhase, setRoundPhase] = useState('draw') // 'draw', 'select', 'result'
  const [selectedCreatures, setSelectedCreatures] = useState([])
  const [isSelectionPhase, setIsSelectionPhase] = useState(true)
  const [isRolling, setIsRolling] = useState(false)
  const [winningCard, setWinningCard] = useState(null)

  // Initialize game with creature selection
  const startGame = () => {
    const shuffledCreatures = [...creatures].sort(() => Math.random() - 0.5)
    setSelectedCreatures(shuffledCreatures.slice(0, 20)) // First 20 creatures for selection
    setIsSelectionPhase(true)
    setScores({ player: 0, computer: 0 })
    setGameStatus('Select 10 creatures for your deck!')
  }

  // Handle creature selection
  const selectCreaturesForGame = (selectedIndices) => {
    const playerCreatures = selectedIndices.map(i => selectedCreatures[i])
    const remainingCreatures = selectedCreatures.filter((_, i) => !selectedIndices.includes(i))
    const computerCreatures = remainingCreatures.slice(0, 10)
    
    setPlayerDeck(playerCreatures)
    setComputerDeck(computerCreatures)
    setIsSelectionPhase(false)
    setGameStatus('Draw a creature card!')
  }

  const drawCards = () => {
    if (playerDeck.length === 0) {
      setGameStatus('Game Over!')
      return
    }

    setPlayerCard(playerDeck[0])
    setComputerCard(computerDeck[0])
    setPlayerDeck(playerDeck.slice(1))
    setComputerDeck(computerDeck.slice(1))
    setRoundPhase('select')
    setGameStatus('Select a trait to challenge!')
    setRollResults(null)
  }

  const handleDiceRoll = async (trait) => {
    setIsRolling(true)
    setSelectedTrait(trait)
    
    // Animate dice roll
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const playerDice = playerCard.traits[trait]
    const computerDice = computerCard.traits[trait]
    
    const playerRoll = rollDice(playerDice.dice, playerDice.sides)
    const computerRoll = rollDice(computerDice.dice, computerDice.sides)
    
    setRollResults({ player: playerRoll, computer: computerRoll, trait })
    setIsRolling(false)

    // Set winning card animation
    if (playerRoll > computerRoll) {
      setWinningCard('player')
      setScores(prev => ({ ...prev, player: prev.player + 1 }))
      setGameStatus(`You win with ${playerRoll} vs ${computerRoll}!`)
    } else if (computerRoll > playerRoll) {
      setWinningCard('computer')
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }))
      setGameStatus(`Computer wins with ${computerRoll} vs ${playerRoll}!`)
    } else {
      setWinningCard(null)
      setGameStatus(`Tie! Both rolled ${playerRoll}`)
    }

    // Clear winning animation after delay
    setTimeout(() => setWinningCard(null), 2000)
  }

  const renderDiceAnimation = () => {
    if (!isRolling) return null;
    
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const RandomDice = diceIcons[Math.floor(Math.random() * diceIcons.length)]
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="dice-rolling">
          <RandomDice className="w-16 h-16 text-white" />
        </div>
      </div>
    )
  }

  const renderCreatureCard = (creature, isPlayer = true) => {
    if (!creature) return (
      <Card className="w-64 h-96 flex items-center justify-center bg-slate-800/95 backdrop-blur-sm">
        <div className="text-slate-400">No card</div>
      </Card>
    )

    const isWinning = (isPlayer && winningCard === 'player') || 
                     (!isPlayer && winningCard === 'computer')

    return (
      <Card className={`relative w-64 h-96 p-4 flex flex-col bg-slate-800/95 backdrop-blur-sm text-white
        ${isWinning ? 'winning-card' : ''}`}>
        {isRolling && renderDiceAnimation()}
        <h3 className="text-xl font-bold text-center mb-4">{creature.name}</h3>
        <div className="space-y-4">
          {Object.entries(creature.traits).map(([trait, dice]) => (
            <div 
              key={trait}
              className={`p-2 rounded ${
                selectedTrait === trait ? 'bg-blue-600/90' : 'bg-slate-700/90'
              } ${
                isPlayer && roundPhase === 'select' 
                  ? 'cursor-pointer hover:bg-blue-500/90' 
                  : ''
              }`}
              onClick={() => {
                if (isPlayer && roundPhase === 'select') {
                  handleDiceRoll(trait)
                }
              }}
            >
              <div className="flex justify-between items-center">
                <span className="capitalize">{trait}</span>
                {isPlayer || roundPhase === 'result' ? (
                  <Badge variant="outline" className="bg-slate-800/80">
                    {formatDice(dice.dice, dice.sides)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-800/80">?</Badge>
                )}
              </div>
              {rollResults && rollResults.trait === trait && (
                <div className="mt-1 text-sm font-bold">
                  Roll: {isPlayer ? rollResults.player : rollResults.computer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const renderCreatureSelection = () => {
    if (!isSelectionPhase) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8">
        <div className="bg-slate-800/95 backdrop-blur-sm p-6 rounded-lg max-w-4xl w-full">
          <h2 className="text-2xl text-white mb-4">Select 10 Creatures</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {selectedCreatures.map((creature, index) => (
              <div 
                key={index}
                className="p-2 bg-slate-700/90 rounded cursor-pointer hover:bg-blue-600/90"
                onClick={() => {/* Add selection logic */}}
              >
                <h3 className="text-white font-bold">{creature.name}</h3>
                <div className="text-sm text-slate-300">
                  {Object.entries(creature.traits).map(([trait, dice]) => (
                    <div key={trait}>
                      {trait}: {formatDice(dice.dice, dice.sides)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button 
            className="mt-4"
            onClick={() => {/* Confirm selection */}}
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Creature Clash</h1>
          <p className="text-slate-300">{gameStatus}</p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-8">
          <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-slate-900/80">
              Player: {scores.player}
            </Badge>
          </div>
          <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-lg">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-slate-900/80">
              Computer: {scores.computer}
            </Badge>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl text-center text-white">Your Creature</h2>
            <div className="flex justify-center">
              {renderCreatureCard(playerCard)}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl text-center text-white">Computer's Creature</h2>
            <div className="flex justify-center">
              {renderCreatureCard(computerCard, false)}
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
          {roundPhase !== 'select' && (
            <Button 
              size="lg"
              onClick={drawCards}
              disabled={playerDeck.length === 0 || roundPhase === 'select'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Draw Creatures
            </Button>
          )}
        </div>

        {/* Deck Status */}
        <div className="text-center text-white bg-slate-800/95 backdrop-blur-sm p-2 rounded-lg inline-block mx-auto">
          Creatures remaining: {playerDeck.length}
        </div>
      </div>

      {renderCreatureSelection()}
    </main>
  )
}