import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    "I'm Dewald Krynauw. I live in New York City, where I design the future.",
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            I&apos;m Dewald Krynauw. I live in South Africa, where I build the
            future.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I&apos;ve loved making things for as long as I can remember, it
              started with Lego, building spaceships robots and rockets. But
              that static nature of Lego was not enough for me, I needed more
              action! That&apos;s when I got my Lego Mindstorm kit (After
              ceaseless begging of course). Inspired by Mythbusters and
              Battlebots I started building robots, and I haven&apos;t stopped
              since.
            </p>
            <p>
              When I was 12, I build a robot that solves a Rubik&apos;s cube (I
              was still faster than the robot though). I participated in the
              Siemens Cyber Junkyard Challenge. Started learning how to code,
              and program PLCs and microcontrollers. Got obsessed with Games and
              Game development, and maybe got a minecraft addiction too. But
              then I started looking up, and I saw the stars, and I knew I had
              to go there.
            </p>
            <p>
              I started studying Computer and Electronics Engineering at
              Potchefstroom University. Did my Masters in Deep Learning and AI,
              specifically in the field of Solar Flare prediction. But then
              everything changed when the CryptoKitties attacked.
            </p>
            <p>
              Today, I&apos;m a Software Engineer at Yknot Blockchain Solutions,
              where I&apos;m building the future of blockchain technology. We
              are busy leveraging the power of blockchain to build a better
              future for everyone.
            </p>
          </div>
          <div className="mt-6">
            <h2>Skills</h2>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                I&apos;m a full-stack developer, with a focus on blockchain
                development. I&apos;ve worked with a wide range of technologies
                and languages, and I&apos;m always looking to learn more.
              </p>
              <p>I&apos;m currently working with the following technologies:</p>
              <ul className="list-inside list-disc">
                <li>DevOps and Cloud</li>
                <li>React</li>
                <li>Vue</li>
                <li>Next.js</li>
                <li>Typescript</li>
                <li>Node.js</li>
                <li>MySQL & MongoDb</li>
                <li>Solidity</li>
                <li>C & C++</li>
                <li>Python</li>
                <li>Excel</li>
                <li>Linux</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://twitter.com/FuZzyWaZzie"
              icon={TwitterIcon}
            >
              Follow on Twitter
            </SocialLink>
            {/* <SocialLink href="#" icon={InstagramIcon} className="mt-4">
              Follow on Instagram
            </SocialLink> */}
            <SocialLink
              href="https://github.com/Dewald928"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/dewald-k-6a080298/"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            {/* <SocialLink
              href="mailto:dewald123@rocketmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              dewald123@rocketmail.com
            </SocialLink> */}
          </ul>
        </div>
      </div>
    </Container>
  )
}
