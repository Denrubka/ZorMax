document.addEventListener('DOMContentLoaded', () => {


    const tabs = document.querySelectorAll('.vacansies-tab');
    const sliders = document.querySelectorAll('.vacansies-slider');
    const menuOpen = document.querySelector('.menu-open');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const content = document.querySelector('.content');
    const links = document.querySelectorAll('a[href*="#"]')

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach((elem, i) => {
                elem.classList.remove('tab-active');
                sliders[i].classList.add('hidden');
            })
            tab.classList.add('tab-active');
            sliders[index].classList.remove('hidden');

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

    // for (let link of links) {
    //     link.addEventListener('click', function (e) {
    //     e.preventDefault()
        
    //     const blockID = link.getAttribute('href').substr(1)
        
        
    //     if(blockID.length > 2) {
    //     document.getElementById(blockID).scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'start'
    //         })
    //     }
    //     })
    // }

});
$(document).ready(function(){
    $('.vacansies-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    });
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
        })
        .catch(err => {
            console.error(err);
        })
}

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

    const renderVacansiesPage = ([{ name, experience, skills, offers }]) => {
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
    getVacansies(renderVacansiesPage, 'id', hash);
} catch(err) {
    console.warn(err);
}