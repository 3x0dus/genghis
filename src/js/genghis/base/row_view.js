Genghis.Base.RowView = Backbone.View.extend({
    tagName: 'tr',
    events: {
        'click a.name':         'navigate',
        'click button.destroy': 'destroy'
    },
    initialize: function() {
        _.bindAll(this, 'render', 'navigate', 'remove', 'destroy');

        this.model.bind('change',  this.render);
        this.model.bind('destroy', this.remove);
    },
    render: function() {
        $(this.el).html(this.template(this.model));
        $(this.el).find('.label[title]').tooltip({placement: 'below'});
        this.$('.has-details').popover({
            html: true,
            content: function() { return $(this).siblings('.details').html(); },
            title: function() { return $(this).siblings('.details').attr('title'); },
            trigger: 'manual'
        }).hoverIntent(
            function() { $(this).popover('show'); },
            function() { $(this).popover('hide'); }
        );
        return this;
    },
    navigate: function(e) {
        e.preventDefault();
        Genghis.app.router.navigate(Genghis.Util.route($(e.target).attr('href')), true);
    },
    remove: function() {
        $(this.el).remove();
        this.unbind();
    },
    destroy: function() {
        var model = this.model;
        apprise(
            'Really? There is no undo.',
            {
                confirm: true,
                textOk: '<strong>Yes</strong>, delete '+(model.has('name') ? model.get('name') : '')+' forever'
            },
            function(r) { if (r) model.destroy(); }
        );
    }
});
