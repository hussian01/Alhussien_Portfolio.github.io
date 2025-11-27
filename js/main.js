document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Mobile Menu Toggle Logic (القائمة المتنقلة) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // تغيير الأيقونة من شريط إلى X
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // إغلاق القائمة عند النقر على أي رابط
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // إغلاق القائمة فقط إذا لم يكن الجهاز جهاز كمبيوتر
                if (window.innerWidth <= 992) {
                    navLinks.classList.remove('open');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }


    // --- 1. Dark/Light Mode Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.hasAttribute('data-theme')) {
                body.removeAttribute('data-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 2. Typing Effect (لصفحة index.html) ---
    const textElement = document.querySelector('.typing-text');
    if (textElement) {
        const words = ["مبرمج ويب", "مصمم جرافيك", "كاتب محتوى"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        type();
    }

    // --- 3. Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 
    });

    const elementsToAnimate = document.querySelectorAll('.hidden');
    elementsToAnimate.forEach((el) => observer.observe(el));
    
    // --- 4. Form Submission to WhatsApp (لصفحة contact.html) ---
    const contactForm = document.getElementById('contact-form');
    const whatsappNumber = "9647737173482"; 

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(contactForm);
            let message = "👋 رسالة جديدة عبر نموذج 'اتصل بي' في موقع الحسين:\n\n";
            
            const fullName = formData.get('full_name') || 'غير محدد';
            const clientEmail = formData.get('client_email') || 'غير محدد';
            const messageDetails = formData.get('message_details') || 'لا توجد تفاصيل';

            message += `* اسم المرسل: ${fullName}\n`;
            message += `* البريد الإلكتروني: ${clientEmail}\n`;
            message += `\n* نص الرسالة:\n--------------------------------\n${messageDetails}\n--------------------------------\n`;
            message += "\n*يرجى الرد على هذه الرسالة عبر واتساب.*";

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
            
            contactForm.reset();
            alert("تم تجهيز رسالتك! سيتم فتح WhatsApp الآن لإرسالها مباشرة.");
        });
    }

    // =================================================================
    // 5. Certificate Modal Logic (لصفحة certificates.html)
    // =================================================================

    const modal = document.getElementById('certificate-modal');
    const modalImage = document.getElementById('modal-image');
    // استخدام اسم الكلاس الصحيح لزر الإغلاق
    const closeBtn = document.querySelector('.modal-overlay .close-btn');
    // استخدام اسم الكلاس الصحيح الذي أضفناه للعناصر المفتتحة
    const openModalButtons = document.querySelectorAll('.open-modal-trigger');

    // دالة الإغلاق المشتركة
    function closeModal() {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // إعادة تمكين التمرير
        }
    }

    // 1. فتح الـ Modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSource = this.getAttribute('data-img-src');
            
            if (modalImage && imageSource) {
                modalImage.src = imageSource;
                modal.classList.add('open');
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    // 2. إغلاق الـ Modal عبر زر X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 3. إغلاق الـ Modal عبر النقر خارج الصورة (على الـ Overlay)
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // 4. إغلاق الـ Modal عبر زر Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    

});
