export default function (loading = {}, action) {
  const { type } = action;
  const matches = /(.*)_(API|SUCCESSFULLY|FAILED)/.exec(type);

  // not a *_API / *_SUCCESS /  *_FAILED actions, so we ignore them
  if (!matches) return loading;

  const [requestState, requestName, requestContent] = matches;
  const result = { ...loading, isFetching: requestContent === 'API' };
  return result;
}
