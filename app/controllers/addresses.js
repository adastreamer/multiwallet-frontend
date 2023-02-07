import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

class Address {
  @tracked id;
  @tracked value;
  @tracked group_id;
  @tracked group_name;
  @tracked balanceBNB;
  @tracked balanceCHEEL;
}

export default class AddressesController extends Controller {
  queryParams = ['page', 'limit', 'group'];

  @service router;
  @service('api') api;

  @tracked data = {};
  @tracked addresses = [];
  @tracked error = undefined;

  setBalanceCHEEL = async function (ctx, addr) {
    addr.balanceCHEEL = await ctx.api.balanceCHEEL(ctx, addr.value);
  };

  setBalanceBNB = async function (ctx, addr) {
    addr.balanceBNB = await ctx.api.balanceBNB(ctx, addr.value);
  };

  load = async function (ctx) {
    try {
      ctx.error = undefined;
      ctx.data = {};
      ctx.addresses = [];
      ctx.data = await ctx.api.getAddresses(
        ctx,
        ctx.group,
        ctx.page,
        ctx.limit
      );
      ctx.data.addresses.forEach(function (item) {
        setTimeout(function () {
          let addr = new Address();
          addr.id = item.id;
          addr.value = item.value;
          addr.group_id = item.group_id;
          addr.group_name = item.group_name;
          ctx.addresses.push(addr);
          ctx.addresses = ctx.addresses;
          ctx.setBalanceBNB(ctx, addr);
          ctx.setBalanceCHEEL(ctx, addr);
        });
      });
    } catch (error) {
      ctx.error = error;
    }
  };

  releaseAddress = async function (ctx, id) {};

  deleteAddress = async function (ctx, id) {};

  actions = {
    load: async function () {
      this.load(this);
    },
    releaseAddress: async function () {},
    deleteAddress: async function () {},
    gotoPrevPage: async function () {
      var pageTo = this.data.page - 1;
      if (pageTo <= 0) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.load(this);
    },
    gotoNextPage: async function () {
      var pageTo = this.data.page + 1;
      if (pageTo * this.data.limit > this.data.total) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.load(this);
    },
  };
}
