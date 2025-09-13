export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Simpson&apos;s DLE</h1>
        
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is Simpson&apos;s DLE?</h2>
            <p className="text-gray-700 leading-relaxed">
              Simpson&apos;s DLE is a daily guessing game inspired by Wordle and other word games, but focused on the 
              beloved characters from The Simpsons TV show. Each day, players try to guess a different Simpson&apos;s 
              character using various clues about their first appearance, occupation, gender, and other characteristics.
            </p>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Every day at midnight, a new Simpson&apos;s character is selected as the target. Players have 5 attempts 
                to guess the correct character. With each guess, you&apos;ll receive feedback in the form of colored squares:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span>Green means your guess matches the target character for that category</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span>Red means your guess doesn&apos;t match the target character for that category</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Game Modes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Challenge</h3>
                <p className="text-gray-700">
                  Play the official daily Simpson&apos;s DLE with a new character each day. 
                  Compare your results with friends and other players worldwide.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Mode</h3>
                <p className="text-gray-700">
                  Can&apos;t wait for tomorrow? Play unlimited rounds with random characters 
                  and practice your Simpson&apos;s knowledge anytime.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy & Data</h2>
            <p className="text-gray-700 leading-relaxed">
              Simpson&apos;s DLE stores your game statistics locally in your browser. We don&apos;t collect personal 
              information or track your gameplay across devices. Your statistics and progress are private 
              and remain on your device.
            </p>
          </section>

          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Credits</h2>
            <p className="text-gray-700 leading-relaxed">
              Simpson&apos;s DLE is inspired by Wordle and other daily puzzle games. The Simpsons is created by 
              Matt Groening and owned by Fox Broadcasting Company. This game is a fan project and is not 
              affiliated with or endorsed by Fox or the creators of The Simpsons.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 