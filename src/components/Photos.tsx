'use client'

import { useEffect, useRef } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { motion, useSpring } from 'motion/react'
import clsx from 'clsx'

import { useInteractive } from '@/components/Interactions'

const lean = { stiffness: 170, damping: 14 }
const tilt = { stiffness: 200, damping: 20 }

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
      let falloff = Math.exp(-Math.hypot(dx, dy) / 500)
      x.set(dx * 0.025 * falloff)
      y.set(dy * 0.02 * falloff)
      r.set(rotate + dx * 0.004 * falloff)
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive, rotate, x, y, r])

  return (
    <motion.div
      ref={ref}
      drag={interactive}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 170, bounceDamping: 14 }}
      whileDrag={{ zIndex: 10 }}
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
          rotateY.set(((event.clientX - box.left) / box.width - 0.5) * 14)
          rotateX.set(-((event.clientY - box.top) / box.height - 0.5) * 14)
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
  let rotations = [2, -2, 2, 2, -2]

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
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
