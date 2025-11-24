'use client'

import { useState, useEffect } from 'react'
import { Palette, Shapes, Type, Sparkles } from 'lucide-react'

interface StyleStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

const COLOR_MODES = [
  { value: 'vibrant', label: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
  { value: 'muted', label: 'Muted', colors: ['#95A5A6', '#7F8C8D', '#BDC3C7'] },
  { value: 'bold', label: 'Bold', colors: ['#E74C3C', '#3498DB', '#F39C12'] },
  { value: 'monochrome', label: 'Monochrome', colors: ['#2C3E50', '#34495E', '#7F8C8D'] }
]

const SHAPE_STYLES = [
  { value: 'rounded', label: 'Rounded & Soft', icon: '○' },
  { value: 'sharp', label: 'Sharp & Angular', icon: '◆' },
  { value: 'organic', label: 'Organic & Natural', icon: '◉' },
  { value: 'geometric', label: 'Geometric & Modern', icon: '■' }
]

const TYPOGRAPHY_STYLES = [
  { value: 'modern', label: 'Modern & Clean', font: 'Inter' },
  { value: 'classic', label: 'Classic & Timeless', font: 'Georgia' },
  { value: 'playful', label: 'Playful & Fun', font: 'Comic Sans MS' },
  { value: 'elegant', label: 'Elegant & Refined', font: 'Playfair Display' },
  { value: 'serious', label: 'Serious & Professional', font: 'Arial' }
]

export function StyleStep({ data, onUpdate, errors }: StyleStepProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    primaryColor: data.primaryColor || '#3B82F6',
    colorMode: data.colorMode || 'vibrant',
    geometry: data.geometry || 'rounded',
    complexity: data.complexity || 50,
    symmetry: data.symmetry || 80,
    typographyPersonality: data.typographyPersonality || 'modern',
    fontWeight: data.fontWeight || 'regular',
    minimalism: data.minimalism || 50,
    friendliness: data.friendliness || 50,
    innovation: data.innovation || 50,
    trust: data.trust || 50
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Palette className="text-pink-600" />
          Visual Style DNA
        </h2>
        <p className="text-gray-600">
          Define the visual genetics of your living brand
        </p>
      </div>

      <div className="space-y-6">
        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Palette className="inline w-4 h-4 mr-1" />
            Color Personality
          </label>
          
          {/* Primary Color */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-2">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
              <div className="flex-1">
                <div 
                  className="h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: formData.primaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Color Mode */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Color Mode</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COLOR_MODES.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => handleChange('colorMode', mode.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    formData.colorMode === mode.value
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  )}
                >
                  <div className="flex gap-1 justify-center mb-2">
                    {mode.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium">{mode.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shape Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Shapes className="inline w-4 h-4 mr-1" />
            Shape Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SHAPE_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => handleChange('geometry', style.value)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  formData.geometry === style.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                )}
              >
                <div className="text-2xl mb-2 text-center">{style.icon}</div>
                <p className="text-xs font-medium text-center">{style.label}</p>
              </button>
            ))}
          </div>

          {/* Complexity & Symmetry Sliders */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span>Complexity</span>
                <span>{formData.complexity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.complexity}
                onChange={(e) => handleChange('complexity', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Simple</span>
                <span>Complex</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span>Symmetry</span>
                <span>{formData.symmetry}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.symmetry}
                onChange={(e) => handleChange('symmetry', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Asymmetric</span>
                <span>Symmetric</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Type className="inline w-4 h-4 mr-1" />
            Typography Personality
          </label>
          <div className="space-y-2">
            {TYPOGRAPHY_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => handleChange('typographyPersonality', style.value)}
                className={cn(
                  "w-full p-3 rounded-lg border-2 transition-all text-left",
                  formData.typographyPersonality === style.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                )}
              >
                <p className="font-medium" style={{ fontFamily: style.font }}>
                  {style.label}
                </p>
                <p className="text-sm text-gray-600" style={{ fontFamily: style.font }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Style Attributes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Sparkles className="inline w-4 h-4 mr-1" />
            Style Attributes
          </label>
          <div className="space-y-3">
            {[
              { key: 'minimalism', label: 'Minimalism', low: 'Detailed', high: 'Minimal' },
              { key: 'friendliness', label: 'Friendliness', low: 'Professional', high: 'Friendly' },
              { key: 'innovation', label: 'Innovation', low: 'Traditional', high: 'Innovative' },
              { key: 'trust', label: 'Trustworthiness', low: 'Bold', high: 'Trustworthy' }
            ].map(attr => (
              <div key={attr.key}>
                <label className="text-xs text-gray-600 flex justify-between mb-1">
                  <span>{attr.label}</span>
                  <span>{formData[attr.key]}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData[attr.key]}
                  onChange={(e) => handleChange(attr.key, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{attr.low}</span>
                  <span>{attr.high}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Style Preview */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>🎨 Style DNA:</strong> Your brand will have a {formData.colorMode} color palette 
          with {formData.geometry} shapes, {formData.typographyPersonality} typography, 
          and a {formData.minimalism > 50 ? 'minimalist' : 'detailed'} aesthetic.
        </p>
      </div>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}