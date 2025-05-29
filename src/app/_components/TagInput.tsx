'use client'

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Tag } from '@/types/Tag'

interface TagInputProps {
  selectedTags: Tag[]
  setSelectedTags: (tags: Tag[]) => void
}

export const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // 既存タグの取得とフィルタリング
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      fetch(`/api/tags/search?query=${encodeURIComponent(inputValue)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.tags) {
            // 既に選択されているタグを除外
            const filteredTags = data.tags.filter(
              (tag: Tag) =>
                !selectedTags.some((selected) => selected.id === tag.id),
            )
            setSuggestions(filteredTags)
            setShowSuggestions(true)
            setActiveSuggestionIndex(-1)
          }
        })
        .catch(() => {
          setSuggestions([])
        })
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, selectedTags])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestionIndex >= 0) {
        // 候補からタグを選択
        addTag(suggestions[activeSuggestionIndex])
      } else if (inputValue.trim()) {
        // 新しいタグを作成
        createNewTag(inputValue.trim())
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
    } else if (
      e.key === 'Backspace' &&
      inputValue === '' &&
      selectedTags.length > 0
    ) {
      // 最後のタグを削除
      removeTag(selectedTags[selectedTags.length - 1])
    }
  }

  const addTag = (tag: Tag) => {
    if (!selectedTags.some((selected) => selected.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
    setInputValue('')
    setShowSuggestions(false)
    setActiveSuggestionIndex(-1)
    inputRef.current?.focus()
  }

  const createNewTag = async (tagName: string) => {
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tagName }),
      })
      const data = await res.json()
      if (data.tag) {
        addTag(data.tag)
      }
    } catch (error) {
      console.error('タグの作成に失敗しました:', error)
    }
  }

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToRemove.id))
  }

  const handleSuggestionClick = (tag: Tag) => {
    addTag(tag)
  }

  return (
    <div className="relative">
      <div className="min-h-[42px] p-2 border border-gray-300 rounded-md focus-within:border-blue-500 flex flex-wrap items-center gap-1 bg-white">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
          >
            <span className="mr-1">#</span>
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? 'タグを追加...' : ''}
          className="flex-1 min-w-[120px] px-1 py-1 border-none outline-none bg-transparent"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((tag, index) => (
            <div
              key={tag.id}
              onClick={() => handleSuggestionClick(tag)}
              className={`px-3 py-2 cursor-pointer flex items-center ${
                index === activeSuggestionIndex
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-500 mr-1">#</span>
              <span>{tag.name}</span>
            </div>
          ))}
          {inputValue.trim() &&
            !suggestions.some(
              (tag) =>
                tag.name.toLowerCase() === inputValue.toLowerCase().trim(),
            ) && (
              <div
                onClick={() => createNewTag(inputValue.trim())}
                className={`px-3 py-2 cursor-pointer flex items-center border-t border-gray-200 ${
                  activeSuggestionIndex === suggestions.length
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-500 mr-1">#</span>
                <span className="font-semibold">{inputValue.trim()}</span>
                <span className="ml-2 text-sm text-gray-500">を新規作成</span>
              </div>
            )}
        </div>
      )}
    </div>
  )
}
