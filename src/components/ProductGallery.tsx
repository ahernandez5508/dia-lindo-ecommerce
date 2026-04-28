'use client'
import { useState } from 'react'

type Props = {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-salmon/20 rounded-2xl flex items-center justify-center text-carbon/20 text-xs">
        Sin imagen
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square bg-salmon/20 rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail strip — only when 2+ images */}
      {images.length >= 2 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver imagen ${i + 1} de ${alt}`}
              aria-current={i === activeIndex}
              className={`aspect-square rounded-lg overflow-hidden ring-2 transition ${
                i === activeIndex
                  ? 'ring-terracota'
                  : 'ring-transparent hover:ring-salmon'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
