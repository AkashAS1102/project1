(function() {
        'use strict';

        /* ========================================
           TOAST SYSTEM
           ======================================== */
        function toast(msg, type = 'success', ms = 3000) {
            const wrap = document.getElementById('toast-wrap');
            const el = document.createElement('div');
            el.className = `toast ${type}`;
            const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
            el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${msg}`;
            wrap.appendChild(el);
            setTimeout(() => {
                el.classList.add('out');
                setTimeout(() => el.remove(), 300);
            }, ms);
        }

        /* ========================================
           THEME TOGGLE (dark/light)
           ======================================== */
        const themeBtn = document.getElementById('theme-toggle');
        const themeIcon = themeBtn?.querySelector('i');

        function applyTheme(light) {
            document.body.classList.toggle('light-mode', light);
            if (themeIcon) {
                themeIcon.className = light ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            }
        }

        // Init from localStorage
        const savedLight = localStorage.getItem('spidy-light') === 'true';
        applyTheme(savedLight);

        themeBtn?.addEventListener('click', () => {
            const goLight = !document.body.classList.contains('light-mode');
            localStorage.setItem('spidy-light', goLight);
            applyTheme(goLight);
            toast(goLight ? 'Light mode enabled' : 'Dark mode enabled', 'info', 2000);
        });

        /* ========================================
           SCROLL PROGRESS BAR
           ======================================== */
        const progressBar = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (progressBar && h > 0) {
                progressBar.style.width = ((window.scrollY / h) * 100) + '%';
            }
        }, { passive: true });

        /* ========================================
           STICKY NAV GLASS
           ======================================== */
        const nav = document.getElementById('main-nav');
        window.addEventListener('scroll', () => {
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });

        /* ========================================
           USER DROPDOWN
           ======================================== */
        const userTrigger = document.getElementById('user-trigger');
        const userDrop = document.getElementById('user-dropdown');

        userTrigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            userDrop?.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#user-trigger')) userDrop?.classList.remove('open');
        });

        /* ========================================
           MOBILE DRAWER
           ======================================== */
        const hamburger = document.getElementById('hamburger');
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');

        function openDrawer() {
            drawer?.classList.add('open');
            overlay?.classList.add('open');
            hamburger?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            drawer?.classList.remove('open');
            overlay?.classList.remove('open');
            hamburger?.classList.remove('open');
            document.body.style.overflow = '';
        }

        hamburger?.addEventListener('click', () => {
            drawer?.classList.contains('open') ? closeDrawer() : openDrawer();
        });

        overlay?.addEventListener('click', closeDrawer);

        // Close drawer when clicking a link
        drawer?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        /* ========================================
           KEYBOARD SHORTCUTS
           ======================================== */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDrawer();
                userDrop?.classList.remove('open');
            }
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                openSearchModal();
            }
        });

        /* ========================================
           DYNAMIC AUDIO VISUALIZER
           ======================================== */
        const visualizerBars = document.querySelectorAll('.audio-visualizer .bar');
        if (visualizerBars.length > 0) {
            setInterval(() => {
                visualizerBars.forEach(bar => {
                    const height = Math.random() * 80 + 20; // 20% to 100%
                    bar.style.height = `${height}%`;
                    bar.style.transition = 'height 0.15s ease-in-out';
                });
            }, 150);
        }

        /* ========================================
           HERO PARALLAX
           ======================================== */
        const heroVisual = document.getElementById('hero-visual');
        const heroImg = document.getElementById('hero-product-img');

        heroVisual?.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            if (heroImg) {
                heroImg.style.transform = `translateY(${y * -20}px) translateX(${x * 15}px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
            }
        });

        heroVisual?.addEventListener('mouseleave', () => {
            if (heroImg) heroImg.style.transform = '';
        });

        /* ========================================
           COUNTER ANIMATION
           ======================================== */
        function animateValue(el, end, suffix = '', duration = 2000) {
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                const isFloat = String(end).includes('.');
                const val = isFloat
                    ? (eased * end).toFixed(1)
                    : Math.round(eased * end);
                el.textContent = val + suffix;
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    const dl = document.getElementById('stat-downloads');
                    const rt = document.getElementById('stat-rating');
                    const pr = document.getElementById('stat-products');
                    if (dl) animateValue(dl, 5, 'M+', 2000);
                    if (rt) animateValue(rt, 4.8, '', 1800);
                    if (pr) animateValue(pr, 460, '+', 2200);
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) statsObserver.observe(heroStats);

        /* ========================================
           PRODUCT FILTERS
           ======================================== */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                productCards.forEach(card => {
                    const cat = card.dataset.category;
                    const show = filter === 'all' || cat === filter;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }
                });

                toast(`Showing: ${btn.textContent}`, 'info', 1500);
            });
        });

        /* ========================================
           CART SYSTEM
           ======================================== */
        let cart = [];
        const cartBadge = document.getElementById('cart-badge');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartBadge) {
                cartBadge.textContent = totalItems;
                cartBadge.classList.toggle('visible', totalItems > 0);
                cartBadge.classList.remove('pop');
                void cartBadge.offsetWidth;
                cartBadge.classList.add('pop');
            }

            if (!cartItemsContainer) return;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <p>Your cart is empty.</p>
                        <button class="btn-primary" id="cart-shop-now">Shop Now</button>
                    </div>
                `;
                document.getElementById('cart-shop-now')?.addEventListener('click', () => {
                    closeCart();
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                });
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => `
                    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding: 15px 0; border-bottom: 1px solid var(--border);">
                        <div>
                            <h4 style="margin-bottom:5px; font-weight:600">${item.name}</h4>
                            <span style="color:var(--text-secondary)">$${item.price} x ${item.quantity}</span>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <span style="font-weight:600; color:var(--accent)">$${item.price * item.quantity}</span>
                            <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; color:var(--accent-rose); cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `).join('');

                cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const idx = this.dataset.index;
                        const removed = cart.splice(idx, 1)[0];
                        toast(`${removed.name} removed from cart`, 'info');
                        updateCartUI();
                    });
                });
            }

            if (cartTotalPrice) {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotalPrice.textContent = `$${total.toFixed(2)}`;
            }
        }

        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price || 0);
                
                const existing = cart.find(item => item.name === name);
                if (existing) {
                    existing.quantity++;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                
                updateCartUI();

                const orig = this.innerHTML;
                this.classList.add('added');
                this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';

                setTimeout(() => {
                    this.classList.remove('added');
                    this.innerHTML = orig;
                }, 1400);

                toast(`${name} added to cart`, 'success');
            });
        });

        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const closeCartBtn = document.getElementById('close-cart');
        
        function openCart() {
            cartSidebar?.classList.add('open');
            cartOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeCart() {
            cartSidebar?.classList.remove('open');
            cartOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        document.getElementById('cart-btn')?.addEventListener('click', openCart);
        closeCartBtn?.addEventListener('click', closeCart);
        cartOverlay?.addEventListener('click', closeCart);

        /* ========================================
           WISHLIST TOGGLES
           ======================================== */
        document.querySelectorAll('.wish-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('liked');
                const icon = this.querySelector('i');
                const isLiked = this.classList.contains('liked');
                icon.className = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
                this.style.transform = 'scale(1.3)';
                setTimeout(() => this.style.transform = '', 250);
                toast(isLiked ? 'Added to wishlist ❤️' : 'Removed from wishlist', isLiked ? 'success' : 'info', 2000);
            });
        });

        /* ========================================
           PRODUCT COLOR PICKER
           ======================================== */
        document.querySelectorAll('.product-colors').forEach(container => {
            container.querySelectorAll('.product-color').forEach(dot => {
                dot.addEventListener('click', () => {
                    container.querySelectorAll('.product-color').forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                });
            });
        });

        /* ========================================
           NEWSLETTER
           ======================================== */
        document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (input?.value) {
                toast('Subscribed! Welcome aboard 🎉', 'success');
                input.value = '';
            }
        });

        /* ========================================
           CTA BUTTONS
           ======================================== */
        document.getElementById('shop-now-btn')?.addEventListener('click', () => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });

        const videoModal = document.getElementById('video-modal');
        const videoOverlay = document.getElementById('video-modal-overlay');
        const closeVideoBtn = document.getElementById('close-video-modal');

        document.getElementById('explore-btn')?.addEventListener('click', () => {
            videoModal?.classList.add('open');
            videoOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        function closeVideoModal() {
            videoModal?.classList.remove('open');
            videoOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }
        closeVideoBtn?.addEventListener('click', closeVideoModal);
        videoOverlay?.addEventListener('click', closeVideoModal);

        /* ========================================
           FAQ ACCORDION
           ======================================== */
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });

        /* ========================================
           SEARCH FUNCTIONALITY
           ======================================== */
        const searchModal = document.getElementById('search-modal');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        // Sample product data for search and quick view
        const products = [
            { id: 1, name: 'Sequoia Pro', category: 'Over-Ear Headphones', price: 299, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500', desc: 'Experience uncompromising audio clarity with precision-engineered 50mm drivers. Active Noise Cancellation blocks out the world so you can focus on the music.' },
            { id: 2, name: 'X-Bud Pro', category: 'Wireless Earbuds', price: 179, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500', desc: 'Compact, powerful, and built for all-day comfort. Featuring adaptive EQ and up to 32 hours of battery life with the charging case.' },
            { id: 3, name: 'Studio Max', category: 'Studio Headphones', price: 349, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500', desc: 'Designed for professionals. The open-back design delivers a breathtakingly expansive soundstage and the most natural audio reproduction.' },
            { id: 4, name: 'Pulse Speaker', category: 'Portable Speaker', price: 199, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=500', desc: 'Take the party anywhere. Waterproof, rugged, and delivering 360-degree booming bass that defies its compact size.' }
        ];

        function openSearchModal() {
            searchModal?.classList.add('open');
            searchOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput?.focus(), 100);
            renderSearchResults(products); // Show all initially
        }

        function closeSearchModal() {
            searchModal?.classList.remove('open');
            searchOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }

        document.getElementById('search-toggle')?.addEventListener('click', openSearchModal);
        document.getElementById('close-search-modal')?.addEventListener('click', closeSearchModal);
        searchOverlay?.addEventListener('click', closeSearchModal);

        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
            renderSearchResults(filtered);
        });

        function renderSearchResults(results) {
            if (!searchResults) return;
            if (results.length === 0) {
                searchResults.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding: 20px;">No products found.</p>';
                return;
            }
            searchResults.innerHTML = results.map(p => `
                <div class="search-result-item" data-id="${p.id}">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="search-result-info">
                        <h4>${p.name}</h4>
                        <p>${p.category}</p>
                    </div>
                    <div style="margin-left:auto; color:var(--accent); font-weight:600;">$${p.price}</div>
                </div>
            `).join('');

            // Add click listeners to results to open quick view
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    closeSearchModal();
                    openQuickView(parseInt(item.dataset.id));
                });
            });
        }

        /* ========================================
           QUICK VIEW FUNCTIONALITY
           ======================================== */
        const quickViewModal = document.getElementById('quick-view-modal');
        const quickViewOverlay = document.getElementById('quick-view-overlay');
        const quickViewContent = document.getElementById('quick-view-content');

        function openQuickView(id) {
            const product = products.find(p => p.id === id);
            if (!product || !quickViewContent) return;

            quickViewContent.innerHTML = `
                <div class="quick-view-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">${product.category}</p>
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <p>${product.desc}</p>
                    <button class="btn-primary add-cart-btn" data-name="${product.name}" data-price="${product.price}">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                    </button>
                </div>
            `;

            // Re-bind cart button
            const addBtn = quickViewContent.querySelector('.add-cart-btn');
            addBtn?.addEventListener('click', function() {
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price || 0);
                
                const existing = cart.find(item => item.name === name);
                if (existing) {
                    existing.quantity++;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                
                updateCartUI();
                
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
                setTimeout(() => this.innerHTML = orig, 1400);
                toast(`${name} added to cart`, 'success');
            });

            quickViewModal?.classList.add('open');
            quickViewOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeQuickView() {
            quickViewModal?.classList.remove('open');
            quickViewOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }

        document.getElementById('close-quick-view')?.addEventListener('click', closeQuickView);
        quickViewOverlay?.addEventListener('click', closeQuickView);

        // Bind product cards to Quick View
        document.querySelectorAll('.product-img-wrap img').forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                // Map the image click to the product ID (1-indexed based on grid order)
                openQuickView(index + 1);
            });
        });

        /* ========================================
           SCROLL REVEAL (IntersectionObserver)
           ======================================== */
        const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObs.observe(el));

        /* ========================================
           LAZY IMAGE FADE-IN
           ======================================== */
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                img.addEventListener('load', () => { img.style.opacity = '1'; });
            }
        });

        /* ========================================
           BACK TO TOP
           ======================================== */
        const backToTop = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });

        backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /* ========================================
           PRELOADER
           ======================================== */
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    setTimeout(() => preloader.remove(), 800);
                }, 500); // minimum artificial delay for premium feel
            }
        });

        /* ========================================
           CUSTOM MAGNETIC CURSOR
           ======================================== */
        const cursor = document.getElementById('custom-cursor');
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        let isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (!isTouchDevice && cursor) {
            document.body.classList.add('has-custom-cursor');
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Smooth spring animation for cursor
            function animateCursor() {
                const dx = mouseX - cursorX;
                const dy = mouseY - cursorY;
                cursorX += dx * 0.2;
                cursorY += dy * 0.2;
                
                cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
                requestAnimationFrame(animateCursor);
            }
            requestAnimationFrame(animateCursor);

            // Magnetic hover states
            const interactables = document.querySelectorAll('a, button, .nav-logo, .product-color, .nav-user');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                    el.style.transition = 'none';
                });
                
                // Magnetic effect for prominent buttons
                if (el.classList.contains('btn-primary') || el.classList.contains('nav-btn')) {
                    el.addEventListener('mousemove', (e) => {
                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
                    });
                }
                
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                    el.style.transition = 'all 0.4s var(--spring)';
                    el.style.transform = '';
                });
            });
            
            // Hide on leaving window
            document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
            document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
        } else if (cursor) {
            cursor.style.display = 'none';
        }

        /* ========================================
           BACKGROUND PARALLAX
           ======================================== */
        const orbs = document.querySelectorAll('.orb');
        window.addEventListener('scroll', () => {
            if (!isTouchDevice) {
                const scrolled = window.scrollY;
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.15;
                    orb.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        }, { passive: true });

        /* ========================================
           CART PARTICLE EFFECT (Overriding previous logic)
           ======================================== */
        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            // Remove previous click listeners if possible, but since they are anonymous, 
            // we will just add the particle effect on top.
            btn.addEventListener('click', function(e) {
                if (isTouchDevice) return; // Skip complex animation on mobile
                
                const cartIcon = document.getElementById('cart-btn');
                if (!cartIcon) return;

                const rect = this.getBoundingClientRect();
                const cartRect = cartIcon.getBoundingClientRect();
                
                const particle = document.createElement('div');
                particle.className = 'cart-particle';
                particle.innerHTML = '<i class="fa-solid fa-headphones"></i>';
                
                // Start position (center of button)
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;
                
                // End position (center of cart icon)
                const endX = cartRect.left + cartRect.width / 2;
                const endY = cartRect.top + cartRect.height / 2;

                particle.style.left = `${startX}px`;
                particle.style.top = `${startY}px`;
                
                document.body.appendChild(particle);

                // Animate
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.2)`;
                    particle.style.opacity = '0';
                });

                setTimeout(() => particle.remove(), 800);
            });
        });

        /* ========================================
           3D TILT EFFECT
           ======================================== */
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (isTouchDevice) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                if (isTouchDevice) return;
                card.style.transform = '';
                card.style.transition = 'transform 0.5s var(--ease)';
            });
        });

    })();
