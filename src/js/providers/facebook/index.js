import BaseProvider from '../base/base-provider';
import Player from './player';

export default class Facebook extends BaseProvider {
  constructor( Splide, Components ) {
    super( Splide, Components );
    this.createPlayers( Player, 'data-splide-facebook' );
  }
}