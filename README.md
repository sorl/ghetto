Ghetto
======
Javascript is a ghetto, we all know that. But it seems there is now way out,
the ghetto gets larger and larger every day, more and more libraries open their
doors, people from all backgrounds are moving in, even large respected
companies seem to like the ghetto now. Ok, my imagination is over for now, let's
get to the point. What is this? Why is it?

Ghetto is a framework for building websites. But there are other frameworks,
right? Yeah... so there are basically two problems that I want to solve, the
first is error handling, this is terrible in most, except for maybe Koa. If an
express.js route does not capture an error, it does not bubble up and your whole
app crashes without a proper stack trace, simply not an ideal situation. But
using ES7 async/await coroutines we can capture errors using try/catch over a
block or simply by attaching an error method to .catch. This is great news
except that it is not available yet in node, we are left with generators.
Generators can be used together with the co package for example to accomplish
this same thing, capturing errors over a block and providing a stack trace, but
the solution is just not as nice as the async/await would have been. Luckily
with the development of transpilers such as babel we can now write our code
using async/await syntax and transpile this to generators. This is how the first
problem is solved, routes in ghetto should use async/await syntax, they are also
wrapped so that a configurable error handler is called if there was an unhandled
error in that route.

The second problem with micro-frameworks like express.js is that it does not
force its users in to any particular way of organizing your code and there are
many ways to configure them badly. For new comers this is not a good thing, some
configurations are hard to get correct but there are also too many insignificant
choices that take the fun out of producing something useful. I have worked many
years with Django and there are some problems with Django for sure but getting
productive is not one of them. These decisions also pose a problem for larger
projects involving more than one developer, somebody has to make all these
decisions, which could lead to some very boring and unproductive bike shed
discussions.

A lot of things are not implemented like a default templating engine, rest
library etc.


(Pre)-installation
------------------
```
npm install -g ghetto-command
```

Create your first app using ghetto init
---------------------------------------
```
ghetto init testapp
```

Run your first app using babel-node
-----------------------------------
```
cd testapp
npm install ghetto babel-cli babel-plugin-transform-async-to-generator
./node_modules/.bin/babel-node ghetto.js
```

Navigate to http://localhost:4100
Now try http://localhost:4100/sleep
Oops, open up the file `router.js`. This is where the routing is configured. Every
row in the array is a route, the first position is the route (specified in the
same way as in express.js), the second is the route function to call. There is
also an optional third position where you can set allowed methods, by default
only get is accepted, if you want to change allowed methods pass a comma
separated string of methods, for example: `'get,post'`. Ok so now have a look
in `routes/demo.js` There a `require('sleep')` causing our error. Break the application
using ctrl+c and do `npm install sleep` and start the application again:
```
./node_modules/.bin/babel-node ghetto.js
```
Try http://localhost:4100/sleep a second time.



