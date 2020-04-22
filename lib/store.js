import createStore from 'unistore';

export const store = createStore({
    config: {
        username: '',
        repositoryName: '',
        token: ''
    },
    current: { url: '', title: '' },
});
