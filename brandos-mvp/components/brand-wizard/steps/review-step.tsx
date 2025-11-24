'use client'

import { useState } from 'react'
import { Check, Sparkles, Edit, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBrandStore } from '@/store/brand-store'
import { useRouter } from 'next/navigation'

interface ReviewStepProps {
  data: any
  onUpdate: (data: any) => void
  errors: Record<string, string>
}

export function ReviewStep({ data, onUpdate, errors }: ReviewStepProps) {
  const router = useRouter()
  const { 
    setGenerating, 
    setGenerationProgress,
    initializeBrandDNA,
    saveBrand,
    setCurrentBrand,
    setWizardStep
  } = useBrandStore()
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('')

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerating(true)
    setGenerationProgress(0)

    try {
      // Simulate generation steps (in production, this would call your AI API)
      const steps = [
        { message: 'Analyzing brand DNA...', progress: 20 },
        { message: 'Generating visual concepts...', progress: 40 },
        { message: 'Creating logo variations...', progress: 60 },
        { message: 'Building color palette...', progress: 80 },
        { message: 'Finalizing brand assets...', progress: 100 }
      ]

      for (const step of steps) {
        setGenerationStep(step.message)
        setGenerationProgress(step.progress)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Create the brand DNA
      const brandDNA = initializeBrandDNA(data)
      
      // Add some mock generated assets
      brandDNA.assets = {
        logo: {
          id: 'logo-1',
          primary: {
            id: 'primary-logo',
            svg: '<svg>...</svg>',
            colors: [data.primaryColor || '#3B82F6'],
            dimensions: { width: 200, height: 60 }
          },
          variations: []
        },
        colors: {
          primary: data.primaryColor || '#3B82F6',
          neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a'
          }
        }
      }

      // Save the brand
      saveBrand(brandDNA)
      setCurrentBrand(brandDNA)

      // Navigate to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)

    } catch (error) {
      console.error('Generation error:', error)
      setGenerationStep('Error generating brand. Please try again.')
    } finally {
      setIsGenerating(false)
      setGenerating(false)
    }
  }

  const editStep = (stepIndex: number) => {
    setWizardStep(stepIndex)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Living Brand</h2>
        <p className="text-gray-600">
          Everything looks great! Review your brand DNA and generate your living brand system.
        </p>
      </div>

      {/* Brand DNA Summary */}
      <div className="space-y-4">
        {/* Identity Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Brand Identity
            </h3>
            <button
              onClick={() => editStep(0)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>Name:</strong> {data.name || 'Not set'}</p>
            {data.tagline && <p><strong>Tagline:</strong> {data.tagline}</p>}
            {data.values && data.values.length > 0 && (
              <p><strong>Values:</strong> {data.values.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Market Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Market Position
            </h3>
            <button
              onClick={() => editStep(1)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>Industry:</strong> {data.industry || 'Not set'}</p>
            {data.targetAudience && data.targetAudience.length > 0 && (
              <p><strong>Target Audience:</strong> {data.targetAudience.join(', ')}</p>
            )}
            {data.differentiator && (
              <p><strong>Differentiator:</strong> {data.differentiator}</p>
            )}
          </div>
        </div>

        {/* Style Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Visual Style
            </h3>
            <button
              onClick={() => editStep(2)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <strong>Primary Color:</strong>
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: data.primaryColor || '#3B82F6' }}
              />
              <span>{data.primaryColor || '#3B82F6'}</span>
            </div>
            <p><strong>Style:</strong> {data.colorMode || 'vibrant'}, {data.geometry || 'rounded'}</p>
            <p><strong>Typography:</strong> {data.typographyPersonality || 'modern'}</p>
          </div>
        </div>

        {/* Personality Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Brand Personality
            </h3>
            <button
              onClick={() => editStep(3)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            {data.personality && data.personality.length > 0 && (
              <p><strong>Traits:</strong> {data.personality.join(', ')}</p>
            )}
            <p><strong>Voice:</strong> {data.tone || 'friendly'}</p>
            <p><strong>Communication:</strong> {data.humor > 50 ? 'Humorous' : 'Serious'}, {data.technicality > 50 ? 'Technical' : 'Simple'}</p>
          </div>
        </div>

        {/* Living Behaviors Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-300 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              Living Brand Behaviors
            </h3>
            <button
              onClick={() => editStep(4)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-green-700">
              <strong>✓ Adaptive Features:</strong> {
                [data.seasonal && 'Seasonal', 
                 data.contextual && 'Contextual',
                 data.platformOptimized && 'Platform-optimized'].filter(Boolean).join(', ') || 'None'
              }
            </p>
            <p className="text-green-700">
              <strong>✓ Evolution:</strong> {data.learningEnabled ? 'AI-powered' : 'Manual'} | 
              Speed: {data.evolutionSpeed || 'moderate'}
            </p>
            <p className="text-green-700">
              <strong>✓ Innovation Rate:</strong> {data.experimentationRate || 20}%
            </p>
          </div>
        </div>
      </div>

      {/* Unique Value Proposition */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-300">
        <h3 className="font-bold text-lg mb-2">🚀 Your Unique Living Brand</h3>
        <p className="text-sm text-gray-700 mb-4">
          Unlike traditional static brands, your BrandOS-powered brand will:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>Evolve automatically</strong> based on performance data</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>Adapt to contexts</strong> (dark mode, seasons, platforms)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>Learn from interactions</strong> to improve over time</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-600 mt-0.5" />
            <span><strong>Stay consistent</strong> while allowing for innovation</span>
          </li>
        </ul>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        {!isGenerating ? (
          <Button
            variant="gradient"
            size="xl"
            onClick={handleGenerate}
            className="min-w-[250px]"
          >
            <Sparkles className="mr-2" />
            Generate Living Brand
          </Button>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Loader2 className="animate-spin text-blue-600" />
              <span className="font-medium">{generationStep}</span>
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>We'll generate your complete brand system using AI</li>
          <li>You'll get logo variations, color palettes, and brand guidelines</li>
          <li>Your brand will start learning and adapting immediately</li>
          <li>Access your dashboard to manage and monitor your living brand</li>
        </ol>
      </div>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}

function generationProgress(generationProgress: any): import("react").CSSProperties | undefined {
  throw new Error('Function not implemented.')
}