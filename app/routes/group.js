import Route from '@ember/routing/route';

export default class GroupRoute extends Route {
  activate() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('id', model.id);
    controller.send('load');
  }
}
