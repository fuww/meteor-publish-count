# Meteor package for publishing counts

Polls or observes a cursor and publishes the count of documents to the client.

## Install

```sh
meteor add fuww:publish-count
```

## Usage
On the server:
```js
import {publishCount} from 'meteor/fuww:publish-count';
// ...

Meteor.publish('userCount', function(role) {
  const users = User.find({role: role});

  publishCount(
    this, // publication context
    role, // _id for count document
    users, // cursor
    {
      ready: true, // should call this.ready()? (default: false)
      strategy: 'poll', // or 'observe' (default: 'observe')
      interval: 5000 // polling interval in ms (default: 1000)
    }
  );
});
```

On the client:
```js
import {Count} from 'meteor/fuww:publish-count';
// ...

// in a reactive context
const role = 'administrator';
if (Meteor.subscribe('userCount', role).ready()) {
  const countDocument = Count.findOne(role);
  // => {_id: 'administrator', count: 123}
}
```
