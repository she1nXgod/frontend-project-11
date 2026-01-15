import axios from 'axios';

function buildProxyUrl(url) {
  return `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
}

function updateState(state, data) {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  // console.log(parsedData);

  const feed = parsedData.querySelector('title').textContent;
  const description = parsedData.querySelector('description').textContent;
  const items = parsedData.querySelectorAll('item');

  if (feed === 'Error') {
    throw new Error('invalidRSS');
  }
  // console.log(feed);
  // console.log(items);
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
  });

  state.posts.push(posts);
  state.feeds.push(feed);
  state.descriptions.push(description);
}

function parseRss(state) {
  return axios
    .get(buildProxyUrl(state.form.value))
    .then((response) => {
      const data = response.data.contents;
      updateState(state, data);
    })
    .catch((error) => {
      if (error.message === 'invalidRSS') {
        throw error;
      }
      throw new Error('networkError');
    });
}

export { parseRss };
