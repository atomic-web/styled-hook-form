let nextId = () => {
  let id = 0;
  return () => ++id;
};

export const ID = nextId();
