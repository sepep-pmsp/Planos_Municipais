const data = Array.from({ length: 100 })
  .map((_, i) => `Item ${(i + 1)}`);
let perPage = 5;
const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(data.length / perPage),
  maxVisibleButtons: 5
};
const html = {
  get(element) {
    return document.querySelector(element);
  }
};
const controls = {
  next() {
    state.page++;
    const lastPage = state.page > state.totalPage;
    if (lastPage) {
      state.page--;
    };
  },

  prev() {
    state.page--;

    const firstPage = state.page < 1;
    if (firstPage) {
      state.page++;
    };
  },

  goTo(page) {
    if (page < 1) {
      page = 1;
    }

    state.page = +page;
    if (page > state.totalPage) {
      state.page = state.totalPage;
    }

  },

  createListeners() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });

    html.get('.last').addEventListener('click', () => {
      controls.goTo(state.totalPage);
      update();
    });

    html.get('.prev').addEventListener('click', () => {
      controls.prev();
      update();
    });

    html.get('.next').addEventListener('click', () => {
      controls.next();
      update();
    });
  }
};

const list = {
  create(item) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = item;

    html.get('.list').appendChild(div);
  },
  update() {
    const { perPage } = state;
    html.get('.list').innerHTML = '';

    let page = state.page - 1;
    let start = page * perPage;
    let end = start + perPage;

    const paginatedItems = data.slice(start, end);
    paginatedItems.forEach(list.create);
  }
};

const buttons = {
  element: html.get('.controls .numbers'),
  create(number) {
    const button = document.createElement('div');

    button.innerHTML = number;

    if (state.page == number) {
      button.classList.add('active');
    }

    button.addEventListener('click', (event) => {
      const page = event.target.innerText;

      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    buttons.element.innerHTML = '';

    const { maxLeft, maxRight } = buttons.calculateMaxVisible();

    for(let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    };
  },
  calculateMaxVisible() {
    const { maxVisibleButtons, totalPage } = state;

    let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2));
    let maxRight = (state.page + Math.floor(maxVisibleButtons / 2));

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxVisibleButtons;
    };

    if (maxRight > totalPage) {
      maxLeft = totalPage - (maxVisibleButtons - 1);
      maxRight = totalPage;

      if (maxLeft < 1) maxLeft = 1;
    };

    return {maxLeft, maxRight};
  }
};

function blockButtons() {
  const { page, totalPage } = state;

  const elements = {
    prev: html.get('.controls .prev'),
    next: html.get('.controls .next'),
    
    first: html.get('.controls .first'),
    last: html.get('.controls .last')
  };

  if (page == 1) {
    elements.prev.classList.add('disable');
    elements.first.classList.add('disable');
  } else {
    elements.prev.classList.remove('disable');
    elements.first.classList.remove('disable');
  };

  if (page == totalPage) {
    elements.next.classList.add('disable');
    elements.last.classList.add('disable');
  } else {
    elements.next.classList.remove('disable');
    elements.last.classList.remove('disable');
  };
}

function update() {
  list.update();
  buttons.update();
  controls.createListeners();
  blockButtons();
};
function init() {
  update();
};

window.addEventListener('load', init);