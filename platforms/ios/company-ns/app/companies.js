var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var viewModule = require("ui/core/view");

var http = require("http");

var companies = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();
var page;

exports.onPageLoaded = function(args) {
  page = args.object;
  pageData.set("company", "");
  pageData.set("companies", companies);
  page.bindingContext = pageData;

  http.getJSON("http://localhost:3000/company").then(function (r) {
    // Add companies to list
    for(var i = 0; i < r.length; i++) {
      companies.push(r[i]);
    }
  }, function (e) {
    // Argument (e) is Error!
    console.log(e);
    done(e);
  });
};

exports.add = function() {
  var companyName = pageData.get("company");
  companies.push({ name: companyName });
  pageData.set("company", "");
  viewModule.getViewById( page, "company" ).dismissSoftInput();

  http.request({
    url: "http://localhost:3000/company",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    content: JSON.stringify({ name: companyName})
  }).then(function (response) {
    // silently handle response
  }, function (e) {
    console.log("Error occurred " + e);
  });
};