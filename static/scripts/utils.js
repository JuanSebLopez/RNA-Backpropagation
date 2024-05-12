const utils = {
    createSlider: function(id, min, max, value) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.id = id;
        slider.classList.add('rs-range');
        return slider;
    },
    
}
export default utils;