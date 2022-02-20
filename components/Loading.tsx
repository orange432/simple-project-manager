import React from 'react'
import Head from 'next/head'
import styles from './Loading.module.scss'

const Loading = () => {
  return (
    <>
    <Head>
        <title>Simple Project Manager - Loading</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className={styles.center}>
      <div>Loading...</div>
    </div>
    </>
  )
}

export default Loading