const express = require('express');
const router = express.Router();
const models = require("./models");
const todos = models.finalToDo;

let messages = [];
let tasks = {};

router.get("/", function(req, res){
  todos.findAll({
    where: {
      complete: false,
    }
  }).then(function (todos) {
    res.render("tasks",{todos:todos, errors:messages});
  });
});

router.post("/", function (req, res){
  req.checkBody("task","Please enter a task.").notEmpty();
  let errors = req.validationErrors();
  if (errors){
    errors.forEach(function(error){
      messages.push(error.msg);
    });
  } else {
     //putting the data from form in database
    const todo = {
      name: req.body.task,
      complete: false};
      todos.create(todo).then(function(newTodo){
        res.redirect("/");
      });
    }
});

router.get("/edit/:id", function (req, res) {
  todos.findOne({
    where:{
      id: req.params.id
    }
  }).then(function(task){
    res.render("edit", {todos: task});
  })
});

router.post("/edit", function(req, res){
    todos.update({
     item: req.body.editField
    },{ where:{
         id: req.body.editButton
       }
    }).then(function(){
      res.redirect('/')
    })
});

router.post("/delete", function(req, res){
  todos.destroy({
  where: {
      id: req.body.delete
    }
}).then(function (tasks){
  res.redirect("/");
})
});

router.post("/complete", function(req, res){
  todos.update({
   completed: true
    }, {
      where: {
        id: req.body.clicked
      }
  }).then(function (tasks){
    res.redirect("/",{todos:tasks});
  })
});

module.exports = router;
