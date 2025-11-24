'use client'

import { useState, useEffect } from 'react'
import { Brain, MessageSquare, Smile, Volume2 } from 'lucide-react'

interface PersonalityStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

const PERSONALITY_TRAITS = [
  { value: 'professional', label: 'Professional', icon: '👔' },
  { value: 'friendly', label: 'Friendly', icon: '😊' },
  { value: 'innovative', label: 'Innovative', icon: '💡' },
  { value: 'trustworthy', label: 'Trustworthy', icon: '🤝' },
  { value: 'playful', label: 'Playful', icon: '🎮' },
  { value: 'sophisticated', label: 'Sophisticated', icon: '🎩' },
  { value: 'bold', label: 'Bold', icon: '🔥' },
  { value: 'caring', label: 'Caring', icon: '❤️' },
  { value: 'adventurous', label: 'Adventurous', icon: '🚀' },
  { value: 'reliable', label: 'Reliable', icon: '⚡' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'authentic', label: 'Authentic', icon: '✨' }
]

const VOICE_TONES = [
  { value: 'formal', label: 'Formal & Professional', example: 'We are pleased to announce...' },
  { value: 'casual', label: 'Casual & Relaxed', example: 'Hey there! We\'ve got news...' },
  { value: 'friendly', label: 'Friendly & Warm', example: 'We\'re excited to share...' },
  { value: 'authoritative', label: 'Authoritative & Expert', example: 'Industry research indicates...' }
]

export function PersonalityStep({ data, onUpdate, errors }: PersonalityStepProps) {
  const [formData, setFormData] = useState({
    personality: data.personality || [],
    tone: data.tone || 'friendly',
    humor: data.humor || 30,
    technicality: data.technicality || 50,
    enthusiasm: data.enthusiasm || 60,
    formality: data.formality || 40
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePersonality = (trait: string) => {
    const current = formData.personality
    if (current.includes(trait)) {
      handleChange('personality', current.filter((t: string) => t !== trait))
    } else if (current.length < 4) {
      handleChange('personality', [...current, trait])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Brain className="text-orange-600" />
          Brand Personality
        </h2>
        <p className="text-gray-600">
          Give your brand a personality that resonates with your audience
        </p>
      </div>

      <div className="space-y-6">
        {/* Personality Traits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Core Personality Traits (Choose up to 4)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {PERSONALITY_TRAITS.map(trait => (
              <button
                key={trait.value}
                onClick={() => togglePersonality(trait.value)}
                disabled={!formData.personality.includes(trait.value) && formData.personality.length >= 4}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-center",
                  formData.personality.includes(trait.value)
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="text-2xl mb-1">{trait.icon}</div>
                <p className="text-xs font-medium">{trait.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Voice & Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MessageSquare className="inline w-4 h-4 mr-1" />
            Brand Voice & Tone
          </label>
          <div className="space-y-2">
            {VOICE_TONES.map(voice => (
              <button
                key={voice.value}
                onClick={() => handleChange('tone', voice.value)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-left",
                  formData.tone === voice.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                )}
              >
                <p className="font-medium mb-1">{voice.label}</p>
                <p className="text-sm text-gray-600 italic">"{voice.example}"</p>
              </button>
            ))}
          </div>
        </div>

        {/* Communication Style Sliders */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Volume2 className="inline w-4 h-4 mr-1" />
            Communication Style
          </label>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span><Smile className="inline w-3 h-3 mr-1" />Humor Level</span>
                <span>{formData.humor}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.humor}
                onChange={(e) => handleChange('humor', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Serious</span>
                <span>Humorous</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span>Technical Depth</span>
                <span>{formData.technicality}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.technicality}
                onChange={(e) => handleChange('technicality', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Simple</span>
                <span>Technical</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span>Enthusiasm</span>
                <span>{formData.enthusiasm}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.enthusiasm}
                onChange={(e) => handleChange('enthusiasm', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Reserved</span>
                <span>Enthusiastic</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 flex justify-between mb-1">
                <span>Formality</span>
                <span>{formData.formality}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.formality}
                onChange={(e) => handleChange('formality', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Summary */}
      {formData.personality.length > 0 && (
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">Personality Profile</h3>
          <p className="text-sm text-orange-700">
            Your brand personality is <strong>{formData.personality.join(', ')}</strong> with a 
            <strong> {formData.tone}</strong> voice. 
            {formData.humor > 50 && ' It enjoys a good sense of humor.'}
            {formData.technicality > 50 && ' It speaks with technical expertise.'}
            {formData.enthusiasm > 50 && ' It communicates with high energy and passion.'}
          </p>
        </div>
      )}
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}