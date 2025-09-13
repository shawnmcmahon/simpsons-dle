export default function Header() {
  return (
    <header className="bg-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Simpson's DLE</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="/about" className="text-gray-700 hover:text-gray-900">About</a>
            <a href="/statistics" className="text-gray-700 hover:text-gray-900">Statistics</a>
          </nav>
        </div>
      </div>
    </header>
  )
} 