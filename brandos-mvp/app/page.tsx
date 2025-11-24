'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sparkles, ChevronRight, Zap, Brain, TrendingUp, 
  Shield, Users, Star, Check, Play, ArrowRight,
  Activity, RefreshCw, Globe, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-600" size={24} />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrandOS
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/create">
                <Button variant="gradient">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm mb-6">
              <Activity className="w-4 h-4" />
              <span>Introducing the first Living Brand System</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Brand is
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Alive</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stop creating static logos. Build a <strong>living brand</strong> that evolves with your business, 
              adapts to contexts, and learns from performance.
            </p>

            {/* Unique Value Props */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Evolves automatically</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Adapts to contexts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Learns from data</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>Always consistent</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/create">
                <Button variant="gradient" size="xl">
                  <Sparkles className="mr-2" />
                  Create Living Brand
                </Button>
              </Link>
              <Button variant="outline" size="xl" onClick={() => setIsVideoPlaying(true)}>
                <Play className="mr-2" size={20} />
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free beta access • 5 minutes to launch
            </p>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Static Brand */}
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-6 mb-3">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Traditional Logo</p>
                  </div>
                  <p className="font-semibold text-gray-700">Static Brand</p>
                  <p className="text-sm text-gray-500">One size fits none</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="hidden md:block">
                    <ChevronRight className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                {/* Living Brand */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-2 animate-pulse" />
                      <div className="absolute -top-2 -right-2">
                        <Activity className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                    <p className="text-xs text-purple-700 font-medium">BrandOS Living Brand</p>
                  </div>
                  <p className="font-semibold text-blue-700">Living Brand</p>
                  <p className="text-sm text-blue-600">Adapts & evolves</p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Auto-evolving</span>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">AI-powered</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Problem with Traditional Branding
            </h2>
            <p className="text-xl text-gray-600">
              Static brands can&apos;t keep up with dynamic businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">One-Time Creation</CardTitle>
                <CardDescription className="text-red-600">
                  Download once, never updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Traditional logo makers give you a static file. Your brand stays frozen 
                  while your business evolves.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700">No Adaptation</CardTitle>
                <CardDescription className="text-orange-600">
                  Same look everywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Your logo looks the same on Instagram, LinkedIn, and your website - 
                  missing platform-specific optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-700">No Learning</CardTitle>
                <CardDescription className="text-yellow-600">
                  Zero performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  You never know if your brand is working. No metrics, no improvement, 
                  no evolution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Introducing <span className="text-blue-600">Living Brands</span>
            </h2>
            <p className="text-xl text-gray-600">
              A brand that grows with you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Auto-Evolution</h3>
              <p className="text-sm text-gray-600">
                Your brand evolves based on performance data and user interactions
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Context Aware</h3>
              <p className="text-sm text-gray-600">
                Adapts to dark mode, seasons, platforms, and special events automatically
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Learning</h3>
              <p className="text-sm text-gray-600">
                Learns from engagement metrics and optimizes for better performance
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Performance Tracking</h3>
              <p className="text-sm text-gray-600">
                Real-time analytics on brand recognition and engagement
              </p>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              BrandOS vs Traditional Logo Makers
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">
                      <span className="text-gray-500">Traditional</span>
                    </th>
                    <th className="text-center py-3 px-4">
                      <span className="text-blue-600 font-bold">BrandOS</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Logo Creation', '✓', '✓'],
                    ['Auto-Evolution', '✗', '✓'],
                    ['Context Adaptation', '✗', '✓'],
                    ['Performance Tracking', '✗', '✓'],
                    ['AI Learning', '✗', '✓'],
                    ['Seasonal Updates', '✗', '✓'],
                    ['Platform Optimization', '✗', '✓'],
                    ['A/B Testing', '✗', '✓'],
                    ['Brand Health Monitoring', '✗', '✓'],
                    ['Continuous Updates', '✗', '✓']
                  ].map(([feature, traditional, brandos]) => (
                    <tr key={feature} className="border-b">
                      <td className="py-3 px-4">{feature}</td>
                      <td className="text-center py-3 px-4">
                        {traditional === '✓' ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">✗</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How BrandOS Works
            </h2>
            <p className="text-xl text-gray-600">
              Create your living brand in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Define Brand DNA</h3>
              <p className="text-gray-600">
                Answer questions about your business, values, and goals. Our AI analyzes your unique needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Living Brand</h3>
              <p className="text-gray-600">
                AI creates your brand system with logos, colors, and guidelines that adapt and evolve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Watch It Grow</h3>
              <p className="text-gray-600">
                Your brand learns from data, adapts to contexts, and evolves automatically over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  Free
                  <span className="text-sm font-normal text-gray-500 block">Forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Brand DNA creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Basic logo generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">3 brand applications</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="ml-6 text-sm">Limited adaptations</span>
                  </li>
                </ul>
                <Link href="/create" className="w-full">
                  <Button variant="outline" className="w-full">Start Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Growth - Popular */}
            <Card className="border-blue-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  $29
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Auto-evolution enabled</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Performance analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>
                <Link href="/create" className="w-full">
                  <Button variant="gradient" className="w-full">Start Growing</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  $99
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Everything in Growth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Custom AI training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Team collaboration</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to bring your brand to life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the beta and be among the first to experience living brands
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
                <Sparkles className="mr-2" />
                Create Living Brand
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Limited beta spots available • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400" size={20} />
              <span className="font-bold">BrandOS</span>
              <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full ml-2">
                BETA
              </span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 BrandOS. The future of branding.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}