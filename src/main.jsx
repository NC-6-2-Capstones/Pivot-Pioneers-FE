import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


// const theme = extendTheme({})

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      {/* <ChakraProvider theme={theme}> */}
        <App />
      {/* </ChakraProvider> */}
    </React.StrictMode>
  )