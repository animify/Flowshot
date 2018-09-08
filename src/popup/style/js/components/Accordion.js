import * as $ from 'jquery';

export default class Accordion {
    constructor() {
        this.setEventClick();
    }

    setEventClick() {
        $('body').on('click', '.accordion .title', (e) => {
            const target = $(e.target);

            if (target.parent().hasClass('single') && !target.hasClass('open')) {
                $('.accordion .title, .accordion .content').removeClass('open');
                $('.accordion .content').slideUp('fast');
            }

            if (target.hasClass('open')) {
                target.removeClass('open').next().slideUp('fast');
            } else {
                target.addClass('open').next().slideDown('fast');
            }
        });
    }
}
