import { CLEAR_ERROR } from '../../constant';

export default function (error = {}, action) {
  const { type, payload } = action;
  if (type === CLEAR_ERROR) return {};
  const matches = /(.*)_(API|FAILED)/.exec(type);

  if (!matches || (matches && matches.length > 0 && matches[2] !== 'FAILED')) return {};
  
  const [requestName, requestState, requestContent] = matches;
  const result = {
    ...error,
    [requestName]: requestContent === 'FAILED' ? payload : '',
  };

  return result;
}
