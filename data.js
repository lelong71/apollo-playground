const sessionStorage = {
  data: {},
  getItem: function(id) {
    return this.data[id];
  },
  setItem: function(id, value) {
    this.data[id] = value;
  }
};
const store = {
  getNextId: function(name) {
    let newId = sessionStorage.getItem(name);
    if (!newId) {
      newId = 1;
    }
    sessionStorage.setItem(name, newId + 1);
    return newId;
  },
  todos: [],
  stories: []
};
module.exports = store;
