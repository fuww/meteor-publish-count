import {Meteor} from 'meteor/meteor';
import PublishCount from '../../shared/namespace';

const Count = new Meteor.Collection(PublishCount.COLLECTION);

export default Count;
