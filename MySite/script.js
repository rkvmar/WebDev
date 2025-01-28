const header = document.getElementById('header');
const arrow = document.getElementById('arrow');
const hamburger = document.querySelector('.ham');
const subtext = ['They/Them', 'Ze/Zir', 'E/Em', 'Xe/Xem', 'Ask'];
// const subtext = ['average person', 'average failure']
let currentSubtextIndex = 0;
const subtextElement = document.getElementById('subtext');
const subtextText = document.querySelector('#subtextText');s

// Initialize pronouns text when page loads
subtextText.textContent = subtext[currentSubtextIndex];

window.onload = () => {
    window.scrollTo(0, 0);
};

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        arrow.classList.add('hidden');
        subtextElement.classList.add('hidden');
        hamburger.classList.add('visible');
        scrollToMain();
    } else {
        header.classList.remove('scrolled');
        arrow.classList.remove('hidden');
        subtextElement.classList.remove('hidden');
        hamburger.classList.remove('visible');
    }
});

function scrollToMain() {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
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
setInterval(cycleSubtext, 3000); // Change subtext every 3 seconds
hamburger.addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('active');
});
const menuSelector = document.querySelector('.menu-selector');
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseover', () => {
        menuSelector.style.top =  (2*item.offsetTop+item.offsetHeight)/2 - (menuSelector.offsetHeight/2) + 'px';
    });
});
