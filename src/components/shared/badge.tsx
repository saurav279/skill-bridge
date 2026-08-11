import React from 'react'

export function BadgeText({text}: {text: string}) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          {text}
  </p>
  )
}

