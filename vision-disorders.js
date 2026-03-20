/**
 * Vision Disorders Simulation
 * Interactive section simulating Myopia, Cataracts, and Glaucoma
 * via CSS filter effects on a street photo.
 */
(function () {
    'use strict';

    const CONFIG = {
        defaultSeverity: 50,
        defaultCondition: 'healthy',
    };

    let currentCondition = CONFIG.defaultCondition;
    let img, overlay, sliderRow, slider;

    // ─── Init ────────────────────────────────────────────────────────────────

    function init() {
        if (!document.getElementById('vision-disorders')) return;

        img       = document.getElementById('vd-image');
        overlay   = document.getElementById('vd-overlay');
        sliderRow = document.getElementById('vd-slider-row');
        slider    = document.getElementById('vd-slider');

        // Tab listeners
        document.querySelectorAll('.vd-tab').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setCondition(btn.dataset.condition);
            });
        });

        // Slider listener — no CSS transition during drag
        slider.addEventListener('input', function () {
            updateSliderFill(slider);
            updateEffect(parseInt(slider.value, 10), false);
        });

        // Initial state: Healthy tab already marked .active in HTML
        // No updateEffect() needed — Healthy = no filter applied
    }

    // ─── Condition switching ─────────────────────────────────────────────────

    function setCondition(name) {
        currentCondition = name;

        document.querySelectorAll('.vd-tab').forEach(function (btn) {
            const isActive = btn.dataset.condition === name;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if (name === 'healthy') {
            sliderRow.classList.remove('visible');
            resetEffects();
        } else {
            sliderRow.classList.add('visible');
            slider.value = CONFIG.defaultSeverity;
            updateSliderFill(slider);
            updateEffect(CONFIG.defaultSeverity, true);
        }
    }

    // ─── Effect engine ───────────────────────────────────────────────────────

    function updateEffect(sliderValue, isTabSwitch) {
        const v = sliderValue / 100;

        if (isTabSwitch) {
            img.classList.add('vd-transitioning');
            setTimeout(function () {
                img.classList.remove('vd-transitioning');
            }, 400);
        } else {
            // Cancel any in-progress tab-switch transition before applying filter
            img.classList.remove('vd-transitioning');
        }

        resetEffects();

        // Suppress CSS transition for slider drag (applied after resetEffects clears inline style)
        if (!isTabSwitch) {
            img.style.transition = 'none';
        }

        if (currentCondition === 'myopia')         { applyMyopia(v); }
        else if (currentCondition === 'cataracts') { applyCataracts(v); }
        else if (currentCondition === 'glaucoma')  { applyGlaucoma(v); }
    }

    function applyMyopia(v) {
        img.style.filter = 'blur(' + (v * 10) + 'px)';
    }

    function applyCataracts(v) {
        img.style.filter = [
            'blur(' + (v * 4) + 'px)',
            'brightness(' + (1 - v * 0.35) + ')',
            'sepia(' + (v * 0.6) + ')',
            'contrast(' + (1 - v * 0.2) + ')',
        ].join(' ');
        overlay.style.background = 'rgba(255, 245, 200, ' + (v * 0.35) + ')';
        overlay.style.opacity    = '1';
    }

    function applyGlaucoma(v) {
        const innerR = Math.max(5, 55 - v * 50);
        const midR   = Math.min(innerR + 25, 90);
        overlay.style.background = [
            'radial-gradient(ellipse 50% 50% at 50% 50%,',
            '  transparent ' + innerR + '%,',
            '  rgba(0,0,0,0.7) ' + midR + '%,',
            '  rgba(0,0,0,0.97) 100%)',
        ].join(' ');
        overlay.style.opacity = '1';
        img.style.filter = 'brightness(' + (1 - v * 0.2) + ')';
    }

    function updateSliderFill(el) {
        const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
        el.style.background = 'linear-gradient(to right, #0a2a3d ' + pct + '%, #d1d5db ' + pct + '%)';
    }

    function resetEffects() {
        img.style.filter     = '';
        img.style.transition = '';   // clears inline override, restores CSS class control
        overlay.style.opacity    = '0';
        overlay.style.background = 'none';
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    function getCondition() { return currentCondition; }

    window.VisionDisorders = { init: init, getCondition: getCondition };
    document.addEventListener('DOMContentLoaded', init);

}());
