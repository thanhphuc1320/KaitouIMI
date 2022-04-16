import { HOST, TOKEN_KEY, REQUESTS_URI } from '../constant';

import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils';

export function getTextRecordApi(url) {
    const token = getTokenFromLocalStorage(TOKEN_KEY);
    return axios({
        method: 'get',
        url: `${HOST}/file/public?url=${url}`,
        headers: { Authorization: `Bearer ${token}` },
    });
}