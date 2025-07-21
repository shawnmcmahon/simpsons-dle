export default function GamesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Games</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Simpson's DLE</h2>
            <p className="text-gray-600 mb-4">Guess the Simpson's character in 5 tries</p>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Play Now →
            </a>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Unlimited Mode</h2>
            <p className="text-gray-600 mb-4">Play as many rounds as you want</p>
            <a href="/unlimited" className="text-blue-600 hover:text-blue-800 font-medium">
              Play Now →
            </a>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-400 mb-3">Coming Soon</h2>
            <p className="text-gray-400 mb-4">More Simpson's games are in development</p>
            <span className="text-gray-400 font-medium">Stay Tuned</span>
          </div>
        </div>
      </div>
    </div>
  )
} 