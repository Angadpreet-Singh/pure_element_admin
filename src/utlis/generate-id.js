/// Generate ID

export  function generateID(prefix) {
  return (
    prefix +
    new Date().getFullYear().toString().substr(-2) +
    Math.floor(Math.random() * 90000)
  );
}
export  function generateOrderID(prefix) {
  return (
    prefix +
    new Date().getFullYear().toString().substr(-2) +
    Math.floor(Math.random() * 900000)
  );
}
