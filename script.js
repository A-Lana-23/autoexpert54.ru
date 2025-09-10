// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    // --- Модальное окно консультации ---
    const modal = document.getElementById('modal');
    const btns = document.querySelectorAll('.open-modal');
    const closeBtn = document.querySelector('#modal .close');

    // Функция открытия модального окна
    function openModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Функция закрытия модального окна
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Открываем модальное окно
    if (btns.length > 0) {
        btns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        });
    }

    // Закрываем при клике на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Закрываем при клике вне окна
    window.addEventListener('click', function (event) {
        if (modal && event.target == modal) {
            closeModal();
        }
    });

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.placeholder = '+7XXXXXXXXX';

        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value;

            if (!value.startsWith('+7')) {
                value = '+7' + value.replace(/\D/g, '');
            } else {
                value = '+7' + value.substring(2).replace(/\D/g, '');
            }

            if (value.length > 12) {
                value = value.substring(0, 12);
            }

            e.target.value = value;
        });

        phoneInput.addEventListener('keypress', function (e) {
            if ([8, 46, 9, 27, 13].indexOf(e.keyCode) !== -1) {
                return;
            }

            if (e.target.value.length === 0 && e.key === '+') {
                return;
            }

            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    // Обработка формы
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            const whatsappMessage = `*Новая заявка с сайта!*\n\n*Имя:* ${name}\n*Телефон:* ${phone}\n*Сообщение:* ${message || 'Не указано'}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const phoneNumber = '79994674987';

           window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
            closeModal();
            this.reset();

            if (phoneInput) {
                phoneInput.placeholder = '+7XXXXXXXXX';
            }

            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        });
    }

    // --- НОВАЯ ЛОГИКА ДЛЯ КАРУСЕЛЕЙ С ПРЕДПРОСМОТРОЙ ---
    const previewCarousels = {
        certificates: {
            mainImage: document.getElementById('certificates-main-image'),
            container: document.querySelector('.certificates-carousel .carousel-thumbnails'),
            track: document.querySelector('.certificates-carousel .carousel-track'),
            slides: document.querySelectorAll('.certificates-carousel .carousel-slide'),
            thumbnails: document.querySelectorAll('.certificates-carousel .thumbnail-image'),
            currentIndex: 0,
            totalItems: 0,
            visibleItems: 3 // Количество видимых миниатюр
        },
        reviews: {
            mainImage: document.getElementById('reviews-main-image'),
            container: document.querySelector('.reviews-carousel .carousel-thumbnails'),
            track: document.querySelector('.reviews-carousel .carousel-track'),
            slides: document.querySelectorAll('.reviews-carousel .carousel-slide'),
            thumbnails: document.querySelectorAll('.reviews-carousel .thumbnail-image'),
            currentIndex: 0,
            totalItems: 0,
            visibleItems: 3
        }
    };

    // Инициализация каруселей
    function initPreviewCarousel(type) {
        const carousel = previewCarousels[type];
        if (!carousel || carousel.slides.length === 0) return;

        carousel.totalItems = carousel.slides.length;
        
        // Обработчики кликов по миниатюрам
        carousel.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                showSlide(type, index);
            });
        });

        // Инициализируем первую миниатюру как активную
        updateThumbnails(type);
        updateCarouselTrack(type);
    }

    // Показать слайд по индексу
    function showSlide(type, index) {
        const carousel = previewCarousels[type];
        if (!carousel || index < 0 || index >= carousel.totalItems) return;

        carousel.currentIndex = index;
        
        // Обновляем основное изображение
        const newSrc = carousel.thumbnails[index].dataset.src;
        carousel.mainImage.src = newSrc;
        carousel.mainImage.alt = carousel.thumbnails[index].alt;

        // Обновляем активную миниатюру
        updateThumbnails(type);
        
        // Обновляем позицию дорожки миниатюр
        updateCarouselTrack(type);
    }

    // Обновить состояние активных миниатюр
    function updateThumbnails(type) {
        const carousel = previewCarousels[type];
        carousel.thumbnails.forEach((thumb, i) => {
            if (i === carousel.currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Обновить позицию дорожки миниатюр
    function updateCarouselTrack(type) {
        const carousel = previewCarousels[type];
        if (!carousel.slides.length) return;

        const slideHeight = carousel.slides[0].offsetHeight;
        const visibleHeight = slideHeight * carousel.visibleItems;
        const totalHeight = slideHeight * carousel.totalItems;
        const trackHeight = carousel.track.offsetHeight;

        // Центрируем активный элемент, если возможно
        let targetIndex = carousel.currentIndex;
        
        // Ограничиваем диапазон для центрирования
        const startIndex = Math.max(0, targetIndex - Math.floor(carousel.visibleItems / 2));
        const endIndex = Math.min(carousel.totalItems - carousel.visibleItems, startIndex);
        const finalIndex = Math.max(0, endIndex);

        carousel.track.style.transform = `translateY(-${finalIndex * slideHeight}px)`;
    }

    // Перейти к следующему слайду
    function nextSlide(type) {
        const carousel = previewCarousels[type];
        if (!carousel) return;
        
        const nextIndex = (carousel.currentIndex + 1) % carousel.totalItems;
        showSlide(type, nextIndex);
    }

    // Перейти к предыдущему слайду
    function prevSlide(type) {
        const carousel = previewCarousels[type];
        if (!carousel) return;
        
        const prevIndex = (carousel.currentIndex - 1 + carousel.totalItems) % carousel.totalItems;
        showSlide(type, prevIndex);
    }

    // Обработчики для кнопок навигации
    document.querySelectorAll('.carousel-nav').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.carousel;
            if (this.classList.contains('carousel-next')) {
                nextSlide(type);
            } else {
                prevSlide(type);
            }
        });
    });

    // Инициализация всех каруселей
    Object.keys(previewCarousels).forEach(type => {
        initPreviewCarousel(type);
    });

    // Автопрокрутка основных изображений (опционально)
    // setInterval(() => {
    //     Object.keys(previewCarousels).forEach(type => {
    //         nextSlide(type);
    //     });
    // }, 5000); // Прокрутка каждые 5 секунд

});
// Открытие модального окна политики конфиденциальности
document.addEventListener('DOMContentLoaded', function() {
    // Селектор для всех ссылок, открывающих политику (в модальном окне и футере)
    const openPrivacyPolicyLinks = document.querySelectorAll('#openPrivacyPolicy, #openPrivacyPolicyFooter');
    const privacyModal = document.getElementById('privacy-modal');
    // Теперь крестик снаружи, ищем его правильно
    const privacyCloseButtons = privacyModal ? privacyModal.querySelectorAll('.close-outside, .close') : null;
    // Элемент с прокручиваемым контентом
    const modalScrollContainer = privacyModal ? privacyModal.querySelector('.modal-scroll-container') : null;

    if (privacyModal && privacyCloseButtons && modalScrollContainer) {
        // Функция для открытия модального окна
        function openPrivacyModal() {
            privacyModal.style.display = 'block';
            // Прокручиваем к началу при открытии
            modalScrollContainer.scrollTop = 0;
            // Также можно прокрутить внутренний контент, если это необходимо
            // privacyModal.querySelector('.privacy-modal-content').scrollTop = 0;
        }

        // Функция для закрытия модального окна
        function closePrivacyModal() {
            privacyModal.style.display = 'none';
        }

        // Обработчики для открытия
        openPrivacyPolicyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openPrivacyModal();
            });
        });

        // Обработчики для закрытия (крестик внутри и снаружи)
        privacyCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                closePrivacyModal();
            });
        });

        // Закрытие модального окна при клике вне его (на затемненную область)
        privacyModal.addEventListener('click', function(e) {
            // Проверяем, кликнули ли мы непосредственно на .modal-scroll-container
            // или на самого себя (#privacy-modal). Если да, закрываем.
            if (e.target === modalScrollContainer || e.target === privacyModal) {
                 closePrivacyModal();
            }
        });

        // Закрытие модального окна клавишей Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && privacyModal.style.display === 'block') {
                closePrivacyModal();
            }
        });
    }
});