import React from "react"
// import { HorizontalScrollCarousel } from "@/components/ui/HorizontalScrollCarousel"

const images = [
  "https://images.unsplash.com/photo-1572099606223-6e29045d7de3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501426614169-0dca89e36cd5?q=80&w=1000&auto=format&fit=crop",
]

export default function HorizontalScrollCarouselDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Horizontal Scroll Carousel
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Scroll down to see the carousel in action with smooth horizontal scrolling animation
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition">
              View Demo
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <section className="min-h-[200vh] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">Keep scrolling...</p>
          <div className="w-1 h-16 bg-gradient-to-b from-white to-transparent mx-auto animate-bounce" />
        </div>
      </section>

      {/* Carousel Section */}
      {/* <HorizontalScrollCarousel 
        images={images}
        title="Featured Gallery"
        subtitle="Experience the smooth horizontal scroll effect as you scroll down the page"
        cardWidth={400}
        cardHeight={450}
      /> */}
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Carousel Component Coming Soon</h2>
          <p className="text-gray-400">The HorizontalScrollCarousel component is currently being developed.</p>
        </div>
      </section>

      {/* Footer Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Scroll Complete!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The horizontal scroll carousel component provides a smooth, engaging user experience by transforming vertical scroll into horizontal card movement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🎨 Customizable</h3>
              <p className="text-gray-400">Easy to customize colors, sizes, and animations</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="font-bold text-lg mb-2">⚡ Performance</h3>
              <p className="text-gray-400">Optimized with Framer Motion for smooth animations</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="font-bold text-lg mb-2">📱 Responsive</h3>
              <p className="text-gray-400">Works seamlessly on all device sizes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
