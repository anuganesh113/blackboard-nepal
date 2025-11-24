import { 
  Cpu, Globe, Zap, Terminal, Command, // Tech
  TrendingUp, Wallet, Shield, Landmark, PieChart, // Finance
  Palette, PenTool, Image, Camera, Sparkles, // Creative
  Leaf, Flower2, Sun, Mountain, Droplet, // Nature
  Crown, Gem, Star, Diamond, Award // Luxury
} from 'lucide-react';

export interface BrandColors {
  primary: string;
  secondary: string;
  background: string;
  onPrimary: string; // Text color on primary background
  text: string;
}

export interface BrandTypography {
  headingFont: string;
  bodyFont: string;
}

export type LogoLayout = 'vertical' | 'horizontal' | 'monogram';
export type IconStyle = 'filled-square' | 'filled-circle' | 'outline' | 'minimal';

export interface BrandIdentity {
  id: string;
  colors: BrandColors;
  typography: BrandTypography;
  vibe: string;
  iconName: string;
  layout: LogoLayout;
  iconStyle: IconStyle;
}

// Icon Mapping
const iconMap: Record<string, string[]> = {
  tech: ['Cpu', 'Globe', 'Zap', 'Terminal', 'Command'],
  finance: ['TrendingUp', 'Wallet', 'Shield', 'Landmark', 'PieChart'],
  creative: ['Palette', 'PenTool', 'Image', 'Camera', 'Sparkles'],
  nature: ['Leaf', 'Flower2', 'Sun', 'Mountain', 'Droplet'],
  luxury: ['Crown', 'Gem', 'Star', 'Diamond', 'Award']
};

// Helper to get component by string name (for the UI to use)
export const getIconComponent = (name: string) => {
  const icons: any = { 
    Cpu, Globe, Zap, Terminal, Command,
    TrendingUp, Wallet, Shield, Landmark, PieChart,
    Palette, PenTool, Image, Camera, Sparkles,
    Leaf, Flower2, Sun, Mountain, Droplet,
    Crown, Gem, Star, Diamond, Award
  };
  return icons[name] || Zap;
};

// Curated Color Palettes
const palettes: Record<string, BrandColors[]> = {
  tech: [
    { primary: '#3b82f6', secondary: '#1e40af', background: '#ffffff', onPrimary: '#ffffff', text: '#0f172a' }, // Blue/Clean
    { primary: '#8b5cf6', secondary: '#6d28d9', background: '#fafafa', onPrimary: '#ffffff', text: '#18181b' }, // Purple/SaaS
    { primary: '#10b981', secondary: '#059669', background: '#ecfdf5', onPrimary: '#ffffff', text: '#064e3b' }, // Green/Modern
  ],
  finance: [
    { primary: '#0f172a', secondary: '#334155', background: '#f8fafc', onPrimary: '#ffffff', text: '#020617' }, // Slate/Trust
    { primary: '#1e3a8a', secondary: '#172554', background: '#ffffff', onPrimary: '#ffffff', text: '#0f172a' }, // Navy/Classic
  ],
  creative: [
    { primary: '#ec4899', secondary: '#db2777', background: '#fff1f2', onPrimary: '#ffffff', text: '#831843' }, // Pink/Bold
    { primary: '#f59e0b', secondary: '#d97706', background: '#fffbeb', onPrimary: '#ffffff', text: '#78350f' }, // Amber/Warm
    { primary: '#6366f1', secondary: '#4338ca', background: '#ffffff', onPrimary: '#ffffff', text: '#312e81' }, // Indigo/Electric
  ],
  nature: [
    { primary: '#4d7c0f', secondary: '#365314', background: '#f7fee7', onPrimary: '#ffffff', text: '#1a2e05' }, // Olive/Organic
    { primary: '#0d9488', secondary: '#0f766e', background: '#f0fdfa', onPrimary: '#ffffff', text: '#134e4a' }, // Teal/Fresh
  ],
  luxury: [
    { primary: '#1c1917', secondary: '#44403c', background: '#fafaf9', onPrimary: '#ffffff', text: '#292524' }, // Stone/Minimal
    { primary: '#78716c', secondary: '#57534e', background: '#ffffff', onPrimary: '#ffffff', text: '#1c1917' }, // Warm Grey
  ]
};

// Curated Font Pairings
const typography: Record<string, BrandTypography[]> = {
  tech: [
    { headingFont: 'Inter, sans-serif', bodyFont: 'Inter, sans-serif' },
    { headingFont: 'Plus Jakarta Sans, sans-serif', bodyFont: 'Inter, sans-serif' },
  ],
  finance: [
    { headingFont: 'Playfair Display, serif', bodyFont: 'Lato, sans-serif' },
    { headingFont: 'Merriweather, serif', bodyFont: 'Open Sans, sans-serif' },
  ],
  creative: [
    { headingFont: 'Space Grotesk, sans-serif', bodyFont: 'Space Grotesk, sans-serif' },
    { headingFont: 'Abril Fatface, cursive', bodyFont: 'Lato, sans-serif' },
  ],
  nature: [
    { headingFont: 'Nunito, sans-serif', bodyFont: 'Nunito, sans-serif' },
    { headingFont: 'Lora, serif', bodyFont: 'Lato, sans-serif' },
  ],
  luxury: [
    { headingFont: 'Cinzel, serif', bodyFont: 'Montserrat, sans-serif' },
    { headingFont: 'Bodoni Moda, serif', bodyFont: 'Lato, sans-serif' },
  ]
};

export const generateBrand = (_name: string, industry: string): BrandIdentity => {
  // 1. Get available resources
  const industryPalettes = palettes[industry] || palettes.tech;
  const industryFonts = typography[industry] || typography.tech;
  const industryIcons = iconMap[industry] || iconMap.tech;

  // 2. Random Selection
  const selectedPalette = industryPalettes[Math.floor(Math.random() * industryPalettes.length)];
  const selectedTypography = industryFonts[Math.floor(Math.random() * industryFonts.length)];
  const selectedIcon = industryIcons[Math.floor(Math.random() * industryIcons.length)];
  
  // 3. Layout Randomization logic
  const layouts: LogoLayout[] = ['vertical', 'horizontal', 'monogram'];
  const styles: IconStyle[] = ['filled-square', 'filled-circle', 'outline', 'minimal'];

  return {
    id: crypto.randomUUID(),
    colors: selectedPalette,
    typography: selectedTypography,
    vibe: industry,
    iconName: selectedIcon,
    layout: layouts[Math.floor(Math.random() * layouts.length)],
    iconStyle: styles[Math.floor(Math.random() * styles.length)],
  };
};
