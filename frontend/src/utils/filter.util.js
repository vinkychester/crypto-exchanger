const handleChange = (event, func) => {
  const { name, value } = event.target;
  func(name, value.trim());
};

export { handleChange };