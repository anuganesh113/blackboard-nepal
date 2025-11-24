import { Briefcase, Palette, Code, RefreshCw, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateBrand, type BrandIdentity } from './lib/generator';
import { LogoPreview } from './components/LogoPreview';
import { motion } from 'framer-motion';

function App() {
  const [brandName, setBrandName] = useState('Acme Corp');
  const [industry, setIndustry] = useState('tech');
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate "AI" processing time
    setTimeout(() => {
      setBrand(generateBrand(brandName, industry));
      setLoading(false);
    }, 600);
  };

  // Generate initial brand
  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl tracking-tight">Brand.js</span>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Generate Brand Identity + Code System
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Brand Inputs
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input 
                    type="text" 
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Vibe</label>
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="tech">Tech / SaaS (Modern, Clean)</option>
                    <option value="finance">Finance (Trust, Blue/Green)</option>
                    <option value="creative">Creative (Bold, Playful)</option>
                    <option value="nature">Nature / Wellness (Organic)</option>
                    <option value="luxury">Luxury (Minimal, Serif)</option>
                  </select>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Generating...' : 'Generate Identity'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Why is this different?</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                BrandCrowd gives you a PNG. <br/>
                <strong>Brand.js</strong> gives you a <code className="bg-blue-100 px-1 rounded">theme.js</code> file ready for your React app.
              </p>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Logo Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex flex-col relative">
               <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-500 rounded-full uppercase tracking-wider">Visual Identity</span>
               </div>
               
               {brand && (
                 <div className="flex-1 flex items-center justify-center p-12 transition-colors duration-500" style={{ backgroundColor: brand.colors.background }}>
                    <div className="text-center w-full">
                      <motion.div 
                        key={brand.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <LogoPreview brand={brand} brandName={brandName} />
                      </motion.div>
                    </div>
                 </div>
               )}
            </div>

            {/* The "Code" Part (Unique Value Prop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Color Palette Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Palette
                 </h3>
                 {brand && (
                   <div className="space-y-3">
                      {Object.entries(brand.colors).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-12 h-12 rounded-lg shadow-sm border border-gray-100" style={{ backgroundColor: color }}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 capitalize">{name}</p>
                            <p className="text-xs text-gray-500 font-mono group-hover:text-blue-600">{color}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Code Export Card */}
              <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-100 relative group">
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded flex items-center gap-1">
                      <Download size={12} /> Copy
                    </button>
                 </div>
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Design Tokens
                 </h3>
                 {brand && (
                   <pre className="font-mono text-xs leading-relaxed overflow-x-auto">
{`export const theme = {
  colors: {
    primary: "${brand.colors.primary}",
    secondary: "${brand.colors.secondary}",
    background: "${brand.colors.background}",
    text: "${brand.colors.text}"
  },
  fonts: {
    heading: "${brand.typography.headingFont}",
    body: "${brand.typography.bodyFont}"
  },
  borderRadius: "0.5rem"
}`}
                   </pre>
                 )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default App
