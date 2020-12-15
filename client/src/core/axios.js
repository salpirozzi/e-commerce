import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:5000'
});

const setBearer = (token) => {
    if(token)
        axios.defaults.headers.common["Authorization"] = token;
    else
        delete axios.defaults.headers.common["Authorization"];
}

export { axios, setBearer };