'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { motion, useDragControls, useSpring } from 'motion/react'
import clsx from 'clsx'

import { useInteractive } from '@/components/Interactions'

const lean = { stiffness: 170, damping: 14 }
const tilt = { stiffness: 200, damping: 20 }
const rotations = [2, -2, 2, 2, -2]

// Tuning: how far the cursor's pull reaches (px), how strongly photos follow it,
// and the maximum hover tilt (degrees).
const leanReach = 500
const leanX = 0.025
const leanY = 0.02
const leanTurn = 0.004
const maxTilt = 14

function Photo({
  image,
  rotate,
  interactive,
}: {
  image: StaticImageData
  rotate: number
  interactive: boolean
}) {
  let ref = useRef<HTMLDivElement>(null)
  // stay on top until the snap-back finishes, not just while held
  let [lifted, setLifted] = useState(false)
  let drag = useDragControls()
  let x = useSpring(0, lean)
  let y = useSpring(0, lean)
  let r = useSpring(rotate, lean)
  let rotateX = useSpring(0, tilt)
  let rotateY = useSpring(0, tilt)

  // Lean gently toward the cursor, fading out with distance.
  // The rect is the outer (un-leaned) box, so the lean never feeds back into itself.
  useEffect(() => {
    if (!interactive) return

    function onMove(event: PointerEvent) {
      let box = ref.current!.getBoundingClientRect()
      let dx = event.clientX - (box.left + box.width / 2)
      let dy = event.clientY - (box.top + box.height / 2)
      let falloff = Math.exp(-Math.hypot(dx, dy) / leanReach)
      x.set(dx * leanX * falloff)
      y.set(dy * leanY * falloff)
      r.set(rotate + dx * leanTurn * falloff)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      // settle back if effects switch off mid-session (e.g. reduced motion turned on)
      x.set(0)
      y.set(0)
      r.set(rotate)
      rotateX.set(0)
      rotateY.set(0)
    }
  }, [interactive, rotate, x, y, r, rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      // Mouse-only drag: motion's own listener would block touch scrolling over the
      // strip on touchscreen laptops, where the primary pointer is still a mouse.
      drag={interactive}
      dragListener={false}
      dragControls={drag}
      onPointerDown={(event) => {
        if (interactive && event.pointerType === 'mouse') drag.start(event)
      }}
      dragSnapToOrigin
      dragTransition={{
        bounceStiffness: lean.stiffness,
        bounceDamping: lean.damping,
      }}
      onDragStart={() => setLifted(true)}
      onDragTransitionEnd={() => setLifted(false)}
      style={{ zIndex: lifted && interactive ? 10 : undefined }}
      className={clsx(
        'relative aspect-9/10 w-44 flex-none sm:w-72',
        interactive && 'cursor-grab active:cursor-grabbing',
      )}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-xl bg-zinc-100 sm:rounded-2xl dark:bg-zinc-800"
        style={{ x, y, rotate: r, rotateX, rotateY, transformPerspective: 900 }}
        whileHover={{ scale: 1.05 }}
        onPointerMove={(event) => {
          if (!interactive) return
          let box = event.currentTarget.getBoundingClientRect()
          rotateY.set(((event.clientX - box.left) / box.width - 0.5) * maxTilt)
          rotateX.set(-((event.clientY - box.top) / box.height - 0.5) * maxTilt)
        }}
        onPointerLeave={() => {
          rotateX.set(0)
          rotateY.set(0)
        }}
      >
        <Image
          src={image}
          alt=""
          sizes="(min-width: 640px) 18rem, 11rem"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

export function Photos({ images }: { images: Array<StaticImageData> }) {
  let interactive = useInteractive()

  return (
    <div className="mt-16 sm:mt-20">
      {/* clip only sideways, so a dragged photo can move up and down freely */}
      <div className="-my-4 flex justify-center gap-5 overflow-x-clip py-4 sm:gap-8">
        {images.map((image, imageIndex) => (
          <Photo
            key={image.src}
            image={image}
            rotate={rotations[imageIndex % rotations.length]}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  )
}
