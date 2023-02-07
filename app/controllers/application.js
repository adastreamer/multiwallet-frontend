import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service('api') api;

  actions = {
    logout: async function () {
      await this.api.logout(this);
      location.reload();
    }
  }
}
