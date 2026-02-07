// Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sticky navigation
        function initStickyNav() {
            const nav = document.querySelector('nav[data-nav]');
            const jumbotron = document.querySelector('.jumbotron');
            if (!nav || !jumbotron) return;

            // Create spacer element to prevent content jump
            const spacer = document.createElement('div');
            spacer.className = 'nav-spacer';
            spacer.style.height = nav.offsetHeight + 'px';
            nav.parentNode.insertBefore(spacer, nav.nextSibling);

            function handleScroll() {
                const jumbotronBottom = jumbotron.offsetTop + jumbotron.offsetHeight;

                if (window.scrollY > jumbotronBottom) {
                    nav.classList.add('is-sticky');
                    spacer.classList.add('is-active');
                } else {
                    nav.classList.remove('is-sticky');
                    spacer.classList.remove('is-active');
                }
            }

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Check initial state
        }

        // Run sticky nav when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initStickyNav);
        } else {
            initStickyNav();
        }

        // Open Now indicator
        function initOpenStatus() {
            const statusEl = document.querySelector('[data-open-status]');
            const hoursDataEl = document.getElementById('store-hours-data');

            if (!statusEl || !hoursDataEl) return;

            // Parse hours from embedded JSON
            let hoursData;
            try {
                hoursData = JSON.parse(hoursDataEl.textContent);
                // Handle double-encoded JSON from Hugo
                if (typeof hoursData === 'string') {
                    hoursData = JSON.parse(hoursData);
                }
            } catch (e) {
                return;
            }

            // Convert 12-hour format to 24-hour minutes
            function parseTime(timeStr) {
                if (!timeStr) return null;
                const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);
                if (!match) return null;
                let hours = parseInt(match[1]);
                const mins = parseInt(match[2]);
                const period = match[3].toLowerCase();
                if (period === 'pm' && hours !== 12) hours += 12;
                if (period === 'am' && hours === 12) hours = 0;
                return { hours, mins, formatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}` };
            }

            // Map day names to day numbers (0 = Sunday)
            const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

            // Build hours object keyed by day number
            const hours = {};
            for (const [dayName, data] of Object.entries(hoursData)) {
                const dayNum = dayMap[dayName];
                if (data.closed) {
                    hours[dayNum] = null;
                } else {
                    const openTime = parseTime(data.open);
                    const closeTime = parseTime(data.close);
                    if (openTime && closeTime) {
                        hours[dayNum] = { open: openTime.formatted, close: closeTime.formatted };
                    }
                }
            }

            function getNextOpenTime(currentDay, currentMinutes) {
                // Check if store opens later today
                const todayHours = hours[currentDay];
                if (todayHours) {
                    const [openHour, openMin] = todayHours.open.split(':').map(Number);
                    const openMinutes = openHour * 60 + openMin;
                    if (currentMinutes < openMinutes) {
                        return { minutes: openMinutes - currentMinutes, day: 'today' };
                    }
                }

                // Find next open day
                let daysAhead = 1;
                for (let i = 1; i <= 7; i++) {
                    const nextDay = (currentDay + i) % 7;
                    if (hours[nextDay]) {
                        const [openHour, openMin] = hours[nextDay].open.split(':').map(Number);
                        const openMinutes = openHour * 60 + openMin;
                        // Minutes until midnight + minutes into next open day
                        const minutesUntilMidnight = (24 * 60) - currentMinutes;
                        const totalMinutes = minutesUntilMidnight + ((i - 1) * 24 * 60) + openMinutes;
                        return { minutes: totalMinutes, day: i === 1 ? 'tomorrow' : null };
                    }
                }
                return null;
            }

            function formatTimeUntil(minutes) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;

                if (hours === 0) {
                    return `Opens in ${mins}m`;
                } else if (hours < 24) {
                    return mins > 0 ? `Opens in ${hours}h ${mins}m` : `Opens in ${hours}h`;
                } else {
                    const days = Math.floor(hours / 24);
                    const remainingHours = hours % 24;
                    if (days === 1) {
                        return remainingHours > 0 ? `Opens tomorrow` : `Opens tomorrow`;
                    }
                    return `Opens in ${days} days`;
                }
            }

            function checkIfOpen() {
                // Get current time in Pacific timezone
                const now = new Date();
                const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
                const day = pacificTime.getDay();
                const currentMinutes = pacificTime.getHours() * 60 + pacificTime.getMinutes();

                const todayHours = hours[day];

                let isOpen = false;
                if (todayHours) {
                    const [openHour, openMin] = todayHours.open.split(':').map(Number);
                    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
                    const openMinutes = openHour * 60 + openMin;
                    const closeMinutes = closeHour * 60 + closeMin;
                    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
                }

                if (isOpen) {
                    statusEl.textContent = 'Open Now';
                    statusEl.className = 'open-status is-open';
                } else {
                    const nextOpen = getNextOpenTime(day, currentMinutes);
                    if (nextOpen) {
                        statusEl.textContent = formatTimeUntil(nextOpen.minutes);
                        statusEl.className = 'open-status is-closed';
                    }
                }
            }

            // Highlight current day
            const pacificNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
            const todayRow = document.querySelector(`[data-day="${pacificNow.getDay()}"]`);
            if (todayRow) {
                todayRow.classList.add('is-today');
            }

            checkIfOpen();
            // Update every minute
            setInterval(checkIfOpen, 60000);
        }

        // Run open status when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initOpenStatus);
        } else {
            initOpenStatus();
        }

        // Exploding candy button effect
        window.addExplosion = function(button, event) {
            // Skip animation if user prefers reduced motion
            if (prefersReducedMotion) {
                if (button.tagName === 'A' && event) {
                    // Don't prevent default, let normal navigation happen
                    return;
                }
                return;
            }
            // If it's a link, prevent default and navigate after animation
            if (button.tagName === 'A' && event) {
                event.preventDefault();
                const href = button.href;
                const target = button.target;

                // Navigate after animation plays
                setTimeout(() => {
                    if (target === '_blank') {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                }, 400);
            }

            button.classList.add('explode');

            // Create sparkles
            for (let i = 0; i < 8; i++) {
                const sparkle = document.createElement('iconify-icon');
                sparkle.setAttribute('icon', ['mdi:star', 'mdi:star-four-points', 'mdi:sparkles', 'mdi:star-circle'][Math.floor(Math.random() * 4)]);
                sparkle.style.position = 'absolute';
                sparkle.style.left = '50%';
                sparkle.style.top = '50%';
                sparkle.style.transform = 'translate(-50%, -50%)';
                sparkle.style.fontSize = '1.5rem';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';

                button.appendChild(sparkle);

                const angle = (360 / 8) * i;
                const distance = 60;
                const x = Math.cos(angle * Math.PI / 180) * distance;
                const y = Math.sin(angle * Math.PI / 180) * distance;

                sparkle.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'ease-out'
                });

                setTimeout(() => sparkle.remove(), 600);
            }

            setTimeout(() => button.classList.remove('explode'), 600);
        }

        // Magic Dust Sparkles around H1
        function initSparkles() {
            // Skip sparkles if user prefers reduced motion
            if (prefersReducedMotion) return;
            const head = document.getElementsByTagName('head')[0];
            let animationId = 1;

            function CreateMagicDust(x1, x2, y1, y2, sizeRatio, fallingTime, animationDelay, node = 'hero-content') {
                let dust = document.createElement('span');
                let animation = document.createElement('style');
                animation.innerHTML = `
                @keyframes blink${animationId} {
                    0% {
                        top: ${y1}px;
                        left: ${x1}px;
                        width: ${2*sizeRatio}px;
                        height: ${2*sizeRatio}px;
                        opacity: .4
                    }
                    20% {
                        width: ${4*sizeRatio}px;
                        height: ${4*sizeRatio}px;
                        opacity: .8
                    }
                    35% {
                        width: ${2*sizeRatio}px;
                        height: ${2*sizeRatio}px;
                        opacity: .5
                    }
                    55% {
                        width: ${3*sizeRatio}px;
                        height: ${3*sizeRatio}px;
                        opacity: .7
                    }
                    80% {
                        width: ${sizeRatio}px;
                        height: ${sizeRatio}px;
                        opacity: .3
                    }
                    100% {
                        top: ${y2}px;
                        left: ${x2}px;
                        width: 0px;
                        height: 0px;
                        opacity: .1
                    }
                }`;
                head.appendChild(animation);
                dust.classList.add('dustDef');
                dust.setAttribute('style', `animation: blink${animationId++} ${fallingTime}s cubic-bezier(.71, .11, .68, .83) infinite ${animationDelay}s`);
                const container = document.querySelector('.hero-content');
                if (container) {
                    container.appendChild(dust);
                }
            }

            // Generate random falling sparkles from the H1 text
            // Get the H1 position to spawn sparkles from it
            const h1 = document.querySelector('h1');
            const heroContent = document.querySelector('.hero-content');
            if (h1 && heroContent) {
                const h1Rect = h1.getBoundingClientRect();
                const heroRect = heroContent.getBoundingClientRect();

                // Calculate relative position within hero-content
                const h1Top = h1Rect.top - heroRect.top + 40;
                const h1Left = h1Rect.left - heroRect.left;
                const h1Width = h1Rect.width;
                const h1Height = h1Rect.height;

                // Create 30+ sparkles with randomized positions
                const sparkles = [];
                for (let i = 0; i < 33; i++) {
                    // Random horizontal position across the title width
                    const startX = h1Left + Math.random() * h1Width;
                    // Slight horizontal drift as it falls
                    const endX = startX + (Math.random() * 60 - 30);

                    // Start from within the H1 text area
                    const startY = h1Top + Math.random() * h1Height;
                    // Fall down to various distances
                    const endY = startY + 150 + Math.random() * 250;

                    // Random size
                    const size = 0.42 + Math.random() * 0.62;

                    // Random duration (how fast it falls)
                    const duration = 2 + Math.random() * 3;

                    // Random delay for staggered effect
                    const delay = Math.random() * 4;

                    sparkles.push([startX, endX, startY, endY, size, duration, delay]);
                }

                sparkles.forEach((o) => CreateMagicDust(...o));
            }
        }

        // Run sparkles when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSparkles);
        } else {
            initSparkles();
        }

        // Holiday Countdown
        function initHolidayCountdown() {
            try {
                const countdownContainer = document.querySelector('[data-holiday-countdown]');
                console.log('CC found:', !!countdownContainer);
                if (!countdownContainer) return;

                const countdownTimer = document.getElementById('countdown-timer');
                console.log('CT found:', !!countdownTimer);
                if (!countdownTimer) return;

                const holidayMessage = document.getElementById('holiday-message');
                
                const targetDateStr = countdownTimer.getAttribute('data-countdown-target');
                console.log('TDS:', targetDateStr);
                
                if (!targetDateStr) return;
                
                const dateParts = targetDateStr.split('-');
                if (dateParts.length !== 3) {
                    console.error('Bad date:', targetDateStr);
                    return;
                }
                
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1;
                const day = parseInt(dateParts[2], 10);
                
                const targetDate = new Date(year, month, day, 23, 59, 59).getTime();
                const now = new Date().getTime();
                
                console.log('Target ms:', targetDate, 'Now ms:', now, 'Diff:', targetDate - now);

                function updateCountdown() {
                    const currentNow = new Date().getTime();
                    const distance = targetDate - currentNow;

                    if (distance <= 0) {
                        if (countdownTimer) countdownTimer.style.display = 'none';
                        if (holidayMessage) holidayMessage.style.display = 'block';
                        return;
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    const daysEl = countdownTimer ? countdownTimer.querySelector('[data-days]') : null;
                    const hoursEl = countdownTimer ? countdownTimer.querySelector('[data-hours]') : null;
                    const minutesEl = countdownTimer ? countdownTimer.querySelector('[data-minutes]') : null;
                    const secondsEl = countdownTimer ? countdownTimer.querySelector('[data-seconds]') : null;

                    if (daysEl) daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
                    if (hoursEl) hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
                    if (minutesEl) minutesEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
                    if (secondsEl) secondsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');
                }

                updateCountdown();
                setInterval(updateCountdown, 1000);
            } catch (error) {
                console.error('Countdown error:', error);
            }
        }

        // Run countdown when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initHolidayCountdown);
        } else {
            initHolidayCountdown();
        }