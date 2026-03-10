addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    let moveAndHideObj;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideObj = animaster().moveAndHide(block, 2000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideObj !== undefined) {
                moveAndHideObj.reset();
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    let heartBeatingObj;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingObj = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingObj !== undefined) {
                heartBeatingObj.stop();
            }
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
  
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
  
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    return {
        _steps: [],
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function (element, duration, translation) {
            animaster().move(element, duration * 0.4, translation);
            const timeOut = setTimeout(() => animaster().fadeOut(element, duration * 0.6), duration * 0.4);

            return {
                reset: function () {
                    clearTimeout(timeOut);
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            }
        },
        showAndHide: function (element, duration) {
            animaster().fadeIn(element, duration / 3);
            setTimeout(() => animaster().fadeOut(element, duration / 3), duration / 3);
        },
        heartBeating: function (element) {
            this.scale(element, 500, 1.4);
            const scaleToBigInt = setInterval(() => this.scale(element, 500, 1), 500);
            const scaleToOneInt = setInterval(() => this.scale(element, 500, 1.4), 1000);

            return {
                stop: function () {
                    clearInterval(scaleToBigInt);
                    clearInterval(scaleToOneInt);
                }
            };
        },
        addMove(){
            return
        },
        play(element){
            for (let i; i < this._steps.length; i++){
                if (this._steps[i].name === 'move'){
                    this.move(element, this._steps[i].duration, this._steps[i].translation)
                }
                if (this._steps[i].name === 'scale'){
                    this.scale(element, this._steps[i].duration, this._steps[i].ratio)
                }
                if (this._steps[i].name === 'fadeIn'){
                    this.fadeIn(element, this._steps[i].duration)
                }
                if (this._steps[i].name === 'fadeOut'){
                    this.fadeOut(element, this._steps[i].duration)
                }
            }
        }
    }
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
/**function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}**/

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
/**function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}**/

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
/**function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}**/

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
