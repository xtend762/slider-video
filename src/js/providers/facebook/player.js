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
    this.fbPlayer = null;
  }

  destroy() {
    super.destroy();
  }

  createPlayer( readyCallback = null ) {
    var that = this;

    $(document).ready(function () {
      that.resizeFB();
    });
    $(window).resize(that.resizeFB.bind(that));

    let videoId = this.videoId;
    let htmlVideo = '<div class="fb-video" id="carousel-fb-video-' + videoId + '" data-href="https://www.facebook.com/facebook/videos/' + videoId + '/" data-allowfullscreen="true" data-autoplay="true"></div>';
    this.slide.querySelector('.splide__video').innerHTML = htmlVideo;
    FB.XFBML.parse();

    FB.Event.subscribe('xfbml.ready', function(msg) {
      if (msg.type === 'video' && msg.id === 'carousel-fb-video-' + videoId) {
        that.resizeFB();

        that.fbPlayer = msg.instance;

        var playEventHandler = that.fbPlayer.subscribe('startedPlaying', that.onPlay.bind( that ));
        var pausedEventHandler = that.fbPlayer.subscribe('paused', that.onPause.bind( that ));
        var endedEventHandler = that.fbPlayer.subscribe('finishedPlaying', that.onEnded.bind( that ));

        if(readyCallback) {
          readyCallback();
          that.state.set(PLAYING);
        }
      }
    });

    return null;
  }

  resizeFB() {
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
    const url    = this.slide.getAttribute( 'data-splide-facebook' );
    const regExp = /\/videos\/(\d+)/;
    const match  = url.match( regExp );

    const videoId = ( match && match[ 1 ] ) ? match[1] : '';
    return videoId;
  }

  playVideo() {
    this.fbPlayer.play();
  }

  pauseVideo() {
    this.fbPlayer.pause();
  }
}