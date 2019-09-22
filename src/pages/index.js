import React, { useEffect, useState, lazy, Suspense } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { stringify } from 'flatted';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"
const snippet = `function Component() {
  console.log('welcome to pxcode');
  const [a, b] = useState('world');
  return (
  <div style={{ cursor: 'pointer', paddingTop: '100px', textAlign: 'center', margin: 'auto' }}><div onClick={e => a === 'world' ? b('world!') : b('world')}> Hello {a}</div ></div>
  )

  }
  
  render(<><Component /></>);
  `
const scope = { lazy, Suspense, useEffect, useState }

const IndexPage = () => {
  const [code, setCode] = useState("")
  const [saved, saveCode] = useState("")
  const [show, showSnippet] = useState(true)
  const saveSnippet = () => {
    const snippets = [code]
    saveCode(snippets)
  }
  var old = console.log;
  const prettifyAndSet = e => {
    setCode(e)
  }

  const injectCode = e => {
    var logger = document.getElementById('log');
    try {
      var a = eval(e);
      logger.innerHTML += stringify(a) + '<br />';
    } catch (e) {
      logger.innerHTML += e + '<br />';
    }
  }
  return (
    <Layout>
      <SEO title="pxcode" />
      <div style={{ marginBottom: `1.45rem` }}>
        {saved.length && show ? (
          <div
            style={{
              width: "100%",
              paddingBottom: 10,
              position: "fixed",
              overflow: "scroll",
            }}
          >
            {saved.map((v, i) => (
              <div style={{ padding: 10, backgroundColor: 'pink' }} key={i}>
                {v}
              </div>
            ))}
          </div>
        ) : null}
        <LiveProvider noInline={true} scope={scope} code={code || snippet}>
          <div style={{ width: "100%", height: "50%" }}>
            <LivePreview />
          </div>
          <div
            style={{
              border: "1px solid black",
              width: "100%",
              height: "50%",
              position: "fixed",
              bottom: 0,
            }}
          >

            <div style={{ position: 'fixed', height: '150', width: '100%' }}>
              <LiveEditor onChange={e => prettifyAndSet(e)} />
              <pre style={{ overflow: 'scroll' }} id="log">pxcode loaded...<br /></pre>
            </div>

          </div>
          <div style={{ position: "fixed", bottom: 0 }}>
            <button onClick={() => saveSnippet()}>Save</button>
            <button onClick={() => showSnippet(!show)}>Show</button>
            <input onKeyDown={e => e.keyCode === 13 && injectCode(e.target.value)} />
          </div>
          <LiveError />
        </LiveProvider>
      </div>
    </Layout >
  )
}

export default IndexPage
