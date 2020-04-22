import createStore from 'unistore';

export const store = createStore({
    /* @type { null | { username: string; repositoryName: string; token: string; } }*/
    config: null,
});

export const initConfig = () => {
    const encodedConfig = localStorage.getItem('config');
    if (!encodedConfig) return;

    store.setState({ config: JSON.parse(encodedConfig) });
}
