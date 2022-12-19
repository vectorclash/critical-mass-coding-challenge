let cities = null;
let activeID = 0;

function init() {
  let messageElement = document.querySelector("#message");

  fetch('assets/scripts/navigation.json').then(response => {
    return response.json();
  }).then(data => {
    messageElement.style.display = 'none';
    buildNav(data);
  }).catch(error => {
    messageElement.textContent = 'Something went wrong.';
    console.log(error)
  });

  window.addEventListener('resize', onResize);
}

function buildNav(data) {
  cities = data.cites;
  let navList = document.querySelector('.nav-list');
  data.cities.forEach((city, index) => {
    let navItem = document.createElement('li');
    navItem.classList.add('nav-item');
    navItem.textContent = city.label;
    navList.appendChild(navItem);
    navList.addEventListener('click', onButtonClick);
  });
}

function moveBar(x, width) {
  let indicator = document.querySelector('.nav-line-indicator');
  let line = document.querySelector('.nav-line');

  gsap.to(indicator, {
    duration: 1,
    ease: 'quad.inOut',
    x: x - line.getBoundingClientRect().x,
    width: width,
    alpha: 1
  })
}

// event handlers

function onButtonClick(e) {
  let navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((navItem, index) => {
    activeID = index;

    if(navItem === e.target) {
      navItem.classList.add('active');
      let bounds = navItem.getBoundingClientRect();
      moveBar(bounds.x, bounds.width);
    } else {
      navItem.classList.remove('active');
    }
  });
}

function onResize(e) {

}

// initialize on content load

window.addEventListener("DOMContentLoaded", init);