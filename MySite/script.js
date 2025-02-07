const header = document.getElementById('header');
const arrow = document.getElementById('arrow');
const hamburger = document.querySelector('.ham');
const windowHeight = header.offsetHeight;
const subtext = ['They/Them', 'Ze/Zir', 'E/Em', 'Xe/Xem', 'Vi/Vim'];
// const subtext = ['average person', 'average failure']
let currentSubtextIndex = 0;
const subtextElement = document.getElementById('subtext');
const subtextText = document.querySelector('#subtextText');
const scrollMargin = 50;
let isScrolling = false;
let isIndex = false;
const menuItem = document.querySelectorAll('.menu-item');
const cardsWrapper = document.getElementById('cards');
const cards = document.querySelectorAll('.box');
if(window.location.pathname.split('/').pop() === 'index.html'){
    isIndex = true;
}
if(isIndex){
    subtextText.textContent = subtext[currentSubtextIndex];
}
window.onresize = () => {
    fixResize();
}
window.onload = () => {
    window.scrollTo(0, 0);
    document.getElementById('menu').classList.remove('active');
};

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        arrow.classList.add('hidden');
        subtextElement.classList.add('hidden');
        hamburger.classList.add('visible');
        if(!isScrolling) {
            window.scrollTo({ top: windowHeight-80, behavior: 'smooth' });
        }
    } else {
        header.classList.remove('scrolled');
        arrow.classList.remove('hidden');
        subtextElement.classList.remove('hidden');
        hamburger.classList.remove('visible');
        document.getElementById('menu').classList.remove('active');
        document.querySelector('.ham').classList.remove('active');  
    }
});

function scrollToMain() {
    window.scrollTo({ top: windowHeight-80, behavior: 'smooth' });
}

function cycleSubtext() {
    if (!subtextElement.classList.contains('hidden')) {
        currentSubtextIndex = (currentSubtextIndex + 1) % subtext.length;
        subtextText.style.opacity = '0';
        
        setTimeout(() => {
            subtextText.textContent = subtext[currentSubtextIndex];
            subtextText.style.opacity = '1';
        }, 500);
    }
}

// Change to a shorter interval for more frequent changes
if(isIndex){
    setInterval(cycleSubtext, 3000); // Change subtext every 3 seconds
}
hamburger.addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('active');
    console.log('clicked');
});
function smoothScrollTo(element) {
    isScrolling = true;
    window.scrollTo({ top: element.offsetTop+windowHeight-80, behavior: 'smooth' });
    setTimeout(() => {
        isScrolling = false;
    }, 300);
    document.getElementById('menu').classList.remove('active');
    document.querySelector('.ham').classList.remove('active');
}
function smoothScrollHome() {
    isScrolling = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    isScrolling = false;
    document.getElementById('menu').classList.remove('active');
    document.querySelector('.ham').classList.remove('active');
}
function fixResize(){
    const newAspectRatio = window.innerWidth / window.innerHeight;
    const newFontSize = newAspectRatio < 1 ? '3rem' : '4.9rem';
    menuItem.forEach(item => {
        item.style.fontSize = newFontSize;
    });
    cardsWrapper.style.flexDirection = newAspectRatio < 1 ? 'column' : 'row';
    cardsWrapper.style.gap = newAspectRatio < 1 ? '3vh' : '3vw';
    cards.forEach(card => {
        card.style.width = newAspectRatio < 1 ? '25vh' : '30vw';
    const boxParagraphs = document.querySelectorAll('.box p');
    boxParagraphs.forEach(paragraph => {
        paragraph.parentElement.addEventListener('mouseover', () => {
            paragraph.style.transform = newAspectRatio < 1 ? 'translateY(200%)' : 'translateY(140%)';
        });
        paragraph.parentElement.addEventListener('mouseout', () => {
                paragraph.style.transform = 'translateY(0)';
            });
        });
    });
}
fixResize();