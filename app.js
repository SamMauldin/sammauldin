/**
 * Module dependencies.
 */
var Prismic = require("prismic-nodejs");
var app = require("./config");
var PORT = app.get("port");
var PConfig = require("./prismic-configuration");

app.listen(PORT, function() {
  console.log("Now running on http://localhost:" + PORT);
});

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

function api(req, res) {
  res.locals.ctx = { // So we can use this information in the views
    endpoint: PConfig.apiEndpoint,
    linkResolver: PConfig.linkResolver
  };
  return Prismic.api(PConfig.apiEndpoint, {
    accessToken: PConfig.accessToken,
    req: req
  });
}

app.get("/", function(req, res) {
  api(req, res).then(p => {
    p.getSingle("home-page", function(err, pageContent) {
      res.render("home", {
        pageContent: pageContent,
        linkResolver: PConfig.linkResolver
      });
    });
  });
});

app.get("/page/:uid", function(req, res) {
  const uid = req.params.uid;
  api(req, res).then(p => {
    return p.getByUID("page", uid);
  }).then(pageContent => {
    if (pageContent) {
      res.render("page", {
        pageContent: pageContent,
        linkResolver: PConfig.linkResolver
      });
    } else {
      res.render("404");
    }
  }).catch(function(err) {
    handleError(err, req, res);
  });
});

app.route("/preview").get(function(req, res) {
  api(req, res).then(function(api) {
    return Prismic.preview(api, PConfig.linkResolver, req, res);
  }).catch(function(err) {
    handleError(err, req, res);
  });
});
