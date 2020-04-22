import React, {useEffect} from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';

import { store } from '../lib/store';
import { connect } from 'unistore/preact';

function init () {
    const encodedConfig = localStorage.getItem('config');
    if (!encodedConfig) return;

    store.setState({ config: JSON.parse(encodedConfig) });

    if (typeof browser !== 'undefined') {
      (async () => {
        const [ tab ] = await browser.tabs.query({ active: true, currentWindow: true });
        store.setState({ current: { url: tab.url, title: tab.title } });
      })();
    }
}

export default connect(['config', 'current'])(({ config, current }) => {
  useEffect(init, []);

  const updateConfig = async (ev) => {
    ev.preventDefault();

    const form = ev.target;
    const config = {
      username: form.querySelector('input[name="username"]').value,
      repositoryName: form.querySelector('input[name="repository_name"]').value,
      token: form.querySelector('input[name="token"]').value,
    };

    store.setState({ config });
    localStorage.setItem('config', JSON.stringify(config));
  }

  const addBookmark = async (ev) => {
    ev.preventDefault();

    const getBookmarksRequest = await fetch(
      `https://api.github.com/repos/${config.username}/${config.repositoryName}/contents/bookmarks.jsonl`,
      {
        headers: {
          'authorization': `Basic ${btoa(`${config.username}:${config.token}`)}`
        }
      }
    );
    const body = await getBookmarksRequest.json();

    const bookmarks = getBookmarksRequest.ok ? atob(body.content) : '';

    const form = ev.target;
    const newBookmark = {
      url: form.querySelector('input[name="url"]').value,
      title: form.querySelector('input[name="title"]').value,
      description: form.querySelector('textarea[name="description"]').value,
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
  };

  return (
    <div>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={updateConfig}>
        <label>
          Username:
          <input type="text" name="username" value={config.username} />
        </label>
        <label>
          Repository Name:
          <input type="text" name="repository_name" value={config.repositoryName} />
        </label>
        <label>
          Token:
          <input type="password" name="token" value={config.token} />
        </label>
        <button>Update</button>
      </form>

      <br />

      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={addBookmark}>
        <label>URL:
          <input type="text" name="url" value={current.url} />
        </label>
        <label>Title:
          <input type="text" name="title" value={current.title} />
        </label>
        <label>Description:
          <textarea name="description" />
        </label>
        <button>Add</button>
      </form>

    </div>
  );
});
