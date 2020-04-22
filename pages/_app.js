import { Provider } from 'unistore/react';

import { store } from '../lib/store';
import Notifications from '../components/notifications';

import './styles.css';

export default function ({ Component, pageProps }) {
  return (
      <Provider store={store}>
        <>
          <Notifications />
          <Component {...pageProps} />
        </>
      </Provider>
  );
}
