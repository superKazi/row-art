// react & next
import { useLayoutEffect, useState } from 'react'
import Head from 'next/head'
// libraries
import Parser from 'rss-parser'
import { debounce } from 'mini-debounce'
// components & styles
import RowImage from '../components/rowimage'
import styles from '../styles/style.module.css'

export default function Home({ feed: { items } }) {
  const images = items.map((item) => {
    let fullImageItem = { ...item }
    fullImageItem.media.$.url = fullImageItem.media.$.url.replace(
      '160x160',
      '1600x900'
    )
    return fullImageItem
  })

  const [screen, setScreen] = useState(false)
  const [height, setHeight] = useState(false)

  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.matchMedia('(orientation: portrait)').matches
      ? setScreen('portrait')
      : setScreen('landscape')
    screen === 'portrait' && setHeight(document.body.clientHeight)
    window.addEventListener(
      'resize',
      debounce(() => {
        vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        window.matchMedia('(orientation: portrait)').matches
          ? setScreen('portrait')
          : setScreen('landscape')
        screen === 'portrait'
          ? setHeight(document.body.clientHeight)
          : setHeight(false)
      }, 150)
    )
  }, [])

  return (
    <>
      <Head />
      <main className={styles.main}>
        <h1 className={styles.hed}>
          <a className={styles.row} href="https://restofworld.org">
            Rest of World
          </a>
          <br />
          Latest Stories
          <br />
          via Imagery
        </h1>
        {screen === 'portrait' && (
          <p className={styles.point} aria-label="scroll right">
            👉
          </p>
        )}
        {screen === 'landscape' && (
          <p className={styles.point} aria-label="scroll down">
            👇
          </p>
        )}
        {screen && (
          <section className={styles.section}>
            {images.map(
              (
                {
                  title,
                  contentSnippet,
                  credit,
                  link,
                  media: {
                    $: { url },
                  },
                },
                index
              ) => (
                <RowImage
                  key={url}
                  title={title}
                  contentSnippet={contentSnippet}
                  credit={credit}
                  link={link}
                  url={url}
                  index={index}
                  screen={screen}
                  height={height}
                />
              )
            )}
          </section>
        )}
      </main>
    </>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'media'],
        ['media:credit', 'credit'],
      ],
    },
  })
  const feed = await parser.parseURL('https://restofworld.org/feed/latest/')

  return {
    props: {
      feed,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 3600, // In seconds
  }
}
