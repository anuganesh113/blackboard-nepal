import { create } from 'zustand'
import { BrandDNA, BrandLogo } from '@/types/brand'
import { generateId } from '@/lib/utils'

interface BrandState {
  // Current brand being created/edited
  currentBrand: Partial<BrandDNA> | null
  
  // All user's brands
  brands: BrandDNA[]
  
  // Wizard state
  wizardStep: number
  wizardData: any
  
  // UI state
  isGenerating: boolean
  generationProgress: number
  
  // Actions
  setCurrentBrand: (brand: Partial<BrandDNA> | null) => void
  updateCurrentBrand: (updates: Partial<BrandDNA>) => void
  saveBrand: (brand: BrandDNA) => void
  deleteBrand: (id: string) => void
  
  // Wizard actions
  setWizardStep: (step: number) => void
  updateWizardData: (data: any) => void
  resetWizard: () => void
  
  // Generation actions
  setGenerating: (isGenerating: boolean) => void
  setGenerationProgress: (progress: number) => void
  
  // Initialize brand DNA
  initializeBrandDNA: (data: any) => BrandDNA
}

export const useBrandStore = create<BrandState>((set, get) => ({
  currentBrand: null,
  brands: [],
  wizardStep: 0,
  wizardData: {},
  isGenerating: false,
  generationProgress: 0,

  setCurrentBrand: (brand) => set({ currentBrand: brand }),
  
  updateCurrentBrand: (updates) => 
    set((state) => ({
      currentBrand: state.currentBrand 
        ? { ...state.currentBrand, ...updates }
        : updates
    })),

  saveBrand: (brand) => 
    set((state) => ({
      brands: [...state.brands.filter(b => b.id !== brand.id), brand]
    })),

  deleteBrand: (id) =>
    set((state) => ({
      brands: state.brands.filter(b => b.id !== id),
      currentBrand: state.currentBrand?.id === id ? null : state.currentBrand
    })),

  setWizardStep: (step) => set({ wizardStep: step }),
  
  updateWizardData: (data) =>
    set((state) => ({
      wizardData: { ...state.wizardData, ...data }
    })),
  
  resetWizard: () => set({ 
    wizardStep: 0, 
    wizardData: {}, 
    currentBrand: null 
  }),

  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setGenerationProgress: (progress) => set({ generationProgress: progress }),

  initializeBrandDNA: (data): BrandDNA => {
    const brand: BrandDNA = {
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      
      identity: {
        name: data.name || '',
        tagline: data.tagline || '',
        mission: data.mission || '',
        vision: data.vision || '',
        values: data.values || [],
        personality: data.personality || []
      },
      
      market: {
        industry: data.industry || '',
        targetAudience: data.targetAudience || '',
        competitors: data.competitors || [],
        differentiator: data.differentiator || ''
      },
      
      visualGenome: {
        colorGenes: {
          primary: data.primaryColor || '#0066CC',
          secondary: data.secondaryColor,
          accent: data.accentColor,
          mode: data.colorMode || 'vibrant'
        },
        shapeGenes: {
          geometry: data.geometry || 'rounded',
          complexity: data.complexity || 0.5,
          symmetry: data.symmetry || 0.8
        },
        typographyGenes: {
          personality: data.typographyPersonality || 'modern',
          weight: data.fontWeight || 'regular',
          style: data.fontStyle || 'sans-serif'
        },
        styleGenes: {
          minimalism: data.minimalism || 0.5,
          friendliness: data.friendliness || 0.5,
          innovation: data.innovation || 0.5,
          trust: data.trust || 0.5
        }
      },
      
      behaviors: {
        voice: {
          tone: data.tone || 'friendly',
          humor: data.humor || 0.3,
          technicality: data.technicality || 0.5
        },
        adaptability: {
          seasonal: data.seasonal || false,
          contextual: data.contextual || true,
          platformOptimized: data.platformOptimized || true,
          performanceDriven: data.performanceDriven || false
        },
        evolution: {
          learningEnabled: data.learningEnabled || true,
          experimentationRate: data.experimentationRate || 0.2,
          consistencyThreshold: data.consistencyThreshold || 0.8
        }
      }
    }
    
    return brand
  }
}))