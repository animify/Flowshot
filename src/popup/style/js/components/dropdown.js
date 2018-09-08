import * as $ from 'jquery';

export default class Dropdown {
    constructor() {
        this.setEventClick();
        this.setEventHover();
    }

    setEventClick() {
        $('body').on('click', '.toggle, .menu a', (e) => {
            $(e.target).parents('.dropdown').toggleClass('open');
            $('.dropdown.open').not($(e.target).parents('.dropdown')).removeClass('open');
        });
    }

    setEventHover() {
        $('body').on('mouseenter', '.dropdown.hover', (e) => {
            console.log(e);
            $(e.currentTarget).addClass('open');
        }).on('mouseleave', '.dropdown.hover.open', (e) => {
            $(e.currentTarget).removeClass('open');
        });
    }
}
