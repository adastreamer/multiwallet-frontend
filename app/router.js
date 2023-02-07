import EmberRouter from '@ember/routing/router';
import config from 'multiwallet-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', { path: '' });
  this.route('groups');
  this.route('addresses');
  this.route('groups_new');
  this.route('group', { path: '/groups/:id' });
  this.route('address', { path: '/address/:id' });
});
