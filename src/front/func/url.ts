export const urlSearchParams = () => new URL(window.location.href).searchParams;

export const updateQueryParams = (params: Record<string, string>) => {
  const url = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });
  history.replaceState(null, "", url);
};
