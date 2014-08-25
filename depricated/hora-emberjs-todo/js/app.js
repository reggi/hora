/*global Ember, DS, Todos:true */
window.Todos = Ember.Application.create();

Todos.Router.map(function() {
  this.resource('todos', {
    path: '/'
  }, function() {
    this.route('active');
    this.route('completed');
  });
});

Todos.TodosRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('todo');
  }
});

Todos.TodosIndexRoute = Todos.TodosRoute.extend({
  templateName: 'todo-list',
  controllerName: 'todos-list'
});

Todos.TodosActiveRoute = Todos.TodosIndexRoute.extend({
  model: function() {
    return this.store.filter('todo', function(todo) {
      return !todo.get('isCompleted');
    });
  }
});

Todos.TodosCompletedRoute = Todos.TodosIndexRoute.extend({
  model: function() {
    return this.store.filter('todo', function(todo) {
      return todo.get('isCompleted');
    });
  }
});

Todos.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'todos-emberjs'
});

Todos.TodoInputComponent = Ember.TextField.extend({
  focusOnInsert: function() {
    // Re-set input value to get rid of a reduntant text selection
    this.$().val(this.$().val());
    this.$().focus();
  }.on('didInsertElement')
});

Todos.Todo = DS.Model.extend({
  title: DS.attr('string'),
  isCompleted: DS.attr('boolean')
});

Ember.Handlebars.helper('pluralize', function(singular, count) {
  /* From Ember-Data */
  var inflector = Ember.Inflector.inflector;

  return count === 1 ? singular : inflector.pluralize(singular);
});

Todos.TodosListController = Ember.ArrayController.extend({
  needs: ['todos'],
  allTodos: Ember.computed.alias('controllers.todos'),
  itemController: 'todo',
  canToggle: function() {
    var anyTodos = this.get('allTodos.length');
    var isEditing = this.isAny('isEditing');

    return anyTodos && !isEditing;
  }.property('allTodos.length', '@each.isEditing')
});

Todos.TodosController = Ember.ArrayController.extend({
  actions: {
    createTodo: function() {
      var title, todo;

      // Get the todo title set by the "New Todo" text field
      title = this.get('newTitle').trim();
      if (!title) {
        return;
      }

      // Create the new Todo model
      todo = this.store.createRecord('todo', {
        title: title,
        isCompleted: false
      });
      todo.save();

      // Clear the "New Todo" text field
      this.set('newTitle', '');
    },

    clearCompleted: function() {
      var completed = this.get('completed');
      completed.invoke('deleteRecord');
      completed.invoke('save');
    },
  },

  /* properties */

  remaining: Ember.computed.filterBy('model', 'isCompleted', false),
  completed: Ember.computed.filterBy('model', 'isCompleted', true),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isCompleted', value);
      return value;
    } else {
      var length = this.get('length');
      var completedLength = this.get('completed.length');

      return length > 0 && length === completedLength;
    }
  }.property('length', 'completed.length')
});

Todos.TodoController = Ember.ObjectController.extend({
  isEditing: false,

  // We use the bufferedTitle to store the original value of
  // the model's title so that we can roll it back later in the
  // `cancelEditing` action.
  bufferedTitle: Ember.computed.oneWay('title'),

  actions: {
    editTodo: function() {
      this.set('isEditing', true);
    },

    doneEditing: function() {
      var bufferedTitle = this.get('bufferedTitle').trim();

      if (Ember.isEmpty(bufferedTitle)) {
        // The `doneEditing` action gets sent twice when the user hits
        // enter (once via 'insert-newline' and once via 'focus-out').
        //
        // We debounce our call to 'removeTodo' so that it only gets
        // made once.
        Ember.run.debounce(this, 'removeTodo', 0);
      } else {
        var todo = this.get('model');
        todo.set('title', bufferedTitle);
        todo.save();
      }

      // Re-set our newly edited title to persist its trimmed version
      this.set('bufferedTitle', bufferedTitle);
      this.set('isEditing', false);
    },

    cancelEditing: function() {
      this.set('bufferedTitle', this.get('title'));
      this.set('isEditing', false);
    },

    removeTodo: function() {
      this.removeTodo();
    }
  },

  removeTodo: function() {
    var todo = this.get('model');

    todo.deleteRecord();
    todo.save();
  },

  saveWhenCompleted: function() {
    this.get('model').save();
  }.observes('isCompleted')
});