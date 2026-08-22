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

                let isScrolling = false;
        const progressBar = document.getElementById('scroll-progress');
        const nav = document.getElementById('main-nav');
        const backToTop = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const h = document.documentElement.scrollHeight - window.innerHeight;
                    
                    if (progressBar && h > 0) progressBar.style.width = ((scrolled / h) * 100) + '%';
                    if (nav) nav.classList.toggle('scrolled', scrolled > 50);
                    if (backToTop) backToTop.classList.toggle('visible', scrolled > 600);
                    
                    isScrolling = false;
                });
                isScrolling = true;
            }
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

        /* Duplicate CART SYSTEM logic removed in favor of LOCALSTORAGE logic below */

        /* ========================================
           WISHLIST SYSTEM
           ======================================== */
        let wishlist = JSON.parse(localStorage.getItem('spidy-wishlist') || '[]');
        const wishlistBadge = document.getElementById('wishlist-badge');
        const wishlistDrawer = document.getElementById('wishlist-drawer');
        const wishlistOverlay = document.getElementById('wishlist-overlay');
        const wishlistItemsContainer = document.getElementById('wishlist-items');
        
        function updateWishlistUI() {
            if (wishlistBadge) {
                wishlistBadge.textContent = wishlist.length;
                wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
            }
            if (!wishlistItemsContainer) return;
            if (wishlist.length === 0) {
                wishlistItemsContainer.innerHTML = `<div class="cart-empty-state">Your wishlist is empty.</div>`;
            } else {
                wishlistItemsContainer.innerHTML = wishlist.map((item, index) => `
                    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding: 15px 0; border-bottom: 1px solid var(--border);">
                        <div>
                            <h4 style="margin-bottom:5px; font-weight:600">${item.name}</h4>
                            <span style="color:var(--text-secondary)">$${item.price}</span>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="remove-wish-btn" data-index="${index}" style="background:none; border:none; color:var(--accent-rose); cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `).join('');
                
                wishlistItemsContainer.querySelectorAll('.remove-wish-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const idx = this.dataset.index;
                        const removed = wishlist.splice(idx, 1)[0];
                        localStorage.setItem('spidy-wishlist', JSON.stringify(wishlist));
                        toast(`${removed.name} removed from wishlist`, 'info');
                        updateWishlistUI();
                        // Also un-toggle the heart icon on the page
                        document.querySelectorAll('.wish-btn').forEach(wishBtn => {
                            if (wishBtn.dataset.name === removed.name) {
                                wishBtn.classList.remove('liked');
                                wishBtn.querySelector('i').className = 'fa-regular fa-heart';
                            }
                        });
                    });
                });
            }
        }
        
        function openWishlist() {
            wishlistDrawer?.classList.add('open');
            wishlistOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
            updateWishlistUI();
        }
        function closeWishlist() {
            wishlistDrawer?.classList.remove('open');
            wishlistOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        document.getElementById('wishlist-btn')?.addEventListener('click', openWishlist);
        document.getElementById('wishlist-close')?.addEventListener('click', closeWishlist);
        wishlistOverlay?.addEventListener('click', closeWishlist);

        document.querySelectorAll('.wish-btn').forEach(btn => {
            const card = btn.closest('.product-card');
            const cartBtn = card?.querySelector('.add-cart-btn');
            if (cartBtn) {
                btn.dataset.name = cartBtn.dataset.name;
                btn.dataset.price = cartBtn.dataset.price;
            }
            
            if (wishlist.find(i => i.name === btn.dataset.name)) {
                btn.classList.add('liked');
                btn.querySelector('i').className = 'fa-solid fa-heart';
            }
            
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const name = this.dataset.name || 'Product';
                const price = parseFloat(this.dataset.price || 0);
                
                const existingIndex = wishlist.findIndex(item => item.name === name);
                const isLiked = existingIndex === -1;
                
                if (isLiked) {
                    wishlist.push({ name, price });
                    this.classList.add('liked');
                    this.querySelector('i').className = 'fa-solid fa-heart';
                    toast(`Added to wishlist ❤️`, 'success');
                } else {
                    wishlist.splice(existingIndex, 1);
                    this.classList.remove('liked');
                    this.querySelector('i').className = 'fa-regular fa-heart';
                    toast(`Removed from wishlist`, 'info');
                }
                
                localStorage.setItem('spidy-wishlist', JSON.stringify(wishlist));
                updateWishlistUI();
                
                this.style.transform = 'scale(1.3)';
                setTimeout(() => this.style.transform = '', 250);
            });
        });
        
        updateWishlistUI();

        /* ========================================
           LOGIN SYSTEM MOCK
           ======================================== */
        const loginOverlay = document.getElementById('login-overlay');
        const loginModal = document.getElementById('login-modal');
        const closeLoginBtn = document.getElementById('close-login');
        const userTrigger = document.getElementById('user-trigger');
        const loginForm = document.getElementById('login-form');
        const userDisplayName = document.getElementById('user-display-name');
        const userDisplayIcon = document.getElementById('user-display-icon');
        const userDisplayAvatar = document.getElementById('user-display-avatar');
        
        let isLoggedIn = localStorage.getItem('spidy-logged-in') === 'true';
        
        function updateLoginUI() {
            if (isLoggedIn) {
                if (userDisplayName) userDisplayName.textContent = 'Ryman';
                if (userDisplayIcon) userDisplayIcon.style.display = 'none';
                if (userDisplayAvatar) userDisplayAvatar.style.display = 'block';
            } else {
                if (userDisplayName) userDisplayName.textContent = 'Sign In';
                if (userDisplayIcon) userDisplayIcon.style.display = 'inline-block';
                if (userDisplayAvatar) userDisplayAvatar.style.display = 'none';
            }
        }
        
        function openLogin() {
            if (isLoggedIn) return;
            loginModal?.classList.add('open');
            loginOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeLogin() {
            loginModal?.classList.remove('open');
            loginOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        userTrigger?.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                openLogin();
            }
        });
        closeLoginBtn?.addEventListener('click', closeLogin);
        loginOverlay?.addEventListener('click', closeLogin);
        
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            isLoggedIn = true;
            localStorage.setItem('spidy-logged-in', 'true');
            updateLoginUI();
            closeLogin();
            toast('Successfully signed in!', 'success');
        });
        
        updateLoginUI();

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
           CUSTOM STUDIO LOGIC
           ======================================== */
        const customizerSection = document.getElementById('customizer');
        if (customizerSection) {
            const headphoneMockup = document.getElementById('headphone-mockup');
            
            // Handle color swatch clicks
            document.querySelectorAll('.control-group').forEach(group => {
                const optionsContainer = group.querySelector('.color-options');
                if (!optionsContainer) return;
                
                const layerType = optionsContainer.id.replace('color-', '');
                
                group.querySelectorAll('.color-swatch').forEach(swatch => {
                    swatch.addEventListener('click', (e) => {
                        group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                        swatch.classList.add('active');
                        
                        const color = swatch.dataset.color;
                        
                        if (headphoneMockup) {
                            headphoneMockup.style.setProperty(`--${layerType}-color`, color);
                            headphoneMockup.style.transition = 'transform 0.2s var(--spring)';
                            headphoneMockup.style.transform = 'scale(1.02)';
                            setTimeout(() => {
                                headphoneMockup.style.transform = 'scale(1)';
                            }, 150);
                        }
                    });
                });
            });
            
            // "Add Custom Build to Cart" button animation
            const buildBtn = customizerSection.querySelector('.btn-primary');
            if (buildBtn) {
                buildBtn.addEventListener('click', function() {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart';
                    toast('Custom Sequoia Pro added to your cart!', 'success');
                    
                    // Simple logic to mimic adding to cart for now
                    const cartBadge = document.getElementById('cart-badge');
                    if (cartBadge) {
                        const current = parseInt(cartBadge.textContent) || 0;
                        cartBadge.textContent = current + 1;
                        cartBadge.classList.add('pop');
                        setTimeout(() => cartBadge.classList.remove('pop'), 350);
                    }
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            }
        }

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
            { id: 4, name: 'Pulse Speaker', category: 'Portable Speaker', price: 199, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=500', desc: 'Take the party anywhere. Waterproof, rugged, and delivering 360-degree booming bass that defies its compact size.' },
            { id: 5, name: 'Aero Stand', category: 'Headphone Stand', price: 49, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500', desc: 'Minimalist aluminum headphone stand to display your Spidy gear in style.' },
            { id: 6, name: 'Cloud Cushions', category: 'Replacement Pads', price: 29, image: 'https://images.unsplash.com/photo-1628190771804-98448f760e58?auto=format&fit=crop&q=80&w=500', desc: 'Ultra-soft memory foam replacement ear cushions for all-day listening comfort.' }
        ];

        /* ========================================
           CONTACT FORM
           ======================================== */
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            toast('Message sent! We will get back to you shortly.', 'success');
            e.target.reset();
        });

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

        let searchTimeout = null;
        let selectedSearchIndex = -1;
        let currentSearchResults = [];

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();
            
            searchTimeout = setTimeout(() => {
                if(!query) {
                    currentSearchResults = products;
                } else {
                    currentSearchResults = products.filter(p => 
                        p.name.toLowerCase().includes(query) || 
                        p.category.toLowerCase().includes(query)
                    );
                }
                selectedSearchIndex = -1;
                renderSearchResults(currentSearchResults, query);
            }, 250);
        });

        searchInput?.addEventListener('keydown', (e) => {
            const items = searchResults?.querySelectorAll('.search-result-item');
            if (!items || items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedSearchIndex = (selectedSearchIndex + 1) % items.length;
                updateSearchSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedSearchIndex = (selectedSearchIndex - 1 + items.length) % items.length;
                updateSearchSelection(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedSearchIndex >= 0) {
                    items[selectedSearchIndex].click();
                } else if (items.length > 0) {
                    items[0].click();
                }
            }
        });

        function updateSearchSelection(items) {
            items.forEach((item, index) => {
                if (index === selectedSearchIndex) {
                    item.style.background = 'var(--bg-secondary)';
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.style.background = '';
                }
            });
        }

        function highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark style="background:var(--accent); color:#000; padding:0 2px; border-radius:2px;">$1</mark>');
        }

        function renderSearchResults(results, query = '') {
            if (!searchResults) return;
            if (results.length === 0) {
                searchResults.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding: 20px;">No products found.</p>';
                return;
            }
            
            searchResults.innerHTML = results.map((p, index) => {
                const highlightedName = highlightText(p.name, query);
                const highlightedCategory = highlightText(p.category, query);
                return `
                <div class="search-result-item" data-id="${p.id}" style="cursor:pointer; transition: background 0.2s;">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="search-result-info">
                        <h4>${highlightedName}</h4>
                        <p>${highlightedCategory}</p>
                    </div>
                    <div style="margin-left:auto; color:var(--accent); font-weight:600;">$${p.price}</div>
                </div>
            `}).join('');

            searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('mouseenter', () => {
                    selectedSearchIndex = index;
                    updateSearchSelection(searchResults.querySelectorAll('.search-result-item'));
                });
                item.addEventListener('click', () => {
                    closeSearchModal();
                    openQuickView('p' + item.dataset.id);
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

        /* Back To Top combined in unified scroll handler */

        const backToTopBtn = document.getElementById('back-to-top');
        backToTopBtn?.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

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

        /* Background Parallax removed for performance optimization */

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

        /* ========================================
           QUICK VIEW MODAL LOGIC
           ======================================== */
        const productData = {
            'p1': { 
                name: 'Sequoia Pro', price: '$299', 
                img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500', 
                gallery: [
                    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1593696954577-1643c1a351ef?auto=format&fit=crop&q=80&w=500'
                ],
                desc: 'Over-Ear Headphones with industry-leading Active Noise Cancellation and lossless audio support.', freq: '10Hz - 40kHz', battery: '40 Hours', driver: '45mm Neodymium', anc: 'Yes', weight: '280g' 
            },
            'p2': { 
                name: 'X-Bud Pro', price: '$179', 
                img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500', 
                gallery: [
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1572536147168-9b88981604a5?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=500'
                ],
                desc: 'True wireless earbuds with adaptive EQ and sweat resistance for an active lifestyle.', freq: '20Hz - 20kHz', battery: '24 Hours (with case)', driver: '11mm Custom', anc: 'Yes', weight: '5.4g (per earbud)' 
            },
            'p3': { 
                name: 'Studio Max', price: '$349', 
                img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500', 
                gallery: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=500'
                ],
                desc: 'Reference-grade studio headphones designed for audio engineers and producers.', freq: '5Hz - 50kHz', battery: 'N/A (Wired)', driver: '50mm Planar Magnetic', anc: 'No', weight: '340g' 
            },
            'p4': { 
                name: 'Pulse Speaker', price: '$199', 
                img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=500', 
                gallery: [
                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1589003071536-407421160d5b?auto=format&fit=crop&q=80&w=500',
                    'https://images.unsplash.com/photo-1612198273689-b751996515b1?auto=format&fit=crop&q=80&w=500'
                ],
                desc: 'Portable bluetooth speaker with 360-degree spatial sound and waterproof design.', freq: '40Hz - 20kHz', battery: '18 Hours', driver: 'Dual Passive Radiators', anc: 'No', weight: '850g' 
            }
        };

        const qvBtns = document.querySelectorAll('.quick-view-btn');
        const qvModal = document.getElementById('quick-view-modal');
        const qvOverlay = document.getElementById('quick-view-overlay');
        const qvContent = document.getElementById('quick-view-content');
        const closeQv = document.getElementById('close-quick-view');

        function openQuickView(id) {
            const data = productData[id];
            if (!data) return;

            let thumbnailsHtml = data.gallery ? data.gallery.map((src, index) => 
                `<img src="${src}" class="qv-thumb ${index === 0 ? 'active' : ''}" data-src="${src}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; cursor:pointer; opacity:${index === 0 ? '1' : '0.6'}; border: 2px solid ${index === 0 ? 'var(--accent)' : 'transparent'}; transition:all 0.3s;">`
            ).join('') : '';

            qvContent.innerHTML = `
                <div style="display:flex; gap: 30px; align-items: flex-start;">
                    <div style="flex:1; border-radius: var(--radius-md); overflow:hidden; display:flex; flex-direction:column; gap:10px;">
                        <div style="background: #fff; width:100%; border-radius: var(--radius-md); overflow:hidden; aspect-ratio: 1/1;">
                            <img src="${data.img}" id="qv-main-img" style="width:100%; height:100%; object-fit:cover; transition: opacity 0.3s ease;">
                        </div>
                        <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;" id="qv-thumbnails">
                            ${thumbnailsHtml}
                        </div>
                    </div>
                    <div style="flex:1;" class="quick-view-details">
                        <h2>${data.name}</h2>
                        <div class="price">${data.price}</div>
                        <p>${data.desc}</p>
                        <ul style="list-style:none; padding:0; margin-bottom:20px; color:var(--text-secondary);">
                            <li style="margin-bottom:10px;"><strong>Frequency:</strong> ${data.freq}</li>
                            <li style="margin-bottom:10px;"><strong>Battery:</strong> ${data.battery}</li>
                            <li style="margin-bottom:10px;"><strong>Weight:</strong> ${data.weight}</li>
                        </ul>
                        <button class="btn-primary add-cart-btn" data-name="${data.name}" data-price="${data.price.replace('$','')}"><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>
                    </div>
                </div>
            `;
            
            // Add event listeners for thumbnails
            const thumbnails = qvContent.querySelectorAll('.qv-thumb');
            const mainImg = qvContent.querySelector('#qv-main-img');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImg.style.opacity = '0';
                    setTimeout(() => {
                        mainImg.src = thumb.dataset.src;
                        mainImg.style.opacity = '1';
                    }, 150);
                    thumbnails.forEach(t => { 
                        t.classList.remove('active'); 
                        t.style.opacity = '0.6'; 
                        t.style.borderColor = 'transparent';
                    });
                    thumb.classList.add('active');
                    thumb.style.opacity = '1';
                    thumb.style.borderColor = 'var(--accent)';
                });
            });

            qvModal.classList.add('open');
            qvOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Re-bind add to cart inside modal
            qvContent.querySelector('.add-cart-btn').addEventListener('click', function() {
                toast(`${data.name} added to cart`);
                let count = parseInt(document.getElementById('cart-badge').textContent) || 0;
                document.getElementById('cart-badge').textContent = count + 1;
                closeQuickViewModal();
            });
        }

        function closeQuickViewModal() {
            qvModal.classList.remove('open');
            qvOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        qvBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openQuickView(btn.dataset.id);
        }));
        closeQv?.addEventListener('click', closeQuickViewModal);
        qvOverlay?.addEventListener('click', closeQuickViewModal);

        /* ========================================
           PRODUCT COMPARISON TOOL
           ======================================== */
        const compare1 = document.getElementById('compare-1');
        const compare2 = document.getElementById('compare-2');
        const compareTable = document.getElementById('comparison-table');

        function renderComparison() {
            if (!compare1 || !compare2 || !compareTable) return;
            const p1 = productData[compare1.value];
            const p2 = productData[compare2.value];

            const specs = [
                { label: 'Frequency Response', key: 'freq' },
                { label: 'Battery Life', key: 'battery' },
                { label: 'Driver', key: 'driver' },
                { label: 'Active Noise Cancellation', key: 'anc' },
                { label: 'Weight', key: 'weight' }
            ];

            let html = `
                <tr>
                    <th>Specification</th>
                    <th>${p1.name}</th>
                    <th>${p2.name}</th>
                </tr>
            `;

            specs.forEach(spec => {
                html += `
                    <tr>
                        <td>${spec.label}</td>
                        <td>${p1[spec.key]}</td>
                        <td>${p2[spec.key]}</td>
                    </tr>
                `;
            });

            compareTable.innerHTML = html;
        }

        compare1?.addEventListener('change', renderComparison);
        compare2?.addEventListener('change', renderComparison);
        renderComparison(); // Init

        /* ========================================
           IMMERSIVE AUDIO DEMO
           ======================================== */
        const spatialToggle = document.getElementById('spatial-toggle');
        const demoPlayBtn = document.getElementById('demo-play-btn');
        const demoEq = document.getElementById('demo-eq');
        const soundWaves = document.getElementById('sound-waves');
        const toggleRow = document.querySelector('.audio-toggle-row');

        let audioCtx;
        let audioElement;
        let track;
        let panner;

        function initAudio() {
            if (audioCtx) return;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioElement = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            audioElement.crossOrigin = "anonymous";
            audioElement.loop = true;
            
            track = audioCtx.createMediaElementSource(audioElement);
            panner = audioCtx.createStereoPanner();
            
            track.connect(panner).connect(audioCtx.destination);
            
            // Simple LFO for spatial effect (panning left/right)
            let panVal = 0;
            let panDir = 0.015;
            setInterval(() => {
                if (spatialToggle?.checked && !audioElement.paused) {
                    panVal += panDir;
                    if (panVal > 1 || panVal < -1) panDir = -panDir;
                    if(panner.pan) panner.pan.value = panVal;
                } else {
                    if(panner.pan) panner.pan.value = 0;
                    panVal = 0;
                }
            }, 50);
        }

        spatialToggle?.addEventListener('change', (e) => {
            if (e.target.checked) {
                toggleRow?.classList.add('spatial-active');
                if(demoPlayBtn?.classList.contains('playing')) {
                    soundWaves?.classList.add('active');
                }
                toast('Spidy Spatial enabled', 'info', 1500);
            } else {
                toggleRow?.classList.remove('spatial-active');
                soundWaves?.classList.remove('active');
                toast('Standard Audio enabled', 'info', 1500);
            }
        });

        demoPlayBtn?.addEventListener('click', async () => {
            initAudio();
            
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            if (audioElement.paused) {
                audioElement.play();
                demoPlayBtn.classList.add('playing');
                demoEq?.classList.add('playing');
                demoPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                if (spatialToggle?.checked) soundWaves?.classList.add('active');
            } else {
                audioElement.pause();
                demoPlayBtn.classList.remove('playing');
                demoEq?.classList.remove('playing');
                demoPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                soundWaves?.classList.remove('active');
            }
        });

        /* ========================================
           FLY TO CART IMAGE ANIMATION
           ======================================== */
        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (window.innerWidth < 768) return; // Skip on mobile
                
                const card = this.closest('.product-card');
                if(!card) return;
                
                const img = card.querySelector('img');
                const cartIcon = document.getElementById('cart-btn');
                if (!img || !cartIcon) return;

                const imgRect = img.getBoundingClientRect();
                const cartRect = cartIcon.getBoundingClientRect();
                
                const flyImg = img.cloneNode();
                flyImg.className = 'fly-to-cart-img';
                flyImg.style.left = `${imgRect.left}px`;
                flyImg.style.top = `${imgRect.top}px`;
                flyImg.style.width = `${imgRect.width}px`;
                flyImg.style.height = `${imgRect.height}px`;
                
                document.body.appendChild(flyImg);

                // Animate
                requestAnimationFrame(() => {
                    flyImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.1)`;
                    flyImg.style.opacity = '0.5';
                });

                setTimeout(() => flyImg.remove(), 800);
            });
        });

        /* ========================================
           CART DRAWER & LOCALSTORAGE
           ======================================== */
        const cartOverlay = document.getElementById('cart-overlay');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartClose = document.getElementById('cart-close');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const checkoutBtn = document.getElementById('checkout-btn');
        let cart = JSON.parse(localStorage.getItem('spidy-cart')) || [];

        function saveCart() {
            localStorage.setItem('spidy-cart', JSON.stringify(cart));
            updateCartBadge();
            renderCart();
        }

        function updateCartBadge() {
            const badge = document.getElementById('cart-badge');
            if (badge) {
                const count = cart.reduce((acc, item) => acc + item.qty, 0);
                badge.textContent = count;
            }
        }

        function openCart() {
            if (cartDrawer) {
                cartDrawer.classList.add('open');
                cartOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                renderCart();
            }
        }

        function closeCart() {
            if (cartDrawer) {
                cartDrawer.classList.remove('open');
                cartOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        }

        function renderCart() {
            if (!cartItemsContainer) return;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="cart-empty-state">Your cart is empty.</div>';
                cartTotalPrice.textContent = '$0.00';
                return;
            }

            cartItemsContainer.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price} x ${item.qty}</div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(el);
            });
            cartTotalPrice.textContent = '$' + total.toFixed(2);

            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    cart.splice(idx, 1);
                    saveCart();
                });
            });
        }

        document.getElementById('cart-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
        document.getElementById('mobile-cart-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeDrawer();
            openCart();
        });
        cartClose?.addEventListener('click', closeCart);
        cartOverlay?.addEventListener('click', closeCart);

        /* ========================================
           CHECKOUT MODAL LOGIC
           ======================================== */
        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutOverlay = document.getElementById('checkout-overlay');
        const closeCheckoutModal = document.getElementById('close-checkout-modal');
        const checkoutForm = document.getElementById('checkout-form');
        
        const step1Dot = document.getElementById('step-1-dot');
        const step2Dot = document.getElementById('step-2-dot');
        const step3Dot = document.getElementById('step-3-dot');
        
        const step1Content = document.getElementById('checkout-step-1');
        const step2Content = document.getElementById('checkout-step-2');
        const step3Content = document.getElementById('checkout-step-3');

        function openCheckout() {
            if (cart.length === 0) return toast('Cart is empty', 'error');
            closeCart();
            checkoutModal?.classList.add('open');
            checkoutOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Reset to step 1
            step1Content?.classList.add('active');
            step2Content?.classList.remove('active');
            step3Content?.classList.remove('active');
            step1Dot?.classList.add('active');
            step2Dot?.classList.remove('active');
            step3Dot?.classList.remove('active');
        }

        function closeCheckout() {
            checkoutModal?.classList.remove('open');
            checkoutOverlay?.classList.remove('open');
            document.body.style.overflow = '';
        }

        checkoutBtn?.addEventListener('click', openCheckout);
        closeCheckoutModal?.addEventListener('click', closeCheckout);
        checkoutOverlay?.addEventListener('click', closeCheckout);
        document.getElementById('btn-close-checkout')?.addEventListener('click', closeCheckout);

        document.getElementById('btn-next-1')?.addEventListener('click', () => {
            const name = document.getElementById('co-name').value;
            const email = document.getElementById('co-email').value;
            const address = document.getElementById('co-address').value;
            
            if(!name || !email || !address) return toast('Please fill all fields', 'error');
            
            step1Content?.classList.remove('active');
            step2Content?.classList.add('active');
            step2Dot?.classList.add('active');
        });

        document.getElementById('btn-prev-2')?.addEventListener('click', () => {
            step2Content?.classList.remove('active');
            step1Content?.classList.add('active');
            step2Dot?.classList.remove('active');
        });

        checkoutForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading
            const submitBtn = document.getElementById('btn-submit-order');
            const origText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = origText;
                submitBtn.disabled = false;
                
                // Go to step 3 (Success)
                step2Content?.classList.remove('active');
                step3Content?.classList.add('active');
                step3Dot?.classList.add('active');
                
                // Clear cart
                cart = [];
                saveCart();
            }, 1500);
        });

        // Add to Cart Logic modification
        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.product-card');
                if(!card) return;
                
                const title = card.querySelector('.product-name')?.textContent || 'Spidy Product';
                let priceText = card.querySelector('.price')?.textContent || '$0';
                const price = parseFloat(priceText.replace('$', '').replace(',', ''));
                const img = card.querySelector('.product-img-wrap img')?.src || '';

                const existing = cart.find(i => i.title === title);
                if (existing) {
                    existing.qty++;
                } else {
                    cart.push({ title, price, img, qty: 1 });
                }
                saveCart();
                toast('Added to cart!', 'success');
            });
        });

        updateCartBadge(); // Init

        /* ========================================
           PRODUCT FILTERING
           ======================================== */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        /* ========================================
           PRODUCT SORTING
           ======================================== */
        const sortSelect = document.getElementById('sort-products');
        const productsGrid = document.getElementById('products-grid');
        
        if (sortSelect && productsGrid) {
            sortSelect.addEventListener('change', (e) => {
                const sortValue = e.target.value;
                const cards = Array.from(productsGrid.querySelectorAll('.product-card'));
                
                cards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.add-cart-btn')?.dataset.price || 0);
                    const priceB = parseFloat(b.querySelector('.add-cart-btn')?.dataset.price || 0);
                    
                    if (sortValue === 'price-low') return priceA - priceB;
                    if (sortValue === 'price-high') return priceB - priceA;
                    // Mock sorting for rating
                    if (sortValue === 'rating') return Math.random() - 0.5;
                    return 0; // featured defaults to original DOM order roughly
                });
                
                cards.forEach(card => productsGrid.appendChild(card));
            });
        }

        /* ========================================
           3D TILT EFFECT
           ======================================== */
        const tiltCards = document.querySelectorAll('.product-card');
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            const glare = document.createElement('div');
            glare.className = 'tilt-glare';
            card.appendChild(glare);

            let rafId = null;

            card.addEventListener('mousemove', e => {
                if (rafId) cancelAnimationFrame(rafId);
                
                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
                    const rotateY = ((x - centerX) / centerX) * 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)`;
            });
        });

        /* ========================================
           FORM SUBMISSION MOCK
           ======================================== */
        const newsletterForm = document.querySelector('.cta-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                newsletterForm.classList.add('form-loading');
                setTimeout(() => {
                    newsletterForm.classList.remove('form-loading');
                    newsletterForm.reset();
                    toast('Successfully subscribed to newsletter!', 'success');
                }, 1500);
            });
        }

        /* ========================================
           SCROLL ENTRANCE ANIMATIONS
           ======================================== */
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-up, .reveal-stagger').forEach(el => {
            scrollObserver.observe(el);
        });

        /* ========================================
           DEVELOPER EASTER EGG
           ======================================== */
        console.log("%c🎧 Welcome to Spidy Premium Audio!", "color: #00e5ff; font-size: 20px; font-weight: bold;");
        console.log("%cHandcrafted for audiophiles. Try the Konami Code for a surprise!", "color: #8d8fa3; font-size: 14px;");

        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        function activateEasterEgg() {
            toast('🎉 Konami Code Activated: Cyberpunk Overdrive!', 'success', 5000);
            
            document.body.style.transition = "all 2s ease";
            document.body.style.filter = "invert(1) hue-rotate(180deg)";
            
            setTimeout(() => {
                document.body.style.filter = "none";
                toast('System returning to normal...', 'info', 3000);
            }, 10000);
        }

    // Wire up all Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price || 0);
            
            // Find product image
            let img = '';
            const card = this.closest('.product-card');
            if (card) {
                img = card.querySelector('img')?.src || '';
            } else {
                // Might be in quick view
                img = document.querySelector('.quick-view-img img')?.src || '';
            }
    
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name, price, qty: 1, img, title: name });
            }
            
            saveCart();
            
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
            setTimeout(() => this.innerHTML = orig, 1400);
            toast(`${name} added to cart`, 'success');
        });
    });
    
    // Checkout logic
    const checkoutBtnNode = document.getElementById('checkout-btn');
    if (checkoutBtnNode) {
        checkoutBtnNode.addEventListener('click', () => {
            if(cart.length === 0) {
                toast('Your cart is empty', 'error');
                return;
            }
            closeCart();
            const checkoutModal = document.getElementById('checkout-modal');
            const checkoutOverlay = document.getElementById('checkout-overlay');
            if(checkoutModal && checkoutOverlay) {
                checkoutModal.classList.add('open');
                checkoutOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                
                // reset checkout steps
                document.querySelectorAll('.checkout-step-content').forEach(s => s.classList.remove('active'));
                document.getElementById('checkout-step-1').classList.add('active');
                
                document.querySelectorAll('.checkout-steps .step').forEach(s => s.classList.remove('active'));
                document.getElementById('step-1-dot').classList.add('active');
            }
        });
    }
    
    // Next Step 1 -> 2
    document.getElementById('btn-next-1')?.addEventListener('click', () => {
        const name = document.getElementById('co-name').value;
        const email = document.getElementById('co-email').value;
        const address = document.getElementById('co-address').value;
        if(!name || !email || !address) {
            toast('Please fill all shipping details', 'error');
            return;
        }
        document.getElementById('checkout-step-1').classList.remove('active');
        document.getElementById('checkout-step-2').classList.add('active');
        document.getElementById('step-2-dot').classList.add('active');
    });
    
    // Back Step 2 -> 1
    document.getElementById('btn-prev-2')?.addEventListener('click', () => {
        document.getElementById('checkout-step-2').classList.remove('active');
        document.getElementById('checkout-step-1').classList.add('active');
        document.getElementById('step-2-dot').classList.remove('active');
    });
    
    // Submit Order
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if(document.getElementById('checkout-step-2').classList.contains('active')) {
            const card = document.getElementById('co-card').value;
            const exp = document.getElementById('co-exp').value;
            const cvv = document.getElementById('co-cvv').value;
            if(!card || !exp || !cvv) {
                toast('Please fill all payment details', 'error');
                return;
            }
            
            document.getElementById('checkout-step-2').classList.remove('active');
            document.getElementById('checkout-step-3').classList.add('active');
            document.getElementById('step-3-dot').classList.add('active');
            
            // Clear cart
            cart = [];
            saveCart();
        }
    });
    
    document.getElementById('btn-close-checkout')?.addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.remove('open');
        document.getElementById('checkout-overlay').classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // Comparison logic
    const comparisonData = {
        'p1': { name: 'Sequoia Pro', type: 'Over-Ear', anc: 'Yes (Adaptive)', battery: '40 Hours', driver: '50mm Neodymium', waterproof: 'No' },
        'p2': { name: 'X-Bud Pro', type: 'Earbuds', anc: 'Yes', battery: '32 Hours (with case)', driver: '11mm Dynamic', waterproof: 'IPX4' },
        'p3': { name: 'Studio Max', type: 'Over-Ear (Open Back)', anc: 'No', battery: 'Wired', driver: '45mm Planar Magnetic', waterproof: 'No' },
        'p4': { name: 'Pulse Speaker', type: 'Speaker', anc: 'N/A', battery: '24 Hours', driver: 'Dual 2.5"', waterproof: 'IP67' }
    };
    
    function updateComparison() {
        const p1 = document.getElementById('compare-1')?.value;
        const p2 = document.getElementById('compare-2')?.value;
        const table = document.getElementById('comparison-table');
        
        if(!p1 || !p2 || !table) return;
        
        const d1 = comparisonData[p1];
        const d2 = comparisonData[p2];
        
        if(d1 && d2) {
            table.innerHTML = `
                <tr><th>Feature</th><th>${d1.name}</th><th>${d2.name}</th></tr>
                <tr><td>Type</td><td>${d1.type}</td><td>${d2.type}</td></tr>
                <tr><td>ANC</td><td>${d1.anc}</td><td>${d2.anc}</td></tr>
                <tr><td>Battery</td><td>${d1.battery}</td><td>${d2.battery}</td></tr>
                <tr><td>Driver</td><td>${d1.driver}</td><td>${d2.driver}</td></tr>
                <tr><td>Water Resistance</td><td>${d1.waterproof}</td><td>${d2.waterproof}</td></tr>
            `;
        }
    }
    
    document.getElementById('compare-1')?.addEventListener('change', updateComparison);
    document.getElementById('compare-2')?.addEventListener('change', updateComparison);
    updateComparison(); // initial load
    
    // Testimonial slider logic
    const slider = document.getElementById('testimonials-slider');
    const dotsContainer = document.getElementById('testimonial-dots');
    if(slider && dotsContainer) {
        const slides = slider.querySelectorAll('.slide');
        let currentSlide = 0;
        
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
        
        function goToSlide(idx) {
            currentSlide = idx;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }
        
        document.getElementById('prev-testimonial')?.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        });
        document.getElementById('next-testimonial')?.addEventListener('click', () => {
            goToSlide((currentSlide + 1) % slides.length);
        });
        
        // Autoplay
        setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);
    }
    // Update productData for p5 and p6
    if (typeof productData !== 'undefined') {
        productData['p5'] = {
            name: 'Aero Stand', price: '$49',
            img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500',
            gallery: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500'],
            desc: 'Minimalist aluminum headphone stand to display your Spidy gear in style.', freq: 'N/A', battery: 'N/A', driver: 'N/A', anc: 'N/A', weight: '200g'
        };
        productData['p6'] = {
            name: 'Cloud Cushions', price: '$29',
            img: 'https://images.unsplash.com/photo-1628190771804-98448f760e58?auto=format&fit=crop&q=80&w=500',
            gallery: ['https://images.unsplash.com/photo-1628190771804-98448f760e58?auto=format&fit=crop&q=80&w=500'],
            desc: 'Ultra-soft memory foam replacement ear cushions for all-day listening comfort.', freq: 'N/A', battery: 'N/A', driver: 'N/A', anc: 'N/A', weight: '50g'
        };
    }

    // 1. Functional Product Sorting
    const sortSelect = document.getElementById('sort-products');
    const productsGrid = document.getElementById('products-grid');
    if (sortSelect && productsGrid) {
        // Store original order
        const originalCards = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        sortSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            let sortedCards = Array.from(productsGrid.querySelectorAll('.product-card'));
            
            if (val === 'featured') {
                sortedCards = originalCards;
            } else if (val === 'price-low') {
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.add-cart-btn')?.dataset.price || 0);
                    const priceB = parseFloat(b.querySelector('.add-cart-btn')?.dataset.price || 0);
                    return priceA - priceB;
                });
            } else if (val === 'price-high') {
                sortedCards.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.add-cart-btn')?.dataset.price || 0);
                    const priceB = parseFloat(b.querySelector('.add-cart-btn')?.dataset.price || 0);
                    return priceB - priceA;
                });
            } else if (val === 'rating') {
                sortedCards.sort((a, b) => {
                    const ratingA = parseFloat(a.querySelector('.product-rating')?.textContent.replace(/[^0-9.]/g, '') || 0);
                    const ratingB = parseFloat(b.querySelector('.product-rating')?.textContent.replace(/[^0-9.]/g, '') || 0);
                    return ratingB - ratingA;
                });
            }
            
            // Re-append sorted cards
            sortedCards.forEach(card => productsGrid.appendChild(card));
        });
    }

    // 2. Recently Viewed Section
    const recentKey = 'spidy-recent';
    const recentScrollContainer = document.getElementById('recent-scroll-container');
    const recentlyViewedSection = document.getElementById('recently-viewed');

    function renderRecentlyViewed() {
        if (!recentScrollContainer) return;
        const recent = JSON.parse(localStorage.getItem(recentKey)) || [];
        if (recent.length === 0) {
            recentlyViewedSection.style.display = 'none';
            return;
        }
        
        recentlyViewedSection.style.display = 'block';
        recentScrollContainer.innerHTML = recent.map(item => `
            <div class="recent-card" onclick="document.querySelector('.quick-view-btn[data-id=\\'${item.id}\\']')?.click()">
                <img src="${item.img}" alt="${item.name}" class="recent-img">
                <div class="recent-title">${item.name}</div>
                <div class="recent-price">${item.price}</div>
            </div>
        `).join('');
    }

    // Hook into quick view clicks
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const data = typeof productData !== 'undefined' ? productData[id] : null;
            if (data) {
                let recent = JSON.parse(localStorage.getItem(recentKey)) || [];
                // Remove if exists
                recent = recent.filter(item => item.id !== id);
                // Add to start
                recent.unshift({ id, name: data.name, price: data.price, img: data.img });
                // Keep max 6
                if (recent.length > 6) recent.pop();
                localStorage.setItem(recentKey, JSON.stringify(recent));
                renderRecentlyViewed();
            }
        });
    });
    // Initial render
    renderRecentlyViewed();

    // 3. Interactive Hero Audio Visualizer
    const visualizer = document.getElementById('audio-visualizer');
    if (visualizer) {
        const bars = visualizer.querySelectorAll('.bar');
        setInterval(() => {
            bars.forEach(bar => {
                const height = Math.floor(Math.random() * 80) + 20; // 20% to 100%
                bar.style.height = `${height}%`;
                bar.style.transition = 'height 0.1s ease';
            });
        }, 100);
    }


    /* ========================================
       BIG FEATURE 1: EXIT INTENT POPUP
       ======================================== */
    const exitPopupOverlay = document.getElementById('exit-popup-overlay');
    let exitIntentTriggered = sessionStorage.getItem('spidy_exit_intent');

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 50 && !exitIntentTriggered && exitPopupOverlay) {
            exitPopupOverlay.classList.add('show');
            sessionStorage.setItem('spidy_exit_intent', 'true');
            exitIntentTriggered = true;
        }
    });

    document.getElementById('close-exit-popup')?.addEventListener('click', () => {
        exitPopupOverlay.classList.remove('show');
    });
    document.getElementById('claim-discount-btn')?.addEventListener('click', () => {
        exitPopupOverlay.classList.remove('show');
        toast('Discount code SPIDY15 copied to clipboard!', 'success');
        navigator.clipboard.writeText('SPIDY15');
    });

    /* ========================================
       BIG FEATURE 2: AI CUSTOMER SUPPORT CHATBOT
       ======================================== */
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chatbot');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input-field');
    const chatSendBtn = document.getElementById('chatbot-send-btn');

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => chatWindow.classList.toggle('open'));
        closeChat.addEventListener('click', () => chatWindow.classList.remove('open'));

        const botReplies = {
            'shipping': 'We offer free 2-day shipping on all orders over $50!',
            'return': 'We have a 30-day hassle-free return policy. Just contact support to get a return label.',
            'recommendation': 'Based on popularity, our Sequoia Pro is the ultimate choice for audiophiles.',
            'hello': 'Hello! How can I assist you with your Spidy audio gear today?',
            'hi': 'Hi! Need help finding the perfect headphones?',
            'default': 'I am still learning! For complex issues, please email support@spidy.com.'
        };

        function addMessage(text, sender) {
            const msg = document.createElement('div');
            msg.className = `chat-message ${sender}`;
            msg.textContent = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleSend() {
            const text = chatInput.value.trim();
            if (!text) return;
            addMessage(text, 'user');
            chatInput.value = '';

            // Typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-message bot typing-indicator';
            typingMsg.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatMessages.appendChild(typingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Process bot reply
            setTimeout(() => {
                typingMsg.remove();
                const lower = text.toLowerCase();
                let replied = false;
                for (const key in botReplies) {
                    if (lower.includes(key)) {
                        addMessage(botReplies[key], 'bot');
                        replied = true;
                        break;
                    }
                }
                if (!replied) addMessage(botReplies['default'], 'bot');
            }, 1200);
        }

        chatSendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    /* ========================================
       BIG FEATURE 3: USER REVIEWS SYSTEM (Modifying QuickView)
       ======================================== */
    // We will override the openQuickView function to append reviews.
    // However, since we can't easily override the exact function from here without breaking other bindings,
    // we will listen to clicks on quick view buttons and dynamically append the reviews section 
    // to the modal after it is populated.

    const reviewsDBKey = 'spidy_reviews';
    function getReviews(productId) {
        const db = JSON.parse(localStorage.getItem(reviewsDBKey)) || {};
        return db[productId] || [
            { author: 'Jane Doe', rating: 5, date: 'Aug 10, 2026', text: 'Absolutely love the sound quality on these. Best purchase ever!' }
        ];
    }
    function saveReview(productId, review) {
        const db = JSON.parse(localStorage.getItem(reviewsDBKey)) || {};
        if (!db[productId]) db[productId] = getReviews(productId);
        db[productId].unshift(review);
        localStorage.setItem(reviewsDBKey, JSON.stringify(db));
    }

    function renderReviewsSection(productId, container) {
        let existing = container.querySelector('.reviews-section');
        if (existing) existing.remove();

        const reviews = getReviews(productId);
        const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 5.0;

        const section = document.createElement('div');
        section.className = 'reviews-section';
        section.innerHTML = `
            <div class="review-header">
                <div>
                    <h3 style="margin-bottom:5px;">Customer Reviews</h3>
                    <div class="review-stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(avgRating))}
                        <span style="color:var(--text-muted); margin-left:5px;">${avgRating} (${reviews.length})</span>
                    </div>
                </div>
                <button class="btn-secondary" id="write-review-btn" style="padding: 8px 15px; font-size: 0.85rem;">Write a Review</button>
            </div>
            
            <div class="write-review-form" id="write-review-form">
                <div class="star-rating-input" id="star-rating-input">
                    <i class="fa-solid fa-star" data-val="1"></i>
                    <i class="fa-solid fa-star" data-val="2"></i>
                    <i class="fa-solid fa-star" data-val="3"></i>
                    <i class="fa-solid fa-star" data-val="4"></i>
                    <i class="fa-solid fa-star" data-val="5"></i>
                </div>
                <input type="text" id="review-name" placeholder="Your Name" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text);">
                <textarea id="review-text" placeholder="Share your experience..." style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text); min-height:80px;"></textarea>
                <button class="btn-primary" id="submit-review-btn" style="width:100%; justify-content:center;">Submit Review</button>
            </div>

            <div class="reviews-list">
                ${reviews.map(r => `
                    <div class="review-item">
                        <div class="review-item-top">
                            <span class="review-author">${r.author}</span>
                            <span class="review-date">${r.date}</span>
                        </div>
                        <div class="review-stars" style="margin-bottom:8px;">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
                        </div>
                        <div class="review-text">${r.text}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(section);

        // Events
        let currentRating = 5;
        const stars = section.querySelectorAll('#star-rating-input i');
        stars.forEach(s => {
            s.addEventListener('click', (e) => {
                currentRating = parseInt(e.target.dataset.val);
                stars.forEach(st => {
                    st.classList.toggle('active', parseInt(st.dataset.val) <= currentRating);
                });
            });
            // Init active
            s.classList.toggle('active', parseInt(s.dataset.val) <= currentRating);
        });

        section.querySelector('#write-review-btn').addEventListener('click', () => {
            section.querySelector('#write-review-form').classList.toggle('open');
        });

        section.querySelector('#submit-review-btn').addEventListener('click', () => {
            const name = section.querySelector('#review-name').value.trim() || 'Anonymous';
            const text = section.querySelector('#review-text').value.trim();
            if (!text) {
                toast('Please write a review', 'error');
                return;
            }
            saveReview(productId, {
                author: name,
                rating: currentRating,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                text: text
            });
            toast('Review submitted!', 'success');
            renderReviewsSection(productId, container); // Re-render
        });
    }

    // Attach to all Quick View buttons (including newly appended ones if we delegate)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-view-btn');
        if (btn) {
            const id = btn.dataset.id;
            // The modal is populated synchronously, so we can just wait a tiny tick for it to finish rendering innerHTML
            setTimeout(() => {
                const details = document.querySelector('#quick-view-content .quick-view-details') || document.querySelector('#quick-view-content');
                if (details) {
                    renderReviewsSection(id, details);
                }
            }, 50);
        }
    });


})();
