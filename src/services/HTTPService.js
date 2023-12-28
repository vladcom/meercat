export default class HTTPService {
  static _instance;

  constructor() {
    if (HTTPService._instance) {
      return HTTPService._instance;
    }

    HTTPService._instance = this;
    return this;
  }

  static async fetch(method, url, options = {}, raw = false) {
    const { body, ...fetchOptions } = options;

    if (typeof body !== 'undefined') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const authOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    };

    const response = await fetch(import.meta.env.VITE_APP_BASE_URL + url, authOptions);

    if (raw) {
      return response;
    }

    if (response.status === 401) {
      throw new Error('Not Authenticated!');
    }

    return response.json().catch(() => response);
  }

  static async authFetch(method, url, options = {}, raw = false) {
    const token = localStorage.getItem('acc');
    const { body, ...fetchOptions } = options;
    if (body instanceof FormData) {
      fetchOptions.body = options.body;
    } else if (typeof body !== 'undefined') {
      fetchOptions.body = JSON.stringify(options.body);
      fetchOptions.headers = { 'Content-Type': 'application/json' };
    }

    const authOptions = {
      method,
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: token,
        // 'X-XSS-Protection': '1; mode=block',
        // 'X-Frame-Options': 'DENY'
      },
    };

    const response = await fetch(import.meta.env.VITE_APP_BASE_URL + url, authOptions);

    if (raw) {
      return response;
    }

    if (response.status === 401) {
      throw new Error('Not Authenticated!');
    }

    return response.json().catch(() => response);
  }

  apiGet = (...args) => HTTPService.authFetch('GET', ...args);

  apiPut = (...args) => HTTPService.authFetch('PUT', ...args);

  apiPost = (...args) => HTTPService.authFetch('POST', ...args);

  apiPatch = (...args) => HTTPService.authFetch('PATCH', ...args);

  apiDelete = (...args) => HTTPService.authFetch('DELETE', ...args);

  apiPostPublic = (...args) => this.HTTPService.fetch('POST', ...args);
}
