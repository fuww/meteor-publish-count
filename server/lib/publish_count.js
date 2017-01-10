import {Meteor} from 'meteor/meteor';
import PublishCount from '../../shared/namespace';

function getCountDocument(count) {
  return {
    count
  };
}

function getCount(cursor) {
  return getCountDocument(cursor.count());
}

function poll(publishContext, countId, cursor, options) {
  const interval = options.interval || PublishCount.DEFAULT_INTERVAL;

  publishContext.added(PublishCount.COLLECTION, countId, getCount(cursor));

  if (options.ready) {
    publishContext.ready();
  }

  const intervalId = Meteor.setInterval(() => {
    publishContext.changed(PublishCount.COLLECTION, countId, getCount(cursor));
  }, interval);

  publishContext.onStop(() => {
    Meteor.clearInterval(intervalId);
  });
}

function observe(publishContext, countId, cursor, options) {
  const originalCursorDescription = cursor._cursorDescription;
  const cursorDescription = {
    collectionName: originalCursorDescription.collectionName,
    selector: originalCursorDescription.selector,
    options: {
      fields: {
        _id: 1
      }
    }
  };

  let count = 0;
  let initializing = true;

  const handle = cursor._mongo._observeChanges(cursorDescription, false, {
    added() {
      count += 1;

      if (initializing) {
        return;
      }

      publishContext.changed(
        PublishCount.COLLECTION, countId, getCountDocument(count)
      );
    },
    removed() {
      count -= 1;

      if (initializing) {
        return;
      }

      publishContext.changed(
        PublishCount.COLLECTION, countId, getCountDocument(count)
      );
    }
  });

  publishContext.added(
    PublishCount.COLLECTION, countId, getCountDocument(count)
  );

  initializing = false;

  if (options.ready) {
    publishContext.ready();
  }

  publishContext.onStop(() => {
    handle.stop();
  });
}

export default function publishCount(
  publishContext,
  countId,
  cursor,
  options = {}
) {
  if (options.strategy === 'poll') {
    poll(publishContext, countId, cursor, options);
  } else {
    observe(publishContext, countId, cursor, options);
  }
};
