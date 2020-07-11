"use strict";

const helpers = {};

helpers.ifeq = function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
};

helpers.repeat = function (times, opts) {
  var out = "";
  var i;
  var data = {};
  if (times) {
    for (i = 1; i <= times; i++) {
      data.index = i;
      out += opts.fn(this, { data: data });
    }
  } else {
    out = opts.inverse(this);
  }
  return out;
};

helpers.lowerString = function (variable = "") {
  return String(variable).toLowerCase();
};

helpers.objToList = function (variable) {
  function toList(obj, indent) {
    let res = "";
    for (var k in obj) {
      if (obj[k] instanceof Object) {
        res = res + k + "<br>" + toList(obj[k], "   " + indent);
      } else {
        res = res + indent + k + " : " + obj[k] + "<br>";
      }
    }
    return res;
  }
  return toList(variable, "");
};

module.exports = helpers;
