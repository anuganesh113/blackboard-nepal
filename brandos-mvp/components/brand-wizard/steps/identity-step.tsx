'use client'

import { useState, useEffect } from 'react'
import { Building2, Heart, Target, Star } from 'lucide-react'

interface IdentityStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

export function IdentityStep({ data, onUpdate, errors }: IdentityStepProps) {
  const [formData, setFormData] = useState({
    name: data.name || '',
    tagline: data.tagline || '',
    mission: data.mission || '',
    vision: data.vision || '',
    values: data.values || []
  })

  const [valueInput, setValueInput] = useState('')

  const predefinedValues = [
    'Innovation', 'Trust', 'Quality', 'Sustainability', 
    'Customer-First', 'Integrity', 'Excellence', 'Creativity',
    'Transparency', 'Collaboration', 'Growth', 'Impact'
  ]

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addValue = (value: string) => {
    if (value && !formData.values.includes(value) && formData.values.length < 5) {
      handleChange('values', [...formData.values, value])
      setValueInput('')
    }
  }

  const removeValue = (value: string) => {
    handleChange('values', formData.values.filter((v: string) => v !== value))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Building2 className="text-blue-600" />
          Tell us about your brand
        </h2>
        <p className="text-gray-600">
          Let's start with the foundation - your brand's core identity
        </p>
      </div>

      <div className="space-y-4">
        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your brand name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="A memorable phrase that captures your brand essence"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Mission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="inline w-4 h-4 mr-1 text-red-500" />
            Mission Statement
          </label>
          <textarea
            value={formData.mission}
            onChange={(e) => handleChange('mission', e.target.value)}
            placeholder="Why does your brand exist? What problem do you solve?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Vision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline w-4 h-4 mr-1 text-green-500" />
            Vision Statement
          </label>
          <textarea
            value={formData.vision}
            onChange={(e) => handleChange('vision', e.target.value)}
            placeholder="Where do you see your brand in the future?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Core Values */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="inline w-4 h-4 mr-1 text-yellow-500" />
            Core Values (Choose up to 5)
          </label>
          
          {/* Selected Values */}
          {formData.values.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.values.map((value: string) => (
                <span
                  key={value}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {value}
                  <button
                    onClick={() => removeValue(value)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Value Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addValue(valueInput)}
              placeholder="Add a custom value"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={formData.values.length >= 5}
            />
            <button
              onClick={() => addValue(valueInput)}
              disabled={formData.values.length >= 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          {/* Predefined Values */}
          <div className="flex flex-wrap gap-2">
            {predefinedValues.map((value) => (
              <button
                key={value}
                onClick={() => addValue(value)}
                disabled={formData.values.includes(value) || formData.values.length >= 5}
                className={cn(
                  "px-3 py-1 rounded-full text-sm transition-all",
                  formData.values.includes(value)
                    ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Your brand identity forms the DNA of everything we'll create. 
          Be authentic and think about what truly makes your brand unique.
        </p>
      </div>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}