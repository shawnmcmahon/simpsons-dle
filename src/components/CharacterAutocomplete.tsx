'use client'

import { useState, useRef, useEffect } from 'react'
import { SimpsonCharacter } from '@/lib/database'
import { Input } from '@/components/ui/input'

interface CharacterAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (character: SimpsonCharacter) => void
  characters: SimpsonCharacter[]
  placeholder: string
  disabled?: boolean
  className?: string
}

export default function CharacterAutocomplete({
  value,
  onChange,
  onSelect,
  characters,
  placeholder,
  disabled = false,
  className = ''
}: CharacterAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredCharacters, setFilteredCharacters] = useState<SimpsonCharacter[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter characters based on input value
  useEffect(() => {
    if (!value.trim()) {
      setFilteredCharacters([]) // Don't show any characters if no input
    } else {
      const filtered = characters.filter(char =>
        char.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8) // Limit to 8 results
      setFilteredCharacters(filtered)
    }
  }, [value, characters])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    // Only show dropdown if user is actually typing
    setIsOpen(newValue.trim().length > 0)
  }

  // Handle character selection
  const handleSelect = (character: SimpsonCharacter) => {
    onChange(character.name)
    onSelect(character)
    setIsOpen(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          // Only show dropdown on focus if there's already text
          if (value.trim().length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white font-semibold ${
          disabled ? 'bg-gray-200 cursor-not-allowed text-white' : ''
        } ${className}`}
      />
      
      {/* Dropdown */}
      {isOpen && !disabled && filteredCharacters.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCharacters.map((character, index) => (
            <button
              key={character.id}
              type="button"
              onClick={() => handleSelect(character)}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none font-semibold text-gray-800 ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${
                index === filteredCharacters.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              {character.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 