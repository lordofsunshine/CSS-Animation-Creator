document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('animation-form');
    const animatedElement = document.getElementById('animated-element');
    const cssOutput = document.getElementById('css-output');
    const copyButton = document.getElementById('copy-css');
    const elementTypeSelect = document.getElementById('element-type');
    const customShapeGroup = document.getElementById('custom-shape-group');
    const timingFunctionSelect = document.getElementById('timing-function');
    const cubicBezierGroup = document.getElementById('cubic-bezier-group');
    const infiniteCheckbox = document.getElementById('infinite');
    const iterationCountInput = document.getElementById('iteration-count');
    const applyAnimationButton = document.getElementById('apply-animation');

    applyAnimationButton.addEventListener('click', applyAnimation);

    copyButton.addEventListener('click', () => {
        const cssCode = cssOutput.textContent;
        navigator.clipboard.writeText(cssCode).then(() => {
            alert('CSS код скопирован в буфер обмена!');
        });
    });

    elementTypeSelect.addEventListener('change', () => {
        customShapeGroup.style.display = elementTypeSelect.value === 'custom' ? 'block' : 'none';
    });

    timingFunctionSelect.addEventListener('change', () => {
        cubicBezierGroup.style.display = timingFunctionSelect.value === 'cubic-bezier' ? 'block' : 'none';
    });

    infiniteCheckbox.addEventListener('change', () => {
        iterationCountInput.disabled = infiniteCheckbox.checked;
    });

    function applyAnimation() {
        try {
            const elementType = elementTypeSelect.value;
            const animationType = document.getElementById('animation-type').value;
            const duration = parseFloat(document.getElementById('duration').value);
            const delay = parseFloat(document.getElementById('delay').value);
            const timingFunction = timingFunctionSelect.value;
            const iterationCount = infiniteCheckbox.checked ? 'infinite' : iterationCountInput.value;
            const customShape = document.getElementById('custom-shape').value;
            const cubicBezier = document.getElementById('cubic-bezier').value;

            const timingFunctionValue = timingFunction === 'cubic-bezier' ? `cubic-bezier(${cubicBezier})` : timingFunction;
            animatedElement.style.animation = `${animationType} ${duration}s ${timingFunctionValue} ${delay}s ${iterationCount} normal`;

            updateElementShape(elementType, customShape);

            const cssCode = generateCSSCode(elementType, animationType, duration, delay, timingFunctionValue, iterationCount, customShape);

            cssOutput.textContent = cssCode;
        } catch (error) {
            console.error('Ошибка при применении анимации:', error);
            alert('Произошла ошибка при применении анимации. Пожалуйста, проверьте введенные данные.');
        }
    }

    function updateElementShape(elementType, customShape) {
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        animatedElement.style.width = '100px';
        animatedElement.style.height = '100px';

        switch (elementType) {
            case 'box':
                animatedElement.style.borderRadius = '0';
                animatedElement.style.backgroundColor = accentColor;
                animatedElement.style.clipPath = 'none';
                animatedElement.textContent = '';
                break;
            case 'circle':
                animatedElement.style.borderRadius = '50%';
                animatedElement.style.backgroundColor = accentColor;
                animatedElement.style.clipPath = 'none';
                animatedElement.textContent = '';
                break;
            case 'triangle':
                animatedElement.style.borderRadius = '0';
                animatedElement.style.backgroundColor = accentColor;
                animatedElement.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                animatedElement.textContent = '';
                break;
            case 'text':
                animatedElement.style.borderRadius = '0';
                animatedElement.style.backgroundColor = 'transparent';
                animatedElement.style.clipPath = 'none';
                animatedElement.style.color = accentColor;
                animatedElement.textContent = 'Анимированный текст';
                break;
            case 'custom':
                animatedElement.style.borderRadius = '0';
                animatedElement.style.backgroundColor = accentColor;
                if (customShape) {
                    animatedElement.style.clipPath = `path('${customShape}')`;
                } else {
                    animatedElement.style.clipPath = 'none';
                }
                animatedElement.textContent = '';
                break;
        }
    }

    function generateCSSCode(elementType, animationType, duration, delay, timingFunction, iterationCount, customShape) {
        let cssCode = `.animated-element {
    animation: ${animationType} ${duration}s ${timingFunction} ${delay}s ${iterationCount} normal;
`;

        switch (elementType) {
            case 'circle':
                cssCode += '    border-radius: 50%;\n';
                break;
            case 'triangle':
                cssCode += '    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);\n';
                break;
            case 'custom':
                if (customShape) {
                    cssCode += `    clip-path: path('${customShape}');\n`;
                }
                break;
        }

        cssCode += '}\n\n';
        cssCode += `@keyframes ${animationType} {
    ${getKeyframes(animationType)}
}`;

        return cssCode;
    }

    function getKeyframes(animationType) {
        switch (animationType) {
            case 'fade':
                return `from { opacity: 0; }
    to { opacity: 1; }`;
            case 'slide':
                return `from { transform: translateX(-100%); }
    to { transform: translateX(0); }`;
            case 'rotate':
                return `from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }`;
            case 'scale':
                return `from { transform: scale(0); }
    to { transform: scale(1); }`;
            case 'shake':
                return `0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }`;
            case 'bounce':
                return `0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }`;
            case 'flip':
                return `0% { transform: perspective(400px) rotateY(0); }
    100% { transform: perspective(400px) rotateY(360deg); }`;
            case 'pulse':
                return `0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }`;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            this.value = escapeHTML(this.value);
        });
    });
});