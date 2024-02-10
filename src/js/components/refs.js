function getRefs() {
  return {
    form: document.getElementById('search-form'),
    loadMoreBtn: document.querySelector('.js-load-more'),
    target: document.querySelector('.js-guard'),
    listSearch: document.querySelector('.gallery'),
  };
}

export { getRefs };
