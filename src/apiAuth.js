import axios from 'axios';

// Existing components use the default Axios instance. Attach credentials only
// to this API, and read the token on every request to handle login/logout.
axios.interceptors.request.use((config) => {
    const api = process.env.REACT_APP_API_IP;
    if (!api) return config;
    const base = new URL(api, window.location.origin);
    const target = new URL(config.url, config.baseURL || window.location.origin);
    const prefix = base.pathname.replace(/\/$/, '');
    if (target.origin === base.origin &&
        (target.pathname === prefix || target.pathname.startsWith(`${prefix}/`))) {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = token;
    }
    return config;
});
