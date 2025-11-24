'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Sparkles, Download, Copy, Eye, Edit2, Settings, 
  TrendingUp, Users, Activity, BarChart3, 
  Sun, Moon, Globe, Palette, Type, Layout
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useBrandStore } from '@/store/brand-store'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { currentBrand, brands } = useBrandStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Use the first brand if no current brand is selected
  const brand = currentBrand || brands[0] || {
    identity: { name: 'My Brand' },
    visualGenome: { colorGenes: { primary: '#3B82F6' } }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="text-blue-600" size={24} />
                <span className="font-bold text-xl">BrandOS</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="font-semibold text-gray-900">{brand.identity?.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="gradient" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'brand', label: 'Brand Assets', icon: Palette },
              { id: 'applications', label: 'Applications', icon: Layout },
              { id: 'evolution', label: 'Evolution', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Brand Health Score */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-blue-600" />
                  Brand Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-gray-600 mt-1">Excellent health</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">+12%</span>
                    </div>
                    <p className="text-sm text-gray-600">vs last month</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consistency</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardDescription>Brand Applications</CardDescription>
                  <CardTitle className="text-2xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Across 5 platforms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Evolution Stage</CardDescription>
                  <CardTitle className="text-2xl">Stage 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Learning phase</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Adaptations Today</CardDescription>
                  <CardTitle className="text-2xl">7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">3 contextual, 4 platform</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Brand Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: Sun, text: 'Seasonal adaptation applied for winter', time: '2 hours ago', color: 'text-blue-600' },
                    { icon: Globe, text: 'Platform optimization for LinkedIn', time: '5 hours ago', color: 'text-purple-600' },
                    { icon: Palette, text: 'Color palette refined based on engagement', time: '1 day ago', color: 'text-green-600' },
                    { icon: Type, text: 'Typography weight adjusted for better readability', time: '2 days ago', color: 'text-orange-600' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-6">
            {/* Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle>Logo System</CardTitle>
                <CardDescription>Your adaptive logo variations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Primary Logo */}
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-gray-100 rounded-lg p-8 mb-2">
                      <div 
                        className="w-20 h-20 rounded-lg mx-auto"
                        style={{ backgroundColor: brand.visualGenome?.colorGenes?.primary || '#3B82F6' }}
                      />
                    </div>
                    <p className="text-sm font-medium">Primary</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-gray-900 rounded-lg p-8 mb-2">
                      <div className="w-20 h-20 bg-white rounded-lg mx-auto" />
                    </div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Icon Only */}
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-gray-100 rounded-lg p-8 mb-2">
                      <div 
                        className="w-20 h-20 rounded-full mx-auto"
                        style={{ backgroundColor: brand.visualGenome?.colorGenes?.primary || '#3B82F6' }}
                      />
                    </div>
                    <p className="text-sm font-medium">Icon</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Monochrome */}
                  <div className="border rounded-lg p-4 text-center">
                    <div className="bg-gray-100 rounded-lg p-8 mb-2">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg mx-auto" />
                    </div>
                    <p className="text-sm font-medium">Monochrome</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Your brand&apos;s color system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Primary Colors</p>
                    <div className="flex gap-2">
                      {['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'].map(color => (
                        <div key={color} className="text-center">
                          <div 
                            className="w-20 h-20 rounded-lg shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-xs mt-1 font-mono">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Neutral Colors</p>
                    <div className="flex gap-2">
                      {['#F9FAFB', '#E5E7EB', '#6B7280', '#111827'].map(color => (
                        <div key={color} className="text-center">
                          <div 
                            className="w-20 h-20 rounded-lg shadow-sm border"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-xs mt-1 font-mono">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="space-y-6">
            {/* Evolution Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Evolution Timeline</CardTitle>
                <CardDescription>How your brand has adapted over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { date: 'Today', change: 'Winter seasonal colors activated', type: 'seasonal', improvement: '+15% engagement' },
                    { date: '3 days ago', change: 'LinkedIn optimization applied', type: 'platform', improvement: '+22% clicks' },
                    { date: '1 week ago', change: 'Simplified logo for small sizes', type: 'adaptive', improvement: '+18% recognition' },
                    { date: '2 weeks ago', change: 'Color contrast improved', type: 'performance', improvement: '+25% readability' }
                  ].map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.change}</p>
                            <p className="text-sm text-gray-500">{event.date}</p>
                          </div>
                          <span className="text-sm font-medium text-green-600">{event.improvement}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evolution Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Evolution Settings</CardTitle>
                <CardDescription>Configure how your brand evolves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Evolution</p>
                      <p className="text-sm text-gray-500">Allow AI to optimize your brand</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Seasonal Adaptations</p>
                      <p className="text-sm text-gray-500">Adjust for holidays and seasons</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Platform Optimization</p>
                      <p className="text-sm text-gray-500">Optimize for different platforms</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}