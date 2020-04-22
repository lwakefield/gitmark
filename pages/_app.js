import { Provider } from 'unistore/react';

import { store } from '../lib/store';

import './styles.css';

export default function ({ Component, pageProps }) {
  return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
  );
}
