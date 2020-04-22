import React, {useEffect} from 'react'

import { store, initConfig } from '../lib/store';
import { connect } from 'unistore/preact';

export default connect(['config', 'current'])(({ config, current }) => {
  useEffect(initConfig, []);

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
    </div>
  );
});

