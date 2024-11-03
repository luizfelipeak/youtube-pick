// carousel
const carouselPhotos = document.querySelectorAll(".carousel-photos");
let carouselWebWorker = undefined, index = 0;

// const beatpellaLink = document.querySelector(".container-width");
// const hellcat = document.querySelector(".hellcat");
// const hiss = document.querySelector(".hiss");
// const huckle = document.querySelector(".huckle");
// const yella = document.querySelector(".yella");
// const wing = document.querySelector(".wing");
// const beatpellaObserver = new IntersectionObserver(entries => {
//     if(entries[0].isIntersecting) {
//         const delay = 150;
//         hellcat.classList.add("animate-show");
//         setTimeout(() => {
//             hiss.classList.add("animate-show");
//             setTimeout(() => {
//                 huckle.classList.add("animate-show");
//                 setTimeout(() => {
//                     yella.classList.add("animate-show");
//                     setTimeout(() => {
//                         wing.classList.add("animate-show");
//                     }, delay);
//                 }, delay);
//             }, delay);
//         }, delay);
//     }
// }, {threshold: 1, rootMargin: "0px 0px -100px 0px"});

function initiateCarouselWorker() {
    let indexCSS = [], rotationCSS = [], totalCarousel = carouselPhotos.length - 1;

    // ----- Initializing Earth web worker -----
    if(typeof (carouselWebWorker) == "undefined") {
        carouselWebWorker = new Worker("carousel_worker.js");
    }

    let i;
    for(i = 0; i <= totalCarousel; i++) {
        indexCSS.push(getComputedStyle(carouselPhotos[i]).getPropertyValue("--_index"));
        rotationCSS.push(getComputedStyle(carouselPhotos[i]).getPropertyValue("--_rotation"));
    }

    carouselWebWorker.onmessage = function (response) {
        carouselPhotos[index].classList.add("slide");
        setTimeout(() => {
            indexCSS.unshift(indexCSS.pop());
            rotationCSS.unshift(rotationCSS.pop());
            shufflePhotos(carouselPhotos, indexCSS, rotationCSS);
        }, 1000);
        index = response.data;
    };

    carouselWebWorker.postMessage([index, totalCarousel]);
}

function shufflePhotos(carouselPhotos, indexCSS, rotationCSS) {
    let i, totalImgs = carouselPhotos.length;
    for(i = 0; i < totalImgs; i++) {
        carouselPhotos[i].style.setProperty("--_index", indexCSS[i]);
        carouselPhotos[i].style.setProperty("--_rotation", rotationCSS[i]);
    }
}

// beatpellaObserver.observe(beatpellaLink);

initiateCarouselWorker();

Array.from(carouselPhotos).forEach(photo => {
    photo.addEventListener("animationend", () => {
        photo.classList.remove("slide");
    });
});

document.addEventListener("visibilitychange", () => {
    if(document.hidden) {
        if(typeof (carouselWebWorker) != "undefined") {
            carouselWebWorker.terminate();
            carouselWebWorker = undefined;
        }
    }
    else
        initiateCarouselWorker();
});