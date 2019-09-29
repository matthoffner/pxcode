import React, { useEffect, useState, lazy, Suspense } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { stringify } from 'flatted';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { LiveProvider, LiveError, LivePreview } from "react-live"
import html2canvas from 'html2canvas'
const snippet = `function Component() {
  console.log('welcome to pxcode');
  const [a, b] = useState('world');
  return (
      <div style={{ cursor: 'pointer', paddingTop: '100px', textAlign: 'center', margin: 'auto' }}>
        <div onClick={e => a === 'world' ? b('world!') : b('world')}>
          Hello {a}
        </div>
      </div>
    )
  }
  
  render(<><Component /></>);
  `
const scope = { lazy, Suspense, useEffect, useState }

const IndexPage = () => {
  const [code, setCode] = useState("")
  const [saved, saveCode] = useState("")
  const [show, showSnippet] = useState(true)
  const debug = console.log;
  let snippets = [];
  const saveSnippet = () => {
    const livePreview = document.getElementById('livePreview');
    html2canvas(document.getElementById('livePreview')).then(canvas => {
      snippets = [{
        snapshot: canvas.toDataURL(),
        savedCode: code
      }, ...saved]
      return snippets;
    }).then(saved => {
      console.log(saved);
      saveCode(saved);
    });
  }
  var logger = document.getElementById('log');

  console.log = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'object') {
        if (logger) {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />'; logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        }
      } else {
        if (logger) {
          logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
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
              <div style={{ padding: 10, backgroundColor: 'gold' }} key={i}>
                <div style={{ width: '30%', display: 'inline-block' }}>
                  <img width="100%" src={`data:image/jpeg;charset=utf-8;base64${v.snapshot}`} />
                </div>
                <div style={{ width: '70%', display: 'inline-block' }}>
                  {v.savedCode}
                </div>
              </div>
            ))}
          </div>
        ) : null}


        <LiveProvider noInline={true} scope={scope} code={code || snippet}>
          <div id="livePreview">
            <LivePreview />
          </div>
          <div style={{ position: 'fixed', bottom: 0 }}>
            <Editor
              value={code || snippet}
              onValueChange={e => setCode(e)}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
            <pre style={{ overflowY: 'auto', height: '250px' }} id="log">pxcode loaded...<br /></pre>
            <LiveError />
            <div>
              <button onClick={() => saveSnippet()}>Save</button>
              <button onClick={() => showSnippet(!show)}>Show</button>
              <input onKeyDown={e => e.keyCode === 13 && injectCode(e.target.value)} />
            </div>
          </div>
        </LiveProvider>



      </div>
    </Layout >
  )
}

export default IndexPage
