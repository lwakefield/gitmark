import React from 'react'
import Link from 'next/link'

export default () => <div>
  <p>
    <strong>gitmark</strong> is a dead simple bookmarking browser extension that saves bookmarks to a GitHub repository.
  </p>

  <p>Currently, only Firefox with GitHub is supported. Please <a href="https://github.com/lwakefield/gitmark">contribute</a> if you want to more platforms and providers supported!</p>

  <p>
    To use <strong>gitmark</strong>, you need a <a href="https://github.com/join">GitHub account</a>, and a <a href="https://github.com/settings/tokens">personal access token</a>. Once you have those, plug your username and token in <Link href="/config">here</Link>. Then go ahead and click "initialize" - that will create a new repository on GitHub for you which will be used to store your bookmarks. Now all you need to do is browse around until you find a website you like, click the button in your browser toolbar and hit "add".
  </p>

  <div style={{ fontSize: '0.7rem' }}>
    <Link href="/">Add a bookmark</Link>
    &nbsp;|&nbsp;
    <Link href="/config">Config</Link>
  </div>

</div>
