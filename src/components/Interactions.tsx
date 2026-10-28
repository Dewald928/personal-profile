'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { motion, useSpring } from 'motion/react'

// Effects only run with a real mouse and no reduced-motion request.
// Touch screens and reduced motion get the plain, static site.
const INTERACTIVE_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function subscribe(onChange: () => void) {
  let media = window.matchMedia(INTERACTIVE_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function useInteractive() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(INTERACTIVE_QUERY).matches,
    () => false,
  )
}

export function Interactions() {
  let interactive = useInteractive()
  let x = useSpring(0, { stiffness: 60, damping: 14 })
  let y = useSpring(0, { stiffness: 60, damping: 14 })
  let opacity = useSpring(0, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (!interactive) return

    function onMove(event: PointerEvent) {
      if (opacity.get() === 0) {
        x.jump(event.clientX)
        y.jump(event.clientY)
      }
      x.set(event.clientX)
      y.set(event.clientY)
      opacity.set(1)

      // ponytail: reads every [data-glow] rect per move, fine for a page of cards; delegate to the hovered card if a page ever has hundreds
      for (let el of document.querySelectorAll<HTMLElement>('[data-glow]')) {
        let rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        el.style.setProperty('--my', `${event.clientY - rect.top}px`)
      }
    }

    function onLeave() {
      opacity.set(0)
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [interactive, x, y, opacity])

  if (!interactive) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -mt-[350px] -ml-[350px] size-[700px] rounded-full spotlight"
      style={{ x, y, opacity }}
    />
  )
}
