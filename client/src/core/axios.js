import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://192.168.1.56:5000'
});

const setBearer = (token) => {
    if(token)
        axios.defaults.headers.common["Authorization"] = token;
    else
        delete axios.defaults.headers.common["Authorization"];
}

export { axios, setBearer };