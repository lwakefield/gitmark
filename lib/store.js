import createStore from 'unistore';

export const store = createStore({
    /* @type { null | { username: string; repositoryName: string; token: string; } }*/
    config: null,
    notification: null,
});

export const initConfig = async () => {
    const config = await storageGet('config');
    console.log(config);
    if (!config) return;

    store.setState({ config });
}

export const updateConfig = async (config) => {
    store.setState({ config });
    await storageSet('config', config);
}

export const addNotification = ({ type, message }) => {
    store.setState({ notification: { type, message } });
};

export const storageGet = async (key) => {
    const isFFExt = typeof browser !== 'undefined';

    if (isFFExt) {
        const item = await browser.storage.local.get(key);
        return item ? item[key] : null;
    }

    const item = localStorage.getItem(key);

    return item ? JSON.parse(localStorage.getItem(key)) : null;
}

export const storageSet = async (key, val) => {
    const isFFExt = typeof browser !== 'undefined';

    if (isFFExt) return browser.storage.local.set({[key]: val});

    localStorage.setItem(key, JSON.stringify(val));
}
