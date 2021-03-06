(function() {

  window.plugins.method = {
    emit: function(div, item) {},
    bind: function(div, item) {
      var annotate, avg, calculate, data, input, output, round, sum;
      data = [];
      input = {};
      output = {};
      div.addClass('radar-source');
      div.get(0).radarData = function() {
        return output;
      };
      div.mousemove(function(e) {
        return $(div).triggerHandler('thumb', $(e.target).text());
      });
      sum = function(v) {
        return _.reduce(v, function(s, n) {
          return s += n;
        });
      };
      avg = function(v) {
        return sum(v) / v.length;
      };
      round = function(n) {
        if (n == null) return '?';
        if (n.toString().match(/\.\d\d\d/)) {
          return n.toFixed(2);
        } else {
          return n;
        }
      };
      annotate = function(text) {
        if (text == null) return '';
        return " <span title=\"" + text + "\">*</span>";
      };
      calculate = function(item) {
        var allocated, dispatch, lines, list, report;
        list = [];
        allocated = 0;
        lines = item.text.split("\n");
        report = [];
        dispatch = function(list, allocated, lines, report, done) {
          var apply, args, color, comment, hours, line, next_dispatch, result, value, _ref, _ref2;
          color = '#eee';
          value = comment = null;
          hours = '';
          line = lines.shift();
          if (line == null) return done(report);
          next_dispatch = function() {
            if ((value != null) && !isNaN(+value)) list.push(+value);
            report.push("<tr style=\"background:" + color + ";\"><td style=\"width: 20%;\"><b>" + (round(value)) + "</b><td>" + line + (annotate(comment)));
            return dispatch(list, allocated, lines, report, done);
          };
          apply = function(name, list) {
            if (name === 'SUM') {
              color = '#ddd';
              return sum(list);
            } else if (name === 'AVG') {
              color = '#ddd';
              return avg(list);
            } else {
              return color = '#edd';
            }
          };
          try {
            if (args = line.match(/^USE ([\w ]+)$/)) {
              color = '#ddd';
              value = ' ';
              return attach((line = args[1]), function(new_data) {
                data = new_data;
                return next_dispatch();
              });
            } else if (args = line.match(/^(-?[0-9.]+) ([\w ]+)$/)) {
              result = hours = +args[1];
              line = args[2];
              output[line] = value = result;
            } else if (args = line.match(/^([A-Z]+) ([\w ]+)$/)) {
              _ref = [apply(args[1], list), []], value = _ref[0], list = _ref[1];
              line = args[2];
              output[line] = value;
            } else if (args = line.match(/^([A-Z]+)$/)) {
              _ref2 = [apply(args[1], list), []], value = _ref2[0], list = _ref2[1];
            } else if (input[line] != null) {
              value = input[line];
              comment = input["" + line + " Assumptions"] || null;
            } else if (line.match(/^[0-9\.-]+$/)) {
              value = +line;
            } else {
              color = '#edd';
            }
          } catch (err) {
            color = '#edd';
            value = null;
            comment = err.message;
          }
          return next_dispatch();
        };
        return dispatch(list, allocated, lines, report, function(report) {
          var table, text;
          text = report.join("\n");
          table = $('<table style="width:100%; background:#eee; padding:.8em;"/>').html(text);
          div.append(table);
          return div.dblclick(function() {
            return wiki.textEditor(div, item);
          });
        });
      };
      return calculate(item);
    }
  };

}).call(this);
