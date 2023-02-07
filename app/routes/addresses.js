import Route from '@ember/routing/route';

export default class AddressesRoute extends Route {
  activate() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.send('load');
  }
}
