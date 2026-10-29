import nextMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // The feed lists articles from disk at request time; ship them with the function
  outputFileTracingIncludes: {
    '/feed.xml': ['./src/app/articles/*/page.mdx'],
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack needs plugins by name, not as imported functions
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['@mapbox/rehype-prism'],
  },
})

export default withMDX(nextConfig)
