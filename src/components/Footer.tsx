'use client'

import { useState } from 'react'
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareText = `I just played Simpson's DLE! Can you guess today's character? 🎮`
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Simpson's DLE",
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.log('Error copying to clipboard:', err)
      }
    }
  }

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-ring"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <ShareIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Share Score</span>
              </>
            )}
          </button>

          {/* Daily puzzle note */}
          <div className="text-center sm:text-right">
            <p className="text-sm text-white">
              New puzzle every day at midnight! 🌙
            </p>
            <p className="text-xs text-white mt-1">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
