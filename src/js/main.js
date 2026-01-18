// Exploding candy button effect
        window.addExplosion = function(button, event) {
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