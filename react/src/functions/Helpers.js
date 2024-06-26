export const generateUniqueId = (messages) => {
  const randomId = Math.random();
  const idExists = messages.some((message) => message.id === randomId);
  if (idExists) {
    return generateUniqueId();
  } else {
    return randomId;
  }
};
