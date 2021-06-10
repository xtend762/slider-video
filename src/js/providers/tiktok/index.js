import BaseProvider from '../base/base-provider';
import Player from './player';

export default class TikTok extends BaseProvider {
  constructor( Splide, Components ) {
    super( Splide, Components );
    this.createPlayers( Player, 'data-splide-tiktok' );
  }
}