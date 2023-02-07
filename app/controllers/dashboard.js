import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DashboardController extends Controller {
  @service('api') api;
  @tracked data = {};
  @tracked error = undefined;

  clear = async function (ctx) {
    ctx.data = {};
    ctx.error = undefined;
  };

  update = async function (ctx) {
    try {
      ctx.clear(ctx);
      ctx.data = await ctx.api.info(ctx);
    } catch (error) {
      ctx.error = error;
    }
  };

  actions = {
    clear: async function () {
      return this.clear(this);
    },
    update: async function () {
      return this.update(this);
    },
  };
}
