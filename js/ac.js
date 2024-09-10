const css = `
    .autocomplete-wrapper {
        position: relative;
        display: inline-block;
        border: none;
    }

    .autocomplete-input {
        z-index: 1;
    }

    .autocomplete-input:focus {
        background: transparent !important;
    }
    .autocomplete-suggestion {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 0;
        opacity: 0.3;
    }
    .autocomplete-suggestion span.inv{
        color: transparent;
    }
`;

const styles = document.createElement('style');
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);

const ACJS = {}

function initACJSInputs(){

    const inputs = document.querySelectorAll('.autocomplete-input');
    inputs.forEach((input) => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'autocomplete-wrapper';

        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'autocomplete-suggestion';

        input.parentNode.insertBefore(wrapperDiv, input);
        wrapperDiv.appendChild(input); 
        wrapperDiv.appendChild(suggestionDiv);

        var inputStyles = window.getComputedStyle(input);
        suggestionDiv.style.fontFamily = inputStyles.fontFamily;
        suggestionDiv.style.fontSize = inputStyles.fontSize;
        suggestionDiv.style.color = inputStyles.color;
        suggestionDiv.style.margin = inputStyles.margin;
        suggestionDiv.style.borderWidth = inputStyles.borderWidth;
        suggestionDiv.style.borderStyle = inputStyles.borderStyle;
        suggestionDiv.style.padding = inputStyles.padding;
        suggestionDiv.style.width = inputStyles.width;
        suggestionDiv.style.height = inputStyles.height;

        suggestionDiv.style.borderColor = 'transparent';     
        
        input.addEventListener('input', () => {
            const userInput = input.value.toLowerCase();
            const suggestion = ACJS[input.name].find(item => item.toLowerCase().startsWith(userInput));

            if (suggestion && userInput) {
                const suggestionPart = suggestion.substring(userInput.length);
                const invisiblePart = suggestion.substring(0, userInput.length); // so if the suggestion is capitalized, it remains so
                suggestionDiv.innerHTML = '<span class="inv">' + invisiblePart + '</span>' + suggestionPart;
            } else {
                suggestionDiv.textContent = '';
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Tab' && !event.shiftKey || event.key === 'Enter') {
                event.preventDefault();
                if (suggestionDiv.textContent) {
                    input.value = suggestionDiv.textContent;
                }

                focusNext();
            }
        });

        input.addEventListener('blur', () => {
            suggestionDiv.textContent = '';
        });

    });//foreach
}//initACJSInputs



function focusNext() {
    const focusableElements = Array.from(document.querySelectorAll('input, button, [tabindex]'))
        .filter(el => !el.disabled && el.tabIndex >= 0);

    const currentIndex = focusableElements.indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;

    focusableElements[nextIndex].focus();
}
