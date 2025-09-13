export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Have a question, suggestion, or found a bug? We&apos;d love to hear from you! 
              Choose the best way to reach out based on your needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email Support</h3>
                <p className="text-gray-600 mb-3">For general questions and support</p>
                <a href="mailto:support@simpsons-dle.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  support@simpsons-dle.com
                </a>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🐛 Bug Reports</h3>
                <p className="text-gray-600 mb-3">Found a bug or technical issue?</p>
                <a href="mailto:bugs@simpsons-dle.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  bugs@simpsons-dle.com
                </a>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Feature Requests</h3>
                <p className="text-gray-600 mb-3">Have an idea for a new feature?</p>
                <a href="mailto:features@simpsons-dle.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  features@simpsons-dle.com
                </a>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Character Suggestions</h3>
                <p className="text-gray-600 mb-3">Know a character we should add?</p>
                <a href="mailto:characters@simpsons-dle.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  characters@simpsons-dle.com
                </a>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: How often do new characters get added?</h3>
                <p className="text-gray-700">A: We regularly review character suggestions and add new ones based on popularity and availability of accurate data.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: Can I suggest improvements to the game?</h3>
                <p className="text-gray-700">A: Absolutely! We welcome all feedback and feature suggestions. Use our feature request email above.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: Is there a mobile app?</h3>
                <p className="text-gray-700">A: Currently, Simpson&apos;s DLE is a web-based game that works great on mobile browsers. A dedicated app may come in the future!</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Q: How do I report incorrect character information?</h3>
                <p className="text-gray-700">A: If you notice incorrect data about a character, please email us at bugs@simpsons-dle.com with the character name and the issue.</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Response Times</h2>
            <p className="text-gray-700 leading-relaxed">
              We typically respond to emails within 24-48 hours during weekdays. Bug reports are prioritized 
              and may receive faster responses. Please be patient as we&apos;re a small team working to make 
              Simpson&apos;s DLE the best it can be!
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 