(function () {
  'use strict';

  var Model = function (data) {
    var listeners = [];
    this.data = data;

    this.addOnUpdate = function (func) {
      listeners.push(func);
    };

    this.update = function () {
      var i = 0,
      len = listeners.length;
      for (i; i < len; i++) {
        var callback = listeners[i];
        if (callback && typeof callback == 'function') {
          callback(this.data);
        }
      }

      console.log(this.data);
    };
  };

  var TemplateCache = function () {
    var templates = {};

    init();

    this.get = function (id) {
      if (templates[id]) {
        return $(templates[id]);
      }
    };

    function init() {
      $('script[type="text/template"]').each(function (index, template) {
        templates[template.getAttribute('id')] = template.innerText;
      });
    }
  };

  var List = function (model, node) {
    var that = this;
    this.model = model;
    this.$node = $(node);

    this.update = function () {
      this.render(this.model.data);
    };

    this.render = function (data) {
      var items = [];
      var i = 0,
      len = data.length;
      for (i; i < len; i++) {
        items.push(this.createItem(data[i], i));
      }
      this.$node.empty();
      this.$node.append(items);
    };

    this.createItem = function (text, index) {
      var $item = templates.get('item');

      $item.find('.label').text(text);
      $item.find('button.remove').click(function () {
        that.model.data.splice(index, 1);
        that.model.update();
      });
      $item.find('button.add').click(function () {
        that.model.data[index]++;
        that.model.update();
      });
      $item.find('button.sub').click(function () {
        that.model.data[index]--;
        that.model.update();
      });
      return $item;
    };

    function init() {
      that.model.addOnUpdate(onModelUpdate);
      that.update();
    }

    function onModelUpdate() {
      that.update();
    }

    init();
  };

  var templates = new TemplateCache();
  var $lists = $('.list');
  var elements = [
    new Model([1, 2, 3, 4, 5, 6, "js"]),
    new Model([22, 23, 24, 25, 26, "funny"])
  ];
  $lists.each(function(index, listNode){
    new List(elements[index], listNode);
  });
})();
