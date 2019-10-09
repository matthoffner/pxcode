import React, { useEffect, useState, lazy, Suspense } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { stringify } from 'flatted';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { LiveProvider, LiveError, LivePreview } from "react-live"
import constructApp from './build-html';

const snippet = `function Component() {
  React.useEffect(() => {
    console.log(' 🎉 welcome to pxcode  🎉');
  }, []);
  return (
  <div style={{ padding: '10px', height: '100%', width: '100%', position: 'fixed', fontFamily: 'Comic Sans MS' }}>
    <h1>Welcome to pxcode</h1>
    <div>
      Build React apps on your phone, deploy as PWA. 
    </div>
    <h2>package.json shoutouts</h2>
    <li>
      react-live
    </li>
    <li>
      react-simple-code-editor
    </li>
    <li>
      gatsby
    </li>
  </div>
    )
  }
  
  render(<Component />);
  `
const scope = { lazy, Suspense, useEffect, useState }

const IndexPage = () => {
  const [code, setCode] = useState("")
  const [saved, saveCode] = useState("")
  const [show, showSnippet] = useState(true)
  const [exported, setExport] = useState("")
  const [showPreview, setShowPreview] = useState("")
  const debug = console.log;
  let snippets = [];
  const saveSnippet = () => {
    import('html2canvas').then(c => c.default(document.getElementById('livePreview')).then(canvas => {
      snippets = [{
        snapshot: canvas.toDataURL(),
        savedCode: code
      }, ...saved]
      return snippets;
    })).then(saved => {
      saveCode(saved);
    });
  }

  if (process.browser) {
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
  }
  const makeTextFile = (text) => {
    var data = new Blob([text], { type: 'text/plain' });
    const textFile = window.URL.createObjectURL(data);

    return textFile;
  };

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
      {saved.length && show ? (
        <div className="blueprint"
          style={{
            width: "100%",
            paddingBottom: 10,
            position: "fixed",
            zIndex: 1,
            cursor: 'pointer',
            'overlow-y': 'auto'
          }}
        >
          {saved.map((v, i) => (
            <div style={{ padding: '5px', color: 'white' }} key={i}>
              <div className="box" style={{ width: '30%', display: 'inline-block', margin: '10px' }}>
                <img width="100%" src={`data:image/jpeg;charset=utf-8;base64${v.snapshot}`} />
              </div>
              <div className="box" style={{ display: 'inline' }}>
                <textarea value={v.savedCode} disabled={true}
                  style={{ height: '250px', width: '60%', display: 'inline-block' }}
                  className="npm__react-simple-code-editor__textarea" />
              </div>
              <div>filename.js</div>
              <a href="#" style={{ color: 'white' }} onClick={() => {
                const app = constructApp(v.savedCode);
                const url = makeTextFile(app);
                setExport(url);
              }}>export</a>
              <br />
              <a onClick={() => {
                setCode(v.savedCode);
                showSnippet(false);
              }} href="#" style={{ color: 'white ' }}>load</a>
            </div>
          ))}
          {exported && <div><a download="filename.html" href={exported} class="language-jsx">{exported}</a>
            <button onClick={() => setExport(null)}>Back</button></div>}
          <div style={{ position: 'fixed', bottom: 0 }}>
            <button onClick={() => showSnippet(!show)}>Show</button>
          </div>
        </div>
      ) :
        <LiveProvider noInline={true} scope={scope} code={code || snippet}>
          <div id="livePreview" style={{ height: '100%', position: 'fixed', width: '100%' }}>
            <LivePreview />
          </div>
          {!showPreview && <div style={{ backgroundColor: 'white', position: 'fixed', bottom: 0 }}>
            <Editor
              value={code || snippet}
              onValueChange={e => setCode(e)}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 10,
                width: '100%'
              }}
            />
            <pre style={{ overflowY: 'auto', height: '50px' }} id="log">pxcode loaded...<br /></pre>
            <LiveError />
            <div>
              <button onClick={() => saveSnippet()}>Save</button>
              <button onClick={() => showSnippet(!show)}>Show</button>
              <input onKeyDown={e => e.keyCode === 13 && injectCode(e.target.value)} />
              <button style={{ position: 'fixed', right: 0 }} onClick={() => setShowPreview(true)}>Preview</button>
            </div>
          </div>}
          {showPreview && <div style={{ position: 'fixed', bottom: 0 }}>
            <button onClick={() => saveSnippet()}>Save</button>
            <button onClick={() => showSnippet(!show)}>Show</button>
            <button style={{ position: 'fixed', right: 0 }} onClick={() => setShowPreview(false)}>Editor</button>
          </div>}
        </LiveProvider>}
    </Layout >
  )
}

export default IndexPage
