const tabs = document.querySelectorAll('.vacansies-tab');
const menuOpen = document.querySelector('.menu-open');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const content = document.querySelector('.content');
const links = document.querySelectorAll('a[href*="#"]')
const headerSelectWrapper = document.querySelector('.header-select__wrapper');
const headerSelectBtn = document.querySelector('.header-select__btn');
const headerSelectList = document.querySelector('.header-select__list');
const headerSelectItem = document.querySelector('.header-select__item');
const headerSelectWrapperMobile = document.querySelector('.header-select__wrapper-mobile');
const headerSelectBtnMobile = document.querySelector('.header-select__btn-mobile');
const headerSelectListMobile = document.querySelector('.header-select__list-mobile');
const headerSelectItemMobile = document.querySelector('.header-select__item-mobile');
let hash = location.hash.substring(1);
let tabActive = '';


headerSelectWrapper.addEventListener('click', event => {
    const target = event.target;
    if(target === headerSelectBtn) {
        headerSelectBtn.classList.toggle('header-select__btn-active');
    headerSelectList.classList.toggle('header-select__list-active');
    }
    if(target == headerSelectItem) {
        let lang = "";
        lang = headerSelectBtn.textContent;
        headerSelectBtn.textContent = target.textContent;
        headerSelectBtnMobile.textContent = target.textContent;
        target.textContent = lang;
        headerSelectItemMobile.textContent = lang;
        headerSelectBtn.classList.remove('header-select__btn-active');
        headerSelectList.classList.remove('header-select__list-active');
    }
});
headerSelectWrapperMobile.addEventListener('click', event => {
    const target = event.target;
    if(target === headerSelectBtnMobile) {
        headerSelectBtnMobile.classList.toggle('header-select__btn-mobile-active');
        headerSelectListMobile.classList.toggle('header-select__list-mobile-active');
    }
    if(target == headerSelectItemMobile) {
        let lang = "";
        lang = headerSelectBtnMobile.textContent;
        headerSelectBtnMobile.textContent = target.textContent;
        headerSelectBtn.textContent = target.textContent;
        target.textContent = lang;
        headerSelectItem.textContent = lang;
        headerSelectBtnMobile.classList.remove('header-select__btn-mobile-active');
        headerSelectListMobile.classList.remove('header-select__list-mobile-active');
    }
});


const slider = new Swiper('.vacansies-slider', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    observer: true,
    initialSlide: 0,
    observeSlideChildren: true,
    observeParents: true,
    breakpoints: {
      // when window width is >= 640px
    360: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 40
    },
    768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40
    },
    1200: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 40
    },
    },

    // Navigation arrows
    navigation: {
        nextEl: '.btn-next',
        prevEl: '.btn-prev',
    },
    pagination: {
        el: '.swiper-pagination',
    },
});


// Запрос базы данных 

const getData = async() => {
    const data = await fetch('db.json');

    if(data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные небыли получены, ошибка ${data.status} ${data.statusText}`)
    }
}

const getVacansies = (callback, prop, value) => {
    getData()
        .then(data => {
            if(value) {
                callback(data.filter(item => item[prop] === value))
            } else {
                callback(data);
            }
            if(value === "Все вакансии") {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err);
        })
}


// Генерация слайдера на главной странице
try {
    if(!document.querySelector('.vacansies-slider')) {
        throw 'This is not a slider'
    }
    const slider = document.querySelector('.swiper-parrent');

    const createSlide = ({name, experience, id}) => {
        const div = document.createElement('div');
        div.classList.add('vacansies-slider__card');
        div.classList.add('swiper-slide');

        div.innerHTML = `
        <h3 class="vacansies-slider__card-title">${name}</h3>
        <span class="vacansies-slider__card-experience">Опыт работы: <span class="vacansies-slider__card-strong">${experience}</span></span>
        <a href="vacansies-page.html#${id}" class="vacansies-slider__card-link">Подробнее
            <svg class="icon" width="24" height="12">
                <use xlink:href="./img/icons/icons.svg#next"></use>
            </svg>
        </a>
        `
        return div;
    }

    const renderSliderList = data => {
        slider.textContent = '';
        
        data.forEach(item => {
            const slide = createSlide(item);
            slider.append(slide);
        }) 
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabActive = tab.textContent
            getVacansies(renderSliderList, "category", tabActive);
        })
    })
    getVacansies(renderSliderList, "category", tabActive);
} catch(err) {
    console.warn(err);
}

// Генерация страницы вакансии
try {
    if(!document.querySelector('.vacansies-page')) {
        throw 'This is a not vacansies-page';
    }

    const vacansiesPageTitle = document.querySelector('.vacansies-page__title');
    const vacansiesPageExperienceSubtitle = document.querySelector('.vacansies-page__experience-subtitle');
    const vacansiesPageSkillsList = document.querySelector('.vacansies-page__skills-list');
    const vacansiesPageOfferList = document.querySelector('.vacansies-page__offer-list');
    const vacansiesPageText = document.querySelector('.vacansies-page__text');

    const generateList = data => data.reduce((html, item, i) =>
    html + `<li class="vacansies-page__skills-item" data-id="${i}">${item}</li>`, '')

    const renderVacansiesPage = ([{ name, experience, skills, offers, text }]) => {
        vacansiesPageTitle.textContent = name;
        vacansiesPageExperienceSubtitle.textContent = experience;
        vacansiesPageSkillsList.innerHTML = generateList(skills);
        vacansiesPageOfferList.innerHTML = generateList(offers);
        if(text) {
            vacansiesPageText.textContent = text;
        } else {
            vacansiesPageText.style.display = 'none';
        }
    }
    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getVacansies(renderVacansiesPage, "id", hash);
        window.scrollTo(0, 0);
    })
    getVacansies(renderVacansiesPage, 'id', hash);
} catch(err) {
    console.warn(err);
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => {
            tab.classList.remove('tab-active');
        })
        if(!tab.matches('.tab-active')) {
            tab.classList.add('tab-active');
        }
    })
})

menuOpen.addEventListener('click', () => {
    mobileMenu.classList.add('mobile-menu__active');
    content.classList.add('content-active')
    document.body.classList.add('noscroll')
})
menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('mobile-menu__active');
    content.classList.remove('content-active')
    document.body.classList.remove('noscroll')
})


