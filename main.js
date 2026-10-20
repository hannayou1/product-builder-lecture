document.addEventListener('DOMContentLoaded', () => {
    // Reveal on scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once shown, we can stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Lotto Generator Logic
    const lottoBtn = document.getElementById('lotto-btn');
    const lottoDisplay = document.getElementById('lotto-display');

    if (lottoBtn && lottoDisplay) {
        lottoBtn.addEventListener('click', () => {
            lottoDisplay.innerHTML = ''; // Clear previous results
            
            for (let i = 0; i < 5; i++) {
                const numbers = generateLottoNumbers();
                const row = document.createElement('div');
                row.className = 'lotto-row';
                
                numbers.forEach(num => {
                    const ball = document.createElement('span');
                    ball.className = `lotto-ball ball-${getBallColorClass(num)}`;
                    ball.textContent = num;
                    row.appendChild(ball);
                });
                
                lottoDisplay.appendChild(row);
            }
        });
    }

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function getBallColorClass(num) {
        if (num <= 10) return 'yellow';
        if (num <= 20) return 'blue';
        if (num <= 30) return 'red';
        if (num <= 40) return 'gray';
        return 'green';
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple terminal typing effect (optional aesthetic touch)
    const codeSpan = document.querySelector('.terminal .code');
    if (codeSpan) {
        // You could add a typing effect here if desired, 
        // but for now, we keep it static as per the design plan.
    }
});
