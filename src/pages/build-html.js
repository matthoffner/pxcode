export default function constructApp(func) {
    const pureFunc = func.toString().replace('render(<Component />);', '');
    const html = `
    <html>
    <body>
    <div id="root"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.24.0/babel.js"></script>
    <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
    <script type="text/babel">
        ${pureFunc}
        ReactDOM.render(<Component />, document.getElementById('root'));
      </script>
      </body>
      </html>
    `
    return html;
}