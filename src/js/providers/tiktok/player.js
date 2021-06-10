import BasePlayer from '../base/base-player';
import {
  NOT_INITIALIZED,
  IDLE,
  LOADING,
  PLAYING,
  PLAY_REQUEST_ABORTED,
  CREATING_PLAYER,
  PENDING_PLAY
} from "../../constants/states";

export default class Player extends BasePlayer {
  constructor( Splide, Components, slide ) {
    super(Splide, Components, slide);
    this.iframe = null;
    this.iframeContainer = null;
    if(this.isHandlingClicks()) {
      this.onSlideMoved();
    }
    this.lastActiveState = false;
    this.videoId = this.findVideoId();
  }

  destroy() {
    super.destroy();
  }

  createPlayer( readyCallback = null ) {
    var that = this;

    $(document).ready(function () {
      that.resizeTikTok();
    });
    $(window).resize(that.resizeTikTok.bind(that));

    let videoId = this.videoId;

    const videoIframeString = `<blockquote class="tiktok-embed-carousel" data-video-id="${videoId}" style="max-width: 325px;min-width: 325px; transform: scale(.85); top: -50px; height: 772px;"><iframe src="https://www.tiktok.com/embed/v2/${videoId}?lang=en-US" style="width: 100%; height: 772px; display: block; visibility: unset; max-height: 772px;" frameborder="0"></iframe></blockquote>`;

    this.iframeContainer = this.slide.querySelector('.splide__video');

    this.iframeContainer.innerHTML = videoIframeString;

    this.iframe = this.slide.querySelector('.splide__video > iframe');

    let blockContainer = $(this.iframeContainer).find('.blockquote');

    // setTimeout(() => {
    //   $(blockContainer).css({ transform: 'scale(.85)' });
    // }, 100);

    // this.setSplideHeightForTikTok(true);

    return null;
  }

  /*
  setSplideHeightForTikTok(shown) {
    return;

    if(shown) {
      $(this.slide.querySelector('.splide__video')).parent('.splide__slide').height('772px');
    } else {
      $(this.slide.querySelector('.splide__video')).parent('.splide__slide').height('378px');
    }
  }
  */

  clearPlayer() {
    // this.setSplideHeightForTikTok(false);
    this.iframeContainer.innerHTML = '';
    this.state.set(NOT_INITIALIZED);
  }

  onSlideMoved() {
    const that = this;
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
          const attributeValue = $(mutation.target).prop(mutation.attributeName);
          if(attributeValue.match(/is-active/i)) {
            that.lastActiveState = true;
          } else {
            if(that.lastActiveState) {
              that.clearPlayer();
            }
            that.lastActiveState = false;
          }
        }
      });
    });
    observer.observe(this.slide, {
      attributes: true
    });
  }

  resizeTikTok() {
    return;
    let thisSlide = $(this.slide);

    let containerWidth = thisSlide.width();
    let iframeOldWidth = $(thisSlide).find("iframe").width();
    let iframeOldHeight = $(thisSlide).find("iframe").height();

    $(thisSlide).find("iframe").attr("width", containerWidth);

    let containerHeight = $(this.slide).height();
    let frameHeight = iframeOldHeight * (containerWidth / iframeOldWidth);
    let frameTop = (containerHeight - frameHeight) / 2;

    $(thisSlide).find("iframe").attr("height", frameHeight);
    if(frameTop > 0) {
      $(thisSlide).find("iframe").css("top", frameTop);
    }
  }

  findVideoId() {
    const url    = this.slide.getAttribute( 'data-splide-tiktok' );
    const regExp = /\/([0-9]+)[^\/]*$/i;
    const match  = url.match( regExp );

    const videoId = ( match && match[ 1 ] ) ? match[1] : '';

    return videoId;
  }

  playVideo() {
  }

  pauseVideo() {
  }
}