class BaseCircularCarousel {
  constructor(container, config) {
    this.container = container;
    this.carousel = container.querySelector(config.carouselSelector);
    this.nextBtn = container.querySelector(config.btnSelector);
    this.items = Array.from(
      this.carousel.querySelectorAll(config.itemSelector)
    );

    this.currentPosition = 0;
    this.totalPositions = config.totalPositions;
    this.isAnimating = false;
    this.orderFunction = config.orderFunction;

    this.init();
  }

  init() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.next());
    }
    this.updateLayout();
  }

  async next() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Исчезаем
    this.carousel.classList.add("fade-out");

    // Ждем окончания анимации
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Меняем порядок
    this.currentPosition = (this.currentPosition + 1) % this.totalPositions;
    this.updateLayout();

    // Ждем окончания анимации
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Появляемся
    this.carousel.classList.remove("fade-out");

    this.isAnimating = false;
  }

  updateLayout() {
    // Создаем массив индексов для новой расстановки
    const newOrder = this.orderFunction(this.currentPosition);
    // Переставляем карточки в DOM
    newOrder.forEach((itemIndex) => {
      const item = this.items[itemIndex];
      this.carousel.appendChild(item);
    });
  }
}

// Конфигурации для разных каруселей
const CAROUSEL_CONFIGS = {
  catalog: {
    carouselSelector: ".card_carusel",
    btnSelector: ".carousel_btn",
    itemSelector: ".card",
    totalPositions: 3,

    orderFunction: (position) => {
      switch (position) {
        case 0: // Исходное (0): 1,2 | 3,4 (5,6)
          return [0, 1, 3, 4, 2, 5];
        case 1: // Положение 1: 2,3,1 | 5,6,4
          return [1, 2, 4, 5, 0, 3];
        case 2: // Положение 2: 3,1,2 | 6,4,5
          return [2, 0, 5, 3, 1, 4];
        default:
          return [0, 1, 3, 4, 2, 5];
      }
    },
  },

  combo: {
    carouselSelector: ".combo_carusel",
    btnSelector: ".combo_carousel_btn",
    itemSelector: ".combo_card",
    totalPositions: 4,

    orderFunction: (position) => {
      switch (position) {
        case 0: // Исходное: 1,2,3,4
          return [0, 1, 2, 3];
        case 1: // Положение 1: 2,3,4,1
          return [1, 2, 3, 0];
        case 2: // Положение 2: 3,4,1,2
          return [2, 3, 0, 1];
        case 3: // Положение 3: 4,1,2,3
          return [3, 0, 1, 2];
        default:
          return [0, 1, 2, 3];
      }
    },
  },
};

// Функция для giftset
function initGiftset() {
  const giftsetSection = document.getElementById("giftset");
  if (!giftsetSection) return;

  const tabSwitchers = giftsetSection.querySelectorAll(
    '.gift_btn[href^="#"], .tab-btn[href^="#"]'
  );

  const allCards = giftsetSection.querySelectorAll(".giftset_card");

  tabSwitchers.forEach((switcher) => {
    switcher.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const targetTab = document.querySelector(href);

      if (targetTab && targetTab.closest("#giftset")) {
        e.preventDefault();
        showTabWithAnimation(href);
      }
    });
  });

  function showTabWithAnimation(tabId) {
    // Убираем active у всех карточек
    allCards.forEach((card) => {
      card.classList.remove("active");
    });

    // Убираем active у всех кнопок
    tabSwitchers.forEach((btn) => btn.classList.remove("active"));

    // Добавляем active к нужной карточке
    const activeTab = document.querySelector(tabId);
    if (activeTab) {
      setTimeout(() => {
        activeTab.classList.add("active");
      }, 10); // Небольшая задержка для плавности

      // Добавляем active к кнопке
      const activeBtn = document.querySelector(`[href="${tabId}"]`);
      if (activeBtn) activeBtn.classList.add("active");
    }
  }
}

// Бургер-меню
function initBurgerMenu() {
  const burgerBtn = document.querySelector(".menu");
  const navList = document.querySelector(".nav__list");

  if (burgerBtn && navList) {
    burgerBtn.addEventListener("click", function (e) {
      // Проверяем, что кликнули именно на бургер (не на другие элементы меню)
      if (e.target === burgerBtn || e.target.classList.contains("menu")) {
        navList.classList.toggle("active");
      }
    });

    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("active");
      });
    });

    // Закрытие меню при клике вне его
    document.addEventListener("click", function (e) {
      if (!navList.contains(e.target) && !burgerBtn.contains(e.target)) {
        navList.classList.remove("active");
      }
    });
  }
}

// Инициализация всех каруселей
document.addEventListener("DOMContentLoaded", () => {
  // Каталог
  const catalogSection = document.getElementById("catalog");
  if (catalogSection) {
    new BaseCircularCarousel(catalogSection, CAROUSEL_CONFIGS.catalog);
  }

  // Комбо
  const comboSection = document.getElementById("combo");
  if (comboSection) {
    new BaseCircularCarousel(comboSection, CAROUSEL_CONFIGS.combo);
  }

  // Инициализация giftset
  initGiftset();

  // Инициализация бургер-меню
  initBurgerMenu();
});
