import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GroupsController extends Controller {
  queryParams = ['page', 'limit'];

  @service router;
  @service('api') api;
  @tracked data = {};
  @tracked prevPage = 0;
  @tracked nextPage = 0;

  clear = async function (ctx) {
    ctx.data = {};
  };

  update = async function (ctx) {
    ctx.data = await ctx.api.groups(ctx, ctx.page, ctx.limit);
    ctx.prevPage = ctx.data.page - 1;
    ctx.nextPage = ctx.data.page + 1;
  };

  deleteGroup = async function (ctx, id) {
    await ctx.api.deleteGroup(ctx, id);
    ctx.clear(ctx);
    ctx.update(ctx);
  };

  actions = {
    clear: async function () {
      clear(this);
    },
    update: async function () {
      this.clear(this);
      this.update(this);
    },
    gotoPrevPage: async function () {
      var pageTo = this.data.page - 1;
      if (pageTo <= 0) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.clear(this);
      this.update(this);
    },
    gotoNextPage: async function () {
      var pageTo = this.data.page + 1;
      if (pageTo * this.data.limit > this.data.total) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.clear(this);
      this.update(this);
    },
    deleteGroup: async function (id) {
      var confirm = window.confirm('Are you sure?');
      if (!confirm) {
        return;
      }
      this.deleteGroup(this, id);
    },
  };
}
