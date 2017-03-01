/**
 * Created by meathill on 2017/2/28.
 */

import DatePicker from './DatePicker';

function max(array) {
  let last = array.pop();
  return array.reduce( (memo, item) => {
    return memo > item ? memo : item;
  }, last);
}
function min(array) {
  let last = array.pop();
  return array.reduce( (memo, item) => {
    return memo > item ? item : memo;
  }, last);
}

class RangeDatePicker extends DatePicker {

  confirm() {
    let start = this.$el.find('.start').data('date');
    let end = this.$el.find('.end').data('date');
    this.start.value = start + ' 00:00';
    this.end.value = end + ' 23:59';
    this.target.val(`${start} ~ ${end}`);
    this.hide();
  }

  createElement(options) {
    super.createElement(options);

    let targetName = this.target.attr('name');
    this.start = this.createInput(targetName, 'start');
    this.end = this.createInput(targetName, 'end');
  }

  createInput(targetName, pos) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = targetName + '-' + pos;
    $(input).insertAfter(this.target);
    return input;
  }

  setValue(value) {
    let values = value.split(/[\s,~]+/);
    let end = max(values);
    let start = min(values);
    start = this.$el.find(`[data-date="${start}"]`).addClass('start').data('index');
    end = this.$el.find(`[data-date="${end}"]`).addClass('end').data('index');
    for (; start <= end; start++) {
      this.$el.find(`[data-index=${start}]`).addClass('select');
    }
  }

  onClick(event) {
    let start = this.$el.find('.start');
    let end = this.$el.find('.end');
    if (start.length && end.length) {
      start.removeClass('start');
      end.removeClass('end');
      this.$el.find('.select').removeClass('select');
      start = end = null;
    }

    let li = $(event.currentTarget);
    if ((!start || start.length === 0) && (!end || end.length === 0)) {
      li.addClass('select start');
      start = li;
      return;
    }

    let startIndex = start.data('index');
    let index = li.data('index');
    if (startIndex <= index) {
      li.addClass('select end');
    } else {
      start.removeClass('start')
        .addClass('end');
      li.addClass('select start');
    }
    this.$el.find(`li[data-index]`)
      .slice(Math.min(startIndex, index), Math.max(startIndex, index))
      .addClass('select');
    end = li;

    if (!this.options.confirm && start.length && end.length) {
      this.confirm();
    }
  }
}

export default RangeDatePicker;