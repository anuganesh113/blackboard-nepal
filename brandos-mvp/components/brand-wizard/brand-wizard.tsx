'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Sparkles, Palette, Type, Target, Brain, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useBrandStore } from '@/store/brand-store'
import { IdentityStep } from './steps/identity-step'
import { MarketStep } from './steps/market-step'
import { StyleStep } from './steps/style-step'
import { PersonalityStep } from './steps/personality-step'
import { BehaviorStep } from './steps/behavior-step'
import { ReviewStep } from './steps/review-step'

const WIZARD_STEPS = [
  { id: 'identity', title: 'Brand Identity', icon: Sparkles, component: IdentityStep },
  { id: 'market', title: 'Market Position', icon: Target, component: MarketStep },
  { id: 'style', title: 'Visual Style', icon: Palette, component: StyleStep },
  { id: 'personality', title: 'Brand Personality', icon: Brain, component: PersonalityStep },
  { id: 'behavior', title: 'Living Behaviors', icon: Zap, component: BehaviorStep },
  { id: 'review', title: 'Review & Generate', icon: Sparkles, component: ReviewStep }
]

export function BrandWizard() {
  const { wizardStep, setWizardStep, wizardData, updateWizardData, isGenerating } = useBrandStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStep = WIZARD_STEPS[wizardStep]
  const StepComponent = currentStep.component
  const progress = ((wizardStep + 1) / WIZARD_STEPS.length) * 100

  const handleNext = () => {
    // Add validation here if needed
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep(wizardStep + 1)
    }
  }

  const handlePrevious = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1)
    }
  }

  const handleStepData = (data: Record<string, unknown>) => {
    updateWizardData(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Living Brand
              </h1>
              <p className="text-gray-600 mt-2">
                Build a brand that evolves with your business
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Step {wizardStep + 1} of {WIZARD_STEPS.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <Progress value={progress} showLabel />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-6">
            {WIZARD_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === wizardStep
              const isComplete = index < wizardStep
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-all",
                    isActive && "scale-110",
                    !isActive && !isComplete && "opacity-50"
                  )}
                  onClick={() => index <= wizardStep && setWizardStep(index)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isActive && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
                      isComplete && "bg-green-500 text-white",
                      !isActive && !isComplete && "bg-gray-200 text-gray-400"
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block">
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={wizardStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                data={wizardData}
                onUpdate={handleStepData}
                errors={errors}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={wizardStep === 0 || isGenerating}
            className="min-w-[120px]"
          >
            <ChevronLeft className="mr-2" size={16} />
            Previous
          </Button>
          
          {wizardStep < WIZARD_STEPS.length - 1 ? (
            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={isGenerating}
              className="min-w-[120px]"
            >
              Next
              <ChevronRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button
              variant="gradient"
              disabled={isGenerating}
              className="min-w-[150px]"
              onClick={() => {
                // Generate brand will be handled by the review step
              }}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 animate-spin" size={16} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={16} />
                  Generate Brand
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}