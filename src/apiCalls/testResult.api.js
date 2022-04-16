import { HOST, TOKEN_KEY, REQUESTS_URI } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

export function getTestResultApi() {
    const token = getTokenFromLocalStorage(TOKEN_KEY);
    return axios({
        method: 'get',
        url: `${HOST}${REQUESTS_URI}/lastRequest`,
        headers: { Authorization: `Bearer ${token}` },
    });
}