// react & next
import { useEffect, useState } from 'react'
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
  const [ml, setMl] = useState(false)

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    setHeight(document.body.clientHeight)
    if (window.matchMedia('(orientation: portrait)').matches) {
      setScreen('portrait')
    } else {
      setScreen('landscape')
    }
    window.addEventListener(
      'resize',
      debounce(() => {
        vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        setHeight(document.body.clientHeight)
        if (window.matchMedia('(orientation: portrait)').matches) {
          setScreen('portrait')
        } else {
          setScreen('landscape')
        }
      }, 150)
    )
  }, [])

  return (
    <>
      <Head>
        <title>Rest of World Latest Stories via imagery</title>
        <meta
          name="Description"
          content="If you’d like to choose which recent story to read solely by lede image, try this!"
        />
        <meta name="robots" content="noindex, follow" />
        <meta
          property="og:title"
          content="Rest of World Latest Stories via imagery"
        />
        <meta
          property="og:description"
          content="If you’d like to choose which recent story to read solely by lede image, try this!"
        />
        <meta property="og:image" content={images[0].media.$.url} />
        <meta property="og:url" content="https://row-art.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
    revalidate: 600,
  }
}
