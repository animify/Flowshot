import * as $ from 'jquery';

export default class Modal {
    constructor() {
        this.setEventClick();
    }

    setEventClick() {
        $('body').on('click', '[modal-toggle]', (e) => {
            const modalName = $(e.target).attr('modal-toggle');
            this.toggle(modalName);
        }).on('click', '[modal-cancel]', (e) => {
            const modalName = $(e.target).parents('.modal-container').attr('modal-name');
            this.close(modalName);
        });
    }

    open(name) {
        $(`[modal-name="${name}"]`).addClass('open');
    }

    close(name) {
        $(`[modal-name="${name}"]`).removeClass('open');
    }

    toggle(name) {
        const modal = $(`[modal-name="${name}"]`);
        if (modal.hasClass('open')) {
            this.close(name);
        } else {
            this.open(name);
        }
    }
}
