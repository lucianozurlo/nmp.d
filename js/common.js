jQuery(function ($) {
   /*--------------------------------------------------
Function Scroll Effects
---------------------------------------------------*/

   window.ScrollEffects = function () {
      gsap.defaults({ overwrite: 'auto' });
      gsap.registerPlugin(ScrollTrigger, Flip);
      gsap.config({ nullTargetWarn: false });

      setTimeout(function () {
         var threeapp = document.getElementById('app');
         threeapp.className += 'active';
         $('body').append(threeapp);
      }, 1500);

      if ($('#showcase-slider').length > 0) {
         setTimeout(function () {
            var threeSlider = document.getElementById('canvas-slider');
            threeSlider.className += ' active';
            $('body').append(threeSlider);
         }, 1500);
      }

      if (!$('body').hasClass('project-nav-text')) {
         if ($('#project-nav').length > 0) {
            $('#main-content').addClass('solid-color');
            $('#main-page-content').addClass('project-page');
         }
      }

      if ($('.portfolio').length > 0) {
         $('#main-content').addClass('portfolio-page');
      }

      let enableSmoothScrollMobile = true;
      if (isMobile()) {
         if (!enableSmoothScrollMobile) {
            document.body.classList.remove('smooth-scroll');
         }
      }

      if (document.body.classList.contains('smooth-scroll')) {
         const ScrollArea = document.querySelector('#content-scroll');
         class EdgeEasingPlugin extends Scrollbar.ScrollbarPlugin {
            constructor() {
               super(...arguments);
               this._remainMomentum = {
                  x: 0,
                  y: 0,
               };
            }
            transformDelta(delta) {
               const { limit, offset } = this.scrollbar;
               const x = this._remainMomentum.x + delta.x;
               const y = this._remainMomentum.y + delta.y;
               // clamps momentum within [-offset, limit - offset]
               this.scrollbar.setMomentum(
                  Math.max(-offset.x, Math.min(x, limit.x - offset.x)),
                  Math.max(-offset.y, Math.min(y, limit.y - offset.y))
               );
               return { x: 0, y: 0 };
            }
            onRender(remainMomentum) {
               Object.assign(this._remainMomentum, remainMomentum);
            }
         }

         EdgeEasingPlugin.pluginName = 'edgeEasing';
         Scrollbar.use(EdgeEasingPlugin);

         // Config

         if (!isMobile()) {
            var ScrollbarOptions = {
               damping: 0.1,
               renderByPixel: true,
               continuousScrolling: true,
               syncCallbacks: true,
            };
         }

         if (isMobile()) {
            var ScrollbarOptions = {
               damping: 0.2,
               renderByPixel: true,
               continuousScrolling: true,
               syncCallbacks: true,
            };
         }

         // Initialise
         var scrollbar = Scrollbar.init(ScrollArea /*ScrollbarOptions*/);

         ScrollTrigger.scrollerProxy('#content-scroll', {
            scrollTop(value) {
               if (arguments.length) {
                  scrollbar.scrollTop = value;
               }
               return scrollbar.scrollTop;
            },
         });

         scrollbar.addListener(ScrollTrigger.update);
         ScrollTrigger.defaults({ scroller: ScrollArea });
      } // End Smooth Scroll

      if (isMobile()) {
         var heroTranslate = $('.hero-translate').height();
         var winHeight = $(window).height();
         var footer_height = $('footer').height();
         $(
            '.smooth-scroll main, .has-parallax, nav, .nmp-slider-wrapper:not(.content-slider), .showcase-lists .nmp-sync-slider, .next-project-image-wrapper, .slider-fixed-content'
         ).css({ height: winHeight });
         $('#main-page-content.project-page').css({
            'margin-bottom': winHeight * 2 - footer_height,
         });
         if (!$('body').hasClass('project-nav-text')) {
            $('#project-nav').css({
               height: winHeight * 2,
               bottom: -winHeight * 2,
            });
         }
         $('.icon-wrap').removeClass('parallax-wrap');

         var resizeTime;
         $(window).resize(function () {
            clearTimeout(resizeTime);
            resizeTime = setTimeout(doneResizing, 100);
         });

         function doneResizing() {
            var heroTranslate = $('.hero-translate').height();
            var winHeight = $(window).height();
            var footer_height = $('footer').height();
            $(
               '.smooth-scroll main, .has-parallax, nav, .nmp-slider-wrapper:not(.content-slider), .showcase-lists .nmp-sync-slider, .next-project-image-wrapper, .slider-fixed-content'
            ).css({ height: winHeight });
            $('#main-page-content.project-page').css({
               'margin-bottom': winHeight * 2 - footer_height,
            });
            if (!$('body').hasClass('project-nav-text')) {
               $('#project-nav').css({
                  height: winHeight * 2,
                  bottom: -winHeight * 2,
               });
            }
            $('.icon-wrap').removeClass('parallax-wrap');
         }
      }

      // Hero AutoScroll On Page Load
      let autoScroll = null;

      if (
         $('body').hasClass('load-project-thumb') ||
         $('body').hasClass('load-project-thumb-with-title')
      ) {
         const delayTime = $('body').hasClass('load-project-thumb-with-title') ? 0.6 : 1.2;

         if ($('#hero.has-image').hasClass('autoscroll')) {
            if ($('body').hasClass('smooth-scroll')) {
               scrollbar.scrollTop = 0; // Reset the scrollbar position to 0
               autoScroll = gsap.to(scrollbar, {
                  duration: 0.7,
                  scrollTop: 120,
                  delay: delayTime,
                  ease: Power2.easeInOut,
               });
            } else {
               autoScroll = gsap.to(window, {
                  duration: 0.7,
                  scrollTo: 120,
                  delay: delayTime,
                  ease: Power2.easeInOut,
               });
            }
         }
      }

      // Slider Center on click
      $('.autocenter').on('click', function () {
         var $window = $(window),
            $element = $(this),
            elementTop = $element.offset().top,
            elementHeight = $element.height(),
            viewportHeight = $window.height(),
            scrollIt = elementTop - (viewportHeight - elementHeight) / 2;
         if ($('body').hasClass('smooth-scroll')) {
            var scrollOffset =
               scrollbar.offset.y + (elementTop - scrollbar.getSize().container.height / 2);
            autoScroll = gsap.to(scrollbar, {
               duration: 0.8,
               scrollTop: scrollOffset + elementHeight / 2,
               ease: Power4.easeInOut,
            });
         } else {
            $('html, body').animate({ scrollTop: scrollIt }, 350);
         }
      });

      // Add an event listener for the mousewheel event
      window.addEventListener('wheel', function (event) {
         if (autoScroll !== null) {
            // Kill the scroll trigger animation
            autoScroll.kill();
            autoScroll = null;
         }
      });

      if ($('body').hasClass('swap-logo')) {
         var imgLogoWhite = document.querySelector('.white-logo');
         var originalSrcWhite = 'images/logo-white.png';
         var updatedSrcWhite = 'images/logo-white-symbol.png';

         var imgLogoBlack = document.querySelector('.black-logo');
         var originalSrcBlack = 'images/logo.png';
         var updatedSrcBlack = 'images/logo-symbol.png';

         // Create a scroll trigger

         ScrollTrigger.create({
            trigger: 'header', // Set the trigger element
            start: 'top 120px',
            onEnter: function () {
               //Restore the original image source
               imgLogoWhite.src = originalSrcWhite;
               imgLogoBlack.src = originalSrcBlack;
               gsap.to($('#logo'), { duration: 0.2, opacity: 1 });
            },
            onEnterBack: function () {
               // Restore the original image source
               gsap.to($('#logo'), {
                  duration: 0.2,
                  opacity: 0,
                  onComplete: function () {
                     imgLogoWhite.src = originalSrcWhite;
                     imgLogoBlack.src = originalSrcBlack;
                     gsap.to($('#logo'), { duration: 0.2, opacity: 1 });
                  },
               });

               $('header').removeClass('swapped-logo');
            },
            onLeave: function () {
               // Change the image source
               gsap.to($('#logo'), {
                  duration: 0.2,
                  opacity: 0,
                  onComplete: function () {
                     imgLogoWhite.src = updatedSrcWhite;
                     imgLogoBlack.src = updatedSrcBlack;
                     gsap.to($('#logo'), { duration: 0.2, opacity: 1 });
                  },
               });

               $('header').addClass('swapped-logo');
            },
            onLeaveBack: function () {
               // Change the image source
               gsap.to($('#logo'), {
                  duration: 0.2,
                  opacity: 0,
                  onComplete: function () {
                     imgLogoWhite.src = updatedSrcWhite;
                     imgLogoBlack.src = updatedSrcBlack;
                     gsap.to($('#logo'), { duration: 0.2, opacity: 1 });
                  },
               });

               $('header').addClass('swapped-logo');
            },
         });

         $('a.ajax-link, a.slide-link, a.next-ajax-link-page').on('click', function () {
            // Restore the original image source when you leave the page
            if ($('header').hasClass('swapped-logo')) {
               gsap.to($('#logo'), {
                  duration: 0.2,
                  opacity: 0,
                  onComplete: function () {
                     imgLogoWhite.src = originalSrcWhite;
                     imgLogoBlack.src = originalSrcBlack;
                     gsap.to($('#logo'), { duration: 0.2, opacity: 1 });
                  },
               });
            }
         });
      }

      // Back To Top
      $('#backtotop').on('click', function () {
         if ($('body').hasClass('smooth-scroll')) {
            gsap.to(scrollbar, {
               duration: 1.5,
               scrollTop: 0,
               delay: 0.1,
               ease: Power4.easeInOut,
            });
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         } else {
            $('html,body').animate({ scrollTop: 0 }, 800);
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         }
      });

      //Scroll Down
      $('.scroll-down, .hero-arrow.link').on('click', function () {
         var heroheight = $('#hero').height();
         if ($('body').hasClass('smooth-scroll')) {
            gsap.to(scrollbar, {
               duration: 1.5,
               scrollTop: heroheight,
               ease: Power4.easeInOut,
            });
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         } else {
            $('html,body').animate({ scrollTop: heroheight }, 800);
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         }
      });

      //Scroll Down
      $('.home-arrow').on('click', function () {
         var heroTitleheight = $('#hero-caption .hero-title').height();
         if ($('body').hasClass('smooth-scroll')) {
            gsap.to(scrollbar, {
               duration: 1.5,
               scrollTop: heroTitleheight,
               ease: Power4.easeInOut,
            });
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         } else {
            $('html,body').animate({ scrollTop: heroTitleheight }, 800);
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               delay: 0.15,
            });
         }
      });

      // Zoom Gallery
      gsap.utils.toArray('.zoom-gallery').forEach((zoomGallery) => {
         const zoomGalleryWrapper = zoomGallery.querySelector('.zoom-wrapper-gallery');
         const zoomWrapperThumb = zoomGallery.querySelector('.zoom-wrapper-thumb');
         const ZoomItem = zoomGallery.querySelector('.zoom-center .zoom-img-wrapper');
         const zoomImgsWrapper = zoomGallery.querySelectorAll(
            'li:not(.zoom-center) .zoom-img-wrapper'
         );
         const zoomImgsWrapperAll = zoomGallery.querySelectorAll('li .zoom-img-wrapper');
         const heightRatio = zoomGalleryWrapper.dataset.heightratio;
         const zoomImgsHeight = ZoomItem.offsetWidth * heightRatio;
         const paddingBottom = (window.innerHeight - zoomImgsHeight) / 2;

         gsap.set(zoomGallery, { paddingBottom: paddingBottom });
         gsap.set(zoomGalleryWrapper, { height: zoomImgsHeight });
         gsap.set(zoomWrapperThumb, {
            top: -paddingBottom,
            height: window.innerHeight,
         });

         gsap.to(zoomGallery, {
            scrollTrigger: {
               trigger: zoomGallery,
               start: function () {
                  const startPin = (window.innerHeight - zoomGalleryWrapper.offsetHeight) / 2;
                  return 'top +=' + startPin;
               },
               end: '+=200%',
               scrub: true,
               pin: true,
            },
         });

         gsap.to(zoomImgsWrapper, {
            scale: 0.9,
            opacity: 0,
            borderRadius: '0',
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: zoomGallery,
               start: function () {
                  const startPin = (window.innerHeight - zoomGalleryWrapper.offsetHeight) / 2;
                  return 'top +=' + startPin;
               },
               end: '+=25%',
               scrub: true,
            },
         });

         const state = Flip.getState(ZoomItem);
         zoomWrapperThumb.appendChild(ZoomItem);

         const zoomAnimation = Flip.from(state, {
            borderRadius: '0',
            absolute: true,
         });

         ScrollTrigger.create({
            trigger: zoomGalleryWrapper,
            start: function () {
               const startPin = (window.innerHeight - zoomGalleryWrapper.offsetHeight) / 2;
               return 'top +=' + startPin;
            },
            end: '+=200%',
            scrub: true,
            animation: zoomAnimation,
         });
      });

      // Carousel Shortcode
      gsap.utils.toArray('.carousel-shortcode-pin').forEach((carouselShortcodePin) => {
         const carouselShortcodeThumbs = carouselShortcodePin.querySelector(
            '.carousel-shortcode-thumbs'
         );
         const carouselShortcodeCaption = carouselShortcodePin.querySelector(
            '.carousel-shortcode-caption'
         );
         const carouselShortcodeWrapper = carouselShortcodePin.closest(
            '.carousel-shortcode-wrapper'
         );
         const carouselShortcodeTitleHide = carouselShortcodePin.querySelectorAll(
            '.carousel-shortcode-title-hide span'
         );
         const carouselShortcodeTitleShow = carouselShortcodePin.querySelectorAll(
            '.carousel-shortcode-title-show span'
         );
         const carouselShortcodeCTA = carouselShortcodePin.querySelector('.carousel-shortcode-cta');

         carouselShortcodeTitleHide.forEach((element) => {
            const div = document.createElement('div');
            element.parentNode.insertBefore(div, element);
            div.appendChild(element);
         });

         carouselShortcodeTitleShow.forEach((element) => {
            const div = document.createElement('div');
            element.parentNode.insertBefore(div, element);
            div.appendChild(element);
         });

         const clapatItems = carouselShortcodePin.querySelectorAll(
            '.carousel-shortcode-thumbs .nmp-item'
         );

         gsap.set(clapatItems, {
            yPercent: (index) => {
               return index % 2 === 0 ? -150 : 150;
            },
            opacity: 0,
         });

         function setCarouselShortcodeWrapperProperties() {
            gsap.set(carouselShortcodeThumbs, { height: window.innerHeight });
            gsap.set(carouselShortcodeCaption, { height: window.innerHeight });
         }

         setCarouselShortcodeWrapperProperties();
         window.addEventListener('resize', setCarouselShortcodeWrapperProperties);

         const showHideItems = gsap
            .timeline({
               scrollTrigger: {
                  trigger: carouselShortcodePin,
                  start: 'top top',
                  end: '+=700%',
                  scrub: 1,
               },
            })
            .to(clapatItems, {
               opacity: 1,
               yPercent: 0,
               stagger: 0.02,
               onUpdate: function () {
                  carouselShortcodeThumbs.classList.remove('is_active');
               },
               onComplete: function () {
                  carouselShortcodeThumbs.classList.add('is_active');
               },
            })
            .add('clapatItemsPause', '+=0.5')
            .to(
               clapatItems,
               {
                  opacity: 0.1,
                  yPercent: (index) => {
                     return index % 2 === 0 ? -180 : 180;
                  },
                  stagger: 0.02,
                  onStart: function () {
                     carouselShortcodeThumbs.classList.remove('is_active');
                  },
                  onReverseComplete: function () {
                     carouselShortcodeThumbs.classList.add('is_active');
                  },
               },
               'clapatItemsPause'
            );

         const showHideTitle = gsap
            .timeline({
               scrollTrigger: {
                  trigger: carouselShortcodePin,
                  start: 'top',
                  end: '+=600%',
                  scrub: 1,
               },
            })
            .to(carouselShortcodeTitleHide, {
               opacity: 0,
               y: -200,
               stagger: 0.04,
            })
            .to(
               carouselShortcodeTitleShow,
               {
                  opacity: 1,
                  y: 0,
                  stagger: -0.02,
               },
               '+=4'
            )
            .to(
               carouselShortcodeCTA,
               {
                  opacity: 1,
                  scale: 1,
                  y: 0,
               },
               '<+=50%'
            );

         gsap.to(carouselShortcodePin, {
            scrollTrigger: {
               trigger: carouselShortcodePin,
               start: function () {
                  const startPin = 0;
                  return 'top +=' + startPin;
               },
               end: '+=600%',
               pin: true,
               scrub: true,
            },
         });

         if (!isMobile()) {
            $('.carousel-shortcode-thumbs .nmp-item .slide-inner')
               .on('mouseenter', function () {
                  $('#ball p').remove();
                  var $this = $(this);
                  gsap.to('#ball', {
                     duration: 0.3,
                     borderWidth: '2px',
                     scale: 1.4,
                     borderColor: 'rgba(255,255,255,0)',
                     backgroundColor: 'rgba(255,255,255,0.1)',
                  });
                  gsap.to('#ball-loader', {
                     duration: 0.2,
                     borderWidth: '2px',
                     top: 2,
                     left: 2,
                  });
                  $('#ball').addClass('with-blur');
                  $('#ball').append('<p class="center-first">' + $this.data('centerline') + '</p>');
                  $(this)
                     .find('video')
                     .each(function () {
                        $(this).get(0).play();
                     });
               })
               .on('mouseleave', function () {
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '4px',
                     scale: 0.5,
                     borderColor: '#999999',
                     backgroundColor: 'transparent',
                  });
                  gsap.to('#ball-loader', {
                     duration: 0.2,
                     borderWidth: '4px',
                     top: 0,
                     left: 0,
                  });
                  $('#ball').removeClass('with-blur');
                  $('#ball p').remove();
                  $(this)
                     .find('video')
                     .each(function () {
                        $(this).get(0).pause();
                     });
               });

            $('.showcase-portfolio .nmp-item .slide-inner')
               .on('mouseenter', function () {
                  if (!$('.showcase-portfolio').hasClass('list-grid')) {
                     gsap.set($(this).find('.slide-title span'), {
                        y: 30,
                        opacity: 0,
                     });
                     gsap.set($(this).find('.slide-cat span'), {
                        y: 30,
                        opacity: 0,
                     });
                     gsap.to($(this).find('.slide-caption'), {
                        duration: 0.2,
                        opacity: 1,
                        ease: Power2.easeOut,
                     });
                     gsap.to($(this).find('.slide-title span'), {
                        duration: 0.3,
                        y: 0,
                        opacity: 1,
                        ease: Power2.easeOut,
                     });
                     gsap.to($(this).find('.slide-cat span'), {
                        duration: 0.3,
                        y: 0,
                        opacity: 1,
                        ease: Power2.easeOut,
                     });
                  }
               })
               .on('mouseleave', function () {
                  if (!$('.showcase-portfolio').hasClass('list-grid')) {
                     gsap.to($(this).find('.slide-caption'), {
                        duration: 0.3,
                        opacity: 0,
                        delay: 0.1,
                        ease: Power2.easeOut,
                     });
                     gsap.to($(this).find('.slide-title span'), {
                        duration: 0.3,
                        y: -30,
                        opacity: 0,
                        ease: Power2.easeOut,
                     });
                     gsap.to($(this).find('.slide-cat span'), {
                        duration: 0.5,
                        y: -30,
                        delay: 0.05,
                        opacity: 0,
                        ease: Power2.easeOut,
                     });
                  }
               });
         }

         $('.trigger-item').on('click', function () {
            $('body').addClass('load-project-thumb');
            $('.carousel-shortcode-thumbs .trigger-item').each(function () {
               if (!$(this).hasClass('above')) {
                  gsap.to($(this), {
                     duration: 0.5,
                     delay: 0,
                     opacity: 0,
                     ease: Power4.easeInOut,
                  });
               } else {
                  gsap.to($(this).parent(), {
                     duration: 0.3,
                     opacity: 1,
                     ease: Power4.easeInOut,
                  });
                  gsap.to($(this), {
                     duration: 0.5,
                     delay: 0.4,
                     opacity: 0,
                     ease: Power4.easeInOut,
                  });
               }
            });
            setTimeout(function () {
               $('body').addClass('show-loader');
            }, 300);
            gsap.to('footer, .carousel-nav-wrapper, .showcase-portfolio.list-grid', {
               duration: 0.5,
               opacity: 0,
               ease: Power4.easeInOut,
            });
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
               backgroundColor: 'transparent',
            });
            gsap.to('#ball-loader', {
               duration: 0.3,
               borderWidth: '4px',
               top: 0,
               left: 0,
            });
            $('#ball').removeClass('with-blur');
            $('#ball p').remove();
         });
      });

      // News Shortcode
      gsap.utils.toArray('.news-shortcode').forEach((newsShortcode) => {
         const newsPosts = Array.from(newsShortcode.querySelectorAll('.news-post'));

         newsPosts.forEach((newsPost, index) => {
            newsPosts[0].classList.add('in-view');
            gsap.set(newsPosts[0], { opacity: 1 });

            const newsContent = newsPost.querySelector('.post-content');

            const newsContentHeight = gsap.getProperty(newsContent, 'height');

            if (index === 0) {
               gsap.set(newsContent, { height: 'auto' });
            } else {
               gsap.set(newsContent, { height: 0 });
            }

            gsap.to(newsPost, {
               scrollTrigger: {
                  trigger: newsPost,
                  start: () => {
                     const startPin = window.innerHeight / 2 + newsPost.offsetHeight / 2;
                     return 'top +=' + startPin;
                  },
                  end: () => {
                     const endPin = newsPost.offsetHeight + newsContentHeight / 1.8;
                     return '+=' + endPin;
                  },
                  onEnter: () => {
                     newsPost.classList.add('in-view');
                     gsap.to(newsPost, {
                        duration: 0.2,
                        opacity: 1,
                        ease: 'power2.easeOut',
                     });
                     gsap.to(newsContent, {
                        duration: 0.2,
                        height: 'auto',
                        ease: 'power2.easeOut',
                     });
                  },
                  onLeave: () => {
                     if (index !== newsPosts.length - 1) {
                        newsPost.classList.remove('in-view');
                        gsap.to(newsPost, {
                           duration: 0.2,
                           opacity: 0.2,
                           ease: 'power2.easeOut',
                        });
                        gsap.to(newsContent, {
                           duration: 0.2,
                           height: 0,
                           ease: 'power2.easeOut',
                        });
                     }
                  },
                  onEnterBack: () => {
                     newsPost.classList.add('in-view');
                     gsap.to(newsPost, {
                        duration: 0.2,
                        opacity: 1,
                        ease: 'power2.easeOut',
                     });
                     gsap.to(newsContent, {
                        duration: 0.2,
                        height: 'auto',
                        ease: 'power2.easeOut',
                     });
                  },
                  onLeaveBack: () => {
                     if (index !== 0) {
                        newsPost.classList.remove('in-view');
                        gsap.to(newsPost, {
                           duration: 0.2,
                           opacity: 0.2,
                           ease: 'power2.easeOut',
                        });
                        gsap.to(newsContent, {
                           duration: 0.2,
                           height: 0,
                           ease: 'power2.easeOut',
                        });
                     }
                  },
               },
            });
         });
      });

      // List Rotator
      gsap.utils.toArray('.list-rotator-wrapper').forEach((listRotatorWrapper) => {
         const listRotatorTitle = listRotatorWrapper.querySelector('.list-rotator-title');
         const listRotatorHeight = listRotatorWrapper.querySelector('.list-rotator-height');
         const listRotatorPin = listRotatorWrapper.querySelector('.list-rotator-pin');
         const listRotator = listRotatorWrapper.querySelector('.list-rotator');
         const listItems = listRotatorWrapper.querySelectorAll('li');
         const totalItems = listItems.length - 1;
         const angleIncrement = 180 / totalItems;

         if (!isMobile()) {
            listItems.forEach(function (item, index) {
               const rotationAngle = index * angleIncrement;
               const fontSize = gsap.getProperty(item, 'fontSize');
               const lineHeight = gsap.getProperty(item, 'lineHeight');
               const translateZ = (parseFloat(fontSize) + parseFloat(lineHeight)) * 1.8;

               gsap.set(item, {
                  rotationX: -rotationAngle,
                  transformOrigin: `center center 0`,
                  transform: `rotateX(${-rotationAngle}deg) translateZ(${translateZ}px)`,
                  zIndex: totalItems - index,
               });
            });

            function setlistRotatorProperties() {
               gsap.set(listRotatorWrapper, { height: window.innerHeight * 3 });
               gsap.set(listRotatorHeight, { height: window.innerHeight * 4 });
               gsap.set(listRotator, { height: window.innerHeight });
               ScrollTrigger.refresh();
            }

            gsap.set(listRotator, { rotationX: -90 });

            setlistRotatorProperties();

            window.addEventListener('resize', setlistRotatorProperties);

            gsap.to(listRotatorTitle, {
               scrollTrigger: {
                  trigger: listRotatorTitle,
                  start: function () {
                     const startPin = 0;
                     return 'top +=' + startPin;
                  },
                  end: function () {
                     const endPin = window.innerHeight * 2.5;
                     return '+=' + endPin;
                  },
                  pin: true,
                  scrub: true,
                  pinSpacing: false,
               },
            });

            gsap.to(listRotatorPin, {
               scrollTrigger: {
                  trigger: listRotatorPin,
                  start: function () {
                     const startPin = 0;
                     return 'top +=' + startPin;
                  },
                  end: function () {
                     const endPin = window.innerHeight * 6;
                     return '+=' + endPin;
                  },
                  pin: true,
                  scrub: true,
                  pinSpacing: false,
               },
            });

            gsap.to(listRotator, {
               scrollTrigger: {
                  trigger: listRotatorWrapper,
                  start: function () {
                     const startPin = window.innerHeight * 0.8;
                     return 'top +=' + startPin;
                  },
                  end: function () {
                     const endPin = window.innerHeight * 5.5;
                     return '+=' + endPin;
                  },
                  scrub: true,
               },
               rotationX: 285,
            });
         }
      });

      // Clipped Image
      gsap.utils.toArray('.clipped-image-wrapper').forEach((clippedImageWrapper) => {
         const clippedImagePin = clippedImageWrapper.querySelector('.clipped-image-pin');
         const clippedImage = clippedImageWrapper.querySelector('.clipped-image');
         const clippedImageGradient = clippedImageWrapper.querySelector('.clipped-image-gradient');
         const clippedImageContent = clippedImageWrapper.querySelector('.clipped-image-content');

         gsap.set(clippedImageContent, {
            paddingTop: window.innerHeight / 2 + clippedImageContent.offsetHeight,
         });

         gsap.set(clippedImageGradient, {
            backgroundColor: clippedImageGradient
               .closest('.content-row ')
               .getAttribute('data-bgcolor'),
         });

         function setClippedImageWrapperProperties() {
            gsap.set(clippedImageContent, { paddingTop: '' });
            gsap.set(clippedImageGradient, { height: window.innerHeight * 0.3 });
            gsap.set(clippedImage, { height: window.innerHeight });
            gsap.set(clippedImageContent, {
               paddingTop: window.innerHeight / 2 + clippedImageContent.offsetHeight,
            });
            gsap.set(clippedImageWrapper, {
               height: window.innerHeight + clippedImageContent.offsetHeight,
            });
         }

         imagesLoaded('body', function () {
            setClippedImageWrapperProperties();
         });

         window.addEventListener('resize', setClippedImageWrapperProperties);

         gsap.to(clippedImageGradient, {
            scrollTrigger: {
               trigger: clippedImagePin,
               start: function () {
                  const startPin = 0;
                  return 'top +=' + startPin;
               },
               end: function () {
                  const endPin = clippedImageContent.offsetHeight;
                  return '+=' + endPin;
               },
               scrub: true,
            },
            opacity: 1,
            y: 1,
         });

         var clippedImageAnimation = gsap.to(clippedImage, {
            clipPath: 'inset(0% 0% 0%)',
            scale: 1,
            duration: 1,
            ease: 'Linear.easeNone',
         });

         var clippedImageScene = ScrollTrigger.create({
            trigger: clippedImagePin,
            start: function () {
               const startPin = 0;
               return 'top +=' + startPin;
            },
            end: function () {
               const endPin = clippedImageContent.offsetHeight;
               return '+=' + endPin;
            },
            animation: clippedImageAnimation,
            scrub: 1,
            pin: true,
            pinSpacing: false,
         });
      });

      // Horizontal Gallery
      const panelsSections = gsap.utils.toArray('.panels');
      for (var i = 0; i < panelsSections.length; i++) {
         thePanelsSection = panelsSections[i];
         const panels = gsap.utils.toArray('.panels-container .panel', thePanelsSection);
         const panelsImgs = gsap.utils.toArray('.panels-container .panel img', thePanelsSection);
         const panelsContainer = thePanelsSection.querySelector('.panels-container');
         const widthRatio = thePanelsSection.dataset.widthratio;

         gsap.set([panelsContainer, panels], { height: window.innerHeight * 0.6 });
         gsap.set(panels, { width: window.innerHeight * widthRatio });

         var totalPanelsWidth = 0;
         panels.forEach(function (panel) {
            totalPanelsWidth += $(panel).outerWidth(true);
         });
         gsap.set(panelsContainer, { width: totalPanelsWidth });

         gsap.set(thePanelsSection, {
            height: panelsContainer.offsetWidth - innerWidth + panelsContainer.offsetHeight,
         });

         gsap.to(panels, {
            x: -totalPanelsWidth + innerWidth,
            ease: 'none',
            scrollTrigger: {
               trigger: panelsContainer,
               pin: true,
               start: function () {
                  const startPin = (window.innerHeight - panelsContainer.offsetHeight) / 2;
                  return 'top +=' + startPin;
               },
               end: function () {
                  const endPin = panelsContainer.offsetWidth - innerWidth;
                  return '+=' + endPin;
               },
               scrub: 1,
            },
         });
      }

      // Slowed Pin Section
      gsap.utils.toArray('.slowed-pin').forEach((slowedPin) => {
         const slowedText = slowedPin.querySelector('.slowed-text');
         const slowedTextWrapper = slowedPin.querySelector('.slowed-text-wrapper');
         const slowedImagesWrapper = slowedPin.querySelector('.slowed-images');
         const slowedImages = slowedPin.querySelectorAll('.slowed-image img');

         gsap.to(slowedText, {
            scrollTrigger: {
               trigger: slowedText,
               scrub: true,
               pin: true,
               start: 'top top',
               end: function () {
                  const durationHeight = slowedImagesWrapper.offsetHeight - window.innerHeight;
                  return '+=' + durationHeight;
               },
            },
            y: window.innerHeight - slowedText.offsetHeight,
         });

         gsap.from(slowedTextWrapper, {
            scrollTrigger: {
               trigger: slowedText,
               scrub: true,
               start: 'top top',
               end: function () {
                  const durationHeight = slowedImagesWrapper.offsetHeight - window.innerHeight;
                  return '+=' + durationHeight;
               },
            },
            y: 100,
         });

         slowedImages.forEach((sImage) => {
            gsap.to(sImage, {
               scrollTrigger: {
                  trigger: sImage,
                  scrub: true,
                  start: 'top 100%',
               },
               scale: 1,
               y: 0,
            });
         });
      });

      imagesLoaded('body', function () {
         // Pinned Gallery
         gsap.utils.toArray('.pinned-gallery').forEach((pinnedGallery) => {
            if (pinnedGallery && pinnedGallery.classList.contains('random-img-ratation')) {
               const rotatedImages = pinnedGallery.querySelectorAll(
                  '.pinned-image:not(:first-child):not(:last-child)'
               );
               gsap.utils.toArray(rotatedImages).forEach((pImage, i, arr) => {
                  let rotation = i % 2 === 0 ? gsap.utils.random(-4, 0) : gsap.utils.random(0, 4);
                  gsap.set(pImage.querySelector('img'), { rotation: rotation });
               });
            }

            const pinnedImages = pinnedGallery.querySelectorAll('.pinned-image');

            pinnedImages.forEach((pImage, i, arr) => {
               if (i < arr.length - 1) {
                  const durationMultiplier = arr.length - i - 1;

                  ScrollTrigger.create({
                     trigger: pImage,
                     start: function () {
                        const centerPin =
                           (window.innerHeight - pImage.querySelector('img').offsetHeight) / 2;
                        return 'top +=' + centerPin;
                     },
                     end: function () {
                        const durationHeight = pImage.offsetHeight * durationMultiplier;
                        return '+=' + durationHeight;
                     },
                     pin: true,
                     pinSpacing: false,
                     scrub: true,
                     animation: gsap.to(pImage.querySelector('img'), {
                        scale: 0.95,
                        opacity: 1,
                        zIndex: 0,
                        duration: 1,
                        ease: Linear.easeNone,
                     }),
                  });
               }
            });
         });

         // Pinned Sections
         if (window.innerWidth > 479) {
            var pinnedSection = gsap.utils.toArray('.pinned-element');
            pinnedSection.forEach(function (pinElement) {
               var parentNode = pinElement.parentNode;
               var scrollingElement = parentNode.querySelector('.scrolling-element');

               var pinnedScene = ScrollTrigger.create({
                  trigger: pinElement,
                  //start: "top top-=-50px",
                  start: function () {
                     const startPin = (window.innerHeight - pinElement.offsetHeight) / 2;
                     return 'top +=' + startPin;
                  },
                  end: () => `+=${scrollingElement.offsetHeight - pinElement.offsetHeight}`,
                  pin: pinElement,
               });
            });
         }

         // Vertical Parallax Columns
         if (window.innerWidth > 767) {
            gsap.utils.toArray('.vertical-parallax').forEach((parallaxElement) => {
               var startMovement = -(
                  parallaxElement.offsetHeight * parallaxElement.dataset.startparallax
               );
               var endMovement = -(
                  parallaxElement.offsetHeight * parallaxElement.dataset.endparallax
               );
               gsap.fromTo(
                  parallaxElement,
                  { y: -startMovement },
                  {
                     y: endMovement,
                     ease: 'none',
                     scrollTrigger: {
                        trigger: parallaxElement,
                        scrub: 0.5,
                     },
                  }
               );
            });
         }

         // Moving Gallery
         gsap.utils.toArray('.moving-gallery').forEach((section, index) => {
            const w = section.querySelector('.wrapper-gallery');
            const [x, xEnd] =
               index % 2
                  ? [section.offsetWidth - w.scrollWidth, 0]
                  : [0, section.offsetWidth - w.scrollWidth];
            gsap.fromTo(
               w,
               { x },
               {
                  x: xEnd,
                  scrollTrigger: {
                     trigger: section,
                     scrub: 0.5,
                  },
               }
            );
         });

         // Reveal Gallery
         gsap.utils.toArray('.reveal-gallery').forEach((revealGallery) => {
            const imgFixed = revealGallery.querySelector('.reveal-img-fixed');
            const imgRotateLeft = revealGallery.querySelector('.reveal-img:first-child');
            const imgRotateRight = revealGallery.querySelector('.reveal-img:last-child');

            gsap.set(imgRotateLeft, { left: '50%', transform: 'translateX(-50%)' });
            gsap.set(imgRotateRight, { left: '50%', transform: 'translateX(-50%)' });

            function setImgProperties() {
               gsap.set(imgRotateLeft, {
                  x: -imgFixed.offsetWidth * 0.35,
                  height: revealGallery.offsetHeight,
                  scale: 0.9,
               });
               gsap.set(imgRotateRight, {
                  x: imgFixed.offsetWidth * 0.35,
                  height: revealGallery.offsetHeight,
                  scale: 0.9,
               });
            }
            setImgProperties();

            window.addEventListener('resize', setImgProperties);

            gsap.to(imgRotateLeft, {
               scrollTrigger: {
                  trigger: revealGallery,
                  scrub: true,
                  start: 'top 100%',
                  end: function () {
                     const durationHeight = revealGallery.offsetHeight + window.innerHeight;
                     return '+=' + durationHeight;
                  },
                  invalidateOnRefresh: true,
               },
               x: function () {
                  return -imgFixed.offsetWidth * 0.65;
               },
               rotation: -12,
            });

            gsap.to(imgRotateRight, {
               scrollTrigger: {
                  trigger: revealGallery,
                  scrub: true,
                  start: 'top 100%',
                  end: function () {
                     const durationHeight = revealGallery.offsetHeight + window.innerHeight;
                     return '+=' + durationHeight;
                  },
                  invalidateOnRefresh: true,
               },
               x: function () {
                  return imgFixed.offsetWidth * 0.65;
               },
               rotation: 12,
            });
         });

         // Roling Text
         let direction = 1;
         const marqueeFw = roll('.marquee-text.fw', { duration: 20 });
         const marqueeBw = roll('.marquee-text.bw', { duration: 20 }, true);

         scroll = ScrollTrigger.create({
            onUpdate(self) {
               if (self.direction !== direction) {
                  direction *= -1;
                  gsap.to([marqueeFw, marqueeBw], {
                     timeScale: direction,
                     overwrite: true,
                  });
               }
            },
         });

         function roll(targets, vars, reverse) {
            const tl = gsap.timeline({
               repeat: -1,
               onReverseComplete() {
                  this.totalTime(this.rawTime() + this.duration() * 10);
               },
            });
            vars = vars || {};
            vars.ease || (vars.ease = 'none');
            gsap.utils.toArray(targets).forEach((el) => {
               let clone = el.cloneNode(true);
               el.parentNode.appendChild(clone);
               gsap.set(clone, {
                  position: 'absolute',
                  top: el.offsetTop,
                  left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
               });
               gsap.to(clone.querySelectorAll('span'), {
                  duration: 0.7,
                  y: 0,
                  opacity: 1,
                  delay: 0.5,
                  ease: Power2.easeOut,
               });
               tl.to([el, clone], { xPercent: reverse ? 100 : -100, ...vars }, 0);
            });
            return tl;
         }
      });

      // Hero Section Effects
      if ($('body').hasClass('hero-below-caption')) {
         // Create Scripts
      } else {
         if ($('#hero').hasClass('has-image')) {
            const heroCaption = document.querySelector('#hero.has-image #hero-caption');
            const heroImage = document.querySelector('#hero-image-wrapper');

            function setheroImageProperties() {
               gsap.set(heroCaption, { height: window.innerHeight });
               gsap.set(heroImage, { height: window.innerHeight });
            }

            setheroImageProperties();

            var heroImagePin = gsap.to('#hero-image-wrapper', {
               scrollTrigger: {
                  trigger: $('#hero.has-image'),
                  start: 'top top',
                  end: function () {
                     const durationHeight = $('#hero.has-image').outerHeight() - window.innerHeight;
                     return '+=' + durationHeight;
                  },
                  pin: '#hero-background-layer',
               },
            });

            window.addEventListener('resize', setheroImageProperties);

            // Animación inicial con desaceleración muy gradual
            gsap.fromTo(
               '.parallax-scroll-image #hero-bg-image',
               { backgroundPosition: '50% 50%' },
               {
                  backgroundPosition: '15% 50%',
                  duration: 1.5,
                  ease: 'power4.out', // Easing con desaceleración más gradual
                  onComplete: startScrollAnimation, // Inicia la animación de scroll una vez completa esta animación
               }
            );

            // Función que inicia la animación de scroll
            function startScrollAnimation() {
               gsap.to('.parallax-scroll-image #hero-bg-image', {
                  duration: 1,
                  backgroundPosition: '15% 50%',
                  ease: Linear.easeNone,
                  scrollTrigger: {
                     trigger: '#hero',
                     start: 'top top',
                     end: () => `+=${$('#hero').outerHeight() - window.innerHeight}`,
                     scrub: true,
                  },
               });
            }

            var heroFooterParallax = gsap.to('#hero-footer', {
               duration: 1,
               yPercent: 15,
               opacity: 0,
               ease: Linear.easeNone,
               scrollTrigger: {
                  trigger: '#hero-description',
                  start: 'top 50%',
                  end: function () {
                     var durationHeight = $('#hero-description').outerHeight() * 2;
                     return '+=' + durationHeight;
                  },
                  scrub: true,
               },
            });
         }

         var heroCaptionParallax = gsap.to('#hero-caption.parallax-scroll-caption', {
            duration: 1,
            yPercent: 5,
            opacity: 0.5,
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: '#hero',
               start: 'top top',
               end: () => `+=${$('#hero').outerHeight()}`,
               scrub: true,
            },
         });
      }

      // Page and Project Navigation

      if ($('body').hasClass('hero-below-caption')) {
         // Create Scripts
      } else {
         var NextheroPin = gsap.to('.next-project-wrap', {
            duration: 1,
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: '.next-project-wrap',
               start: 'top top',
               end: '+=100%',
               pin: true,
               scrub: true,
            },
         });

         //  var nextProjectImageParallax = gsap.to('.next-project-image', {
         //     duration: 1,
         //     clipPath: 'inset(0 0%)',
         //     scale: 1.05,
         //     ease: Linear.easeNone,
         //     scrollTrigger: {
         //        trigger: '#project-nav',
         //        start: 'top 0%',
         //        end: '+=100%',
         //        scrub: true,
         //        onUpdate: (self) => {
         //           // Selecciona todos los elementos de .next-project-image-wrapper y aplica las clases o estilos
         //           document.querySelectorAll('.next-project-wrap').forEach((element) => {
         //              // Verifica si el scroll está al principio
         //              if (self.progress === 0) {
         //                 // Añade la clase 'bg-no-next'
         //                 element.classList.add('bg-no-next');
         //              } else {
         //                 // Remueve la clase 'bg-no-next' si no está al principio
         //                 element.classList.remove('bg-no-next');
         //              }
         //           });

         //           // Añade o elimina la clase 'alpha' con un retraso de 0.5s
         //           document.querySelectorAll('.next-project-image-bg').forEach((element) => {
         //              // Si el scroll está al principio, agrega la clase con un delay
         //              if (self.progress != 0) {
         //                 if (!element.classList.contains('alpha')) {
         //                    // Evita duplicados creando un timeout
         //                    element.alphaTimeout = setTimeout(() => {
         //                       element.classList.remove('alpha');
         //                    }, 5000);
         //                 }
         //              } else {
         //                 // Remueve la clase 'alpha' inmediatamente y limpia el timeout
         //                 clearTimeout(element.alphaTimeout);
         //                 element.classList.add('alpha');
         //              }
         //           });
         //        },
         //     },
         //  });

         var nextAllWorks = gsap.to('.all-works', {
            opacity: 0,
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: '#project-nav',
               start: 'top 0%',
               end: '+=50%',
               scrub: true,
            },
         });

         var nextProjectProgress = gsap.to('.next-hero-progress span', {
            duration: 1,
            width: '100%',
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: '#project-nav',
               start: 'top top',
               end: '+=100%',
               scrub: true,
            },
         });

         var startCount = 0;
         var num = { var: startCount };
         var numbers = document.querySelector('.next-hero-counter span');
         if (numbers) {
            var nextProjectCounter = gsap
               .timeline({
                  scrollTrigger: {
                     trigger: '#project-nav',
                     start: 'top top',
                     end: '+=100%',
                     scrub: true,
                  },
               })
               .to(num, {
                  var: 100,
                  duration: 1,
                  ease: Linear.easeNone,
                  onUpdate: changeNumber,
               });
         }

         function changeNumber() {
            numbers.innerHTML = num.var.toFixed();
         }

         var nextPageCaptionParallax = gsap.to('.page-nav-caption', {
            duration: 1,
            top: '0',
            scale: 1,
            opacity: 1,
            ease: Linear.easeNone,
            scrollTrigger: {
               trigger: '#page-nav',
               start: 'top 100%',
               end: () => `+=${$('#page-nav').outerHeight() + $('footer').outerHeight()}`,
               scrub: true,
            },
         });
      }

      // Elements Animation

      var contentVideo = gsap.utils.toArray('.content-video-wrapper');
      contentVideo.forEach(function (videoPlay) {
         var video = videoPlay.querySelector('video');

         var videoScene = ScrollTrigger.create({
            trigger: videoPlay,
            start: 'top 100%',
            end: () => `+=${videoPlay.offsetHeight + window.innerHeight * 2}`,
            onEnter: function () {
               video.play();
            },
            onLeave: function () {
               video.pause();
            },
            onEnterBack: function () {
               video.play();
            },
            onLeaveBack: function () {
               video.pause();
            },
         });
      });

      var hasParallax = gsap.utils.toArray('.has-parallax');
      hasParallax.forEach(function (hParallax) {
         var bgImage = hParallax.querySelector('img');
         var bgVideo = hParallax.querySelector('video');
         var parallax = gsap.fromTo(
            [bgImage, bgVideo],
            { y: '-20%', scale: 1.15 },
            { y: '20%', scale: 1, duration: 1, ease: Linear.easeNone }
         );
         var parallaxScene = ScrollTrigger.create({
            trigger: hParallax,
            start: 'top 100%',
            end: () => `+=${hParallax.offsetHeight + window.innerHeight}`,
            animation: parallax,
            scrub: true,
         });
      });

      var hasAnimation = gsap.utils.toArray('.has-animation');
      hasAnimation.forEach(function (hAnimation) {
         var delayValue = parseInt(hAnimation.getAttribute('data-delay')) || 0;
         gsap.to(hAnimation, {
            scrollTrigger: {
               trigger: hAnimation,
               start: 'top 85%',
               onEnter: function () {
                  hAnimation.classList.add('animated');
               },
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: Power2.easeOut,
            delay: delayValue / 1000,
         });
      });

      $('.has-cover').css('background-color', function () {
         return $(this).parents('.content-row').data('bgcolor');
      });

      $('.has-mask').each(function () {
         var words = $(this).text().split(' ');
         var total = words.length;
         $(this).empty();
         for (index = 0; index < total; index++) {
            $(this).append($('<span /> ').text(words[index]));
         }
      });

      $('.has-mask span').each(function () {
         var words = $(this).text().split(' ');
         var total = words.length;
         $(this).empty();
         for (index = 0; index < total; index++) {
            $(this).append($('<span /> ').text(words[index]));
         }
      });

      var hasMask = gsap.utils.toArray('.has-mask');
      hasMask.forEach(function (hMask) {
         var delayValue = parseInt(hMask.getAttribute('data-delay')) || 0;
         var spanMask = hMask.querySelectorAll('span > span');
         gsap.to(spanMask, {
            scrollTrigger: {
               trigger: hMask,
               start: 'top 85%',
               onEnter: function () {
                  hMask.classList.add('animated');
               },
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: Power2.easeOut,
            delay: delayValue / 1000,
         });
      });

      $('.has-mask-fill').each(function () {
         var words = $(this).text();
         var total = words;
         $(this).empty();
         $(this).append($('<span /> ').text(words));
      });

      $('.has-mask-fill.block-title').each(function () {
         var words = $(this).text().split(' ');
         var total = words.length;
         $(this).empty();
         for (index = 0; index < total; index++) {
            $(this).append($('<span /> ').text(words[index]));
         }
      });

      var hasMaskFill = gsap.utils.toArray('.has-mask-fill');
      hasMaskFill.forEach(function (hMaskFill) {
         var spanFillMask = hMaskFill.querySelectorAll('span');
         gsap.to(spanFillMask, {
            scrollTrigger: {
               trigger: hMaskFill,
               start: 'top 85%',
               end: () => `+=${hMaskFill.offsetHeight * 2}`,
               scrub: 1,
            },
            duration: 1,
            backgroundSize: '200% 100%',
            stagger: 0.5,
            ease: Linear.easeNone,
         });
      });

      $('.has-opacity').each(function () {
         var words = $(this).text().split(' ');
         var total = words.length;
         $(this).empty();
         for (index = 0; index < total; index++) {
            $(this).append($('<span /> ').text(words[index] + ' '));
         }
      });

      var hasOpacity = gsap.utils.toArray('.has-opacity');
      hasOpacity.forEach(function (hOpacity) {
         var spanOpacity = hOpacity.querySelectorAll('span');
         gsap.to(spanOpacity, {
            scrollTrigger: {
               trigger: hOpacity,
               start: 'top 85%',
               end: () => `+=${hOpacity.offsetHeight}`,
               scrub: 1,
            },
            duration: 1,
            opacity: 1,
            stagger: 0.5,
            ease: Linear.easeNone,
         });
      });

      var counter = gsap.utils.toArray('.number-counter');
      counter.forEach(function (countNumber) {
         gsap.fromTo(
            countNumber,
            { innerText: countNumber.innerText },
            {
               innerText: function () {
                  return Math.floor(parseFloat(countNumber.getAttribute('data-target')));
               },
               duration: 1,
               snap: { innerText: 1 },
               scrollTrigger: {
                  trigger: countNumber,
                  start: 'top 90%',
               },
            }
         );
      });

      var titleMovingForward = gsap.utils.toArray('.title-moving-forward');
      titleMovingForward.forEach(function (movingTitle) {
         var parallax = gsap.to(movingTitle, 1, {
            x: -(movingTitle.offsetWidth - window.innerWidth),
            ease: Linear.easeNone,
         });
         var parallaxScene = ScrollTrigger.create({
            trigger: movingTitle,
            end: () => `+=${movingTitle.offsetHeight + window.innerHeight}`,
            animation: parallax,
            scrub: 2,
         });
      });

      var titleMovingBackward = gsap.utils.toArray('.title-moving-backward');
      titleMovingBackward.forEach(function (movingTitle) {
         gsap.set(movingTitle, {
            x: -(movingTitle.offsetWidth - window.innerWidth),
         });
         var parallax = gsap.to(movingTitle, 1, { x: 0, ease: Linear.easeNone });
         var parallaxScene = ScrollTrigger.create({
            trigger: movingTitle,
            end: () => `+=${movingTitle.offsetHeight + window.innerHeight}`,
            animation: parallax,
            scrub: 2,
         });
      });

      // Content Row Options

      if ($('.content-row').hasClass('light-section')) {
         $('.light-section').each(function (i) {
            $(this).wrap(
               "<div class='light-section-wrapper'><div class='light-section-container content-max-width'></div></div>"
            );
            $('body')
               .find('.light-section-wrapper')
               .each(function (i) {
                  $(this).css('background-color', function () {
                     return $(this).children().children().data('bgcolor');
                  });
               });
         });
      }

      if ($('.content-row').hasClass('dark-section')) {
         $('.dark-section').each(function (i) {
            $(this).wrap(
               "<div class='dark-section-wrapper'><div class='dark-section-container content-max-width'></div></div>"
            );
            $('body')
               .find('.dark-section-wrapper')
               .each(function (i) {
                  $(this).css('background-color', function () {
                     return $(this).children().children().data('bgcolor');
                  });
               });
         });
      }

      $('.content-row.has-clip-path').parent().parent().addClass('clip-effects');

      var hasClipPath = gsap.utils.toArray('.has-clip-path');
      hasClipPath.forEach(function (hClipPath) {
         var clipPath = gsap.to(hClipPath.closest('.clip-effects'), {
            clipPath: 'inset(0% 0%)',
            duration: 1,
            ease: 'Linear.easeNone',
         });

         var clipPathScene = ScrollTrigger.create({
            trigger: hClipPath,
            start: 'top 100%',
            end: `+=${window.innerHeight / 3}`,
            animation: clipPath,
            scrub: 1,
         });
      });

      if ($('.change-header-color').length > 0) {
         imagesLoaded('body', function () {
            setTimeout(function () {
               var changeHeaderColor = gsap.utils.toArray('.change-header-color');
               changeHeaderColor.forEach(function (changeHeaderElement) {
                  var pageHeader = document.querySelector('header');
                  gsap.to(changeHeaderElement, {
                     scrollTrigger: {
                        trigger: changeHeaderElement,
                        start: 'top 8%',
                        end: () => `+=${changeHeaderElement.offsetHeight}`,
                        //markers: true,
                        onEnter: function () {
                           pageHeader.classList.add('white-header');
                        },
                        onEnterBack: function () {
                           pageHeader.classList.add('white-header');
                        },
                        onLeave: function () {
                           pageHeader.classList.remove('white-header');
                        },
                        onLeaveBack: function () {
                           pageHeader.classList.remove('white-header');
                        },
                     },
                  });
               });
            }, 100);
         });
      }

      if ($('#page-content').hasClass('light-content')) {
         if ($('#project-nav').hasClass('change-header')) {
            imagesLoaded('body', function () {
               setTimeout(function () {
                  var pageNav = document.querySelector('#project-nav.change-header');
                  if (pageNav) {
                     var pageContent = document.querySelector('#page-content');
                     var nextPageCaptionParallax = gsap.to('.page-nav-caption', {
                        scrollTrigger: {
                           trigger: pageNav,
                           start: 'top 8%',
                           end: () => `+=${pageNav.offsetHeight}`,
                           onEnter: function () {
                              pageContent.classList.remove('light-content');
                           },
                           onEnterBack: function () {
                              pageContent.classList.remove('light-content');
                           },
                           onLeave: function () {
                              pageContent.classList.add('light-content');
                           },
                           onLeaveBack: function () {
                              pageContent.classList.add('light-content');
                           },
                        },
                     });
                  }
               }, 100);
            });
         }
      }

      // if ($ ('#page-content').hasClass ('dark-content')) {
      //   if ($ ('#project-nav').hasClass ('change-header')) {
      //     imagesLoaded ('body', function () {
      //       setTimeout (function () {
      //         var pageNav = document.querySelector ('#project-nav');
      //         if (pageNav) {
      //           var pageContent = document.querySelector ('#page-content');
      //           var nextPageCaptionParallax = gsap.to ('.page-nav-caption', {
      //             scrollTrigger: {
      //               trigger: pageNav,
      //               start: 'top 8%',
      //               end: () => `+=${pageNav.offsetHeight}`,
      //               onEnter: function () {
      //                 pageContent.classList.add ('light-content');
      //               },
      //               onEnterBack: function () {
      //                 pageContent.classList.add ('light-content');
      //               },
      //               onLeave: function () {
      //                 pageContent.classList.remove ('light-content');
      //               },
      //               onLeaveBack: function () {
      //                 pageContent.classList.remove ('light-content');
      //               },
      //             },
      //           });
      //         }
      //       }, 100);
      //     });
      //   }
      // }

      // **Añadido: Observador de mutaciones para .page-is-changing con manejo de clases adicionales**
      (function () {
         const body = document.body;
         const targetNode = body;
         const config = { attributes: true, attributeFilter: ['class'] };

         let isChanging = false;
         let addDisableTimeout = null;
         let removeDisableTimeout = null;

         const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
               if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                  if ($(body).hasClass('page-is-changing')) {
                     isChanging = true;

                     // Limpiar timeouts si se vuelve a agregar la clase antes de removerla
                     if (addDisableTimeout) {
                        clearTimeout(addDisableTimeout);
                        addDisableTimeout = null;
                     }
                     if (removeDisableTimeout) {
                        clearTimeout(removeDisableTimeout);
                        removeDisableTimeout = null;
                     }

                     // Verificar y añadir clases adicionales al <body>
                     if ($('.next-project-image-bg').hasClass('next-black')) {
                        $(body).addClass('next-black-bg');
                     }
                     if ($('.next-project-image-bg').hasClass('next-white')) {
                        $(body).addClass('next-white-bg');
                     }
                  } else if (isChanging) {
                     isChanging = false;

                     // Remover las clases adicionales del <body>
                     $(body).removeClass('next-black-bg next-white-bg');

                     // Añadir la clase .disable después de 0.5 segundos (500 ms)
                     addDisableTimeout = setTimeout(function () {
                        $('.next-project-image-bg').addClass('disable');

                        // Remover la clase .disable después de 2 segundos (2000 ms)
                        removeDisableTimeout = setTimeout(function () {
                           $('.next-project-image-bg').removeClass('disable');
                           removeDisableTimeout = null;
                        }, 1000);

                        addDisableTimeout = null;
                     }, 43);
                  }
               }
            }
         };

         const observer = new MutationObserver(callback);
         observer.observe(targetNode, config);
      })();

      // Reinit All Scrolltrigger After Page Load

      imagesLoaded('body', function () {
         setTimeout(function () {
            ScrollTrigger.refresh();
         }, 1000);
      });
   }; // End Scroll Effects

   /*--------------------------------------------------
Function First Load
---------------------------------------------------*/

   window.FirstLoad = function () {
      $(window).on('popstate', function () {
         location.reload(true);
      });

      if ($('#page-content').hasClass('light-content')) {
         $('nav').css('background-color', function () {
            return $('header').data('menucolor');
         });

         gsap.to('main', {
            duration: 0.5,
            backgroundColor: document.querySelector('#page-content').getAttribute('data-bgcolor'),
            ease: Power2.easeInOut,
         });

         $('#magic-cursor').addClass('light-content');
         if ($('#hero').length > 0) {
            if ($('#hero').hasClass('has-image')) {
               $('header').css('background-color', 'transparent');
            } else {
               if ($('header').hasClass('fullscreen-menu')) {
                  $('header').css('background-color', 'transparent');
               } else {
                  if ($('#blog').length > 0) {
                     $('header').css('background-color', '#171717');
                  }
                  if ($('#post').length > 0) {
                     $('header').css('background-color', '#171717');
                  }
               }
            }
         } else {
            $('header').css('background-color', 'transparent');
         }
      } else {
         $('nav').css('background-color', function () {
            return $('header').data('menucolor');
         });

         gsap.to('main', {
            duration: 0.5,
            backgroundColor: document.querySelector('#page-content').getAttribute('data-bgcolor'),
            ease: Power2.easeInOut,
         });

         $('#magic-cursor').removeClass('light-content');
         if ($('#hero').length > 0) {
            if ($('#hero').hasClass('has-image')) {
               $('header').css('background-color', 'transparent');
            } else {
               if ($('header').hasClass('fullscreen-menu')) {
                  $('header').css('background-color', 'transparent');
               } else {
                  if ($('#blog').length > 0) {
                     $('header').css('background-color', '#fff');
                  }
                  if ($('#post').length > 0) {
                     $('header').css('background-color', '#fff');
                  }
               }
            }
         } else {
            $('header').css('background-color', 'transparent');
         }
      }

      $('.video-cover').each(function () {
         var image = $(this).data('src');
         $(this).css({ 'background-image': 'url(' + image + ')' });
      });

      //Load Default Page
      $('a.ajax-link').on('click', function () {
         $('body').addClass('show-loader');
         //  setTimeout(function () {
         //     $('#header-container')
         //        .removeClass('light-content-header')
         //        .removeClass('dark-content-header');
         //  }, 50);
         $('.flexnav').removeClass('flexnav-show');
         $('#menu-burger').removeClass('open');

         gsap.to('nav', {
            duration: 0.3,
            backgroundColor: document.querySelector('#page-content').getAttribute('data-bgcolor'),
         });

         $('header').removeClass('white-header');
         $('#app').remove();
         setTimeout(function () {
            $('#canvas-slider.active').remove();
         }, 300);
         $('.temporary-hero').remove();

         gsap.to($('.fullscreen-menu .menu-timeline'), {
            duration: 0.3,
            y: -30,
            opacity: 0,
            stagger: 0.03,
            ease: Power2.easeIn,
         });

         gsap.to('#ball', {
            duration: 0.3,
            borderWidth: '4px',
            scale: 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            opacity: 1,
         });
         gsap.to(
            $(
               '#main, #hero-image-wrapper, #project-nav, .next-project-image, #app, #canvas-slider, #showcase-slider-webgl-holder, .showcase-pagination-wrap, #quickmenu-scroll, #blog, .next-project-image-wrapper'
            ),
            { duration: 0.3, opacity: 0, delay: 0, ease: Power0.ease }
         );
         gsap.to($('#footer-container, .header-middle'), {
            duration: 0.3,
            opacity: 0,
            ease: Power0.ease,
         });
         gsap.to('#show-filters, #counter-wrap', { duration: 0.2, opacity: 0 });
      });

      //Load Page From Menu

      $('nav .ajax-link').on('click', function () {
         $(this).parents('.menu-timeline').addClass('hover');
         $(this).parents('.item-with-ul').addClass('hover');
         gsap.set($(this).find('span'), { yPercent: 0 });
         $('header').removeClass('white-header');
         $('#app').remove();
         $('.big-title-caption').remove();
      });

      $('.flexnav li.menu-timeline .before-span').each(function () {
         var mainMenuList = $(this);
         var menuListSpans = mainMenuList.find('span');

         var spanCube = $('<div>').addClass('span-cube');

         menuListSpans.each(function () {
            var menuListSpan = $(this);
            spanCube.append(menuListSpan.clone());
            spanCube.append(menuListSpan.clone());
            spanCube.append(menuListSpan.clone());
         });

         mainMenuList.empty().append(spanCube);
      });

      $('#burger-wrapper, .menu .button-text').on('click', function () {
         $('#menu-burger, nav').toggleClass('open');
         setTimeout(function () {
            if ($('#menu-burger').hasClass('open')) {
               gsap.to('nav', { duration: 0.3, opacity: 1, ease: Power2.easeInOut });

               //  $('header').addClass('over-sidebar').addClass('over-white-section');
               //  if (!$('#page-content').hasClass('light-content')) {
               //     $('#magic-cursor').addClass('light-content');
               //  }
               //  if ($('header').hasClass('invert-header')) {
               //     $('#header-container').addClass('light-content-header');
               //  } else {
               //     $('#header-container').addClass('dark-content-header');
               //  }
               gsap.set($('nav ul ul li'), { y: 0, opacity: 1 });
               //Fade In Navigation Lists
               gsap.set($('.menu-timeline .before-span'), { y: 160, opacity: 0 });
               gsap.to($('.menu-timeline .before-span'), {
                  duration: 0.7,
                  y: 0,
                  opacity: 1,
                  delay: 0.4,
                  stagger: 0.1,
                  ease: Power2.easeOut,
               });

               $('.menu-timeline > .touch-button').click(function (e, bIndirect) {
                  if (bIndirect == true) {
                     return;
                  }
                  let currentItem = $(this);
                  $('.menu-timeline > .touch-button.active').each(function () {
                     if (currentItem.get(0) !== $(this).get(0)) {
                        $(this).trigger('click', true);
                     }
                  });
               });
            } else {
               gsap.to('nav', {
                  duration: 0.3,
                  opacity: 0,
                  delay: 0.6,
                  ease: Power2.easeInOut,
               });

               //Fade Out Navigation Lists
               gsap.to($('.menu-timeline .before-span'), {
                  duration: 0.5,
                  y: -200,
                  opacity: 0,
                  delay: 0,
                  stagger: 0.05,
                  ease: Power2.easeIn,
               });
               gsap.to($('nav ul ul li'), {
                  duration: 0.5,
                  y: -120,
                  opacity: 0,
                  delay: 0,
                  stagger: 0.03,
                  ease: Power2.easeIn,
               });

               if (!$('#page-content').hasClass('light-content')) {
                  setTimeout(function () {
                     $('#magic-cursor').removeClass('light-content');
                  }, 500);
               }
               //  if ($('header').hasClass('invert-header')) {
               //     setTimeout(function () {
               //        $('#header-container').removeClass('light-content-header');
               //     }, 500);
               //  } else {
               //     setTimeout(function () {
               //        $('#header-container').removeClass('dark-content-header');
               //     }, 500);
               //  }
               setTimeout(function () {
                  $('.touch-button.active').trigger('click');
                  $('header').removeClass('over-sidebar');
                  setTimeout(function () {
                     $('header').removeClass('over-white-section');
                  }, 350);
               }, 500);
            }
         }, 20);
      });

      $('.wpcf7-form-control-wrap').each(function () {
         if ($(this).has('label').length <= 0) {
            $(this).append('<label class="input_label"></label>');
         }
      });
   }; // End First Load

   /*--------------------------------------------------
Function FitThumbScreen WEBGL
---------------------------------------------------*/

   window.FitThumbScreenWEBGL = function () {
      if (!$('body').hasClass('disable-ajaxload')) {
         if ($('#itemsWrapper').hasClass('webgl-fitthumbs')) {
            if ($('#itemsWrapper').length > 0) {
               function createDemoEffect(options) {
                  const transitionEffect = new GridToFullscreenEffect(
                     document.getElementById('app'),
                     document.getElementById('itemsWrapper'),
                     Object.assign(
                        {
                           scrollContainer: window,
                           onToFullscreenStart: ({ index }) => {},
                           onToFullscreenFinish: ({ index }) => {},
                           onToGridStart: ({ index }) => {},
                           onToGridFinish: ({ index, lastIndex }) => {},
                        },
                        options
                     )
                  );

                  return transitionEffect;
               }

               let currentIndex;
               const itemsWrapper = document.getElementById('itemsWrapper');
               const thumbs = [
                  ...itemsWrapper.querySelectorAll(
                     'img.grid__item-img:not(.grid__item-img--large)'
                  ),
               ];

               let transitionEffectDuration = 0.0;
               let transitionEffect = null;

               if ($('.webgl-fitthumbs').hasClass('fx-one')) {
                  //FX 01 ////////////////////////////// .fx-one

                  transitionEffectDuration = 2.2;
                  transitionEffect = createDemoEffect({
                     timing: {
                        type: 'sameEnd',
                        sections: 0,
                        duration: transitionEffectDuration,
                     },
                     activation: {
                        type: 'mouse',
                     },
                     transformation: {
                        type: 'wavy',
                        props: { seed: '5000', frequency: 1, amplitude: 0 },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Cubic.easeInOut,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-two')) {
                  //FX 02 ////////////////////////////// .fx-two

                  transitionEffectDuration = 1.8;
                  transitionEffect = createDemoEffect({
                     activation: { type: 'mouse' },
                     timing: {
                        duration: transitionEffectDuration,
                     },
                     transformation: {
                        type: 'simplex',
                        props: {
                           seed: '8000',
                           frequencyX: 0.2,
                           frequencyY: 0.2,
                           amplitudeX: 0.3,
                           amplitudeY: 0.3,
                        },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Power1.easeInOut,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-three')) {
                  //FX 03 ////////////////////////////// .fx-three

                  transitionEffectDuration = 1.8;
                  transitionEffect = createDemoEffect({
                     activation: { type: 'closestCorner' },
                     timing: {
                        duration: transitionEffectDuration,
                     },
                     transformation: {
                        type: 'flipX',
                     },
                     flipBeizerControls: {
                        c0: {
                           x: 0.4,
                           y: -0.8,
                        },
                        c1: {
                           x: 0.5,
                           y: 0.9,
                        },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Power1.easeInOut,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-four')) {
                  //FX 04 ////////////////////////////// .fx-four

                  transitionEffectDuration = 1.5;
                  transitionEffect = createDemoEffect({
                     activation: { type: 'sinX' },
                     flipX: false,
                     timing: {
                        type: 'sections',
                        sections: 4,
                        duration: transitionEffectDuration,
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Power3.easeIn,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-five')) {
                  //FX 05 ////////////////////////////// .fx-five

                  transitionEffectDuration = 1.8;
                  transitionEffect = createDemoEffect({
                     timing: {
                        type: 'sections',
                        sections: 1,
                        duration: transitionEffectDuration,
                     },
                     activation: {
                        type: 'mouse',
                     },
                     transformation: {
                        type: 'wavy',
                        props: {
                           seed: '8000',
                           frequency: 0.1,
                           amplitude: 1,
                        },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Cubic.easeInOut,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-six')) {
                  //FX 06 ////////////////////////////// .fx-six

                  transitionEffectDuration = 2;
                  transitionEffect = createDemoEffect({
                     activation: { type: 'bottom' },
                     timing: {
                        duration: transitionEffectDuration,
                     },
                     transformation: {
                        type: 'wavy',
                        props: {
                           frequency: 1,
                           amplitude: 0,
                        },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Power2.easeInOut,
                     },
                  });
               } else if ($('.webgl-fitthumbs').hasClass('fx-seven')) {
                  //FX 07 ////////////////////////////// .fx-seven

                  transitionEffectDuration = 2;
                  transitionEffect = createDemoEffect({
                     activation: { type: 'none' },
                     timing: {
                        duration: transitionEffectDuration,
                     },
                     transformation: {
                        type: 'none',
                        props: {
                           frequency: 1,
                           amplitude: 0,
                        },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Power2.easeInOut,
                     },
                  });
               } else {
                  //FX 01 ////////////////////////////// .fx-one

                  transitionEffectDuration = 2.2;
                  transitionEffect = createDemoEffect({
                     timing: {
                        type: 'sameEnd',
                        sections: 0,
                        duration: transitionEffectDuration,
                     },
                     activation: {
                        type: 'mouse',
                     },
                     transformation: {
                        type: 'wavy',
                        props: { seed: '5000', frequency: 0.1, amplitude: 1 },
                     },
                     onToFullscreenStart: ({ index }) => {
                        currentIndex = index;
                        thumbs[currentIndex].style.opacity = 1;
                        gsap.to(itemsWrapper, {
                           duration: 0.6,
                           ease: Power1.easeInOut,
                           opacity: 1,
                           delay: 0,
                        });
                        toggleFullview();
                     },
                     onToGridStart: ({ index }) => {
                        gsap.to(itemsWrapper, {
                           duration: 1,
                           ease: Power3.easeInOut,
                           scale: 1,
                           opacity: 1,
                        });
                        toggleFullview();
                     },
                     onToGridFinish: ({ index, lastIndex }) => {
                        thumbs[lastIndex].style.opacity = 1;
                     },
                     easings: {
                        toFullscreen: Cubic.easeInOut,
                     },
                  });
               }

               transitionEffect.init();

               if ($('#itemsWrapperLinks').length > 0) {
                  const itemsCaptions = document.getElementById('itemsWrapperLinks');
                  const thumbsLink = [...itemsCaptions.querySelectorAll('.trigger-item-link')];
                  for (let idxCaption = 0; idxCaption < thumbsLink.length; idxCaption++) {
                     thumbsLink[idxCaption].addEventListener(
                        'click',
                        transitionEffect.createOnMouseDown(idxCaption)
                     );
                  }
               }

               const toggleFullview = () => {
                  if (transitionEffect.isFullscreen) {
                     transitionEffect.toGrid();
                  }
               };

               // Preload all the images in the pageI
               imagesLoaded(document.querySelectorAll('.grid__item-img'), (instance) => {
                  let images = [];
                  for (var i = 0, imageSet = {}; i < instance.elements.length; i++) {
                     let image = {
                        element: instance.elements[i],
                        image: instance.images[i].isLoaded ? instance.images[i].img : null,
                     };
                     if (i % 2 === 0) {
                        imageSet = {};
                        imageSet.small = image;
                     }

                     if (i % 2 === 1) {
                        imageSet.large = image;
                        images.push(imageSet);
                     }
                  }
                  transitionEffect.createTextures(images);
               });
            }

            var $body = $('body');
            $body.on('mousedown', function (evt) {
               $body.on('mouseup mousemove', function handler(evt) {
                  if (evt.type === 'mouseup') {
                     $(
                        '#itemsWrapperLinks .trigger-item-link, #itemsWrapperLinks .trigger-item-link-secondary'
                     ).on('click', function () {
                        let parent_item = $(this).closest('.trigger-item');
                        parent_item.addClass('above');

                        if (!$('#page-content').hasClass('light-content')) {
                           if (!$('.portfolio').hasClass('portfolio-shortcode')) {
                              if (!parent_item.hasClass('change-header')) {
                                 $('#page-content')
                                    .delay(1200)
                                    .queue(function (next) {
                                       $(this).addClass('light-content');
                                       next();
                                    });
                              }
                           } else {
                              if (!parent_item.hasClass('change-header')) {
                                 $('#page-content')
                                    .delay(1200)
                                    .queue(function (next) {
                                       $(this).removeClass('light-content');
                                       next();
                                    });
                              }
                           }
                        } else {
                           if (!$('.portfolio').hasClass('portfolio-shortcode')) {
                              if (parent_item.hasClass('change-header')) {
                                 $('#page-content')
                                    .delay(1200)
                                    .queue(function (next) {
                                       $(this).removeClass('light-content');
                                       next();
                                    });
                              }
                           } else {
                              if (!parent_item.hasClass('change-header')) {
                                 $('#page-content')
                                    .delay(1200)
                                    .queue(function (next) {
                                       $(this).removeClass('light-content');
                                       next();
                                    });
                              }
                           }
                        }

                        $('.nmp-slider .trigger-item').each(function () {
                           if (!$(this).hasClass('above')) {
                              gsap.to($(this), {
                                 duration: 0.5,
                                 delay: 0,
                                 opacity: 0,
                                 ease: Power4.easeInOut,
                              });
                           } else {
                              gsap.to($(this), {
                                 duration: 0.5,
                                 delay: 0.4,
                                 opacity: 0,
                                 ease: Power4.easeInOut,
                              });
                           }
                        });

                        gsap.to(
                           '#hero, #show-filters, .item-caption-wrapper, .showcase-portfolio .slide-caption, #page-nav, footer, .fadeout-element',
                           { duration: 0.5, opacity: 0, ease: Power4.easeInOut }
                        );
                        gsap.to('#ball', {
                           duration: 0.2,
                           borderWidth: '4px',
                           scale: 0.5,
                           borderColor: '#999999',
                           backgroundColor: 'transparent',
                           opacity: 1,
                        });
                        gsap.to('#ball-loader', {
                           duration: 0.2,
                           borderWidth: '4px',
                           top: 0,
                           left: 0,
                        });
                        $('#ball').removeClass('with-icon');
                        $('#ball p').remove();
                        $('#ball i').remove();

                        if ($('body').hasClass('hero-below-caption')) {
                           var heroTranslate = $('.hero-translate').height();
                           gsap.to('#app canvas', {
                              duration: 1,
                              y: heroTranslate,
                              delay: 0.7,
                              ease: Power3.easeInOut,
                           });
                        }

                        $(this)
                           .delay(1500)
                           .queue(function () {
                              var link = $('.above').find('a');
                              link.trigger('click');
                           });
                     });
                  } else {
                     // drag
                  }
                  $body.off('mouseup mousemove', handler);
               });
            });
         }
      }
   }; //End FitThumbScreenWEBGL

   /*--------------------------------------------------
Function FitThumbScreen GSAP
---------------------------------------------------*/

   window.FitThumbScreenGSAP = function () {
      if (!$('body').hasClass('disable-ajaxload')) {
         if ($('#itemsWrapper').hasClass('no-fitthumbs')) {
            $('#itemsWrapperLinks .trigger-item-link').on('click', function () {
               const parentItem = $(this).closest('.trigger-item');
               parentItem.addClass('above-trigger');
               $('body').addClass('show-loader');

               const fadeOutTargets = $(
                  '#hero, #show-filters, .nmp-slider, .item, .item-caption-wrapper, #page-nav, footer, .fadeout-element'
               );
               const ball = $('#ball');
               const ballLoader = $('#ball-loader');

               const tl = gsap.timeline({
                  defaults: { duration: 0.5, ease: Power4.easeInOut },
               });

               tl.to(fadeOutTargets, { opacity: 0 });
               tl.to(
                  ball,
                  {
                     borderWidth: '4px',
                     scale: 0.5,
                     borderColor: '#999999',
                     backgroundColor: 'transparent',
                     opacity: 1,
                  },
                  '-=0.4'
               );
               tl.to(ballLoader, { borderWidth: '4px', top: 0, left: 0 }, '-=0.4');

               $('#ball').removeClass('with-icon');
               $('#ball p, #ball i').remove();

               $(this)
                  .delay(1000)
                  .queue(function () {
                     const link = $('.above-trigger').find('a');
                     link.trigger('click');
                  });
            });
         }
      } else {
         $('#itemsWrapperLinks .trigger-item').on('click', function () {
            $('body').addClass('show-loader');

            const fadeOutTargets = $(
               '#hero, #show-filters, .nmp-slider, .item, .item-caption-wrapper, #page-nav, footer, .fadeout-element'
            );
            const ball = $('#ball');
            const ballLoader = $('#ball-loader');

            const tl = gsap.timeline();

            tl.to(fadeOutTargets, { opacity: 0 });
            tl.to(
               ball,
               {
                  borderWidth: '4px',
                  scale: 0.5,
                  borderColor: '#999999',
                  backgroundColor: 'transparent',
                  opacity: 1,
               },
               '-=0.4'
            );
            tl.to(ballLoader, { borderWidth: '4px', top: 0, left: 0 }, '-=0.4');

            $('#ball').removeClass('with-icon');
            $('#ball p, #ball i').remove();
         });
      }
   }; //End FitThumbScreenGSAP

   /*--------------------------------------------------
Function Shortcodes
---------------------------------------------------*/

   window.Shortcodes = function () {
      // Buttons

      $('.button-border').each(function () {
         $(this).css('background-color', function () {
            return $(this).data('btncolor');
         });
         $(this).css('border-color', function () {
            return $(this).data('btncolor');
         });
         $(this)
            .find('a')
            .css('color', function () {
               return $(this).parent().data('btntextcolor');
            });
      });

      $('.button-border.outline').each(function () {
         $(this).css('background-color', 'transparent');
         $(this).css('border-color', function () {
            return $(this).data('btncolor');
         });
         $(this)
            .find('a')
            .css('color', function () {
               return $(this).parent().data('btncolor');
            });
         $('.button-border.outline').mouseenter(function (e) {
            $(this).css('background-color', function () {
               return $(this).data('btncolor');
            });
            $(this).css('border-color', function () {
               return $(this).data('btncolor');
            });
            $(this)
               .find('a')
               .css('color', function () {
                  return $(this).parent().data('btntextcolor');
               });
         });
         $('.button-border.outline').mouseleave(function (e) {
            $(this).css('background-color', 'transparent');
            $(this).css('border-color', function () {
               return $(this).data('btncolor');
            });
            $(this)
               .find('a')
               .css('color', function () {
                  return $(this).parent().data('btncolor');
               });
         });
      });

      // Accordion

      $('dd.accordion-content').slideUp(1).addClass('hide');
      $('dl.accordion').on('click', 'dt', function () {
         $(this)
            .addClass('accordion-active')
            .next()
            .slideDown(350)
            .siblings('dd.accordion-content')
            .slideUp(350)
            .prev()
            .removeClass('accordion-active');
         $(this)
            .delay(500)
            .queue(function () {
               ScrollTrigger.refresh();
            });
      });
      $('dl.accordion').on('click', 'dt.accordion-active', function () {
         $(this).removeClass('accordion-active').siblings('dd.accordion-content').slideUp(350);
         $(this)
            .delay(500)
            .queue(function () {
               ScrollTrigger.refresh();
            });
      });

      $('.flexnav').flexNav({ animationSpeed: 250 });

      // Project Share

      $('#share').jsSocials({
         showLabel: false,
         showCount: false,
         shares: ['pinterest', 'twitter', 'facebook'],
      });

      $('.jssocials-share').wrap(
         "<div class='parallax-wrap'><div class='parallax-element'></div></div>"
      );

      if ($('.random-collage-wrap').length > 0) {
         if ($(window).width() >= 1024) {
            $('.random-collage .rc-slide .item-wrap-image').on('mouseenter', function () {
               var $this = $(this);
               gsap.to('#ball', {
                  duration: 0.3,
                  borderWidth: '2px',
                  scale: 1.2,
                  borderColor: $('body').data('primary-color'),
                  backgroundColor: $('body').data('primary-color'),
               });
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '2px',
                  top: 2,
                  left: 2,
               });
               $('#ball').append(
                  '<p class="first">' +
                     $this.data('firstline') +
                     '</p>' +
                     '<p>' +
                     $this.data('secondline') +
                     '</p>'
               );
            });

            $('.random-collage .rc-slide .item-wrap-image').on('mouseleave', function () {
               gsap.to('#ball', {
                  duration: 0.2,
                  borderWidth: '4px',
                  scale: 0.5,
                  borderColor: '#999999',
                  backgroundColor: 'transparent',
               });
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '4px',
                  top: 0,
                  left: 0,
               });
               $('#ball p').remove();
            });
         }
      }

      if ($('.has-hover-image').length > 0) {
         var parent_row = $('.has-hover-image').closest('.content-row');
         parent_row.css('z-index', '10');

         if ($('body').hasClass('smooth-scroll')) {
            var elem = document.querySelector('#content-scroll');
            var scrollbar = Scrollbar.init(elem, {
               renderByPixels: true,
               damping: 0.1,
            });
         }

         const getMousePos = (e) => {
            let posx = 0;
            let posy = 0;
            if (!e) e = window.event;
            if (e.pageX || e.pageY) {
               posx = e.pageX;
               posy = e.pageY;
            } else if (e.clientX || e.clientY) {
               posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
               posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            return { x: posx, y: posy };
         };

         // Effect 1
         class HoverImgFx1 {
            constructor(el) {
               this.DOM = { el: el };
               this.DOM.reveal = document.createElement('div');
               this.DOM.reveal.className = 'hover-reveal';
               this.DOM.reveal.innerHTML = `<div class="hover-reveal__inner"><div class="hover-reveal__img" style="background-image:url(${this.DOM.el.dataset.img})"></div></div>`;
               this.DOM.el.appendChild(this.DOM.reveal);
               this.DOM.revealInner = this.DOM.reveal.querySelector('.hover-reveal__inner');
               this.DOM.revealInner.style.overflow = 'hidden';
               this.DOM.revealImg = this.DOM.revealInner.querySelector('.hover-reveal__img');

               this.initEvents();
            }
            initEvents() {
               this.positionElement = (ev) => {
                  const mousePos = getMousePos(ev);
                  if ($('body').hasClass('smooth-scroll')) {
                     const docScrolls = {
                        left: document.body.scrollLeft + document.documentElement.scrollLeft,
                        top: -scrollbar.scrollTop,
                     };

                     gsap.to($('.hover-reveal'), {
                        duration: 0.7,
                        top: `${mousePos.y - this.DOM.el.querySelector('.hover-reveal').offsetHeight * 0.5 - docScrolls.top}px`,
                        left: `${mousePos.x - this.DOM.el.querySelector('.hover-reveal').offsetWidth * 0.5 - docScrolls.left}px`,
                        ease: Power4.easeOut,
                     });
                  } else {
                     const docScrolls = {
                        left: document.body.scrollLeft + document.documentElement.scrollLeft,
                        top: document.body.scrollTop + document.documentElement.scrollTop,
                     };
                     gsap.to($('.hover-reveal'), {
                        duration: 1,
                        top: `${mousePos.y + 40 - docScrolls.top}px`,
                        left: `${mousePos.x + 10 - docScrolls.left}px`,
                        ease: Power4.easeOut,
                     });
                  }
               };
               this.mouseenterFn = (ev) => {
                  this.positionElement(ev);
                  this.showImage();
               };
               this.mousemoveFn = (ev) =>
                  requestAnimationFrame(() => {
                     this.positionElement(ev);
                  });
               this.mouseleaveFn = () => {
                  this.hideImage();
               };

               this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
               this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
               this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
            }
            showImage() {
               TweenMax.killTweensOf(this.DOM.revealInner);
               TweenMax.killTweensOf(this.DOM.revealImg);

               this.tl = new TimelineMax({
                  onStart: () => {
                     this.DOM.reveal.style.opacity = 1;
                     TweenMax.set(this.DOM.el, { zIndex: 1000 });
                  },
               })
                  .add('begin')
                  .add(
                     new TweenMax(this.DOM.revealInner, 0.3, {
                        ease: Sine.easeOut,
                        startAt: { x: '-100%' },
                        x: '0%',
                     }),
                     'begin'
                  )
                  .add(
                     new TweenMax(this.DOM.revealImg, 0.3, {
                        ease: Sine.easeOut,
                        startAt: { x: '100%' },
                        x: '0%',
                     }),
                     'begin'
                  );
            }
            hideImage() {
               TweenMax.killTweensOf(this.DOM.revealInner);
               TweenMax.killTweensOf(this.DOM.revealImg);

               this.tl = new TimelineMax({
                  onStart: () => {
                     TweenMax.set(this.DOM.el, { zIndex: 999 });
                  },
                  onComplete: () => {
                     TweenMax.set(this.DOM.el, { zIndex: '' });
                     TweenMax.set(this.DOM.reveal, { opacity: 0 });
                  },
               })
                  .add('begin')
                  .add(
                     new TweenMax(this.DOM.revealInner, 0.3, {
                        ease: Sine.easeOut,
                        x: '100%',
                     }),
                     'begin'
                  )
                  .add(
                     new TweenMax(this.DOM.revealImg, 0.3, {
                        ease: Sine.easeOut,
                        x: '-100%',
                     }),
                     'begin'
                  );
            }
         }

         Array.from(document.querySelectorAll('.has-hover-image')).forEach(
            (link) => new HoverImgFx1(link)
         );
      }
   }; //End Shortcodes

   /*--------------------------------------------------
Function Sliders
---------------------------------------------------*/

   window.Sliders = function () {
      if ($('.content-slider').length > 0) {
         slider = new ClapatSlider('.content-slider', {
            direction: 'horizontal',
            snap: true,
            mousewheel: false,
            renderBullet: function (index, className) {
               return (
                  '<div class="parallax-wrap">' +
                  '<div class="parallax-element">' +
                  '<svg class="fp-arc-loader" width="20" height="20" viewBox="0 0 20 20">' +
                  '<circle class="path" cx="10" cy="10" r="5.5" fill="none" transform="rotate(-90 10 10)" stroke="#FFF"' +
                  'stroke-opacity="1" stroke-width="2px"></circle>' +
                  '<circle class="solid-fill" cx="10" cy="10" r="3" fill="#FFF"></circle>' +
                  '</svg></div></div>'
               );
            },
         });

         $('.slider-button-prev')
            .mouseenter(function (e) {
               if ($(this).parents('.nmp-slider-wrapper').hasClass('light-cursor')) {
                  $('body').addClass('drag-cursor-white');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#fff',
                  });
               } else if ($(this).parents('.nmp-slider-wrapper').hasClass('dark-cursor')) {
                  $('body').addClass('drag-cursor-black');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#000',
                  });
               }
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '2px',
                  top: 2,
                  left: 2,
               });
               $('#ball').addClass('with-icon').append('<i class="fa fa-chevron-left"></i>');
            })
            .mouseleave(function (e) {
               gsap.to('#ball', {
                  duration: 0.2,
                  borderWidth: '4px',
                  scale: 0.5,
                  borderColor: '#999999',
               });
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '4px',
                  top: 0,
                  left: 0,
               });
               $('#ball').removeClass('with-icon');
               $('#ball i').remove();
               $('body').removeClass('drag-cursor-black').removeClass('drag-cursor-white');
            });

         $('.slider-button-next')
            .mouseenter(function (e) {
               if ($(this).parents('.nmp-slider-wrapper').hasClass('light-cursor')) {
                  $('body').addClass('drag-cursor-white');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#fff',
                  });
               } else if ($(this).parents('.nmp-slider-wrapper').hasClass('dark-cursor')) {
                  $('body').addClass('drag-cursor-black');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#000',
                  });
               }
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '2px',
                  top: 2,
                  left: 2,
               });
               $('#ball').addClass('with-icon').append('<i class="fa fa-chevron-right"></i>');
            })
            .mouseleave(function (e) {
               gsap.to('#ball', {
                  duration: 0.2,
                  borderWidth: '4px',
                  scale: 0.5,
                  borderColor: '#999999',
               });
               gsap.to('#ball-loader', {
                  duration: 0.2,
                  borderWidth: '4px',
                  top: 0,
                  left: 0,
               });
               $('#ball').removeClass('with-icon');
               $('#ball i').remove();
               $('body').removeClass('drag-cursor-black').removeClass('drag-cursor-white');
            });

         $(
            '.content-slider.looped-carousel .nmp-slider, .content-slider.small-looped-carousel .nmp-slider'
         )
            .on('mouseenter mousemove', function () {
               $('body').addClass('scale-drag-x');
               if ($(this).parent().hasClass('light-cursor')) {
                  $('body').addClass('drag-cursor-white');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#fff',
                  });
               } else if ($(this).parent().hasClass('dark-cursor')) {
                  $('body').addClass('drag-cursor-black');
                  gsap.to('#ball', {
                     duration: 0.2,
                     borderWidth: '2px',
                     scale: 1,
                     borderColor: '#000',
                  });
               }
            })
            .on('mouseleave', function () {
               gsap.to('#ball', {
                  duration: 0.2,
                  borderWidth: '4px',
                  scale: 0.5,
                  borderColor: '#999999',
               });
               $('body')
                  .removeClass('scale-drag-x')
                  .removeClass('drag-cursor')
                  .removeClass('drag-cursor-white')
                  .removeClass('drag-cursor-black');
            });

         imagesLoaded('body', function () {
            setTimeout(function () {
               if (slider != null) {
                  slider.update();
               }
            }, 1000);
         });
      }
   }; //End Sliders

   /*--------------------------------------------------
Function Justified Grid
---------------------------------------------------*/

   window.JustifiedGrid = function () {
      if ($('.justified-grid').length > 0) {
         $('.justified-grid').justifiedGallery({
            rowHeight: 360,
            lastRow: 'nojustify',
            margins: 10,
         });
      }
   }; //End Justified Grid

   /*--------------------------------------------------
Function Lightbox
---------------------------------------------------*/

   window.Lightbox = function () {
      // Image Popup
      const items = gsap.utils.toArray('.image-link');

      let sourceItem = null; // keeps track of which item is the source (clicked to open)
      let activeItem = null; // keeps track of which item is opened (details)

      // Add click listeners
      function showDetails(item) {
         if (sourceItem) {
            // someone could click on an element behind the open details panel in which case we should just ignore it.

            return;
         }

         event.preventDefault();

         $('body').prepend(`<div class="nmp-img-popup">
				<div class="nmp-img-popup-bg-close"></div>				
				<div class="nmp-img-popup-viewport">
					<div class="nmp-img-popup-preloader"><div></div><div></div><div></div><div></div></div>					
					<img />
					<div class="nmp-img-popup-close link"></div>						
				</div>				
				<div class="nmp-img-popup-prev link"></div>
				<div class="nmp-img-popup-next link"></div></div>`);

         const details = document.querySelector('.nmp-img-popup');
         const detailsBgClose = document.querySelector('.nmp-img-popup-bg-close');
         const detailsClose = document.querySelector('.nmp-img-popup-close');
         const detailsPreloader = document.querySelector('.nmp-img-popup-preloader');
         const detailImage = document.querySelector('.nmp-img-popup img');
         const detailPrev = document.querySelector('.nmp-img-popup-prev');
         const detailNext = document.querySelector('.nmp-img-popup-next');

         gsap.to(detailsBgClose, {
            duration: 0.3,
            delay: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
         });
         gsap.to(detailsPreloader, { duration: 0.2, opacity: 1 });
         gsap.set(detailImage, { opacity: 0 });

         $('.link, .button').mouseenter(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '0px',
               scale: 1.5,
               backgroundColor: 'rgba(153, 153, 153, 1)',
               opacity: 0.15,
            });
            gsap.to('#ball-loader', {
               duration: 0.2,
               borderWidth: '2px',
               top: 4,
               left: 4,
            });
         });

         $('.link, .button').mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               backgroundColor: 'rgba(153, 153, 153, 0)',
               opacity: 1,
            });
            gsap.to('#ball-loader', {
               duration: 0.2,
               borderWidth: '4px',
               top: 0,
               left: 0,
            });
         });

         let onLoad = () => {
            gsap.to(detailsPreloader, { duration: 0.2, opacity: 0 });
            gsap.set(detailImage, { opacity: 1 });
            // position the details on top of the item (scaled down)
            Flip.fit(details, item, { scale: true, fitChild: detailImage });

            // record the state
            const state = Flip.getState(detailImage);

            // set the final state
            gsap.set(details, { clearProps: true }); // wipe out all inline stuff so it's in the native state (not scaled)

            gsap.to([detailsClose, detailPrev, detailNext], {
               duration: 0.3,
               delay: 0.6,
               opacity: 1,
            });

            Flip.from(state, {
               delay: 0.2,
               duration: 0.5,
               ease: 'power2.inOut',
               scale: true,
            });

            detailImage.removeEventListener('load', onLoad);
            detailsBgClose.addEventListener('click', hideDetails);
            detailsClose.addEventListener('click', hideDetails);
            detailPrev.addEventListener('click', prevPopup);
            detailNext.addEventListener('click', nextPopup);
         };

         // change image
         detailImage.addEventListener('load', onLoad);
         detailImage.src = item.getAttribute('href');

         // set the source item that was clicked
         sourceItem = activeItem = item;
      }

      function hideDetails() {
         const details = document.querySelector('.nmp-img-popup');
         const detailsBgClose = document.querySelector('.nmp-img-popup-bg-close');
         const detailsClose = document.querySelector('.nmp-img-popup-close');
         const detailImage = document.querySelector('.nmp-img-popup img');
         const detailPrev = document.querySelector('.nmp-img-popup-prev');
         const detailNext = document.querySelector('.nmp-img-popup-next');

         detailsBgClose.removeEventListener('click', hideDetails);
         detailsClose.removeEventListener('click', hideDetails);
         gsap.set(details, { overflow: 'hidden' });

         // record the current state of details
         const state = Flip.getState(detailImage);

         // scale details down so that its detailImage fits exactly on top of sourceItem
         Flip.fit(detailImage, sourceItem, { scale: true, fitChild: detailImage });

         gsap.to([detailsClose, detailPrev, detailNext], {
            duration: 0.2,
            delay: 0,
            opacity: 0,
         });

         // animate from the original state to the current one.
         Flip.from(state, {
            scale: true,
            duration: 0.5,
            delay: 0.0, // time in ms if we want a delay before flip
            onComplete: () =>
               gsap.to(detailsBgClose, {
                  duration: 0.5,
                  backgroundColor: 'rgba(0,0,0,0)',
                  onComplete: function () {
                     $('.nmp-img-popup').remove();
                  },
               }),
         });

         sourceItem = activeItem = null;
      }

      function nextPopup() {
         const detailsPreloader = document.querySelector('.nmp-img-popup-preloader');
         const detailImage = document.querySelector('.nmp-img-popup img');
         let currIndex = items.indexOf(activeItem);

         let nextIndex = currIndex + 1;
         if (nextIndex >= items.length) {
            nextIndex = 0;
         }

         gsap.to(detailsPreloader, { duration: 0.2, opacity: 1 });
         gsap.to(detailImage, { duration: 0.2, opacity: 0 });

         let onLoad = () => {
            gsap.to(detailsPreloader, { duration: 0.2, opacity: 0 });
            gsap.to(detailImage, { duration: 0.2, opacity: 1, delay: 0 });
            detailImage.removeEventListener('load', onLoad);
         };

         sourceItem = activeItem = items[nextIndex];
         detailImage.addEventListener('load', onLoad);
         detailImage.src = activeItem.getAttribute('href');
      }

      function prevPopup() {
         const detailsPreloader = document.querySelector('.nmp-img-popup-preloader');
         const detailImage = document.querySelector('.nmp-img-popup img');
         let currIndex = items.indexOf(activeItem);

         let prevIndex = currIndex - 1;
         if (prevIndex < 0) {
            prevIndex = items.length - 1;
         }

         gsap.to(detailsPreloader, { duration: 0.2, opacity: 1 });
         gsap.to(detailImage, { duration: 0.2, opacity: 0 });

         let onLoad = () => {
            gsap.to(detailsPreloader, { duration: 0.2, opacity: 0 });
            gsap.to(detailImage, { duration: 0.2, opacity: 1 });
            detailImage.removeEventListener('load', onLoad);
         };

         sourceItem = activeItem = items[prevIndex];
         detailImage.addEventListener('load', onLoad);
         detailImage.src = activeItem.getAttribute('href');
      }

      gsap.utils
         .toArray('.image-link')
         .forEach((item) => item.addEventListener('click', () => showDetails(item)));

      $('.image-link').mouseenter(function (e) {
         gsap.to('#ball', {
            duration: 0.2,
            borderWidth: '2px',
            scale: 1,
            borderColor: '#fff',
         });
         gsap.to('#ball-loader', {
            duration: 0.2,
            borderWidth: '2px',
            top: 2,
            left: 2,
         });
         $('#ball').addClass('with-icon').append('<i class="fa-solid fa-plus"></i>');
      });

      $('.image-link').mouseleave(function (e) {
         gsap.to('#ball', {
            duration: 0.2,
            borderWidth: '4px',
            scale: 0.5,
            borderColor: '#999999',
         });
         gsap.to('#ball-loader', {
            duration: 0.2,
            borderWidth: '4px',
            top: 0,
            left: 0,
         });
         $('#ball').removeClass('with-icon');
         $('#ball i').remove();
      });

      // Video Popup
      const videoItems = gsap.utils.toArray('.video-link');

      let sourceVideoItem = null; // keeps track of which item is opened (details)

      // Add click listeners
      function showVideoDetails(event, item) {
         event.preventDefault();

         if (sourceVideoItem) {
            // someone could click on an element behind the open details panel in which case we should just ignore it.

            return;
         }

         $('body').prepend(`<div class="nmp-video-popup">
				<button title="Close (Esc)" type="button" class="nmp-video-popup-close">×</button>
				<iframe class="nmp-video-popup-iframe" frameborder="0" allow="autoplay"></iframe></div>`);

         const details = document.querySelector('.nmp-video-popup');
         const detailsClose = document.querySelector('.nmp-video-popup-close');
         const detailIframe = document.querySelector('.nmp-video-popup iframe');

         let onVideoLoad = () => {
            console.log('Popup Video is ready to play.');
         };

         // load the video
         detailIframe.addEventListener('load', onVideoLoad);
         let videoUrl = item.getAttribute('href');
         if (videoUrl.indexOf('vimeo.com/') >= 0) {
            // this is a vimeo url, extract the video id from it
            let regExp =
               /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
            let parseUrl = regExp.exec(videoUrl);
            let videoId = parseUrl[5];
            detailIframe.src = 'https://player.vimeo.com/video/' + videoId + '?autoplay=1';
         } else if (videoUrl.indexOf('youtube.com/') >= 0) {
            // this is a youtube url, extract the video id from it
            let videoId = videoUrl.split('v=')[1];
            let ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition != -1) {
               videoId = videoId.substring(0, ampersandPosition);
            }
            detailIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
         } else {
            // give it a try anyway
            detailIframe.src = item.getAttribute('href');
         }

         // assign the current item
         sourceVideoItem = item;

         // position the details on top of the item (scaled down)
         Flip.fit(details, item, { scale: true, fitChild: detailIframe });

         // record the state
         const state = Flip.getState(details);

         // set the final state
         gsap.set(details, { clearProps: true }); // wipe out all inline stuff so it's in the native state (not scaled)
         gsap.set(details, {
            xPercent: -50,
            top: '50%',
            yPercent: -50,
            visibility: 'visible',
            overflow: 'hidden',
         });

         Flip.from(state, {
            duration: 0.5,
            ease: 'power2.inOut',
            scale: true,
            onComplete: () => gsap.set(details, { overflow: 'auto' }), // to permit scrolling if necessary
         });

         detailsClose.addEventListener('click', hideVideoDetails);
      }

      function hideVideoDetails() {
         const details = document.querySelector('.nmp-video-popup');
         const detailsClose = document.querySelector('.nmp-video-popup-close');
         const detailIframe = document.querySelector('.nmp-video-popup iframe');

         detailsClose.removeEventListener('click', hideDetails);
         gsap.set(details, { overflow: 'hidden' });

         // record the current state of details
         const state = Flip.getState(details);

         // scale details down so that its detailImage fits exactly on top of sourceItem
         Flip.fit(details, sourceVideoItem, {
            scale: true,
            fitChild: detailIframe,
         });

         // animate from the original state to the current one.
         Flip.from(state, {
            scale: true,
            duration: 0.5,
            delay: 0.0, // time in ms if we want a delay before flip
            onComplete: () => $('.nmp-video-popup').remove(),
            //onInterrupt: () => tl.kill()
         }).set(details, { visibility: 'hidden' });

         sourceVideoItem = null;
      }

      gsap.utils
         .toArray('.video-link')
         .forEach((item) => item.addEventListener('click', (e) => showVideoDetails(e, item)));

      $('.video-link').mouseenter(function (e) {
         gsap.to('#ball', {
            duration: 0.2,
            borderWidth: '2px',
            scale: 1,
            borderColor: '#fff',
         });
         gsap.to('#ball-loader', {
            duration: 0.2,
            borderWidth: '2px',
            top: 2,
            left: 2,
         });
         $('#ball').addClass('with-icon').append('<i class="fa-solid fa-play"></i>');
      });

      $('.video-link').mouseleave(function (e) {
         gsap.to('#ball', {
            duration: 0.2,
            borderWidth: '4px',
            scale: 0.5,
            borderColor: '#999999',
         });
         gsap.to('#ball-loader', {
            duration: 0.2,
            borderWidth: '4px',
            top: 0,
            left: 0,
         });
         $('#ball').removeClass('with-icon');
         $('#ball i').remove();
      });
   }; //End Lightbox

   /*--------------------------------------------------
Function Page PlayVideo
---------------------------------------------------*/

   window.PlayVideo = function () {
      if ($('.video-wrapper').length > 0) {
         $('.video-wrapper').mouseenter(function (e) {
            if ($(this).hasClass('play')) {
               $('#ball').addClass('pause-movie');
            }
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '2px',
               scale: 1,
               borderColor: '#fff',
            });
            $('#ball')
               .addClass('over-movie')
               .append('<i class="fa fa-play"></i><i class="fa fa-pause"></i>');
         });

         $('.video-wrapper').mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '4px',
               scale: 0.5,
               borderColor: '#999999',
            });
            $('#ball').removeClass('over-movie').removeClass('pause-movie');
            $('#ball i').remove();
         });

         $('.video-wrapper .control').mouseenter(function (e) {
            gsap.to('#ball', { duration: 0.2, borderWidth: '20px', scale: 0 });
         });

         $('.video-wrapper .control').mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '2px',
               scale: 1,
               borderColor: '#fff',
            });
         });

         var videocenter = ($(window).height() - $('.video-cover').height()) / 2;

         var playpause = function (videoObj) {
            if (videoObj[0] != null) {
               if (videoObj[0].paused || videoObj[0].ended) {
                  videoObj.parent().addClass('play');
                  videoObj[0].play();
               } else {
                  videoObj.parent().removeClass('play');
                  videoObj[0].pause();
               }
            }
         };

         //Time format converter - 00:00
         var timeFormat = function (seconds) {
            var m =
               Math.floor(seconds / 60) < 10
                  ? '0' + Math.floor(seconds / 60)
                  : Math.floor(seconds / 60);
            var s =
               Math.floor(seconds - m * 60) < 10
                  ? '0' + Math.floor(seconds - m * 60)
                  : Math.floor(seconds - m * 60);
            return m + ':' + s;
         };

         // Events
         // click to video cover - will start the video
         $('.video-wrapper').on('click', function () {
            $('html,body').animate({ scrollTop: $(this).offset().top - videocenter }, 390);
            // hide the video cover in order to start playing
            $(this).find('.video-cover').addClass('hidden');

            $('#ball').toggleClass('pause-movie');

            // pause first the other videos
            var current_wrapper = $(this);
            $('#main-page-content')
               .find('.video-wrapper')
               .each(function () {
                  if (!current_wrapper.is($(this))) {
                     $(this).removeClass('play');
                     $(this)
                        .find('video')
                        .each(function () {
                           if (!$(this).get(0).paused && !$(this).get(0).ended) {
                              $(this).get(0).pause();
                           }
                        });
                  }
               });

            // trigger the click for the inner video
            $(this)
               .find('video')
               .each(function () {
                  playpause($(this));
               });
         });

         //fullscreen button clicked
         $('.btnFS').on('click', function (e) {
            var parent_wrapper = $(this).closest('.video-wrapper');
            var video_object = parent_wrapper.find('video');

            if ($.isFunction(video_object[0].webkitEnterFullscreen)) {
               video_object[0].webkitEnterFullscreen();
            } else if ($.isFunction(video_object[0].mozRequestFullScreen)) {
               video_object[0].mozRequestFullScreen();
            } else {
               alert("Your browsers doesn't support fullscreen");
            }

            // prevent video wrapper div responding the event
            e.stopPropagation();
         });

         //sound button clicked
         $('.sound').on('click', function (e) {
            var parent_wrapper = $(this).closest('.video-wrapper');
            var video_object = parent_wrapper.find('video');

            video_object[0].muted = !video_object[0].muted;
            $(this).toggleClass('muted');
            if (video_object[0].muted) {
               parent_wrapper.find('.volumeBar').css('width', 0);
            } else {
               parent_wrapper.find('.volumeBar').css('width', video_object[0].volume * 100 + '%');
            }

            // prevent video wrapper div responding the event
            e.stopPropagation();
         });

         //progress bar (video timebar) clicked
         $('.progress').on('click', function (e) {
            var parent_wrapper = $(this).closest('.video-wrapper');
            var video_object = parent_wrapper.find('video');

            // calculate click position
            // and update video current time
            // as well as progress bar
            var maxduration = video_object[0].duration;
            var position = e.pageX - $(this).offset().left;
            var percentage = (100 * position) / $(this).width();
            if (percentage > 100) {
               percentage = 100;
            }
            if (percentage < 0) {
               percentage = 0;
            }
            $('.timeBar').css('width', percentage + '%');
            video_object[0].currentTime = (maxduration * percentage) / 100;

            // prevent video wrapper div responding the event
            e.stopPropagation();
         });

         $('#main-page-content')
            .find('video')
            .each(function () {
               var video = $(this);
               var video_wrapper = $(this).parent();

               //remove default control when JS loaded
               video[0].removeAttribute('controls');
               video_wrapper.find('.control').fadeIn(500);
               video_wrapper.find('.caption').fadeIn(500);

               //before everything get started and we have the info about the video such as duration
               video.on('loadedmetadata', function () {
                  var video_object = $(this);
                  var parent_wrapper = $(this).parent();
                  //set video properties
                  parent_wrapper.find('.current').text(timeFormat(0));
                  parent_wrapper.find('.duration').text(timeFormat(video[0].duration));
               });

               //display current video buffered progress
               video.on('progress', function () {
                  var video_object = $(this);
                  var parent_wrapper = $(this).parent();
                  var maxduration = video_object[0].duration;

                  if (maxduration > 0) {
                     for (var i = 0; i < video_object[0].buffered.length; i++) {
                        if (
                           video_object[0].buffered.start(video_object[0].buffered.length - 1 - i) <
                           video_object[0].currentTime
                        ) {
                           var perc =
                              (video_object[0].buffered.end(
                                 video_object[0].buffered.length - 1 - i
                              ) /
                                 maxduration) *
                                 100 +
                              '%';
                           parent_wrapper.find('.bufferBar').css('width', perc + '%');
                           break;
                        }
                     }
                  }
               });

               //display current video play time
               video.on('timeupdate', function () {
                  var parent_wrapper = $(this).parent();
                  var currentPos = $(this).get(0).currentTime;
                  var maxduration = $(this).get(0).duration;
                  var perc = (100 * currentPos) / maxduration;
                  parent_wrapper.find('.timeBar').css('width', perc + '%');
                  parent_wrapper.find('.current').text(timeFormat(currentPos));
               });

               //video screen and play button clicked
               video.on('click', function () {
                  playpause($(this));
               });

               //video canplay event
               video.on('canplay', function () {
                  var parent_wrapper = $(this).parent();
                  parent_wrapper.find('.loading').fadeOut(100); //?
               });

               //video canplaythrough event
               //solve Chrome cache issue
               var completeloaded = false;
               video.on('canplaythrough', function () {
                  completeloaded = true;
               });

               //video ended event
               video.on('ended', function () {
                  $(this).get(0).pause();
                  $(this).parent().removeClass('play');
                  $('#ball').toggleClass('pause-movie');
               });

               //video seeking event
               video.on('seeking', function () {
                  //if video fully loaded, ignore loading screen
                  if (!completeloaded) {
                     var parent_wrapper = $(this).parent();
                     parent_wrapper.find('.loading').fadeIn(200); //?
                  }
               });

               //video seeked event
               video.on('seeked', function () {});

               //video waiting for more data event
               video.on('waiting', function () {
                  var parent_wrapper = $(this).parent();
                  parent_wrapper.find('.loading').fadeIn(200); //?
               });
            });
      }
   }; // End PlayVideo

   window.isMobile = function () {
      if (
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ) {
         $('body').addClass('disable-cursor');
         return true;
      } else {
         if ($(window).width() <= 1024) {
            $('body').addClass('disable-cursor');
            return true;
         }
      }
      return false;
   };

   /*--------------------------------------------------
Function Core
---------------------------------------------------*/

   window.Core = function () {
      if (!isMobile() && !$('body').hasClass('disable-cursor')) {
         var mouse = { x: 0, y: 0 };
         var pos = { x: 0, y: 0 };
         var ratio = 0.65;
         var active = false;
         var ball = document.getElementById('ball');
         var ballloader = document.getElementById('ball-loader');
         var offsetX = 40;

         gsap.set(ball, {
            xPercent: -50,
            yPercent: -50,
            scale: 0.5,
            borderWidth: '4px',
         });

         document.addEventListener('mousemove', mouseMove);

         function mouseMove(e) {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            mouse.x = e.pageX;
            mouse.y = e.pageY - scrollTop;
         }

         gsap.ticker.add(updatePosition);

         function updatePosition() {
            if (!active) {
               pos.x += (mouse.x - pos.x) * ratio;
               pos.y += (mouse.y - pos.y) * ratio;

               gsap.to(ball, { duration: 0.4, x: pos.x, y: pos.y });
            }
         }

         $('.sticky.left').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.left - offsetX;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.9,
               borderWidth: '2px',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('.sticky.right').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.right + offsetX;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.9,
               borderWidth: '2px',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('#main .sticky.left').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.left - offsetX + 10;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.7,
               opacity: 0.6,
               borderWidth: '6px',
               borderColor: '#999999',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('#main .sticky.right').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.right + offsetX - 10;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.7,
               opacity: 0.6,
               borderWidth: '6px',
               borderColor: '#999999',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('.nmp-button .sticky.left').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.left + 22;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.4,
               opacity: 1,
               borderWidth: '6px',
               borderColor: '#000',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('.nmp-button .sticky.right').mouseenter(function (e) {
            var rcBounds = $(this)[0].getBoundingClientRect();
            var positionX = rcBounds.right - 22;
            var positionY = rcBounds.top + rcBounds.height / 2;
            gsap.to(ball, {
               duration: 0.5,
               x: positionX,
               y: positionY,
               scale: 0.4,
               opacity: 1,
               borderWidth: '6px',
               borderColor: '#000',
            });
            gsap.ticker.remove(updatePosition);
         });

         $('.sticky').mouseleave(function (e) {
            gsap.to(ball, {
               duration: 0.2,
               scale: 0.5,
               borderWidth: '4px',
               borderColor: '#999999',
               opacity: 1,
            });
            gsap.ticker.add(updatePosition);
         });

         $('.parallax-wrap').mouseenter(function (e) {
            gsap.to(this, { duration: 0.3, scale: 2 });
            gsap.to(ball, {
               duration: 0.3,
               scale: 0.9,
               borderWidth: '2px',
               opacity: 1,
            });
            gsap.to($(this).children(), { duration: 0.3, scale: 0.5 });
            active = true;
         });

         $('#main .parallax-wrap.icon-wrap').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.3,
               scale: 0.7,
               borderWidth: '6px',
               opacity: 0.6,
               borderColor: '#999',
            });
         });

         $('.nmp-button .parallax-wrap.icon-wrap').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.05,
               scale: 0.4,
               borderWidth: '0px',
               opacity: 1,
               borderColor: '#000',
            });
         });

         $('.parallax-wrap.bigger').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.3,
               scale: 1.35,
               borderWidth: '2px',
               opacity: 1,
            });
         });

         $('.parallax-wrap').mouseleave(function (e) {
            gsap.to(this, { duration: 0.3, scale: 1 });
            gsap.to(ball, {
               duration: 0.3,
               scale: 0.5,
               borderWidth: '4px',
               opacity: 1,
               borderColor: '#999999',
            });
            gsap.to($(this).children(), { duration: 0.3, scale: 1, x: 0, y: 0 });
            active = false;
         });

         $('.sticky').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.5,
               borderColor: $('body').data('primary-color'),
            });
         });
         $('#main .sticky').mouseenter(function (e) {
            gsap.to(ball, { duration: 0.5, borderColor: '#999' });
         });
         $('.nmp-button .sticky').mouseenter(function (e) {
            if ($('#page-content').hasClass('light-content')) {
               gsap.to(ball, { duration: 0.5, borderColor: '#000' });
            } else {
               gsap.to(ball, { duration: 0.5, borderColor: '#fff' });
            }
         });
         $('.parallax-wrap').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.3,
               borderColor: $('body').data('primary-color'),
            });
         });
         $('.nmp-button .parallax-wrap').mouseenter(function (e) {
            if ($('#page-content').hasClass('light-content')) {
               gsap.to(ball, { duration: 0.05, borderColor: '#000' });
            } else {
               gsap.to(ball, { duration: 0.05, borderColor: '#fff' });
            }
         });
         $('.parallax-wrap.bigger').mouseenter(function (e) {
            gsap.to(ball, {
               duration: 0.3,
               borderColor: $('body').data('primary-color'),
            });
         });
         $('#main .parallax-wrap.icon-wrap').mouseenter(function (e) {
            gsap.to(ball, { duration: 0.3, borderColor: '#999' });
         });

         $('.parallax-wrap').mousemove(function (e) {
            parallaxCursor(e, this, 2);
            callParallax(e, this);
         });

         function callParallax(e, parent) {
            parallaxIt(e, parent, parent.querySelector('.parallax-element'), 20);
         }

         function parallaxIt(e, parent, target, movement) {
            var boundingRect = parent.getBoundingClientRect();
            var relX = e.pageX - boundingRect.left;
            var relY = e.pageY - boundingRect.top;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            gsap.to(target, {
               duration: 0.3,
               x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
               y: ((relY - boundingRect.height / 2 - scrollTop) / boundingRect.height) * movement,
               ease: Power2.easeOut,
            });
         }

         function parallaxCursor(e, parent, movement) {
            var rect = parent.getBoundingClientRect();
            var relX = e.pageX - rect.left;
            var relY = e.pageY - rect.top;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
            pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2 - scrollTop) / movement;
            gsap.to(ball, { duration: 0.3, x: pos.x, y: pos.y });
         }

         $('.hide-ball').mouseenter(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '1px',
               scale: 1,
               opacity: 0,
            });
         });

         $('.hide-ball').mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               opacity: 1,
            });
         });

         $('.link, .button').mouseenter(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '0px',
               scale: 1.5,
               backgroundColor: 'rgba(153, 153, 153, 1)',
               opacity: 0.15,
            });
            gsap.to('#ball-loader', {
               duration: 0.2,
               borderWidth: '2px',
               top: 4,
               left: 4,
            });
         });

         $('.link, .button').mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               backgroundColor: 'rgba(153, 153, 153, 0)',
               opacity: 1,
            });
            gsap.to('#ball-loader', {
               duration: 0.2,
               borderWidth: '4px',
               top: 0,
               left: 0,
            });
         });

         //Blog Hover Effects
         $(
            '#blog-page-nav .page-numbers li a, .post-page-numbers, #post-content a, #post-form a, #post-comments a, .wp-block-search__button, .nmp-sidebar-widget a'
         ).mouseenter(function (e) {
            gsap.to('#ball', {
               duration: 0.2,
               borderWidth: '1px',
               scale: 1,
               opacity: 0,
            });
         });

         $(
            '#blog-page-nav .page-numbers li a, .post-page-numbers, #post-content a, #post-form a, #post-comments a, .wp-block-search__button, .nmp-sidebar-widget a'
         ).mouseleave(function (e) {
            gsap.to('#ball', {
               duration: 0.3,
               borderWidth: '4px',
               scale: 0.5,
               opacity: 1,
            });
         });
      }

      if ($('body').hasClass('disable-ajaxload')) {
         return;
      }

      jQuery(document).ready(function () {
         var isAnimating = false,
            newLocation = '';
         firstLoad = false;

         //trigger smooth transition from the actual page to the new one
         $('main').on('click', '[data-type="page-transition"]', function (event) {
            event.preventDefault();
            //detect which page has been selected
            var newPage = $(this).attr('href');
            //if the page is not already being animated - trigger animation
            if (!isAnimating) changePage(newPage, true);
            firstLoad = true;
         });

         //detect the 'popstate' event - e.g. user clicking the back button
         $(window).on('popstate', function () {
            if (firstLoad) {
               /*
				  Safari emits a popstate event on page load - check if firstLoad is true before animating
				  if it's false - the page has just been loaded
				  */
               var newPage = location.href;

               if (!isAnimating && newLocation != newPage) changePage(newPage, false);
            }
            firstLoad = true;
         });

         function changePage(url, bool) {
            isAnimating = true;
            // trigger page animation
            $('body').addClass('page-is-changing');
            $('.cd-cover-layer').one(
               'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
               function () {
                  loadNewContent(url, bool);
                  newLocation = url;
                  $('.cd-cover-layer').off(
                     'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'
                  );
               }
            );
            //if browser doesn't support CSS transitions
            if (!transitionsSupported()) {
               loadNewContent(url, bool);
               newLocation = url;
            }
         }

         function loadNewContent(url, bool) {
            url = '' == url ? 'index.html' : url;

            var section = $('<div class="cd-main-content "></div>');

            section.load(url + ' .cd-main-content > *', function (event) {
               // load new content and replace <main> content with the new one

               $('main').html(section);

               var clapat_title = event.match(/<title[^>]*>([^<]+)<\/title>/)[1];
               $('head title').html(clapat_title);

               // if we have Elementor inline styles in the target page
               headTags = [
                  'style[id*=elementor-frontend-inline]',
                  'style[id*="elementor-post"]',
                  'link[id*="elementor-post"]',
                  'link[id*="google-fonts"]',
               ];
               var head = document.head;
               var newPageRawHead = event.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
               newPageHead = document.createElement('head');

               newPageHead.innerHTML = newPageRawHead;

               var oldHeadTags = head.querySelectorAll(headTags);
               var newHeadTags = newPageHead.querySelectorAll(headTags);

               // append new and remove old tags
               for (let i = 0; i < newHeadTags.length; i++) {
                  if (typeof oldHeadTags[i] !== 'undefined') {
                     head.insertBefore(newHeadTags[i], oldHeadTags[i].nextElementSibling);
                     head.removeChild(oldHeadTags[i]);
                  } else {
                     head.insertBefore(newHeadTags[i], newHeadTags[i - 1]);
                  }
               }

               $('html, body').scrollTop(0);

               //if browser doesn't support CSS transitions - dont wait for the end of transitions
               var delay = transitionsSupported() ? 30 : 0;
               setTimeout(function () {
                  //wait for the end of the transition on the loading bar before revealing the new content
                  $('body').removeClass('page-is-changing');
                  $('.cd-cover-layer').one(
                     'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                     function () {
                        isAnimating = false;
                        $('.cd-cover-layer').off(
                           'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'
                        );
                     }
                  );

                  LoadViaAjax();

                  if (!isMobile() && !$('body').hasClass('disable-cursor')) {
                     $('.sticky.left').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.left - offsetX;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.9,
                           borderWidth: '2px',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('.sticky.right').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.right + offsetX;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.9,
                           borderWidth: '2px',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('#main .sticky.left').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.left - offsetX + 10;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.7,
                           opacity: 0.6,
                           borderWidth: '6px',
                           borderColor: '#999999',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('#main .sticky.right').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.right + offsetX - 10;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.7,
                           opacity: 0.6,
                           borderWidth: '6px',
                           borderColor: '#999999',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('.nmp-button .sticky.left').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.left + 22;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.4,
                           opacity: 1,
                           borderWidth: '6px',
                           borderColor: '#000',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('.nmp-button .sticky.right').mouseenter(function (e) {
                        var rcBounds = $(this)[0].getBoundingClientRect();
                        var positionX = rcBounds.right - 22;
                        var positionY = rcBounds.top + rcBounds.height / 2;
                        gsap.to(ball, {
                           duration: 0.5,
                           x: positionX,
                           y: positionY,
                           scale: 0.4,
                           opacity: 1,
                           borderWidth: '6px',
                           borderColor: '#999999',
                        });
                        gsap.ticker.remove(updatePosition);
                     });

                     $('.sticky').mouseleave(function (e) {
                        gsap.to(ball, {
                           duration: 0.2,
                           scale: 0.5,
                           borderWidth: '4px',
                           borderColor: '#999999',
                           opacity: 1,
                        });
                        gsap.ticker.add(updatePosition);
                     });

                     $('.parallax-wrap').mouseenter(function (e) {
                        gsap.to(this, { duration: 0.3, scale: 2 });
                        gsap.to(ball, {
                           duration: 0.3,
                           scale: 0.9,
                           borderWidth: '2px',
                           opacity: 1,
                        });
                        gsap.to($(this).children(), { duration: 0.3, scale: 0.5 });
                        active = true;
                     });

                     $('#main .parallax-wrap.icon-wrap').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.3,
                           scale: 0.7,
                           borderWidth: '6px',
                           opacity: 0.6,
                           borderColor: '#999',
                        });
                     });

                     $('.nmp-button .parallax-wrap.icon-wrap').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.05,
                           scale: 0.4,
                           borderWidth: '0px',
                           opacity: 1,
                           borderColor: '#000',
                        });
                     });

                     $('.parallax-wrap.bigger').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.3,
                           scale: 1.35,
                           borderWidth: '2px',
                           opacity: 1,
                        });
                     });

                     $('.parallax-wrap').mouseleave(function (e) {
                        gsap.to(this, { duration: 0.3, scale: 1 });
                        gsap.to(ball, {
                           duration: 0.3,
                           scale: 0.5,
                           borderWidth: '4px',
                           opacity: 1,
                           borderColor: '#999999',
                        });
                        gsap.to($(this).children(), {
                           duration: 0.3,
                           scale: 1,
                           x: 0,
                           y: 0,
                        });
                        active = false;
                     });

                     $('.sticky').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.5,
                           borderColor: $('body').data('primary-color'),
                        });
                     });
                     $('#main .sticky').mouseenter(function (e) {
                        gsap.to(ball, { duration: 0.5, borderColor: '#999' });
                     });
                     $('.nmp-button .sticky').mouseenter(function (e) {
                        if ($('#page-content').hasClass('light-content')) {
                           gsap.to(ball, { duration: 0.5, borderColor: '#000' });
                        } else {
                           gsap.to(ball, { duration: 0.5, borderColor: '#fff' });
                        }
                     });
                     $('.parallax-wrap').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.3,
                           borderColor: $('body').data('primary-color'),
                        });
                     });
                     $('.nmp-button .parallax-wrap').mouseenter(function (e) {
                        if ($('#page-content').hasClass('light-content')) {
                           gsap.to(ball, { duration: 0.05, borderColor: '#000' });
                        } else {
                           gsap.to(ball, { duration: 0.05, borderColor: '#fff' });
                        }
                     });
                     $('.parallax-wrap.bigger').mouseenter(function (e) {
                        gsap.to(ball, {
                           duration: 0.3,
                           borderColor: $('body').data('primary-color'),
                        });
                     });
                     $('#main .parallax-wrap.icon-wrap').mouseenter(function (e) {
                        gsap.to(ball, { duration: 0.3, borderColor: '#999' });
                     });

                     $('.parallax-wrap').mousemove(function (e) {
                        parallaxCursor(e, this, 2);
                        callParallax(e, this);
                     });

                     function callParallax(e, parent) {
                        parallaxIt(e, parent, parent.querySelector('.parallax-element'), 20);
                     }

                     function parallaxIt(e, parent, target, movement) {
                        var boundingRect = parent.getBoundingClientRect();
                        var relX = e.pageX - boundingRect.left;
                        var relY = e.pageY - boundingRect.top;
                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                        gsap.to(target, {
                           duration: 0.3,
                           x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
                           y:
                              ((relY - boundingRect.height / 2 - scrollTop) / boundingRect.height) *
                              movement,
                           ease: Power2.easeOut,
                        });
                     }

                     function parallaxCursor(e, parent, movement) {
                        var rect = parent.getBoundingClientRect();
                        var relX = e.pageX - rect.left;
                        var relY = e.pageY - rect.top;
                        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
                        pos.y =
                           rect.top +
                           rect.height / 2 +
                           (relY - rect.height / 2 - scrollTop) / movement;
                        gsap.to(ball, { duration: 0.3, x: pos.x, y: pos.y });
                     }

                     $('.hide-ball').mouseenter(function (e) {
                        gsap.to('#ball', {
                           duration: 0.2,
                           borderWidth: '1px',
                           scale: 1,
                           opacity: 0,
                        });
                     });

                     $('.hide-ball').mouseleave(function (e) {
                        gsap.to('#ball', {
                           duration: 0.2,
                           borderWidth: '4px',
                           scale: 0.5,
                           opacity: 1,
                        });
                     });

                     $('.link, .button').mouseenter(function (e) {
                        gsap.to('#ball', {
                           duration: 0.2,
                           borderWidth: '0px',
                           scale: 1.5,
                           backgroundColor: 'rgba(153, 153, 153, 1)',
                           opacity: 0.15,
                        });
                        gsap.to('#ball-loader', {
                           duration: 0.2,
                           borderWidth: '2px',
                           top: 4,
                           left: 4,
                        });
                     });

                     $('.link, .button').mouseleave(function (e) {
                        gsap.to('#ball', {
                           duration: 0.3,
                           borderWidth: '4px',
                           scale: 0.5,
                           backgroundColor: 'rgba(153, 153, 153, 0)',
                           opacity: 1,
                        });
                        gsap.to('#ball-loader', {
                           duration: 0.2,
                           borderWidth: '4px',
                           top: 0,
                           left: 0,
                        });
                     });

                     //Blog Hover Effects
                     $(
                        '#blog-page-nav .page-numbers li a, .post-page-numbers, #post-content a, #post-form a, #post-comments a, .wp-block-search__button, .nmp-sidebar-widget a'
                     ).mouseenter(function (e) {
                        gsap.to('#ball', {
                           duration: 0.2,
                           borderWidth: '1px',
                           scale: 1,
                           opacity: 0,
                        });
                     });

                     $(
                        '#blog-page-nav .page-numbers li a, .post-page-numbers, #post-content a, #post-form a, #post-comments a, .wp-block-search__button, .nmp-sidebar-widget a'
                     ).mouseleave(function (e) {
                        gsap.to('#ball', {
                           duration: 0.3,
                           borderWidth: '4px',
                           scale: 0.5,
                           opacity: 1,
                        });
                     });
                  }

                  if (!transitionsSupported()) isAnimating = false;
               }, delay);
               if (url != window.location && bool) {
                  window.history.pushState({ path: url }, '', url);
               }
            });
         }

         function transitionsSupported() {
            return $('html').hasClass('csstransitions');
         }
      });
   }; // End Core
});

// Export functions to scripts
var ScrollEffects = window.ScrollEffects;
var FitThumbScreenWEBGL = window.FitThumbScreenWEBGL;
var FitThumbScreenGSAP = window.FitThumbScreenGSAP;
var Shortcodes = window.Shortcodes;
var Sliders = window.Sliders;
var JustifiedGrid = window.JustifiedGrid;
var Lightbox = window.Lightbox;
var PlayVideo = window.PlayVideo;
var isMobile = window.isMobile;
var Core = window.Core;
