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

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration, translation) {
            return this
                .addMove(duration * 0.4, translation)
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {
            const part = duration / 3;

            return this
                .addFadeIn(part)
                .addDelay(part)
                .addFadeOut(part)
                .play(element);
        },

        heartBeating(element) {
            return this
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration,
                translation,
                ratio: undefined,
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration,
                translation: undefined,
                ratio,
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration,
                translation: undefined,
                ratio: undefined,
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration,
                translation: undefined,
                ratio: undefined,
            });
            return this;
        },

        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration,
                translation: undefined,
                ratio: undefined,
            });
            return this;
        },

        play(element, cycled = false) {
            const steps = [...this._steps];
            const timeouts = [];
            let intervalId = null;

            const initialState = {
                isHidden: element.classList.contains('hide'),
                transform: element.style.transform,
                transitionDuration: element.style.transitionDuration,
            };

            let currentTime = 0;

            function runStep(step) {
                if (step.name === 'move') {
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(step.translation, null);
                }

                if (step.name === 'scale') {
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(null, step.ratio);
                }

                if (step.name === 'fadeIn') {
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }

                if (step.name === 'fadeOut') {
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            }

            function startAnimation() {
                let delay = 0;

                for (let i = 0; i < steps.length; i++) {
                    const step = steps[i];

                    const timeoutId = setTimeout(() => {
                        if (step.name !== 'delay') {
                            runStep(step);
                        }
                    }, delay);

                    timeouts.push(timeoutId);
                    delay += step.duration;
                }

                currentTime = delay;
            }

            startAnimation();

            if (cycled) {
                intervalId = setInterval(() => {
                    startAnimation();
                }, currentTime);
            }

            return {
                stop() {
                    timeouts.forEach(clearTimeout);
                    if (intervalId !== null) {
                        clearInterval(intervalId);
                    }
                },

                reset() {
                    timeouts.forEach(clearTimeout);
                    if (intervalId !== null) {
                        clearInterval(intervalId);
                    }

                    if (initialState.isHidden) {
                        resetFadeIn(element);
                    } else {
                        resetFadeOut(element);
                    }

                    resetMoveAndScale(element);

                    element.style.transform = initialState.transform;
                    element.style.transitionDuration = initialState.transitionDuration;
                }
            };
        }
    };
}

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