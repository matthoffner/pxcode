import React, { useEffect, useState, lazy, Suspense } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"
const snippet = `function Component() {
  const [a, b] = useState('world');
  return (
  <div style={{ cursor: 'pointer', paddingTop: '100px', textAlign: 'center', margin: 'auto' }}><div onClick={e => a === 'world' ? b('world!') : b('world')}> Hello {a}</div ></div>
  )

  }
  
  render(<Component />);
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
  const prettifyAndSet = e => {
    setCode(e)
  }

  return (
    <Layout>
      <SEO title="pxcode" />
      <div style={{ marginBottom: `1.45rem` }}>
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
            <LiveEditor onChange={e => prettifyAndSet(e)} />
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
                  <div style={{ padding: 10 }} key={i}>
                    {v}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div style={{ position: "fixed", bottom: 0 }}>
            <button onClick={e => saveSnippet()}>Save</button>
            <button onClick={e => showSnippet(!show)}>Show</button>
          </div>
          <LiveError />
        </LiveProvider>
      </div>
    </Layout>
  )
}

export default IndexPage
