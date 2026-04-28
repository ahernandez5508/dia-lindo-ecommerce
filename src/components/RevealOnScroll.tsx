'use client'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
}

export default function RevealOnScroll({ children, className = '', as = 'section' }: Props) {
  const { ref, inView } = useInViewOnce<HTMLElement>()
  const Tag = as as 'section'
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`${className} transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </Tag>
  )
}
