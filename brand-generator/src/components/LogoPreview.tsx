import { getIconComponent, BrandIdentity } from '../lib/generator';

interface LogoPreviewProps {
  brand: BrandIdentity;
  brandName: string;
}

export function LogoPreview({ brand, brandName }: LogoPreviewProps) {
  const Icon = getIconComponent(brand.iconName);
  const initials = brandName.substring(0, 2).toUpperCase();

  const IconContainer = ({ children }: { children: React.ReactNode }) => {
    const baseClasses = "flex items-center justify-center transition-all duration-300";
    
    switch (brand.iconStyle) {
      case 'filled-circle':
        return (
          <div 
            className={`${baseClasses} w-16 h-16 rounded-full shadow-lg`}
            style={{ backgroundColor: brand.colors.primary, color: brand.colors.onPrimary }}
          >
            {children}
          </div>
        );
      case 'filled-square':
        return (
          <div 
            className={`${baseClasses} w-16 h-16 rounded-xl shadow-lg`}
            style={{ backgroundColor: brand.colors.primary, color: brand.colors.onPrimary }}
          >
            {children}
          </div>
        );
      case 'outline':
        return (
          <div 
            className={`${baseClasses} w-16 h-16 rounded-2xl border-4`}
            style={{ borderColor: brand.colors.primary, color: brand.colors.primary }}
          >
            {children}
          </div>
        );
      default: // minimal
        return (
          <div 
            className={`${baseClasses} w-16 h-16`}
            style={{ color: brand.colors.primary }}
          >
            {children}
          </div>
        );
    }
  };

  const containerClasses = `flex gap-6 items-center justify-center p-8 ${
    brand.layout === 'vertical' ? 'flex-col text-center' : 'flex-row text-left'
  }`;

  return (
    <div className={containerClasses}>
       {brand.layout === 'monogram' ? (
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl"
            style={{ 
              backgroundColor: brand.colors.primary, 
              color: brand.colors.onPrimary,
              fontFamily: brand.typography.headingFont 
            }}
          >
            {initials}
          </div>
       ) : (
          <IconContainer>
             <Icon size={32} strokeWidth={2} />
          </IconContainer>
       )}

       <div>
          <h1 
            className="text-4xl font-bold tracking-tight leading-tight"
            style={{ color: brand.colors.text, fontFamily: brand.typography.headingFont }}
          >
            {brandName}
          </h1>
          {brand.layout !== 'monogram' && (
             <p 
               className="mt-1 text-lg opacity-75 font-medium"
               style={{ color: brand.colors.text, fontFamily: brand.typography.bodyFont }}
             >
               The {brand.vibe} Standard.
             </p>
          )}
       </div>
    </div>
  );
}
