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
  }

  destroy() {
    super.destroy();
  }

  createPlayer( readyCallback = null ) {
    var that = this;

    $(document).ready(function () {
      that.resizeYouku();
    });
    $(window).resize(that.resizeYouku.bind(that));

    let videoId = this.videoId;

    const href = `https://player.youku.com/embed/${this.videoId}`;
    const videoIframeString = `<iframe scrolling="no" frameborder="0" id="player" src="${href}" allowfullscreen="true" style="position: absolute; z-index: 10; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;"></iframe>`;

    this.iframeContainer = this.slide.querySelector('.splide__video');

    this.iframeContainer.innerHTML = videoIframeString;

    this.iframe = this.slide.querySelector('.splide__video > iframe');

    return null;
  }

  clearPlayer() {
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

  resizeYouku() {
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
    const url    = this.slide.getAttribute( 'data-splide-youku' );
    const regExp = /\/v_show\/id_([0-9A-Z_]+)/i;
    const match  = url.match( regExp );

    const videoId = ( match && match[ 1 ] ) ? match[1] : '';

    return videoId;
  }

  playVideo() {
  }

  pauseVideo() {
  }
}