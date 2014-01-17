module.exports = {
  addRoutes: function(app, prefix) {
    app.get(prefix, function(req, res) {
      res.send('admin coming soon');
    });
  }
};