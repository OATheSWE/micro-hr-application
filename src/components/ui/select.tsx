'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(option => option.value === value) || null
  )
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const option = options.find(option => option.value === value)
    setSelectedOption(option || null)
  }, [value, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option)
    onChange(option.value)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (disabled) return
    
    if (!isOpen && selectRef.current) {
      // Check if there's enough space below
      const rect = selectRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If there's less than 200px below, position above
      if (spaceBelow < 200 && spaceAbove > 200) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
    
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          const currentIndex = options.findIndex(option => option.value === selectedOption?.value)
          const nextIndex = (currentIndex + 1) % options.length
          handleSelect(options[nextIndex])
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          const currentIndex = options.findIndex(option => option.value === selectedOption?.value)
          const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1
          handleSelect(options[prevIndex])
        }
        break
    }
  }

  return (
    <div className={cn('relative', className)} ref={selectRef}>
      <div
        className={cn(
          'relative w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent',
          'hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          isOpen && 'ring-2 ring-blue-500 border-transparent'
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
      >
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-sm',
            selectedOption ? 'text-gray-900' : 'text-gray-500'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={cn(
              "absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto",
              dropdownPosition === 'bottom' ? "mt-1" : "mb-1 bottom-full"
            )}
            role="listbox"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'px-3 py-2 cursor-pointer text-sm transition-colors duration-150 text-black',
                  'hover:bg-blue-50 hover:text-blue-900',
                  'first:rounded-t-lg last:rounded-b-lg',
                  selectedOption?.value === option.value && 'bg-blue-50 text-blue-900'
                )}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 