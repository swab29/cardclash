"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { creatures } from '@/lib/creatures'
import { rollDice, formatDice } from '@/lib/dice'

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

  // Initialize decks with creatures
  const startGame = () => {
    const shuffledCreatures = [...creatures, ...creatures, ...creatures, ...creatures]
      .sort(() => Math.random() - 0.5)
    const halfDeck = Math.ceil(shuffledCreatures.length / 2)
    
    setPlayerDeck(shuffledCreatures.slice(0, halfDeck))
    setComputerDeck(shuffledCreatures.slice(halfDeck))
    setPlayerCard(null)
    setComputerCard(null)
    setScores({ player: 0, computer: 0 })
    setGameStatus('Draw a creature card!')
    setRoundPhase('draw')
    setRollResults(null)
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

  const selectTrait = (trait) => {
    setSelectedTrait(trait)
    const playerDice = playerCard.traits[trait]
    const computerDice = computerCard.traits[trait]
    
    const playerRoll = rollDice(playerDice.dice, playerDice.sides)
    const computerRoll = rollDice(computerDice.dice, computerDice.sides)
    
    const results = {
      player: playerRoll,
      computer: computerRoll,
      trait: trait
    }
    
    setRollResults(results)
    setRoundPhase('result')

    if (playerRoll > computerRoll) {
      setScores(prev => ({ ...prev, player: prev.player + 1 }))
      setGameStatus(`You win with ${playerRoll} vs ${computerRoll}!`)
    } else if (computerRoll > playerRoll) {
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }))
      setGameStatus(`Computer wins with ${computerRoll} vs ${playerRoll}!`)
    } else {
      setGameStatus(`Tie! Both rolled ${playerRoll}`)
    }
  }

  const renderCreatureCard = (creature, isPlayer = true) => {
    if (!creature) return (
      <Card className="w-64 h-96 flex items-center justify-center bg-slate-800">
        <div className="text-slate-400">No card</div>
      </Card>
    )

    return (
      <Card className="w-64 h-96 p-4 flex flex-col bg-slate-800 text-white">
        <h3 className="text-xl font-bold text-center mb-4">{creature.name}</h3>
        <div className="space-y-4">
          {Object.entries(creature.traits).map(([trait, dice]) => (
            <div 
              key={trait}
              className={`p-2 rounded ${
                selectedTrait === trait ? 'bg-blue-600' : 'bg-slate-700'
              } ${
                isPlayer && roundPhase === 'select' 
                  ? 'cursor-pointer hover:bg-blue-500' 
                  : ''
              }`}
              onClick={() => {
                if (isPlayer && roundPhase === 'select') {
                  selectTrait(trait)
                }
              }}
            >
              <div className="flex justify-between items-center">
                <span className="capitalize">{trait}</span>
                {isPlayer || roundPhase === 'result' ? (
                  <Badge variant="outline">
                    {formatDice(dice.dice, dice.sides)}
                  </Badge>
                ) : (
                  <Badge variant="outline">?</Badge>
                )}
              </div>
              {rollResults && rollResults.trait === trait && (
                <div className="mt-1 text-sm">
                  Roll: {isPlayer ? rollResults.player : rollResults.computer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
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
          <Badge variant="outline" className="text-lg px-4 py-2">
            Player: {scores.player}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Computer: {scores.computer}
          </Badge>
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
        <div className="text-center text-slate-300">
          Creatures remaining: {playerDeck.length}
        </div>
      </div>
    </main>
  )
}