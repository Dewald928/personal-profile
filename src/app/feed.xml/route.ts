import assert from 'assert'
import * as cheerio from 'cheerio'
import { Feed } from 'feed'

import { getAllArticles } from '@/lib/articles'

export async function GET(req: Request) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    throw Error('Missing NEXT_PUBLIC_SITE_URL environment variable')
  }

  let author = { name: 'Dewald Krynauw' }

  let feed = new Feed({
    title: author.name,
    description:
      'Software engineer based in South Africa and Chief Information Officer of Yknot. Building real-world solutions for real-world problems.',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  // Newest first. Never cache an empty feed: it would stick at the CDN for a year.
  let articleIds = (await getAllArticles()).map((article) => article.slug)
  assert(articleIds.length > 0, 'No articles found for the feed')

  for (let id of articleIds) {
    let url = String(new URL(`/articles/${id}`, req.url))
    let res = await fetch(url)
    assert(res.ok, `Fetching ${url} for the feed failed with ${res.status}`)
    let html = await res.text()
    let $ = cheerio.load(html)

    let publicUrl = `${siteUrl}/articles/${id}`
    let article = $('article').first()
    let title = article.find('h1').first().text()
    let date = article.find('time').first().attr('datetime')
    let content = article.find('[data-mdx-content]').first().html()

    assert(typeof title === 'string')
    assert(typeof date === 'string')
    assert(typeof content === 'string')

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      content,
      author: [author],
      contributor: [author],
      date: new Date(date),
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
