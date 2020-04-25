import React, { useEffect } from 'react';
import Link from 'next/link'
import { connect } from 'unistore/preact';

import * as store from '../lib/store';
import { encodeToBase64 } from '../lib/util';

async function initializeNewRepository () {
  const { config } = store.store.getState();
  const createFromTemplateRequest = await fetch(
    `https://api.github.com/repos/lwakefield/gitmark-template/generate`,
    {
      body: JSON.stringify({
        owner: config.username,
        name: config.repositoryName,
        private: true,
      }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Basic ${encodeToBase64(`${config.username}:${config.token}`)}`,
        'accept': 'application/vnd.github.baptiste-preview+json'
      }
    }
  );
  if (createFromTemplateRequest.ok) {
    store.addNotification({ type: 'success', message: 'Successfully initialized.' }); 
  } else {
    store.addNotification({ type: 'error', message: 'Something went wrong during initialization.' }); 
  }
}

export default connect(['config', 'current'])(({ config, current }) => {
  useEffect(store.initConfig, []);

  const updateConfig = async (ev) => {
    ev.preventDefault();

    const form = ev.target;
    const config = {
      username: form.querySelector('input[name="username"]').value,
      repositoryName: form.querySelector('input[name="repository_name"]').value,
      token: form.querySelector('input[name="token"]').value,
    };

    await store.updateConfig(config);

    store.addNotification({ type: 'success', message: 'Successfully updated configuration.' });
  }

  return (
    <div>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={updateConfig}>
        <label>
          Username:
          <input type="text" name="username" required value={config && config.username} />
        </label>
        <label>
          Repository Name:
          <input type="text" name="repository_name" required value={config && config.repositoryName} />
        </label>
        <label>
          Token:
          <input type="password" name="token" required value={config && config.token} />
        </label>
        <button>Update</button>
      </form>
      <button onClick={initializeNewRepository} style={{ width: '100%' }}>Initialize</button>

      <div style={{ fontSize: '0.7rem' }}>
        <Link href="/">Add a bookmark</Link>
        &nbsp;|&nbsp;
        <Link href="/about">About</Link>
      </div>
    </div>
  );
});

