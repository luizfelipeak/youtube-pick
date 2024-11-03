function carouselInterval(index, size) {
    setInterval(() => {
        if(index < size)
            index++;
        else
            index = 0;

        postMessage(index);
    }, 5000);
}

onmessage = (response) => {
    carouselInterval(response.data[0], response.data[1]);
};