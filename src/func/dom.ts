export const prevent = (cb?: () => void) => {
  if (!cb) return;

  return (e: { preventDefault: () => void }) => {
    e.preventDefault();
    cb();
  };
};
