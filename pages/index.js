import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';

import { store, initConfig, addNotification } from '../lib/store';
import { connect } from 'unistore/preact';

async function addBookmark (ev) {
  ev.preventDefault();

  const { config } = store.getState();

  const getBookmarksRequest = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repositoryName}/contents/bookmarks.jsonl`,
    {
      headers: {
        'authorization': `Basic ${btoa(`${config.username}:${config.token}`)}`
      }
    }
  );
  if (!getBookmarksRequest.ok) {
    addNotification({ type: 'error', message: 'Something went wrong adding bookmark.' }); 
    return;
  }

  const body = await getBookmarksRequest.json();
  const bookmarks = atob(body.content);

  const form = ev.target;
  const now = new Date().toISOString();
  const newBookmark = {
    url: form.querySelector('input[name="url"]').value,
    title: form.querySelector('input[name="title"]').value,
    description: form.querySelector('textarea[name="description"]').value,
    createdAt: now,
    updatedAt: now,
  };

  const newBookmarks = bookmarks + `${JSON.stringify(newBookmark)}\n`

  const updateBookmarksRequest = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repositoryName}/contents/bookmarks.jsonl`,
    {
      body: JSON.stringify({
        message: `Added "${newBookmark.url}"`,
        content: btoa(newBookmarks),
        sha: body.sha,
      }),
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization': `Basic ${btoa(`${config.username}:${config.token}`)}`
      }
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
