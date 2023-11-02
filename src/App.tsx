import { useCallback, useState } from 'react'
import { sanitize } from 'har-sanitizer';
import FileSaver from 'file-saver';
import {useDropzone} from 'react-dropzone'

import './App.css'

function App() {
  type SanitizationType = 'obfuscate' | 'hash';

  const [cookieConfig, setCookieConfig ] = useState<SanitizationType>('obfuscate');
  const [tokensConfig, setTokensConfig ] = useState<SanitizationType>('obfuscate');

  const onDrop = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const content = new TextDecoder("utf-8").decode(await file.arrayBuffer());
    const sanitized = await sanitize(JSON.parse(content), {
      cookies: cookieConfig,
      tokens: tokensConfig,
    });
    const blob = new Blob(
      [JSON.stringify(sanitized, null, 2)],
      { type: "text/plain;charset=utf-8" }
    );
    FileSaver.saveAs(blob, file.name.replace('.har', '-sanitized.har'));
  }, [cookieConfig, tokensConfig])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <>
      <h1>Har Sanitizer</h1>
      <input {...getInputProps()} />
      <hr />
      <div {...getRootProps()} style={{ minWidth: 445 }}>
        {
          isDragActive ?
            <p>Drop your HAR file to get it sanitized...</p> :
            <p>Drop your HAR file to get it sanitized, or click to select files</p>
        }
      </div>
      <hr />
      <div style={{ textAlign: 'left'}}>
        <ul>
          <li>Cookies will be either <strong>obfuscated</strong> or <strong>hashed</strong>.</li>
          <li>Tokens will be either <strong>obfuscated</strong> or <strong>hashed</strong>.</li>
          <li>Passwords will be obfuscated.</li>
        </ul>
        <p>
          Configuration:
        </p>
        <div>
          Cookies:
          <select onChange={e => setCookieConfig(e.target.value as SanitizationType)}>
            <option value="obfuscate">obfuscate</option>
            <option value="hash">hash</option>
          </select>
        </div>
        <div>
          Tokens:
          <select onChange={e => setTokensConfig(e.target.value as SanitizationType)}>
            <option value="obfuscate">obfuscate</option>
            <option value="hash">hash</option>
          </select>
        </div>
      </div>
      <p>
        Open sourced at <a href="https://github.com/jfromaniello/hars">hars</a>.
      </p>
    </>
  )
}

export default App
