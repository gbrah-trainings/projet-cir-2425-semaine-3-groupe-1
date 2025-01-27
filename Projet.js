const container = document.querySelector('.annonces-container');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');


const cardWidth = document.querySelector('.annonce-card').offsetWidth + 24; 


let scrollPosition = 0;


rightArrow.addEventListener('click', () => {
    const maxScroll = container.scrollWidth - container.offsetWidth; 
    if (scrollPosition < maxScroll) {
        scrollPosition += cardWidth;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;
        container.style.transform = `translateX(-${scrollPosition}px)`;
    }
});

leftArrow.addEventListener('click', () => {
    if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
        if (scrollPosition < 0) scrollPosition = 0;
        container.style.transform = `translateX(-${scrollPosition}px)`;
    }
});
