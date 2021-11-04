export class HttpService {
  _handlesErrors(res) {
    if (!res.ok) throw new Error(res.statusText);
    return res;
  }

  get(url) {
    return fetch(url)
      .then((res) => this._handlesErrors(res))
      .then((res) => res.json());
  }

  post(url, dado) {
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(dado),
    });
  }
}
