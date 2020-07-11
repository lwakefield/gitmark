import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import { connect } from 'unistore/preact';

import { store, initConfig, addNotification } from '../lib/store';
import { encodeToBase64, decodeFromBase64 } from '../lib/util';

async function addBookmark (ev) {
  ev.preventDefault();

  const { config } = store.getState();
  const headers = {
    'authorization': `Basic ${encodeToBase64(`${config.username}:${config.token}`)}`
  };

  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  const getBookmarksRequest = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repositoryName}/contents/bookmarks/${today}.jsonl`,
    { headers },
  );

  let bookmarks = '';
  let sha;
  if (getBookmarksRequest.status === 200) {
    const body = await getBookmarksRequest.json();
    sha = body.sha;
    bookmarks = decodeFromBase64(body.content);
  } else if (getBookmarksRequest.status === 404) {
  } else {
    addNotification({ type: 'error', message: 'Something went wrong adding bookmark.' }); 
    return;
  }

  const form = ev.target;
  const newBookmark = {
    url: form.querySelector('input[name="url"]').value,
    title: form.querySelector('input[name="title"]').value,
    description: form.querySelector('textarea[name="description"]').value,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const newBookmarks = bookmarks + `${JSON.stringify(newBookmark)}\n`

  const updateBookmarksRequest = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repositoryName}/contents/bookmarks/${today}.jsonl`,
    {
      body: JSON.stringify({
        message: `Added "${newBookmark.url}"`,
        content: encodeToBase64(newBookmarks),
        sha,
      }),
      method: 'PUT',
      headers: { 'content-type': 'application/json', ...headers, }
    }
  );

  if (updateBookmarksRequest.ok) {
    addNotification({ type: 'success', message: 'Successfully added bookmark.' }); 
  } else {
    addNotification({ type: 'error', message: 'Something went wrong adding bookmark.' }); 
  }

};

export default connect('config')(({ config }) => {
  const [ current, setCurrent ] = useState(null);

  useEffect(initConfig, []);
  useEffect(() => {
    if (typeof browser !== 'undefined') {
      (async () => {
        const [ tab ] = await browser.tabs.query({ active: true, currentWindow: true });
        setCurrent({ url: tab.url, title: tab.title });
      })();
    }
  }, []);

  if (!config) {
    return (
      <div>
        <Link href="/config">
          You need to set up the configuration first.
        </Link>
      </div>
    );
  }

  return (
    <div>

      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={addBookmark}>
        <label>
          URL:
          <input type="text" name="url" value={current && current.url} />
        </label>
        <label>
          Title:
          <input type="text" name="title" value={current && current.title} />
        </label>
        <label>
          Description:
          <textarea style={{ height: '8rem' }} name="description" />
        </label>
        <button>Add</button>
      </form>

      <div style={{ fontSize: '0.7rem' }}>
        <Link href="/config">Configuration</Link>
        &nbsp;|&nbsp;
        <Link href="/about">About</Link>
      </div>

    </div>
  );
});
