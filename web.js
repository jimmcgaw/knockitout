var rq = require("request");
var express = require("express");
var htmlparser = require("htmlparser");
var select = require('soupselect').select;
var _ = require('underscore');
var fs = require("fs");

var app = express();
app.use(express.logger());

app.use("/scripts", express.static(__dirname + '/public/scripts'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get('/', function(request, response) {
  response.sendfile("index.html");
});

app.get("/members", function(request, response){
  var member_list = [{"name":"Joshua Ball"},{"name":"Lily Lin"},{"name":"David Leimbrock"},{"name":"ted s"},{"name":"Mark"},{"name":"Andrew Freese"},{"name":"Jeremy Ellis"},{"name":"Jesse"},{"name":"Bridgette O&#039;Neill"},{"name":"Jim McGaw"},{"name":"Lee"},{"name":"AJ Bahnken"},{"name":"Joe Andrieu"},{"name":"Sean Murray"},{"name":"Patrick K"},{"name":"William DeAngelis"},{"name":"Alan"},{"name":"Timo KiÃŸing"},{"name":"Nelson Chen"},{"name":"Paul Watson"},{"name":"Bruce Brown"},{"name":"Remy Younes"},{"name":"Kevin Wu"},{"name":"Paul Miller"}];
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(member_list));
  response.end();
});

// boot up server here.
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});









// OLD stuff, don't worry about this.
var KICKOFF_URL = "http://www.meetup.com/Santa-Barbara-JavaScript-Meetup/events/125332992/";
// old members function, doing a live scrape of Meetup page
app.get('/members_live', function(request, response) {
  // go fetch contents of Meetup event page
  rq.get(KICKOFF_URL, function(error, res, body){
    // set up html parser handler
    var handler = new htmlparser.DefaultHandler(function(error, dom){
      if (error) {
        console.log(error);
      } else {
        // grab member names from the DOM and build a list of objects
        var members = select(dom, "#rsvp-list h5.member-name a");
        var member_list = _.map(members, function(member){
          return { "name" : member.children[0].raw };
        });
        // send the member_list as JSON
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(member_list));
        response.end();
      }
    });
    // create HTML Parser and parse the response text
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(body);
  });
});