'use client'

import { ReactNode } from 'react'

interface HeroSectionProps {
  title: string
  subtitle: string
  children?: ReactNode
  className?: string
}

export function HeroSection({ title, subtitle, children, className = '' }: HeroSectionProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}
