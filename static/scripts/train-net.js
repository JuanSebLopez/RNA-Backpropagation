// Inicializar sliders al cargar la página
document.addEventListener('DOMContentLoaded', initializeSliders);

function initializeSliders(){
    const sliders = document.querySelectorAll('.rs-range');
    sliders.forEach(slider => {
        updateSliderValue(slider);
        slider.addEventListener('input', (event) => {
            updateSliderValue(event.target);
        });
    });
}

function updateSliderValue(slider) {
    const bullet = slider.parentElement.querySelector('.rs-label');
    const sliderWidth = slider.offsetWidth;
    const max = slider.max;
    const min = slider.min;
    const value = slider.value;

    bullet.innerHTML = slider.value;

    const bulletPosition = ((value - min) / (max - min) *  ((sliderWidth - 21)));

    bullet.style.left = `${bulletPosition}px`
}
