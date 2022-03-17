import Banner from "../../../Base/v.1.0.0/banner.class";

//SPECIFIC BANNER CODE

class BannerTemplate extends Banner {

	constructor() {

		super();

	}

	buildHook() {

		//Here you can write any start code (dom elements already linked and Settings applied)

		if (!window.Banner) window.Banner = this;

		this.touch = false;

		this.currentSlide = 1;

		this.state = 'await';

		document.addEventListener("mouseup", this.handleCancel, true);

		this.addSliderEvents(this.els['cards']);
		this.addBottomSliderEvents(this.els['slider']);

		let eventEls = [];
		let sliderEventEls = [];
		let controlEls = [];
		let button = this.els['button'];

		for (let i = 1; i <= 10; i++) {

			this.els['card-' + i + '-texts'].appendChild(this.els['card-' + i + '-title']);
			this.els['card-' + i + '-texts'].appendChild(this.els['card-' + i + '-description']);
			this.els['card-' + i + '-texts'].appendChild(this.els['card-' + i + '-price']);
			this.els['card-' + i + '-texts'].appendChild(this.els['card-' + i + '-price-cross']);
			this.els['card-' + i + '-texts'].appendChild(this.els['card-' + i + '-price-discounted']);

			this.els['card-' + i].style.display = 'none';
			this.els['card-' + i].index = i;
			this.els['card-' + i + '-slide'].style.display = 'none';
			this.els['card-' + i + '-slide'].index = i;
			this.els['card-' + i + '-slide-control'].style.display = 'none';
			this.els['card-' + i + '-slide-control'].index = i;
			this.els['card-' + i + '-texts'].style.display = 'none';
			this.els['card-' + i + '-texts'].saveInnerHTML = true;
			this.els['card-' + i + '-texts'].index = i;

			let eventEl = [
				this.els['card-' + i],
				this.els['card-' + i + '-title'],
				this.els['card-' + i + '-description'],
				this.els['card-' + i + '-price'],
				this.els['card-' + i + '-price-cross'],
				this.els['card-' + i + '-price-discounted']
			];

			eventEls.push(eventEl);

			sliderEventEls.push(this.els['card-' + i + '-slide']);
			controlEls.push(this.els['card-' + i + '-slide-control']);

		}

		for (let i = 1; i <= this.Settings['cards-number'].value; i++) {

			this.els['card-' + i].style.display = 'block';
			this.els['card-' + i + '-slide'].style.display = 'inline-block';
			this.els['card-' + i + '-slide'].style.backgroundImage = this.els['card-' + i].style.backgroundImage;
			this.els['card-' + i + '-slide-control'].style.display = 'block';
			this.els['card-' + i + '-texts'].style.display = 'block';

			if (i === this.currentSlide) {
				this.els['card-' + i].style.visibility = 'visible';
				this.els['card-' + i + '-slide'].style.opacity = 1;
				this.els['card-' + i + '-slide'].classList.add("card-slide-active");
				this.els['card-' + i + '-slide-control'].classList.add("card-slide-control-active");
				this.els['card-' + i + '-texts'].style.visibility = 'visible';
			} else {
				this.els['card-' + i].style.visibility = 'hidden';
				this.els['card-' + i + '-slide'].style.opacity = 0.5;
				this.els['card-' + i + '-slide'].classList.add("card-slide-inactive");
				this.els['card-' + i + '-slide-control'].classList.add("card-slide-control-inactive");
				this.els['card-' + i + '-texts'].style.visibility = 'hidden';
			}

		}

		if (this.Settings['cards-number'].value > 3) {

			this.els['slider'].style.minWidth = 'max-content';

		} else {

			this.els['slider'].style.display = 'flex';
			this.els['slider'].style.justifyContent = 'center';

		}

		eventEls.forEach((el, index) => {

			el.forEach((cardItem, cardItemIndex) => {

				this.addSliderEvents(cardItem);

				if (cardItemIndex === 0 && !cardItem.redirectListener) {

					this.addRedirectEvent(cardItem, this.Settings['card-' + (index + 1) + '-target-url']);

				}

				if (index === 0 && !button.redirectListener) {

					this.addRedirectEvent(button, this.Settings['card-' + (index + 1) + '-target-url']);

				}

			});

		});

		sliderEventEls.forEach(el => {
			this.addBottomSliderEvents(el);
			this.addBottomClickEvent(el);
		});

		controlEls.forEach(el => this.addBottomClickEvent(el));

		let banner = document.getElementById('banner');
		banner.removeEventListener('click', banner.handler);
		banner.style.cursor = 'unset';

		button.appendChild(this.els['button-text']);

		button.style.cursor = 'pointer';

		this.startAnimation();

		if (this.Settings['button-animation'].value === 1) {

			this.els['button'].style['animation-name'] = 'pulse';
			this.els['button'].style['animation-duration'] = '0.6s';
			this.els['button'].style['animation-iteration-count'] = 'infinite';
			this.els['button'].style['animation-timing-function'] = 'ease-in-out';

		}

		for (let key in this.els) {

			this.els[key].style['-webkit-user-select'] = 'none';
			this.els[key].style['-khtml-user-select'] = 'none';
			this.els[key].style['-moz-user-select'] = 'none';
			this.els[key].style['-o-user-select'] = 'none';
			this.els[key].style['user-select'] = 'none';

		}

	}

	addBannerEventHook(event, handler) {

		//Here you can change banner click event areas if needed

	}

	applySettingHook(settingName, setting) {

		//Here you can apply the value of each banner setting

		if (!this.images) this.images = [
			'background',
			'icon',
			'button',
			'cards',
			'card-1-price-cross',
			'card-2-price-cross',
			'card-3-price-cross',
			'card-4-price-cross',
			'card-5-price-cross',
			'card-6-price-cross',
			'card-7-price-cross',
			'card-8-price-cross',
			'card-9-price-cross',
			'card-10-price-cross'
		];

		if (!this.cards) this.cards = [
			'card-1',
			'card-2',
			'card-3',
			'card-4',
			'card-5',
			'card-6',
			'card-7',
			'card-8',
			'card-9',
			'card-10',
		];

		if (!this.texts) this.texts = [
			'title',
			'sub-title',
			'card-1-title',
			'card-1-description',
			'card-1-price',
			'card-1-price-discounted',
			'card-2-title',
			'card-2-description',
			'card-2-price',
			'card-2-price-discounted',
			'card-3-title',
			'card-3-description',
			'card-3-price',
			'card-3-price-discounted',
			'card-4-title',
			'card-4-description',
			'card-4-price',
			'card-4-price-discounted',
			'card-5-title',
			'card-5-description',
			'card-5-price',
			'card-5-price-discounted',
			'card-6-title',
			'card-6-description',
			'card-6-price',
			'card-6-price-discounted',
			'card-7-title',
			'card-7-description',
			'card-7-price',
			'card-7-price-discounted',
			'card-8-title',
			'card-8-description',
			'card-8-price',
			'card-8-price-discounted',
			'card-9-title',
			'card-9-description',
			'card-9-price',
			'card-9-price-discounted',
			'card-10-title',
			'card-10-description',
			'card-10-price',
			'card-10-price-discounted',
			'button-text'
		];

		if (settingName.indexOf('-section') > -1) {

			if (setting.options && setting.options.unitsMultiplier) setting.unitsMultiplier = setting.options.unitsMultiplier;
			else setting.unitsMultiplier = 1;

			let sectionName = settingName.substring(0, settingName.indexOf('-section'));

			if (this.images.indexOf(sectionName) > -1) this.applySectionSetting(settingName, setting, sectionName);
			if (this.cards.indexOf(sectionName) > -1) this.applyCardSetting(settingName, setting, sectionName);
			if (this.texts.indexOf(sectionName) > -1) this.applyTextSetting(settingName, setting, sectionName);

			if (settingName === 'background-section-offset-x') this.els["background"].style.left = `${(setting.value - 500) * (setting.unitsMultiplier)}%`;

		}

	}

	applySectionSetting(settingName, setting, sectionName) {

		if (setting.options && setting.options.unitsMultiplier) setting.unitsMultiplier = setting.options.unitsMultiplier;
		else setting.unitsMultiplier = 1;

		if (settingName === `${sectionName}-section-asset`) {

			this.applyAsset(this.els[sectionName], this.Assets[setting.value]);

			if (['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7', 'card-8', 'card-9', 'card-10'].indexOf(sectionName) > -1) {

				this.els[sectionName].style['mask-image'] = this.els[sectionName].style.backgroundImage;
				this.els[sectionName].style['-webkit-mask-image'] = this.els[sectionName].style.backgroundImage;
				this.els[sectionName].style['mask-position'] = "0px center";
				this.els[sectionName].style['-webkit-mask-position'] = "0px center";
				this.els[sectionName].style['mask-size'] = "contain";
				this.els[sectionName].style['-webkit-mask-size'] = "contain";

			}

		}

		if (settingName === `${sectionName}-section-width-percent`) this.els[sectionName].style.width = `${setting.value * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-x`) this.els[sectionName].style.left = `${(setting.value) * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-y`) this.els[sectionName].style.top = `${(setting.value - 500) * (setting.unitsMultiplier)}%`;

	}

	applyCardSetting(settingName, setting, sectionName) {

		if (setting.options && setting.options.unitsMultiplier) setting.unitsMultiplier = setting.options.unitsMultiplier;
		else setting.unitsMultiplier = 1;

		if (settingName === `${sectionName}-section-asset`) {

			this.applyAsset(this.els[sectionName], this.Assets[setting.value]);

			if (['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7', 'card-8', 'card-9', 'card-10'].indexOf(sectionName) > -1) {

				this.els[sectionName].style['mask-image'] = this.els[sectionName].style.backgroundImage;
				this.els[sectionName].style['-webkit-mask-image'] = this.els[sectionName].style.backgroundImage;
				this.els[sectionName].style['mask-position'] = "0px center";
				this.els[sectionName].style['-webkit-mask-position'] = "0px center";
				this.els[sectionName].style['mask-size'] = "contain";
				this.els[sectionName].style['-webkit-mask-size'] = "contain";

			}

		}

		if (settingName === `${sectionName}-section-width-percent`) this.els[sectionName].style.backgroundSize = `${setting.value * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-x`) this.els[sectionName].style.backgroundPositionX = `${(setting.value) * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-y`) this.els[sectionName].style.backgroundPositionY = `${(setting.value) * (setting.unitsMultiplier)}%`;

	}

	applyTextSetting(settingName, setting, sectionName) {

		if (setting.options && setting.options.unitsMultiplier) setting.unitsMultiplier = setting.options.unitsMultiplier;
		else setting.unitsMultiplier = 1;

		if (settingName === `${sectionName}-section-text`) this.els[sectionName].innerHTML = `${setting.value}`;
		if (settingName === `${sectionName}-section-font-size`) this.els[sectionName].style.fontSize = `${setting.value}px`;
		if (settingName === `${sectionName}-section-font-color`) this.els[sectionName].style.color = `${setting.value}`;
		if (settingName === `${sectionName}-section-width-percent`) this.els[sectionName].style.width = `${setting.value * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-x`) this.els[sectionName].style.left = `${(setting.value) * (setting.unitsMultiplier)}%`;
		if (settingName === `${sectionName}-section-offset-y`) this.els[sectionName].style.top = `${(setting.value) * (setting.unitsMultiplier)}%`;

	}

	applyAssetHook(el, asset) {

		//Here you can additionally apply the value of each banner asset if default behavior is not suitable for this banner template

	}

	toDataURL(src, callback, outputFormat) {

		let isBase64 = new RegExp('/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/').test(src);
		let isUrl = new RegExp('/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/').test(src);
		if (isBase64 || !isUrl || !src) callback(src);

		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function() {
			let canvas = document.createElement('CANVAS');
			let ctx = canvas.getContext('2d');
			let dataURL;
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;
			ctx.drawImage(this, 0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			callback(dataURL);
		};
		img.src = src;
		if (img.complete || img.complete === undefined) {
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			img.src = src;
		}

	}

	addSliderEvents(el) {

		el.addEventListener("touchstart", window.Banner.handleStart, true);
		el.addEventListener("touchend", window.Banner.handleEnd, true);
		el.addEventListener("touchcancel", window.Banner.handleCancel, true);
		el.addEventListener("touchmove", window.Banner.handleMove, true);
		el.addEventListener("mousedown", window.Banner.handleStart, true);
		el.addEventListener("mouseup", window.Banner.handleEnd, true);
		el.addEventListener("mouseout", window.Banner.handleCancel, true);
		el.addEventListener("mousemove", window.Banner.handleMove, true);

	}

	addBottomSliderEvents(el) {

		el.addEventListener("touchstart", window.Banner.handleBottomStart, true);
		el.addEventListener("touchend", window.Banner.handleBottomEnd, true);
		el.addEventListener("touchcancel", window.Banner.handleCancel, true);
		el.addEventListener("touchmove", window.Banner.handleBottomMove, true);
		el.addEventListener("mousedown", window.Banner.handleBottomStart, true);
		el.addEventListener("mouseup", window.Banner.handleBottomEnd, true);
		el.addEventListener("mouseout", window.Banner.handleBottomCancel, true);
		el.addEventListener("mousemove", window.Banner.handleBottomMove, true);

	}

	addBottomClickEvent(el) {

		el.addEventListener("click", window.Banner.handleBottomClick, true);

	}

	handleStart(e) {

		if (window.Banner.state === 'await') {

			if (window.Banner['CardsSwipeTimeout']) {
				window.Banner['CardsSwipeTimeout'].kill();
				window.Banner['CardsSwipeTimeout'] = null;
			}

			window.Banner.touch = true;
			window.Banner.startPoint = e.clientX;
		}

	}

	handleEnd(e) {

		if (window.Banner['CardsSwipeTimeout']) {
			window.Banner['CardsSwipeTimeout'].kill();
			window.Banner['CardsSwipeTimeout'] = null;
		}

		window.Banner.startAnimation();
		window.Banner.touch = false;
		window.Banner.startPoint = null;

	}

	handleCancel(e) {

		if (window.Banner['CardsSwipeTimeout']) {
			window.Banner['CardsSwipeTimeout'].kill();
			window.Banner['CardsSwipeTimeout'] = null;
		}

		window.Banner.startAnimation();
		window.Banner.touch = false;
		window.Banner.startPoint = null;

	}

	handleMove(e) {

		if (window.Banner.state === 'await' && window.Banner.touch && window.Banner.startPoint) {

			let point = e.clientX;

			let distance = Math.abs((window.Banner.startPoint + 10000) - (point + 10000));

			if (distance > 10 && window.Banner.startPoint < point) {

				window.Banner.handleSwipe('right');

			} else if (distance > 10 && window.Banner.startPoint > point) {

				window.Banner.handleSwipe('left');

			}

			if (window.Banner['CardsSwipeTimeout']) {
				window.Banner['CardsSwipeTimeout'].kill();
				window.Banner['CardsSwipeTimeout'] = null;
			}

		}

	}

	handleBottomStart(e) {

		if (window.Banner.state === 'await') {

			if (window.Banner['CardsSwipeTimeout']) {
				window.Banner['CardsSwipeTimeout'].kill();
				window.Banner['CardsSwipeTimeout'] = null;
			}

			window.Banner.bottomSliderTouch = true;
			window.Banner.bottomSliderStartPoint = e.clientX;
			window.Banner.bottomSliderStartOffset = window.Banner.els['slider'].offsetLeft || 0;

		}

	}

	handleBottomEnd(e) {

		if (window.Banner['CardsSwipeTimeout']) {
			window.Banner['CardsSwipeTimeout'].kill();
			window.Banner['CardsSwipeTimeout'] = null;
		}

		window.Banner.startAnimation();
		window.Banner.bottomSliderTouch = false;
		window.Banner.bottomSliderStartPoint = null;
		window.Banner.bottomSliderStartOffset = null;

	}

	handleBottomCancel(e) {

		if (window.Banner['CardsSwipeTimeout']) {
			window.Banner['CardsSwipeTimeout'].kill();
			window.Banner['CardsSwipeTimeout'] = null;
		}

		window.Banner.startAnimation();
		window.Banner.bottomSliderTouch = false;
		window.Banner.bottomSliderStartPoint = null;
		window.Banner.bottomSliderStartOffset = null;

	}

	handleBottomMove(e) {

		if (window.Banner.state === 'await' && window.Banner.bottomSliderTouch && window.Banner.bottomSliderStartPoint) {

			let point = e.clientX;

			let distance = Math.abs((window.Banner.bottomSliderStartPoint + 10000) - (point + 10000));

			if (distance > 0 && window.Banner.bottomSliderStartPoint < point) {

				if (window.Banner.els['slider'].offsetLeft < 0) {

					window.Banner.els['slider'].style.left = (window.Banner.bottomSliderStartOffset + distance) + 'px';

				}

			} else if (distance > 0 && window.Banner.bottomSliderStartPoint > point)  {

				if (window.Banner.bottomSliderStartOffset - distance > window.Banner.els['content'].offsetWidth * 0.4 - window.Banner.els['slider'].offsetWidth) {

					window.Banner.els['slider'].style.left = (window.Banner.bottomSliderStartOffset - distance) + 'px';

				}

			}

			if (window.Banner['CardsSwipeTimeout']) {
				window.Banner['CardsSwipeTimeout'].kill();
				window.Banner['CardsSwipeTimeout'] = null;
			}

		}

	}

	handleBottomClick(e) {

		if (window.Banner['CardsSwipeTimeout']) {
			window.Banner['CardsSwipeTimeout'].kill();
			window.Banner['CardsSwipeTimeout'] = null;
		}

		if (window.Banner.currentSlide !== e.target.index && window.Banner.state === 'await') window.Banner.handleSelect(e.target.index);

	}

	handleSelect(index, skipSwipe) {

		let bottomSlides = [].slice.call(window.Banner.els['slider'].children);
		let bottomControls = [].slice.call(window.Banner.els['slider-controls'].children);

		if (!skipSwipe) window.Banner.handleSwipe('left', index);

		let distance = -bottomSlides[index - 1].offsetLeft - bottomSlides[index - 1].offsetWidth / 2 + window.Banner.els['content'].offsetWidth / 2 * 0.4;

		if (distance < window.Banner.els['content'].offsetWidth * 0.4 - window.Banner.els['slider'].offsetWidth) distance = window.Banner.els['content'].offsetWidth * 0.4 - window.Banner.els['slider'].offsetWidth;

		if (distance > 0) distance = 0;

		window.gsap.to(window.Banner.els['slider'], {
			left: distance,
			duration: 1
		});

		bottomSlides.forEach((slide) => {

			if (index !== slide.index) {

				slide.classList.remove('card-slide-active');
				slide.classList.add('card-slide-inactive');

			} else {

				slide.classList.remove('card-slide-inactive');
				slide.classList.add('card-slide-active');

			}

		});

		bottomControls.forEach((control) => {

			if (index !== control.index) {

				control.classList.remove('card-slide-control-active');
				control.classList.add('card-slide-control-inactive');

			} else {

				control.classList.remove('card-slide-control-inactive');
				control.classList.add('card-slide-control-active');

			}

		});

	}

	handleSwipe(direction, index) {

		if (index) direction = 'left';

		if (window.Banner.state === 'await') {

			window.Banner.state = 'transition';

			let els = [
				window.Banner.els['card-' + window.Banner.currentSlide],
				window.Banner.els['card-' + window.Banner.currentSlide + '-texts']
			];

			let new_els = [];

			if (direction === 'right') {

				window.Banner.currentSlide--;

				if (window.Banner.currentSlide < 1) {

					window.Banner.currentSlide = window.Banner.Settings['cards-number'].value;

				}

				els[0].style['mask-size'] = 'cover';
				els[0].style['-webkit-mask-size'] = 'cover';
				els[0].style['mask-repeat'] = 'no-repeat';
				els[0].style['-webkit-mask-repeat'] = 'no-repeat';
				els[0].style['mask-position'] = '0px center';
				els[0].style['-webkit-mask-position'] = '0px center';
				els[0].startOffsetLeft = els[0].offsetLeft;
				els[0].endOffsetLeft = els[0].offsetLeft + els[0].offsetWidth;
				els[0].style.left = els[0].startOffsetLeft + 'px';

				new_els = [
					window.Banner.els['card-' + window.Banner.currentSlide],
					window.Banner.els['card-' + window.Banner.currentSlide + '-texts']
				];

				new_els[0].endOffsetLeft = new_els[0].offsetLeft;
				new_els[0].style.left = (new_els[0].offsetLeft - new_els[0].offsetWidth) + 'px';
				new_els[0].startOffsetLeft = new_els[0].offsetLeft;

				new_els[0].style['mask-size'] = 'cover';
				new_els[0].style['-webkit-mask-size'] = 'cover';
				new_els[0].style['mask-repeat'] = 'no-repeat';
				new_els[0].style['-webkit-mask-repeat'] = 'no-repeat';
				new_els[0].style['mask-position'] = (new_els[0].startOffsetLeft + new_els[0].offsetWidth) + 'px center';
				new_els[0].style['-webkit-mask-position'] = (new_els[0].startOffsetLeft + new_els[0].offsetWidth) + '0px center';
				new_els[0].startMaskPosX = (new_els[0].startOffsetLeft + new_els[0].offsetWidth);

				window.Banner.timeout(() => {

					new_els[0].style.visibility = 'visible';

					window.gsap.to(els[0], {
						left: els[0].endOffsetLeft + 'px',
						duration: 1,
						onUpdate: () => {
							let maskPosX = -(els[0].offsetLeft - els[0].startOffsetLeft);
							els[0].style['mask-position'] = maskPosX + 'px center';
							els[0].style['-webkit-mask-position'] = maskPosX + 'px center';
						},
						onComplete: () => {
							els[0].style.left = els[0].startOffsetLeft + 'px';
							els[0].style['mask-position'] = "0px center";
							els[0].style['-webkit-mask-position'] = "0px center";
							els[0].style['mask-size'] = "contain";
							els[0].style['-webkit-mask-size'] = "contain";
							els[0].style.visibility = 'hidden';
						}
					});

					window.gsap.to(new_els[0], {
						left: new_els[0].endOffsetLeft,
						duration: 1,
						onUpdate: () => {
							let maskPosX = new_els[0].startMaskPosX - new_els[0].offsetLeft;
							new_els[0].style['mask-position'] = maskPosX + 'px center';
							new_els[0].style['-webkit-mask-position'] = maskPosX + 'px center';
						},
						onComplete: () => {
							window.Banner.state = 'await';
							new_els[0].startMaskPosX = null;

							if (window.Banner['CardsSwipeTimeout']) {
								window.Banner['CardsSwipeTimeout'].kill();
								window.Banner['CardsSwipeTimeout'] = null;
							}

							window.Banner.startAnimation();
						}
					});

				});

			} else if (direction === 'left') {

				if (index) window.Banner.currentSlide = index;
				else window.Banner.currentSlide++;

				if (window.Banner.currentSlide > window.Banner.Settings['cards-number'].value) {

					window.Banner.currentSlide = 1;

				}

				els[0].startOffsetLeft = els[0].offsetLeft;
				els[0].style['mask-size'] = 'cover';
				els[0].style['-webkit-mask-size'] = 'cover';
				els[0].style['mask-repeat'] = 'no-repeat';
				els[0].style['-webkit-mask-repeat'] = 'no-repeat';
				els[0].style['mask-position'] = els[0].startOffsetLeft - els[0].offsetLeft + 'px center';
				els[0].style['-webkit-mask-position'] = els[0].startOffsetLeft - els[0].offsetLeft + 'px center';

				new_els = [
					window.Banner.els['card-' + window.Banner.currentSlide],
					window.Banner.els['card-' + window.Banner.currentSlide + '-texts']
				];

				new_els[0].endOffsetLeft = new_els[0].offsetLeft;
				new_els[0].style.left = (new_els[0].offsetLeft + new_els[0].offsetWidth) + 'px';
				new_els[0].startOffsetLeft = new_els[0].offsetLeft;

				new_els[0].style['mask-size'] = 'cover';
				new_els[0].style['-webkit-mask-size'] = 'cover';
				new_els[0].style['mask-repeat'] = 'no-repeat';
				new_els[0].style['-webkit-mask-repeat'] = 'no-repeat';
				new_els[0].style['mask-position'] = -(new_els[0].startOffsetLeft - new_els[0].endOffsetLeft) + 'px center';
				new_els[0].style['-webkit-mask-position'] = -(new_els[0].startOffsetLeft - new_els[0].endOffsetLeft) + 'px center';
				new_els[0].startMaskPosX = -(new_els[0].startOffsetLeft - new_els[0].endOffsetLeft);

				window.Banner.timeout(() => {

					new_els[0].style.visibility = 'visible';

					window.gsap.to(els[0], {
						left: (els[0].offsetLeft - els[0].offsetWidth) + 'px',
						duration: 1,
						onUpdate: () => {
							let maskPosX = els[0].startOffsetLeft - els[0].offsetLeft;
							els[0].style['mask-position'] = maskPosX + 'px center';
							els[0].style['-webkit-mask-position'] = maskPosX + 'px center';
						},
						onComplete: () => {
							els[0].style.left = els[0].startOffsetLeft + 'px';
							els[0].style['mask-position'] = "0px center";
							els[0].style['-webkit-mask-position'] = "0px center";
							els[0].style['mask-size'] = "contain";
							els[0].style['-webkit-mask-size'] = "contain";
							els[0].style.visibility = 'hidden';
						}
					});

					let maskPosX = new_els[0].startMaskPosX + (new_els[0].startOffsetLeft - new_els[0].offsetLeft);

					window.gsap.to(new_els[0], {
						left: new_els[0].endOffsetLeft,
						opacity: 1,
						duration: 1,
						onUpdate: () => {
							maskPosX = new_els[0].startMaskPosX + (new_els[0].startOffsetLeft - new_els[0].offsetLeft);
							new_els[0].style['mask-position'] = maskPosX + 'px center';
							new_els[0].style['-webkit-mask-position'] = maskPosX + 'px center';
						},
						onComplete: () => {
							window.Banner.state = 'await';
							new_els[0].startMaskPosX = null;

							if (window.Banner['CardsSwipeTimeout']) {
								window.Banner['CardsSwipeTimeout'].kill();
								window.Banner['CardsSwipeTimeout'] = null;
							}

							window.Banner.startAnimation();
						}
					});

				});

			}

			new_els[1].style.opacity = 0;
			new_els[1].style.visibility = 'visible';

			window.gsap.to(els[1], {
				opacity: 0,
				duration: 1,
				onComplete: () => {
					els[1].style.visibility = 'hidden';
				}
			});

			window.gsap.to(new_els[1], {
				opacity: 1,
				duration: 1
			});

			if (!index) window.Banner.handleSelect(this.currentSlide, true);

			this.els['button'].removeEventListener('click', this.els['button'].redirectListener);

			this.addRedirectEvent(this.els['button'], this.Settings['card-' + this.currentSlide + '-target-url']);

		}

	}

	setMaskFrom(el, from) {
		el.style['mask-image'] = from.style.backgroundImage;
		el.style['-webkit-mask-image'] = from.style.backgroundImage;
		el.style['mask-position'] = from.style['mask-position'];
		el.style['-webkit-mask-position'] = from.style['-webkit-mask-position'];
		el.style['mask-size'] = from.style['mask-size'];
		el.style['-webkit-mask-size'] = from.style['-webkit-mask-size'];
	}

	startAnimation(timeout = 3000) {

		if (this.Settings['cards-auto-rotate'].value === 1 && window.Banner.state === 'await' && !window.Banner['CardsSwipeTimeout']) {

			this['CardsSwipeTimeout'] = window.Banner.timeout(() => {

				this.handleSwipe('left');

				if (window.Banner['CardsSwipeTimeout']) window.Banner['CardsSwipeTimeout'].kill();

				this['CardsSwipeTimeout'] = null;

				this.startAnimation();

			}, timeout);

		}

	}

	animateArrow(arrow) {

		arrow.initOffsetWidth = arrow.offsetWidth;
		arrow.initOffsetLeft = arrow.offsetLeft;

		window.gsap.to(arrow, {
			width: arrow.initOffsetWidth / 1.2 + 'px',
			duration: 0.25,
			onUpdate: () => {
				if (arrow === window.Banner.els['phone-arrow-right']) {

					arrow.style.left = (arrow.initOffsetLeft + (arrow.initOffsetWidth - arrow.offsetWidth)) + 'px'

				}
			},
			onComplete: () => {
				window.gsap.to(arrow, {
					width: arrow.initOffsetWidth + 'px',
					duration: 0.25,
					onUpdate: () => {
						if (arrow === window.Banner.els['phone-arrow-right']) {

							arrow.style.left = (arrow.initOffsetLeft + (arrow.initOffsetWidth - arrow.offsetWidth)) + 'px'

						}
					}
				});
			}
		});

	}

	tweenParticle(particle) {

		if (!particle) return;

		const endOpacity = 0;
		const endScale = 0.85;
		const width = this.Settings['banner-width'].value;
		const height = this.Settings['banner-height'].value;

		let x = gsap.utils.random(-3 *  width/ 4, 3 * width / 4);
		let y = gsap.utils.random(-3 * height / 4, 3 * height / 4);
		let duration = gsap.utils.random(700, 1400) / 1000;
		let rotation = gsap.utils.random(100, 700);

		gsap.to(particle, {
			x: x,
			y: y,
			duration: duration,
			rotation: rotation,
			ease: Power1.easeOut,
			onComplete: () => {
				particle.remove();
			}
		});

		gsap.to(particle, {
			startAt: { scale: 0.5 },
			scale: endScale,
			ease: Back.easeOut.config(10),
			duration: duration
		});

		gsap.to(particle, {
			startAt: { opacity: 1 },
			opacity: endOpacity,
			ease: Expo.easeIn,
			duration: duration
		});

	}

	buildParticle(parent, asset) {

		if (!asset) asset = this.Assets[this.Settings['particle-asset'].value];

		if (!asset || !asset.url) return;

		let particleWidth = `${this.Settings['particle-size'].value}px`;
		let particle = document.createElement('img');

		particle.className = 'particle';
		particle.src = asset.url;
		particle.style.width = particleWidth;
		parent.appendChild(particle);

		return particle;

	}

	timeout(fn, time) {

		return gsap.delayedCall(time / 1000, fn.bind(this));

	}

	getTime(date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		let strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	addRedirectEvent(el, url) {

		if (el && url) {

			el.redirectUrl = url;

			el.redirectListener = null;

			el.redirectListener = () => {

				if (window.Banner.state !== 'transition' && !window.Banner.redirected) {

					this.redirectTimeout();

					let setting = el.redirectUrl;

					if (setting && typeof setting.value === 'object' && setting.value !== null) {

						setting = setting.value;

						if (this.isIos && setting['ios']) setting.value = setting['ios'];
						else if (this.isAndroid && setting['android']) setting.value = setting['android'];
						else setting.value = setting['base'] || setting['ios'] || setting['android'];

					}

					let targetUrl = setting;

					if (targetUrl) {

						if (window.mraid) {

							if ((targetUrl.value.indexOf("play.google.com") > -1 || targetUrl.value.indexOf("apple.com") > -1) && mraid.openStoreUrl) mraid.openStoreUrl(targetUrl.value);

							else mraid.open(targetUrl.value);

						} else window.open(targetUrl.value, '_blank');

					}

				}

			};

			el.addEventListener('click', el.redirectListener);

		}

	}

	redirectTimeout() {

		window.Banner.redirected = true;

		window.setTimeout(() => {

			window.Banner.redirected = false;

		}, 1000);

	}

}

//window.Banner will allow to modify its data and behavior in Releases
window.addEventListener("load", () => window.Banner = new BannerTemplate());