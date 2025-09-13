export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
            <div className="text-sm text-gray-600">Win Percentage</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Max Streak</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guess Distribution</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((guess) => (
              <div key={guess} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-4">{guess}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: '0%' }}
                  >
                    <span className="text-xs font-medium text-white">0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Statistics Work</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Games Played:</strong> Total number of Simpson's DLE games you've completed</p>
            <p><strong>Win Percentage:</strong> Percentage of games won out of total games played</p>
            <p><strong>Current Streak:</strong> Number of consecutive games won</p>
            <p><strong>Max Streak:</strong> Your longest streak of consecutive wins</p>
            <p><strong>Guess Distribution:</strong> Shows how many guesses it typically takes you to win</p>
          </div>
        </div>
      </div>
    </div>
  )
} 