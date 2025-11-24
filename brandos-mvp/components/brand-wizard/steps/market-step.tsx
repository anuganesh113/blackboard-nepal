'use client'

import { useState, useEffect } from 'react'
import { Target, Users, TrendingUp, Shield } from 'lucide-react'

interface MarketStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
  'Real Estate', 'Entertainment', 'Food & Beverage', 'Fashion',
  'Travel & Hospitality', 'Consulting', 'Non-profit', 'Manufacturing',
  'Automotive', 'Sports & Fitness', 'Beauty & Wellness', 'Other'
]

const AUDIENCES = [
  'Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Baby Boomers (57-75)',
  'Businesses (B2B)', 'Enterprises', 'Startups', 'Freelancers',
  'Parents', 'Students', 'Professionals', 'Creative Individuals'
]

export function MarketStep({ data, onUpdate, errors }: MarketStepProps) {
  const [formData, setFormData] = useState({
    industry: data.industry || '',
    targetAudience: data.targetAudience || [],
    competitors: data.competitors || [],
    differentiator: data.differentiator || ''
  })

  const [competitorInput, setCompetitorInput] = useState('')

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAudience = (audience: string) => {
    const current = formData.targetAudience
    if (current.includes(audience)) {
      handleChange('targetAudience', current.filter((a: string) => a !== audience))
    } else if (current.length < 3) {
      handleChange('targetAudience', [...current, audience])
    }
  }

  const addCompetitor = () => {
    if (competitorInput && !formData.competitors.includes(competitorInput)) {
      handleChange('competitors', [...formData.competitors, competitorInput])
      setCompetitorInput('')
    }
  }

  const removeCompetitor = (competitor: string) => {
    handleChange('competitors', formData.competitors.filter((c: string) => c !== competitor))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Target className="text-purple-600" />
          Market Positioning
        </h2>
        <p className="text-gray-600">
          Help us understand your market and competitive landscape
        </p>
      </div>

      <div className="space-y-4">
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1 text-blue-500" />
            Target Audience (Select up to 3)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AUDIENCES.map(audience => (
              <button
                key={audience}
                onClick={() => toggleAudience(audience)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-all border",
                  formData.targetAudience.includes(audience)
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-purple-300"
                )}
              >
                {audience}
              </button>
            ))}
          </div>
        </div>

        {/* Competitors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="inline w-4 h-4 mr-1 text-green-500" />
            Main Competitors (Optional)
          </label>
          
          {formData.competitors.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.competitors.map((competitor: string) => (
                <span
                  key={competitor}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  {competitor}
                  <button
                    onClick={() => removeCompetitor(competitor)}
                    className="ml-1 hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
              placeholder="Enter a competitor name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
            <button
              onClick={addCompetitor}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Differentiator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="inline w-4 h-4 mr-1 text-orange-500" />
            What makes you different?
          </label>
          <textarea
            value={formData.differentiator}
            onChange={(e) => handleChange('differentiator', e.target.value)}
            placeholder="Describe your unique value proposition. What sets you apart from competitors?"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Market Analysis Preview */}
      {formData.industry && formData.targetAudience.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Market Analysis Preview</h3>
          <p className="text-sm text-purple-700">
            Based on your selections, we'll optimize your brand for the <strong>{formData.industry}</strong> industry,
            targeting <strong>{formData.targetAudience.join(', ')}</strong>.
            {formData.competitors.length > 0 && (
              <> We'll ensure your brand stands out from competitors like <strong>{formData.competitors[0]}</strong>.</>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}