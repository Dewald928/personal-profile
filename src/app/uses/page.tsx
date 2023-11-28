import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="Gaming PC">
            A beefy Ryzen 9, 32GB of RAM, and an RTX 3070. For all those
            bazillion docker containers and browser tabs I have open at any
            given time. Also, minecraft.
          </Tool>
          <Tool title="MacBook Air M1">
            I prefer a superior operating system but sometimes you need to run
            travel and need a battery that lasts longer than 5 seconds.
          </Tool>
          <Tool title="Qnap NAS">
            I have too many things to store and I don&apos;t trust the cloud. So
            I mirror everything to a NAS.
          </Tool>
          <Tool title="Keychron K4 Keyboard">
            For those who want to go mechanical but don&apos;t want to wake up
            the neighbours with the clickety-clack.
          </Tool>
          <Tool title="Logitech Master 2S">
            How do people work without an infinite scroll wheel?
          </Tool>
          <Tool title="Ergonomic Merry Fair Chair">
            If I’m going to slouch in the worst ergonomic position imaginable
            all day, I might as well do it in an expensive chair.
          </Tool>
          <Tool title="Equip electronic standing desk">
            For taking breaks from slouching
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="VS code">With way too many extensions.</Tool>
          <Tool title="Docker">
            For running all the things without polluting my machine.
          </Tool>
          <Tool title="Postman">For testing APIs and documenting them.</Tool>
          <Tool title="ChatGPT and Github Copilot">
            For writing all my code for me.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Design">
          <Tool title="Figma">
            We started using Figma as just a design tool but now it’s become our
            virtual whiteboard for the entire company. Never would have expected
            the collaboration features to be the real hook.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Notion">
            Personal note taking, second brain and life organiser.
          </Tool>
          <Tool title="Jira and Confluence">
            Managing the development and documentation of a product with teams
            of developers.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
