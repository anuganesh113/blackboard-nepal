export interface BrandDNA {
  id: string
  userId?: string
  createdAt: Date
  updatedAt: Date
  
  // Core Identity
  identity: {
    name: string
    tagline?: string
    mission?: string
    vision?: string
    values: string[]
    personality: string[]
  }
  
  // Industry & Market
  market: {
    industry: string
    targetAudience: string
    competitors?: string[]
    differentiator?: string
  }
  
  // Visual Genome (Our unique concept)
  visualGenome: {
    colorGenes: {
      primary: string
      secondary?: string
      accent?: string
      neutrals?: string[]
      mode: 'vibrant' | 'muted' | 'monochrome' | 'bold'
    }
    shapeGenes: {
      geometry: 'rounded' | 'sharp' | 'organic' | 'geometric'
      complexity: number // 0-1
      symmetry: number // 0-1
    }
    typographyGenes: {
      personality: 'modern' | 'classic' | 'playful' | 'serious' | 'elegant'
      weight: 'light' | 'regular' | 'bold'
      style: 'sans-serif' | 'serif' | 'display'
    }
    styleGenes: {
      minimalism: number // 0-1
      friendliness: number // 0-1
      innovation: number // 0-1
      trust: number // 0-1
    }
  }
  
  // Behavioral Traits (Living brand concept)
  behaviors: {
    voice: {
      tone: 'formal' | 'casual' | 'friendly' | 'authoritative'
      humor: number // 0-1
      technicality: number // 0-1
    }
    adaptability: {
      seasonal: boolean
      contextual: boolean
      platformOptimized: boolean
      performanceDriven: boolean
    }
    evolution: {
      learningEnabled: boolean
      experimentationRate: number // 0-1
      consistencyThreshold: number // 0-1
    }
  }
  
  // Generated Assets
  assets?: {
    logo?: BrandLogo
    colors?: ColorPalette
    typography?: Typography
    patterns?: Pattern[]
    mockups?: Mockup[]
  }
  
  // Performance Metrics
  metrics?: {
    consistencyScore?: number
    recognitionScore?: number
    engagementScore?: number
    evolutionStage?: number
  }
}

export interface BrandLogo {
  id: string
  primary: LogoVariant
  variations: LogoVariant[]
  adaptations?: {
    darkMode?: LogoVariant
    icon?: LogoVariant
    wordmark?: LogoVariant
    monochrome?: LogoVariant
  }
}

export interface LogoVariant {
  id: string
  svg?: string
  png?: string
  colors: string[]
  dimensions: {
    width: number
    height: number
  }
  context?: string[]
}

export interface ColorPalette {
  primary: string
  secondary?: string
  accent?: string
  neutral: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  semantic?: {
    success: string
    warning: string
    error: string
    info: string
  }
}

export interface Typography {
  heading: FontSpec
  body: FontSpec
  display?: FontSpec
  mono?: FontSpec
}

export interface FontSpec {
  family: string
  fallback: string[]
  weights: number[]
  size: {
    base: number
    scale: number
  }
}

export interface Pattern {
  id: string
  name: string
  svg: string
  usage: string[]
}

export interface Mockup {
  id: string
  name: string
  type: 'business-card' | 'letterhead' | 'social-media' | 'website' | 'app'
  preview: string
  editable: boolean
}

export interface BrandEvolution {
  version: number
  changes: {
    date: Date
    type: 'color' | 'logo' | 'typography' | 'style'
    description: string
    metrics?: {
      before: number
      after: number
    }
  }[]
  learnings: string[]
}

export interface BrandWizardStep {
  id: string
  title: string
  description: string
  fields: FormField[]
  validation?: (data: any) => boolean
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'slider' | 'color' | 'radio'
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  min?: number
  max?: number
  step?: number
  defaultValue?: any
}