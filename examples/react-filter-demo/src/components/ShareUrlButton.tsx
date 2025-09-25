import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

export function ShareUrlButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    
    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: 'Product Filter Configuration',
          text: 'Check out this product filter configuration',
          url: url
        })
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error sharing URL:', error)
      // Fallback for older browsers
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError)
      }
    }
  }

  return (
    <button onClick={handleShare} className="share-button">
      {copied ? (
        <>
          <Check size={16} />
          Copied!
        </>
      ) : (
        <>
          {navigator.share ? <Share2 size={16} /> : <Copy size={16} />}
          Share Filters
        </>
      )}
    </button>
  )
}