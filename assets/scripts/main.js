let cities = null;
let activeID = null;
let isAnimating = false;

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
  let time = new Date().toLocaleTimeString("en-US", { timeZone: iana });
  let timeSplit = time.split(" ");
  let timeString =
    timeSplit[0].split(":")[0] +
    ":" +
    timeSplit[0].split(":")[1] +
    " " +
    timeSplit[timeSplit.length - 1];
  return timeString;
}

function setTime(iana) {
  isAnimating = true;

  gsap.set('#time', {
    opacity: 1
  });
  
  let timeTextElement = document.querySelector(".time-text");
  gsap.to(timeTextElement, {
    scrambleText: { text: getTime(iana), chars: "1234567890" },
    duration: 1,
    ease: "quad.inOut",
    onComplete: () => {
      isAnimating = false;
      setTimeout(() => {
        updateTime();
      }, 1000);
    }
  });
}

function updateTime() {
  let timeTextElement = document.querySelector(".time-text");
  timeTextElement.textContent = getTime(cities[activeID].IANA);

  if(!isAnimating) {
    setTimeout(() => {
      updateTime();
    }, 1000);
  }
}

// event handlers

function onButtonClick(e) {
  if(!e.target.classList.contains('nav-item')) return;

  let navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((navItem, index) => {
    if(navItem === e.target) {
      if(activeID === index) return; 
      navItem.classList.add('active');
      activeID = index;
      let bounds = navItem.getBoundingClientRect();
      moveBar(bounds.x, bounds.width);
      setTime(cities[index].IANA);
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