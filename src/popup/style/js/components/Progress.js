import * as $ from 'jquery';

export default class Progress {
    constructor() {
        this.load();
        this.loadActive();
    }

    load() {
        $('.progress:not(.active) .bar[percentage]').each((i, e) => {
            const target = $(e);
            const status = target.find('.status');
            const percentage = Math.ceil(target.attr('percentage')) + '%';

            target.css('width', percentage);
            status.text(percentage);
        });
    }

    loadActive() {
        $('.progress.active:not(.loaded) .bar[percentage]').each((i, e) => {
            const target = $(e);
            const status = target.find('.status');
            const percentage = Math.ceil(target.attr('percentage'));

            $({ countNum: 0 }).animate({ countNum: percentage }, {
                duration: 1600,
                easing: 'linear',
                step: function () {
                    let pct = '';
                    if (percentage == 0) {
                        pct = Math.floor(this.countNum) + '%';
                    } else {
                        pct = Math.floor(this.countNum + 1) + '%';
                    }

                    status.text(pct) && target.css('width', pct);
                },
                done: () => target.parent('.progress').addClass('loaded')
            });
        });
    }
}
