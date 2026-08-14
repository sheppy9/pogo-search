document.addEventListener('DOMContentLoaded', () => {
    const types = [
        "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting",
        "Fire", "Flying", "Ghost", "Grass", "Ground", "Ice",
        "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"
    ];

    const typeGrid = document.getElementById('type-grid');
    const outputBox = document.getElementById('output-box');
    const clearBtn = document.getElementById('clear-btn');
    const toast = document.getElementById('toast');

    // Create checkboxes dynamically
    types.forEach(type => {
        const lowerType = type.toLowerCase();
        
        const wrapper = document.createElement('label');
        wrapper.className = 'type-label';
        // Set the CSS variable for the background color hover/active states
        // In CSS we defined --type-bug, --type-dark, etc.
        const typeColorVar = `var(--type-${lowerType})`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'type-checkbox';
        checkbox.value = lowerType;
        
        const text = document.createTextNode(type);
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(text);
        
        // Add event listener for dynamic styling and logic
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                wrapper.classList.add('selected');
                wrapper.style.backgroundColor = typeColorVar;
                wrapper.style.borderColor = typeColorVar;
            } else {
                wrapper.classList.remove('selected');
                wrapper.style.backgroundColor = '';
                wrapper.style.borderColor = '';
            }
            updateOutput();
        });

        typeGrid.appendChild(wrapper);
    });

    clearBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.type-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = false;
            // trigger change event to reset styles and output
            cb.dispatchEvent(new Event('change'));
        });
    });

    function updateOutput() {
        const checkboxes = document.querySelectorAll('.type-checkbox:checked');
        const selectedTypes = Array.from(checkboxes).map(cb => cb.value);

        if (selectedTypes.length === 0) {
            if (outputBox) outputBox.innerHTML = '<span class="placeholder">Select types to generate string</span>';
            return;
        }

        // Generate the string based on selected types
        // Part 1 (Fast Moves): @1type1,@1type2
        const fastMoves = selectedTypes.map(t => `@1${t}`).join(',');
        
        // Part 2 (Charged Moves): @2type1,@2type2,@3type1,@3type2
        const charged1 = selectedTypes.map(t => `@2${t}`).join(',');
        const charged2 = selectedTypes.map(t => `@3${t}`).join(',');
        const chargedMoves = `${charged1},${charged2}`;
        
        const generatedString = `${fastMoves}&${chargedMoves}`;
        
        if (outputBox) outputBox.textContent = generatedString;
        
        // Automatically copy to clipboard
        copyToClipboard(generatedString);
    }

    let toastTimeout;
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function showToast() {
        toast.classList.add('show');
        
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
});
