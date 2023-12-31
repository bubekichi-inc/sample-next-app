import React from 'react'

interface Props {
  type: string
  id: string
  value: string
  onChange: (value: string) => void
}

export const Input: React.FC<Props> = ({ type, id, value, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg p-4 w-full"
    />
  )
}
