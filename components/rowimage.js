import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import styles from './rowimage.module.css'

export default function RowImage({
  title,
  contentSnippet,
  credit,
  link,
  url,
  index,
  screen,
  height,
}) {
  const randomInteger = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  const isEven = (number) => number % 2 === 0

  const [styleObj, setStyleObj] = useState(null)

  const myImg = useRef(null)

  useEffect(() => {
    if (screen === 'portrait' && index !== 0) {
      setStyleObj({
        transform: `translateY(-${randomInteger(
          50,
          height - myImg.current.clientHeight
        )}px)`,
      })
    }
    if (screen === 'landscape') {
      setStyleObj({
        gridRow: `${index + 1} / ${index + 2}`,
        gridColumn: isEven(index)
          ? `${randomInteger(1, 3)} / ${randomInteger(8, 10)}`
          : `${randomInteger(4, 5)} / ${randomInteger(11, 13)}`,
        marginTop:
          index === 0
            ? `calc(${randomInteger(5, 25)} * var(--vh, 1vh))`
            : `calc(${randomInteger(75, 175)} * var(--vh, 1vh))`,
      })
    }
  }, [screen])

  return (
    <a
      ref={myImg}
      style={styleObj}
      className={styles.link}
      href={link}
      aria-label={title}
    >
      <figure className={styles.fig}>
        <Image
          className={styles.img}
          layout="responsive"
          src={url}
          width="160"
          height="90"
          alt={credit}
        />
        <figcaption className={styles.cred}>{contentSnippet}</figcaption>
      </figure>
    </a>
  )
}
