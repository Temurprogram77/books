let booksRow = document.querySelector(".books");
let filters = document.querySelector(".filters");
let library_modal__list = document.querySelector(".library-modal__list");

let search = filters.search;
let sort = filters.filter;
let language_filter = filters.language_filter;
let country_filter = filters.country_filter;
let from_year = filters.from_year;
let to_year = filters.to_year;

function localRender() {
  library_modal__list.innerHTML = null;
  let local = JSON.parse(localStorage.getItem("data")) || [];

  for (let i = 0; i < local.length; i++) {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let btn = document.createElement("button");
    li.setAttribute(
      "class",
      "list-group-item border border-dark mt-2 d-flex justify-content-between align-items-center"
    );
    p.setAttribute("class", "m-0");
    btn.setAttribute("class", "btn btn-danger");
    btn.innerHTML = "X";

    p.textContent = local[i];
    li.append(p, btn);
    library_modal__list.append(li);

    btn.addEventListener("click", () => {
      local = local.filter((item) => item != p.textContent);
      localStorage.setItem("data", JSON.stringify(local));
      li.remove();
    });
  }
}

// Add LocalStorage

const addLocalStorage = (data) => {
  let local = JSON.parse(localStorage.getItem("data")) || [];

  if (local.includes(data)) {
    local = local.filter((item) => item != data);
  } else {
    local.push(data);
  }

  localStorage.setItem("data", JSON.stringify(local));
  localRender();
};

// Card create element

function render(book) {
  let local = JSON.parse(localStorage.getItem("data")) || [];
  booksRow.innerHTML = null;

  for (let i = 0; i < book.length; i++) {
    let books_item = document.createElement("div");
    books_item.setAttribute("class", "col-md-6 col-lg-4 mb-3");
    books_item.innerHTML = `
        
         <div class="book card h-100">
          <img class="book__poster card-img-top" src=${
            book[i].imageLink
          } alt="Poster of Things Fall Apart">
          <div class="card-body d-flex flex-column">
            <h3 class="book__title card-title mb-1 text-truncate">${
              book[i].title
            }</h3>
            <h4 class="book__author h6 card-subtitle text-muted mb-3">${
              book[i].author
            }</h4>

            <ul class="book__info-list list-unstyled">
              <li class="book__info-item book__info-year d-flex mb-1">${
                book[i].year
              }</li>
              <li class="book__info-item book__info-language d-flex mb-1">${
                book[i].language
              }</li>
              <li class="book__info-item book__info-country d-flex mb-1">${
                book[i].country
              }</li>
              <li class="book__info-item book__info-pages d-flex mb-1">${
                book[i].pages
              }</li>
            </ul>

            <div class="book__bottom d-flex flex-wrap gap-2">
              <a class="book__more-link btn btn-primary d-inline-flex align-items-center" target="_blank"
                href="https://en.wikipedia.org/wiki/Things_Fall_Apart">
                <img class="me-1" src="./img/icon-info.svg" alt="">
                <span>More info</span>
              </a>

              <button onclick="(addLocalStorage('${
                book[i].uniqueId
              }'))" class="book__add-library btn btn-primary d-inline-flex align-items-center" type="button"
                data-unique-id="Things_Fall_Apart">
                <img class="me-1" style="pointer-events: none;" src="./img/icon-bookmark-add.svg" width="24" height="24"
                  alt="" aria-hidden="true">
                <span style="pointer-events: none;">${
                  local.includes(book[i].uniqueId)
                    ? "Remove from library"
                    : "Add to library"
                }</span>
              </button>
            </div>
          </div>
        </div>

        `;

    booksRow.append(books_item);
  }
}

render(booksData);
localRender();

// Filters

filters.addEventListener("submit", (e) => {
  e.preventDefault();
  booksRow.innerHTML = null;

  let filtered = booksData.filter(
    (item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase()) &&
      (item.language
        .toLowerCase()
        .includes(language_filter.value.toLowerCase()) ||
        language_filter.value == "All") &&
      (item.country
        .toLowerCase()
        .includes(country_filter.value.toLowerCase()) ||
        country_filter.value == "All") &&
      (item.year >= from_year.value || from_year.value == "") &&
      (item.year <= to_year.value || to_year.value == "")
  );

  if (sort.value == "a-z") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort.value == "pages_count") {
    filtered.sort((a, b) => a.pages - b.pages);
  } else if (sort.value == "year") {
    filtered.sort((a, b) => a.year - b.year);
  }

  (search.value = ""),
    (sort.value = "all"),
    (language_filter.value = "All"),
    (country_filter.value = "All"),
    (from_year.value = ""),
    (to_year.value = "");
  render(filtered);
});
