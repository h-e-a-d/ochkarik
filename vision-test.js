/**
 * VISION TEST MODULE
 * Interactive eye vision test using Russian Cyrillic optotypes
 *
 * Features:
 * - 12 lines of progressively smaller optotypes
 * - Line indicator (1 of 12, 2 of 12, etc.)
 * - Vision strength indicator (V = 0.1 to V = 2.0)
 * - Yes/No/Restart button controls
 * - Separate module for easy enable/disable
 *
 * i18n: reads window.__T__ (set by the Nunjucks template) and window.__LANG__.
 * Falls back to English strings if __T__ is not available.
 */

(function() {
    'use strict';

    // Vision test configuration
    const VISION_TEST_CONFIG = {
        totalLines: 12,
        // Vision values for each line (from table-ru.svg)
        visionValues: [
            'V = 0,1', // Line 1 (largest)
            'V = 0,2', // Line 2
            'V = 0,3', // Line 3
            'V = 0,4', // Line 4
            'V = 0,5', // Line 5
            'V = 0,6', // Line 6
            'V = 0,7', // Line 7
            'V = 0,8', // Line 8
            'V = 0,9', // Line 9
            'V = 1,0', // Line 10
            'V = 1,5', // Line 11
            'V = 2,0'  // Line 12 (smallest, best vision)
        ],
        // Corresponding D values (diopters)
        dioptersValues: [
            'D = 50,0',
            'D = 25,0',
            'D = 16,67',
            'D = 12,5',
            'D = 10,0',
            'D = 8,33',
            'D = 7,14',
            'D = 6,25',
            'D = 5,55',
            'D = 5,0',
            'D = 3,33',
            'D = 2,5'
        ],
        // Russian Cyrillic characters for each line (based on table-ru.svg)
        lineCharacters: [
            ['Ш', 'Б'],                              // Line 1 - V=0.1 (largest, 2 chars)
            ['М', 'Н', 'К'],                         // Line 2 - V=0.2 (3 chars)
            ['Ы', 'М', 'Б', 'Ш'],                    // Line 3 - V=0.3 (4 chars)
            ['Б', 'Ы', 'Н', 'К', 'М'],               // Line 4 - V=0.4 (5 chars)
            ['И', 'Н', 'Ш', 'М', 'К'],               // Line 5 - V=0.5 (5 chars)
            ['Н', 'Ш', 'Ы', 'И', 'К', 'Б'],          // Line 6 - V=0.6 (6 chars)
            ['Ш', 'И', 'Н', 'Б', 'К', 'Ы'],          // Line 7 - V=0.7 (6 chars)
            ['К', 'Н', 'Ш', 'М', 'Ы', 'Б', 'И'],     // Line 8 - V=0.8 (7 chars)
            ['Б', 'К', 'Ш', 'М', 'И', 'Ы', 'Н'],     // Line 9 - V=0.9 (7 chars)
            ['Н', 'К', 'И', 'Б', 'М', 'Ш', 'Ы', 'Б'], // Line 10 - V=1.0 (8 chars)
            ['Ш', 'И', 'Н', 'К', 'М', 'И', 'Ы', 'Б'], // Line 11 - V=1.5 (8 chars)
            ['И', 'М', 'Ш', 'Ы', 'Н', 'Б', 'М', 'К']  // Line 12 - V=2.0 (8 chars, smallest)
        ],
        // Font sizes in pixels for each line
        fontSizes: [120, 80, 60, 48, 40, 32, 28, 24, 20, 18, 14, 12]
    };

    /**
     * Return the visionTest translation bag for the current locale.
     * Uses window.__T__ (injected by the Nunjucks template) — never localStorage.
     */
    function getT() {
        return (window.__T__ && window.__T__.visionTest) || {};
    }

    let currentLine = 0; // 0 = not started, 1-12 = active line
    let visionTestActive = false;
    let testResults = []; // Store Yes/No results for each line

    /**
     * Initialize vision test when DOM is ready
     */
    function initVisionTest() {
        const testSection = document.getElementById('vision-test');
        if (!testSection) {
            console.warn('Vision test section not found in DOM');
            return;
        }

        // Get DOM elements
        const startBtn = document.getElementById('vision-start-btn');
        const yesBtn = document.getElementById('vision-yes-btn');
        const noBtn = document.getElementById('vision-no-btn');
        const restartBtn = document.getElementById('vision-restart-btn');
        const instructionText = document.getElementById('vision-instruction');
        const chartImage = document.getElementById('vision-chart');
        const chartBackground = document.getElementById('vision-chart-bg');
        const lineIndicator = document.getElementById('line-indicator');
        const visionIndicator = document.getElementById('vision-indicator');
        const controlsInitial = document.querySelector('.vision-controls-initial');
        const controlsTest = document.querySelector('.vision-controls-test');

        // Event listeners
        if (startBtn) {
            startBtn.addEventListener('click', startTest);
        }
        if (yesBtn) {
            yesBtn.addEventListener('click', () => recordAnswer(true));
        }
        if (noBtn) {
            noBtn.addEventListener('click', () => recordAnswer(false));
        }
        if (restartBtn) {
            restartBtn.addEventListener('click', resetTest);
        }

        /**
         * Start the vision test
         */
        function startTest() {
            visionTestActive = true;
            currentLine = 1;
            testResults = []; // Reset results

            // Update UI
            controlsInitial.classList.add('hidden');
            controlsTest.classList.remove('hidden');
            chartImage.classList.remove('hidden');
            lineIndicator.classList.remove('hidden');
            visionIndicator.classList.remove('hidden');

            // Hide background SVG when test starts
            if (chartBackground) {
                chartBackground.classList.add('hidden');
            }

            // Update instruction text using locale translations
            const t = getT();
            instructionText.setAttribute('data-i18n', 'visionTest.questionInstruction');
            instructionText.textContent = t.questionInstruction || 'Can you read all characters?';

            // Show first line
            updateTestDisplay();
        }

        /**
         * Record answer (Yes or No) and move to next line
         */
        function recordAnswer(canRead) {
            // Store the result for current line
            testResults.push({
                line: currentLine,
                vision: VISION_TEST_CONFIG.visionValues[currentLine - 1],
                diopter: VISION_TEST_CONFIG.dioptersValues[currentLine - 1],
                canRead: canRead
            });

            // Move to next line or show completion
            if (currentLine >= VISION_TEST_CONFIG.totalLines) {
                showCompletionMessage();
                return;
            }

            currentLine++;
            updateTestDisplay();
        }

        /**
         * Reset the test to initial state
         */
        function resetTest() {
            visionTestActive = false;
            currentLine = 0;
            testResults = []; // Clear results

            // Reset UI
            controlsInitial.classList.remove('hidden');
            controlsTest.classList.add('hidden');
            chartImage.classList.add('hidden');
            lineIndicator.classList.add('hidden');
            visionIndicator.classList.add('hidden');

            // Show background SVG again when test resets
            if (chartBackground) {
                chartBackground.classList.remove('hidden');
            }

            // Show Yes and No buttons again (in case they were hidden on completion)
            yesBtn.classList.remove('hidden');
            noBtn.classList.remove('hidden');

            // Reset instruction text using locale translations
            const t = getT();
            instructionText.setAttribute('data-i18n', 'visionTest.initialInstruction');
            instructionText.textContent = t.initialInstruction || 'Try our interactive vision test. Sit 50cm from the screen. Cover one eye.';
            instructionText.style.display = 'block';

            // Reset chart content
            chartImage.innerHTML = '';
        }

        /**
         * Update test display with current line info
         */
        function updateTestDisplay() {
            if (currentLine < 1 || currentLine > VISION_TEST_CONFIG.totalLines) {
                return;
            }

            const lineIndex = currentLine - 1;
            const t = getT();

            // Update indicators
            const lineText = t.lineIndicator || 'Line';
            const ofText = t.of || 'of';
            lineIndicator.textContent = `${lineText} ${currentLine} ${ofText} ${VISION_TEST_CONFIG.totalLines}`;
            visionIndicator.textContent = VISION_TEST_CONFIG.visionValues[lineIndex];

            updateChartDisplay(currentLine);
        }

        /**
         * Update chart display to show specific line of characters
         */
        function updateChartDisplay(lineNumber) {
            if (lineNumber < 1 || lineNumber > VISION_TEST_CONFIG.totalLines) {
                chartImage.innerHTML = '';
                return;
            }

            const lineIndex = lineNumber - 1;
            const characters = VISION_TEST_CONFIG.lineCharacters[lineIndex];
            const fontSize = VISION_TEST_CONFIG.fontSizes[lineIndex];

            chartImage.innerHTML = `
                <div class="vision-line" style="font-size: ${fontSize}px; font-weight: 700;">
                    ${characters.map(char => `<span class="vision-char">${char}</span>`).join('')}
                </div>
            `;
        }

        /**
         * Show completion message with results summary
         */
        function showCompletionMessage() {
            const t = getT();
            const testCompleteText = t.testComplete || 'Test Complete!';
            const yourVisionText = t.yourVision || 'Your vision level:';
            const detailedResultsText = t.detailedResults || 'Detailed Results:';
            const consultationText = t.consultationReminder || 'Please consult with Dr. Karimova for a professional eye examination.';
            const lineText = t.lineIndicator || 'Line';

            // Find the best vision level (last "Yes" answer)
            let bestVision = null;

            for (let i = testResults.length - 1; i >= 0; i--) {
                if (testResults[i].canRead) {
                    bestVision = testResults[i].vision;
                    break;
                }
            }

            if (!bestVision) {
                bestVision = 'Below V = 0,1';
            }

            // Build results summary
            let summaryHTML = `
                <div class="vision-results-summary text-center pt-6">
                    <h3 class="text-lg md:text-2xl font-semibold text-navy-900 mb-2">${testCompleteText}</h3>
                    <div class="text-base md:text-lg mb-3">
                        <p>${yourVisionText} <strong class="text-coral">${bestVision}</strong></p>
                    </div>
                    <div class="results-details bg-white rounded-lg p-4 md:p-6 mb-3 text-left">
                        <h4 class="font-semibold text-navy-900 mb-2 text-center">${detailedResultsText}</h4>
                        <div class="space-y-1 max-h-64 overflow-y-auto pr-2">
            `;

            testResults.forEach(result => {
                const icon = result.canRead ? '✓' : '✗';
                const color = result.canRead ? 'text-green-600' : 'text-red-600';
                summaryHTML += `
                    <div class="flex items-center justify-between py-1.5 border-b border-gray-100 pr-1">
                        <span class="text-sm">${lineText} ${result.line}: ${result.vision}</span>
                        <span class="${color} font-bold text-lg">${icon}</span>
                    </div>
                `;
            });

            summaryHTML += `
                        </div>
                    </div>
                    <p class="text-xs md:text-sm text-gray-600">${consultationText}</p>
                </div>
            `;

            chartImage.innerHTML = summaryHTML;

            // Hide instruction text and Yes/No buttons on completion
            instructionText.style.display = 'none';
            yesBtn.classList.add('hidden');
            noBtn.classList.add('hidden');
        }
    }

    /**
     * Auto-initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisionTest);
    } else {
        initVisionTest();
    }

    /**
     * Public API
     */
    window.VisionTest = {
        init: initVisionTest,
        isActive: () => visionTestActive,
        getCurrentLine: () => currentLine
    };

})();
