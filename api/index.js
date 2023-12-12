import axios from 'axios'

export const BASE_URL = 'http://localhost:5041/';

export const ENDPOINTS = {
    participant: 'participant',
    question:'question',
    getAnswers : 'question/getanswers',
    startExam: 'participant/StartExam',
    endExam: 'participant/EndExam',
    getStartExam: 'participant/GetStartExam',
}

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
      fetch: () => axios.get(url),
      fetchById: id => axios.get(url + id),
      post: newRecord => axios.post(url, newRecord),
      put: (id, updatedRecord) => axios.put(url + id, updatedRecord),
      delete: id => axios.delete(url + id),
      startExam: () => axios.post(url + "startExam"),
      endExam: () => axios.post(url + "endExam"),
      getStartExam: id => axios.get(url  + "getStartExam/" + 1),
    }
}