import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    // Check if auth is required
    if (requiresAuth){
      //btoa creates base-64 encoded ASCII string
      //encodes username and password credentails to api
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      //sets Authorization type to Basic, followed by the encoded credentials
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, {username, password});
    if (response.status === 200) {
      return response.json().then(data => data);

    } else if (response.status === 401) {
      return response.json().then(errors => errors);

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }

  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];

    } else if (response.status === 501) {
      return response.json().then(errors => errors);

    } else if (response.status === 400 ) {
      return response.json().then(errors => errors);

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }

  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);

    } else if (response.status === 404) {
      return response.json().then(data => {
        return data.errors;
      });

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }

  async getCourseByPk(id) {
    const response = await this.api('/courses/' + id, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);

    } else if (response.status === 404){
        return 404;

    } else if (response.status === 500) {
      return 500;

    } else {
        throw new Error();
    }
  }

  async updateCourse(id, update, username, password) {
    const response = await this.api('/courses/'+id, 'PUT', update, true, {username, password});
    if (response.status === 204) {
      return 204;

    } else if (response.status === 403 || response.status === 400 ) {
      return response.json().then(data => data);

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }

  async createCourse(courseInfo, username, password) {
    const response = await this.api('/courses', 'POST', courseInfo, true, {username, password});
    if (response.status === 201) {
      return 201;

    } else if (response.status === 400){
       return response.json().then(errors => errors);

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }

  async deleteCourse(id, username, password){
    const response = await this.api('/courses/' + id, 'DELETE', null, true, {username, password});
    if (response.status === 204){
      return 204;

    } else if (response.status === 403 || response.status === 404){
      return response.json();

    } else if (response.status === 500) {
      return 500;

    } else {
      throw new Error();
    }
  }
}
