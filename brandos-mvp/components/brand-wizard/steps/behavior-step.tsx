'use client'

import { useState, useEffect } from 'react'
import { Zap, RefreshCw, TrendingUp, Activity, Sun, Globe, BarChart3, Beaker } from 'lucide-react'

interface BehaviorStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

export function BehaviorStep({ data, onUpdate, errors }: BehaviorStepProps) {
  const [formData, setFormData] = useState({
    seasonal: data.seasonal ?? true,
    contextual: data.contextual ?? true,
    platformOptimized: data.platformOptimized ?? true,
    performanceDriven: data.performanceDriven ?? false,
    learningEnabled: data.learningEnabled ?? true,
    experimentationRate: data.experimentationRate || 20,
    consistencyThreshold: data.consistencyThreshold || 80,
    evolutionSpeed: data.evolutionSpeed || 'moderate'
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
          <Zap className="text-yellow-600" />
          Living Brand Behaviors
        </h2>
        <p className="text-gray-600">
          Configure how your brand adapts and evolves over time - <strong>our unique differentiator</strong>
        </p>
      </div>

      {/* Unique Value Prop Banner */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border border-yellow-300">
        <div className="flex items-start gap-3">
          <Activity className="text-orange-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">🚀 BrandOS Exclusive Feature</h3>
            <p className="text-sm text-gray-700">
              Unlike static brand generators, your BrandOS brand is <strong>alive</strong>. 
              It learns from performance data, adapts to contexts, and evolves with your business.
              This is what sets us apart from BrandCrowd, Canva, and others.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Adaptive Behaviors */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Adaptive Behaviors
          </h3>
          <div className="space-y-3">
            {/* Seasonal Adaptation */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.seasonal}
                onChange={(e) => handleChange('seasonal', e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  Seasonal Adaptation
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically adjust colors and messaging for holidays, seasons, and special events
                </p>
                {formData.seasonal && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Your brand will celebrate with your customers
                  </p>
                )}
              </div>
            </label>

            {/* Contextual Optimization */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contextual}
                onChange={(e) => handleChange('contextual', e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <Globe className="w-4 h-4 text-blue-500" />
                  Contextual Optimization
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Adapt to different contexts (dark mode, backgrounds, sizes) automatically
                </p>
                {formData.contextual && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Always looks perfect regardless of where it's displayed
                  </p>
                )}
              </div>
            </label>

            {/* Platform Optimization */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.platformOptimized}
                onChange={(e) => handleChange('platformOptimized', e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  Platform-Specific Optimization
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Optimize for different platforms (LinkedIn vs Instagram vs Website)
                </p>
                {formData.platformOptimized && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Each platform gets the perfect version of your brand
                  </p>
                )}
              </div>
            </label>

            {/* Performance-Driven Evolution */}
            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.performanceDriven}
                onChange={(e) => handleChange('performanceDriven', e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Performance-Driven Evolution
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Evolve based on engagement metrics and A/B testing results
                </p>
                {formData.performanceDriven && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Your brand gets better over time based on real data
                  </p>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Evolution Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Evolution Settings
          </h3>
          
          {/* Learning Enabled */}
          <div className="mb-4">
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={formData.learningEnabled}
                onChange={(e) => handleChange('learningEnabled', e.target.checked)}
              />
              <span className="font-medium">Enable AI Learning</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Recommended</span>
            </label>
            {formData.learningEnabled && (
              <p className="text-sm text-gray-600 ml-7">
                Your brand will learn from user interactions and improve over time
              </p>
            )}
          </div>

          {/* Experimentation Rate */}
          <div className="mb-4">
            <label className="text-xs text-gray-600 flex justify-between mb-1">
              <span>Experimentation Rate</span>
              <span>{formData.experimentationRate}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={formData.experimentationRate}
              onChange={(e) => handleChange('experimentationRate', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Conservative</span>
              <span>Experimental</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formData.experimentationRate < 10 && 'Very stable, minimal changes'}
              {formData.experimentationRate >= 10 && formData.experimentationRate < 30 && 'Balanced approach to testing new variations'}
              {formData.experimentationRate >= 30 && 'Actively testing and evolving'}
            </p>
          </div>

          {/* Consistency Threshold */}
          <div className="mb-4">
            <label className="text-xs text-gray-600 flex justify-between mb-1">
              <span>Brand Consistency Threshold</span>
              <span>{formData.consistencyThreshold}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={formData.consistencyThreshold}
              onChange={(e) => handleChange('consistencyThreshold', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Flexible</span>
              <span>Strict</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formData.consistencyThreshold < 70 && 'More freedom for variations'}
              {formData.consistencyThreshold >= 70 && formData.consistencyThreshold < 90 && 'Good balance of consistency and flexibility'}
              {formData.consistencyThreshold >= 90 && 'Very strict brand guidelines'}
            </p>
          </div>

          {/* Evolution Speed */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Evolution Speed</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'slow', label: 'Slow & Steady', desc: 'Quarterly updates' },
                { value: 'moderate', label: 'Moderate', desc: 'Monthly updates' },
                { value: 'fast', label: 'Fast & Agile', desc: 'Weekly updates' }
              ].map(speed => (
                <button
                  key={speed.value}
                  onClick={() => handleChange('evolutionSpeed', speed.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    formData.evolutionSpeed === speed.value
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  )}
                >
                  <p className="font-medium text-sm">{speed.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{speed.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Living Brand Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-gray-900 mb-2">🧬 Your Living Brand DNA</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>✓ <strong>Adaptability:</strong> {
            [formData.seasonal && 'Seasonal', 
             formData.contextual && 'Contextual',
             formData.platformOptimized && 'Platform-optimized',
             formData.performanceDriven && 'Performance-driven'].filter(Boolean).join(', ') || 'Static'
          }</p>
          <p>✓ <strong>Evolution:</strong> {formData.learningEnabled ? 'AI-powered learning' : 'Manual updates only'}</p>
          <p>✓ <strong>Innovation Rate:</strong> {formData.experimentationRate}% of interactions will test variations</p>
          <p>✓ <strong>Update Frequency:</strong> {formData.evolutionSpeed} evolution cycles</p>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}