const store = require("./data");
const { ApolloServer, gql } = require("apollo-server");
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    visibilityFilter: String
    todos: [Todo]
    stories: [Story]
    tasks: [Task]
  }
  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
    linkedStory: Story
  }
  type Story {
    id: Int!
    summary: String!
    status: String
    linedTodo: Todo
    tasks: [Task]
  }
  type Task {
    id: Int!
    summary: String!
    status: String
    story: Story
  }
  type Mutation {
    addTodo(text: String!): Todo
    createStoryFromTodo(todoId: Int!, summary: String!): Story
    createTaskFromStory(storyId: Int!, summary: String!): Task
    toggleTodo(id: Int!): Todo
    visibilityFilter(filter: String!): String
  }
`;
const findElement = (elements, id) => {
  return elements.find(elem => elem.id === id);
};
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: (root, args, context) => store.todos,
    stories: (root, args, context) => store.stories,
    tasks: (obj, args, context, info) => {
      console.log(JSON.stringify(obj));
      let story = findElement(store.stories, obj.id);
      if (story) {
        return story.tasks;
      }
    }
  },
  Mutation: {
    addTodo: (parent, args, context) => {
      let newTodo = {
        id: store.getNextId("TODO"),
        text: args.text,
        completed: false
      };
      store.todos = store.todos.concat([newTodo]);
      return newTodo;
    },
    createStoryFromTodo: (parent, args, context) => {
      let todo = findElement(store.todos, args.todoId);
      console.log("found todo element=" + todo);
      let newStory = {
        id: store.getNextId("STORY"),
        summary: args.summary,
        linkedTodo: todo,
        status: "New",
        tasks: []
      };
      todo.linkedStory = newStory;
      store.stories = store.stories.concat([newStory]);
      return newStory;
    },
    createTaskFromStory: (parent, args, context) => {
      let story = findElement(store.stories, args.storyId);
      let newTask = {
        id: store.getNextId("TASK"),
        summary: args.summary,
        story: story,
        status: "New"
      };
      story.tasks = story.tasks.concat([newTask]);
      return newTask;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
