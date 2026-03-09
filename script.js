// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader Animation Sequence
window.addEventListener('load', () => {

    const loaderArc = document.querySelector('.loader-arc');
    const navLogoTarget = document.querySelector('.nav-logo-target');
    const loaderBg = document.getElementById('loader');

    // Initial continuous rotation for the arc reactor
    const rotationAnim = gsap.to(loaderArc, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: "linear"
    });

    // We'll calculate the end position
    // Since the loader Arc is centered in a 100vw/100vh flexbox, 
    // and navLogoTarget is relative to the page.
    const targetRect = navLogoTarget.getBoundingClientRect();
    const arcRect = loaderArc.getBoundingClientRect();

    // Calculate difference (target - current center)
    const dx = targetRect.left + (targetRect.width / 2) - (arcRect.left + (arcRect.width / 2));
    const dy = targetRect.top + (targetRect.height / 2) - (arcRect.top + (arcRect.height / 2));

    // Scale ratio to match the 40px nav logo vs 150px loader arc
    const scale = targetRect.width / arcRect.width;

    const masterTl = gsap.timeline();

    // 1. Simulate a short loading delay (e.g. 1.5s), keep rotating
    masterTl.to({}, { duration: 1.5 });

    // 2. Animate Arc Reactor to Target Position and shrink it
    masterTl.to(loaderArc, {
        x: dx,
        y: dy,
        scale: scale,
        duration: 1.5,
        ease: "power3.inOut"
    }, "move");

    // 3. Fade out the black background
    masterTl.to(loaderBg, {
        backgroundColor: "rgba(0,0,0,0)",
        duration: 1.2,
        ease: "power2.inOut"
    }, "move+=0.3");

    // 4. Reveal navbar and hero content when the arc reactor lands
    masterTl.from(".navbar *", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    }, "move+=1.2");

    gsap.set(".hero-content", {
        opacity: 0,
        y: 50,
        scale: 0.9
    });

    // 5. Swap the real nav logo in and kill the loader wrapper
    masterTl.add(() => {
        gsap.set(navLogoTarget, { opacity: 1 });
        rotationAnim.kill(); // Stop specific rotation
        loaderBg.style.display = "none"; // Hide loader
    });

    // ScrollTrigger Animation for the Hero Section
    initScrollAnimations();
});

function initScrollAnimations() {

    // Pin and Transition Hero background images
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=150%", // Keep it pinned for 150% of the viewport height to stretch the animation
            scrub: 1.5,      // Smooth scrubbing without too much delay
            pin: true      // Pin the section while animating
        }
    });

    // Instantly fade the navbar out as soon as they start scrolling into the animation
    heroTl.to(".navbar", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.out"
    }, 0);

    // Fade Avengers logo out as user scrolls
    heroTl.to(".avengers-logo-front", {
        opacity: 0,
        y: -100, // moves up slightly
        duration: 1,
        ease: "power2.out"
    }, 0);

    // Make the Iron Man suit (hero-img-back) scale up and fade out as you scroll down
    heroTl.fromTo(".hero-img-back", {
        scale: 0.8, // start smaller (appearing from back)
        opacity: 0,
        y: 100 // slightly lower to "rise" up
    }, {
        scale: 1.1,
        opacity: 1, // Full visibility during initial pin
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, 0);

    // Fade the text IN after Iron man image begins to appear
    heroTl.to(".hero-content", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, 0.6); // Start appearing after Iron Man starts fading in

    // Add a step to fade everything out as it unpins
    heroTl.to(".hero-img-back", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power1.in"
    });

    // Add small parallax effect to details section (about and tech)
    gsap.utils.toArray('.details-section').forEach(section => {
        if (section.id === "suits" || section.id === "about" || section.id === "tech") return; // Skip custom sections
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Tech Section Holographic Nodes Animation
    gsap.fromTo(".tech-node",
        {
            y: 80,
            autoAlpha: 0,
            scale: 0.9
        },
        {
            scrollTrigger: {
                trigger: ".tech-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.2, // Nodes appear one-by-one
            ease: "back.out(1.5)", // Gives them a slight "pop" effect
            clearProps: "all"
        }
    );

    // Tony Stark Sticky Section Animations
    gsap.from(".stark-title", {
        scrollTrigger: {
            trigger: ".tony-stark-section",
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.utils.toArray('.stark-bio-box').forEach(box => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // GSAP Scroll Animation for Accordion entrance
    gsap.fromTo(".suit-item",
        {
            y: 100,
            autoAlpha: 0 // better than opacity for GSAP visibility
        },
        {
            scrollTrigger: {
                trigger: ".suits-accordion",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.2, // Animate in one-by-one
            ease: "power3.out",
            clearProps: "all" // Clears all inline styles after animation finishes
        }
    );

    // Simple interaction logic for accordion expansion
    const suitItems = document.querySelectorAll('.suit-item');

    suitItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            suitItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked
            item.classList.add('active');
        });
    });

    // --- SEC 3: ARC REACTOR LEGACY ANIMATION ---
    const legacyTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".legacy-section",
            start: "top 50%",
            toggleActions: "play none none reverse"
        }
    });

    legacyTl.from(".reactor-container", {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    })
        .from(".legacy-text h2", { y: 20, opacity: 0, duration: 0.8 }, "-=1")
        .from(".legacy-text p", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".memory-node", {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(2)"
        }, "-=0.4");

    // Memory Node Interactive Hover Logic
    const memoryNodes = document.querySelectorAll('.memory-node');
    const popup = document.getElementById('memory-popup');

    memoryNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const quote = e.target.getAttribute('data-quote');
            popup.innerText = `"${quote}"`;
            popup.style.opacity = '1';

            // Position popup slightly above the node
            const rect = e.target.getBoundingClientRect();
            popup.style.left = `${rect.left + window.scrollX - 40}px`;
            popup.style.top = `${rect.top + window.scrollY - 60}px`;
        });

        node.addEventListener('mouseleave', () => {
            popup.style.opacity = '0';
        });
    });

    // --- SEC 1: CINEMATIC SNAP FINALE ---
    const finaleTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".finale-section",
            start: "top top",
            end: "+=300%", // Pin for a much longer, dramatic scroll
            scrub: 1, // Add smoothing
            pin: true
        }
    });

    finaleTl.to(".finale-img-container", {
        opacity: 1,
        duration: 1
    })
        .to(".snap-img", {
            scale: 1, // Slow zoom out effect
            filter: "brightness(1) contrast(1.1)", // Brighten up
            duration: 4
        }, 0) // Align to start
        .to(".stones-glow", {
            opacity: 1,
            duration: 2
        }, 1) // Flash of the stones mid-scroll
        .to(".finale-overlay", {
            background: "transparent",
            duration: 2
        }, 0)
        .to(".snap-text", {
            opacity: 1,
            scale: 1.1,
            duration: 3
        }, 2); // Bring in text towards the end

}
