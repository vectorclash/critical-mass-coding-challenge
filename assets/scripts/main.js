let cities = null;
let activeID = 0;

function init() {
  gsap.registerPlugin(ScrambleTextPlugin);
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
  cities = data.cities;
  let navList = document.querySelector('.nav-list');
  data.cities.forEach((city, index) => {
    let navItem = document.createElement('li');
    navItem.classList.add('nav-item');
    navItem.textContent = city.label;
    navList.appendChild(navItem);
    navList.addEventListener('click', onButtonClick);

    if(index === 0) {
      navItem.click();
    }
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

function getTime(iana) {
  let timeTextElement = document.querySelector('.time-text');
  let time = new Date().toLocaleTimeString("en-US", { timeZone: iana });
  gsap.set('#time', {
    opacity: 1
  });
  
  gsap.to(timeTextElement, {
    scrambleText: {text: time, chars: "1234567890"},
    duration: 1,
    ease: 'quad.inOut'
  })
}

// event handlers

function onButtonClick(e) {
  let navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((navItem, index) => {
    if(navItem === e.target) {
      navItem.classList.add('active');
      activeID = index;
      let bounds = navItem.getBoundingClientRect();
      moveBar(bounds.x, bounds.width);
      getTime(cities[index].IANA);
    } else {
      navItem.classList.remove('active');
    }
  });
}

function onResize(e) {
  let indicator = document.querySelector(".nav-line-indicator");
  let line = document.querySelector(".nav-line");
  let navItems = document.querySelectorAll(".nav-item");

  gsap.set(indicator, {
    x: navItems[activeID].getBoundingClientRect().x - line.getBoundingClientRect().x
  });
}

// initialize on content load

window.addEventListener("DOMContentLoaded", init);