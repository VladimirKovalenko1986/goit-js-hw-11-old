import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { NewApiSearch } from './js/newsApi';
import { getRefs } from './js/components/refs';
import { LoadMoreBtn } from './js/components/loadMoreBtn';

// !!!!!!!!!BUTTON LOAD MORE!!!!!!!!

// const refs = getRefs();
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.js-load-more',
//   isHidden: true,
// });

// let gallery = new SimpleLightbox('.gallery a', {
//   captions: true,
//   captionsData: 'alt',
//   captionDelay: 250,
// });
// const newApiSearch = new NewApiSearch();

// refs.form.addEventListener('submit', onSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

// async function onSubmit(e) {
//   e.preventDefault();

//   loadMoreBtn.disable();

//   const form = e.currentTarget;
//   newApiSearch.searchQuery = form.elements.searchQuery.value.trim();

//   clearNewsList();

//   newApiSearch.resetPage();

//   try {
//     const { hits, totalHits } = await newApiSearch.getNews(
//       newApiSearch.searchQuery
//     );
//     if (!hits.length || !newApiSearch.searchQuery) {
//       throw new Error('No data');
//     }

//     {
//       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//       const markup = renderingNewList(hits);

//       updateNewList(markup);

//       loadMoreBtn.show();

//       loadMoreBtn.enable();

//       gallery.refresh();

//       windowScroll();
//     }
//   } catch (error) {
//     onError(error);
//   } finally {
//     form.reset();
//   }
// }

// async function onLoadMore() {
//   loadMoreBtn.disable();

//   try {
//     const { hits, totalHits } = await newApiSearch.getNews(
//       newApiSearch.searchQuery
//     );

//     const totalPages = Math.ceil(totalHits / hits);

//     if (newApiSearch.queryPage === totalPages) {
//       throw new Error('Data end!');
//     }

//     {
//       const markup = renderingNewList(hits);

//       updateNewList(markup);

//       loadMoreBtn.enable();

//       gallery.refresh();

//       windowScroll();
//     }
//   } catch (error) {
//     onErrorLoadBtn(error);
//   }
// }

// function renderingNewList(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//         <a class="gallery__link" href="${largeImageURL}">
//           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         </a>
//         <div class="info">
//           <p class="info-item">Likes:
//             <b>${likes}</b>
//           </p>
//           <p class="info-item">Views:
//             <b>${views}</b>
//           </p>
//           <p class="info-item">Comments:
//             <b>${comments}</b>
//           </p>
//           <p class="info-item">Downloads:
//             <b>${downloads}</b>
//           </p>
//         </div>
//       </div>`;
//       }
//     )
//     .join('');
// }

// function updateNewList(markup) {
//   refs.listSearch.insertAdjacentHTML('beforeend', markup);
// }

// function clearNewsList() {
//   refs.listSearch.innerHTML = '';
// }

// function onErrorLoadBtn() {
//   Notiflix.Notify.warning(
//     "We're sorry, but you've reached the end of search results."
//   );

//   loadMoreBtn.hide();
// }

// function onError() {
//   Notiflix.Notify.failure(
//     'Sorry, there are no images matching your search query. Please try again.'
//   );

//   loadMoreBtn.hide();
// }

// function windowScroll() {
//   const { height: cardHeight } =
//     refs.listSearch.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// !!!!!!!!!INFINITY SCROLL!!!!!!!!

const refs = getRefs();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.js-load-more',
  isHidden: true,
});

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const newApiSearch = new NewApiSearch();

let observer = new IntersectionObserver(onLoadMore, options);

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  newApiSearch.searchQuery = form.elements.searchQuery.value.trim();

  clearNewsList();

  newApiSearch.resetPage();

  try {
    const { hits, totalHits } = await newApiSearch.getNews(
      newApiSearch.searchQuery
    );

    if (!hits.length || !newApiSearch.searchQuery) {
      throw new Error('No data');
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    observer.observe(refs.target);

    const markup = renderingNewList(hits);

    updateNewList(markup);

    gallery.refresh();

    windowScroll();
  } catch (error) {
    onError(error);
  } finally {
    form.reset();
  }
}

async function onLoadMore(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        const { hits, totalHits } = await newApiSearch.getNews(
          newApiSearch.searchQuery
        );
        const totalPage = Math.ceil(totalHits / hits);

        if (totalPage === newApiSearch.queryPage) {
          throw new Error('Data end!');
        }

        {
          const markup = renderingNewList(hits);

          updateNewList(markup);

          gallery.refresh();

          windowScroll();
        }
      } catch (error) {
        onErrorLoad(error);
      }
    }
  });
}

function renderingNewList(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">Likes:
            <b>${likes}</b>
          </p>
          <p class="info-item">Views:
            <b>${views}</b>
          </p>
          <p class="info-item">Comments:
            <b>${comments}</b>
          </p>
          <p class="info-item">Downloads:
            <b>${downloads}</b>
          </p>
        </div>
      </div>`;
      }
    )
    .join('');
}

function updateNewList(markup) {
  refs.listSearch.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.listSearch.innerHTML = '';
}

function onErrorLoad() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );

  observer.unobserve(refs.target);
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function windowScroll() {
  const { height: cardHeight } =
    refs.listSearch.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
