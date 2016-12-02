const router = require('express').Router()
const Todo = require('../models/todo')


router.get('/', function(req, res, next) {
    db.all("SELECT rowid, * FROM todo").then((todos) => {
      res.format({
        html: () => {res.render("todo/index", {todos: todos})},
        json: () => {
          res.status(401);
          res.send("Bad request");
        }
      })
    }).catch(next)
})

router.get('/add', (req, res) => {
  res.format({
    html: () => {res.render("todo/new")},
    json: () => {
      res.status(401);
      res.send("Bad request");
    }
  });
})

router.post('/', function(req, res) {
    if (req.body.message != '') {
        Todo.insert(req).then(() => {
        	res.format({
		      html: function(){
		        res.redirect("/todo")
		      },
		      json: function() {
		        res.send(todo);
		        console.log("json");
		      }
		    });
 		})
    }
})

router.get('/', (req, res) => {
 Todo.getById(req).then((todos) => {
    res.format({
      html: function(){
        res.render("/todo", {todo: todo});
      },
      json: function() {
        res.send(todo);
      }
    });
  }).catch(next)
})

router.delete('/:userid', (req, res) => {
  Todo.delete(req).then(() => {
    res.format({
      html: function(){
        res.redirect("/todo")
      },
      json: function() {
        var response = JSON.stringify({
          'code': 200,
          'message': "todo deleted",});
        res.send(response);
      }
    });
  }).catch((err) => {
    res.status(500).end();
    console.log(err);
  });
})

router.get("/:userid/edit", (req, res) => {
  Todo.getById(req).then((todo) => {
    console.log(todo)
    res.format({
      html: function(){
        res.render("todo/edit", {todo: todo});
      },
      json: function() {
        res.send(todo);
      }
    });
  }).catch((err) => {
    res.status(500).end();
    console.log(err);
  });
})

router.put('/:userid', (req, res) => {
  Todo.update(req).then(() => {
    res.format({
      html: function(){
        res.redirect("/todo")
      },
      json: function() {
        var response = JSON.stringify({
          'code': 200,
          'message': "todo updated",});
        res.send(response);
      }
    });
  }).catch((err) => {
    res.status(500).end();
    console.log(err);
  });
});

module.exports = router
