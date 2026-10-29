'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useSpring } from 'motion/react'

// Effects only run with a real mouse and no reduced-motion request.
// Touch screens and reduced motion get the plain, static site.
// Keep in sync with the settle-in utility in styles/tailwind.css.
const INTERACTIVE_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const follow = { stiffness: 60, damping: 14 }
const fade = { stiffness: 60, damping: 20 }

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
  let spotRef = useRef<HTMLDivElement>(null)
  let x = useSpring(0, follow)
  let y = useSpring(0, follow)
  let opacity = useSpring(0, fade)

  useEffect(() => {
    if (!interactive) return

    let visible = false
    let frame = 0
    // no glow until the cursor has actually been seen
    let pointer: { x: number; y: number } | null = null

    function clearGlow() {
      for (let el of document.querySelectorAll<HTMLElement>('[data-glow]')) {
        el.style.removeProperty('--mx')
        el.style.removeProperty('--my')
      }
    }

    function draw() {
      frame = 0

      // Read every rect before writing any style, so the browser lays out once per frame.
      // ponytail: reads every [data-glow] rect per frame, fine for a page of cards; delegate to the hovered card if a page ever has hundreds
      let glows = pointer
        ? [...document.querySelectorAll<HTMLElement>('[data-glow]')]
        : []
      let rects = glows.map((el) => el.getBoundingClientRect())

      let spot = spotRef.current
      if (spot) {
        spot.style.transform = `translate(${x.get()}px, ${y.get()}px)`
        spot.style.opacity = String(opacity.get())
      }

      if (!pointer) return
      let { x: px, y: py } = pointer
      glows.forEach((el, i) => {
        // offsetWidth / rect.width undoes any scale transform, giving element-local coordinates
        let scale = el.offsetWidth / rects[i].width || 1
        el.style.setProperty('--mx', `${(px - rects[i].left) * scale}px`)
        el.style.setProperty('--my', `${(py - rects[i].top) * scale}px`)
      })
    }

    function schedule() {
      frame ||= requestAnimationFrame(draw)
    }

    function onMove(event: PointerEvent) {
      // a touchscreen on a mouse-equipped laptop fires these too; follow the mouse only
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      if (!visible) {
        x.jump(event.clientX)
        y.jump(event.clientY)
        visible = true
      }
      x.set(event.clientX)
      y.set(event.clientY)
      opacity.set(1)
      schedule()
    }

    function onLeave() {
      visible = false
      // no cursor, no glow: an always-visible glow border would otherwise stay lit
      pointer = null
      clearGlow()
      opacity.set(0)
    }

    // springs keep animating after the pointer stops, so redraw on every change
    let unsubscribe = [x, y, opacity].map((value) =>
      value.on('change', schedule),
    )
    window.addEventListener('pointermove', onMove, { passive: true })
    // cards move under a still cursor when scrolling, so re-aim the glow
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      unsubscribe.forEach((off) => off())
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      // effects switched off: drop the glow so no card stays lit at the old spot
      clearGlow()
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [interactive, x, y, opacity])

  if (!interactive) {
    return null
  }

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -mt-[350px] -ml-[350px] size-[700px] rounded-full spotlight opacity-0"
    />
  )
}
