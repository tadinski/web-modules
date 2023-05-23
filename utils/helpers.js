const postData = async ({ url, data = {} }) => {
  console.log(url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.error) {
    throw error;
  }

  return res.json();
};

export { postData };
