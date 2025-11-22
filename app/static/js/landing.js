// ===================================
// FAILSAFE AI - LANDING PAGE JS
// Ultra-smooth animations & interactions
// ===================================

// Initialize AOS (Animate On Scroll)
AOS.init({
	duration: 1000,
	easing: 'ease-out-cubic',
	once: true,
	offset: 100,
	delay: 100
});

// Initialize Particles.js
particlesJS('particles-js', {
	particles: {
		number: {
			value: 80,
			density: {
				enable: true,
				value_area: 800
			}
		},
		color: {
			value: ['#00f0ff', '#ff00ff', '#00ff88']
		},
		shape: {
			type: 'circle',
			stroke: {
				width: 0,
				color: '#000000'
			}
		},
		opacity: {
			value: 0.5,
			random: true,
			anim: {
				enable: true,
				speed: 1,
				opacity_min: 0.1,
				sync: false
			}
		},
		size: {
			value: 3,
			random: true,
			anim: {
				enable: true,
				speed: 2,
				size_min: 0.1,
				sync: false
			}
		},
		line_linked: {
			enable: true,
			distance: 150,
			color: '#00f0ff',
			opacity: 0.2,
			width: 1
		},
		move: {
			enable: true,
			speed: 2,
			direction: 'none',
			random: false,
			straight: false,
			out_mode: 'out',
			bounce: false,
			attract: {
				enable: false,
				rotateX: 600,
				rotateY: 1200
			}
		}
	},
	interactivity: {
		detect_on: 'canvas',
		events: {
			onhover: {
				enable: true,
				mode: 'grab'
			},
			onclick: {
				enable: true,
				mode: 'push'
			},
			resize: true
		},
		modes: {
			grab: {
				distance: 200,
				line_linked: {
					opacity: 0.5
				}
			},
			push: {
				particles_nb: 4
			}
		}
	},
	retina_detect: true
});

// Animated Counter for Stats
function animateCounter(element) {
	const target = parseInt(element.getAttribute('data-count'));
	const duration = 2000;
	const increment = target / (duration / 16);
	let current = 0;

	const timer = setInterval(() => {
		current += increment;
		if (current >= target) {
			element.textContent = target;
			clearInterval(timer);
		} else {
			element.textContent = Math.floor(current);
		}
	}, 16);
}

// Observe stat cards and animate when in view
const statObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const numbers = entry.target.querySelectorAll('.stat-number');
			numbers.forEach(num => animateCounter(num));
			statObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
	statObserver.observe(card);
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	});
});

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('.nav-floating');

window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset;

	if (currentScroll <= 100) {
		nav.style.transform = 'translateX(-50%) translateY(0)';
	} else if (currentScroll > lastScroll) {
		// Scrolling down
		nav.style.transform = 'translateX(-50%) translateY(-120%)';
	} else {
		// Scrolling up
		nav.style.transform = 'translateX(-50%) translateY(0)';
	}

	lastScroll = currentScroll;
});

// ROI Calculator
function calculateROI() {
	const machines = parseInt(document.getElementById('machines').value) || 8;
	const failures = parseInt(document.getElementById('failures').value) || 10;
	const costPerHour = parseInt(document.getElementById('cost').value) || 72000;

	// Without FailSafe: 30-60 min average = 45 min = 0.75h
	const oldCostPerFailure = costPerHour * 0.75;

	// With FailSafe: 3 seconds = 0.000833h
	const newCostPerFailure = costPerHour * 0.000833;

	// Savings per failure
	const savingsPerFailure = oldCostPerFailure - newCostPerFailure;

	// Monthly savings
	const monthlySavings = savingsPerFailure * failures;

	// Yearly savings
	const yearlySavings = monthlySavings * 12;

	// Display result with animation
	const resultEl = document.getElementById('roi-result');
	const valueEl = document.getElementById('roi-value');
	const breakdownEl = document.getElementById('roi-breakdown');

	resultEl.classList.remove('show');

	setTimeout(() => {
		valueEl.textContent = '$' + yearlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 });
		breakdownEl.textContent = `${failures} awarii/miesiąc × $${savingsPerFailure.toLocaleString('en-US', { maximumFractionDigits: 0 })} oszczędności × 12 miesięcy`;
		resultEl.classList.add('show');
	}, 100);
}

// Contact Form Handler
document.getElementById('contact-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const data = Object.fromEntries(formData);

	const messageEl = document.getElementById('form-message');
	messageEl.classList.remove('show', 'success', 'error');
	messageEl.textContent = 'Wysyłanie...';
	messageEl.classList.add('show');

	try {
		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
			messageEl.classList.remove('error');
			messageEl.classList.add('success');
			messageEl.textContent = '✅ Wiadomość wysłana! Odpowiemy w ciągu 24h.';
			e.target.reset();

			// Hide message after 5 seconds
			setTimeout(() => {
				messageEl.classList.remove('show');
			}, 5000);
		} else {
			throw new Error('Server error');
		}
	} catch (error) {
		messageEl.classList.remove('success');
		messageEl.classList.add('error');
		messageEl.textContent = '❌ Błąd wysyłania. Spróbuj ponownie lub napisz na: grupa5@failsafe.ai';
	}
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
	const scrolled = window.pageYOffset;
	const hero = document.querySelector('.hero-content');

	if (hero && scrolled < window.innerHeight) {
		hero.style.transform = `translateY(${scrolled * 0.5}px)`;
		hero.style.opacity = 1 - (scrolled / window.innerHeight);
	}
});

// Add glow effect to cursor
document.addEventListener('mousemove', (e) => {
	const glow = document.createElement('div');
	glow.className = 'cursor-glow';
	glow.style.left = e.pageX + 'px';
	glow.style.top = e.pageY + 'px';
	document.body.appendChild(glow);

	setTimeout(() => glow.remove(), 1000);
});

// Add cursor glow styles dynamically
const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: cursorFade 1s ease-out forwards;
    }
    
    @keyframes cursorFade {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console Easter Egg
console.log('%c⚡ FailSafe AI', 'font-size: 40px; font-weight: bold; background: linear-gradient(135deg, #00f0ff 0%, #0080ff 100%); -webkit-background-clip: text; color: transparent;');
console.log('%cGrupa 5 - Hackathon dla Małopolski 2025', 'font-size: 16px; color: #00ff88;');
console.log('%c🚀 Eliminujemy chaos w produkcji w 3 sekundy!', 'font-size: 14px; color: #a0a0b0;');
console.log('%cZainteresowany kodem? github.com/grupa5/failsafe', 'font-size: 12px; color: #606070;');

// Performance Monitoring
if ('performance' in window) {
	window.addEventListener('load', () => {
		setTimeout(() => {
			const perfData = performance.timing;
			const loadTime = perfData.loadEventEnd - perfData.navigationStart;
			console.log(`⚡ Page loaded in ${loadTime}ms`);
		}, 0);
	});
}

// Add loading animation
window.addEventListener('load', () => {
	document.body.classList.add('loaded');
});

// Preload critical resources
const preloadImages = [
	'/image/566515643_817744904459766_2257008912551512909_n.jpg',
	'/image/582668872_1762889247703992_6930978373660329921_n.jpg',
	'/image/582706326_1560963088391669_1736509180567921371_n.jpg',
	'/image/583134104_1590564038978593_6057847812674814760_n.jpg',
	'/image/583736527_1171711168262411_7597140228375737247_n.jpg',
	'/image/583884406_834197982657429_1674551657563673654_n.jpg'
];

preloadImages.forEach(src => {
	const img = new Image();
	img.src = src;
});

console.log('✅ FailSafe Landing Page initialized');
