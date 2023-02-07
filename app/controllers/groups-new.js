import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GroupsNewController extends Controller {
  @service router;
  @service('api') api;
  @tracked data = {};
  @tracked result = undefined;
  @tracked error = undefined;

  clear = function (ctx) {
    ctx.data = {};
    ctx.result = undefined;
    ctx.error = undefined;
  };

  createGroup = async function (ctx) {
    ctx.result = undefined;
    ctx.error = undefined;
    if (ctx.data && ctx.data.name) {
    } else {
      ctx.error = 'Name is required!';
      return;
    }
    try {
      var result = await ctx.api.createGroup(ctx, ctx.data);
      if (result && result.group && result.group.id) {
        this.router.transitionTo('group', result.group.id);
      }
      ctx.result = JSON.stringify(result);
    } catch (error) {
      ctx.error = error;
    }
  };

  actions = {
    clear: function () {
      this.clear(this);
    },
    createGroup: async function () {
      await this.createGroup(this);
    },
  };
}
