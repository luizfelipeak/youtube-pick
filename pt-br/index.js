// carousel
const carouselPhotos = document.querySelectorAll(".carousel-photos");
let carouselWebWorker = undefined, index = 0;

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