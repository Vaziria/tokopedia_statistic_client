import Head from 'next/head'
import { useState } from 'react'
import CategorySelect  from "../components/CategorySelect"

export default function Home() {
  const [categs, setCateg ] = useState([0,0,0])
  return (
    <div className="container">
      <Head>
        <title>Stat Tokopedia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <CategorySelect
        onChange={setCateg}
        onChangeLevel={(level)=>console.log(level)}
      ></CategorySelect>

      {
        categs.map(categ => `| ${ categ }`)
      }

      </main>

    </div>
  )
}
