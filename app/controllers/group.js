import config from '../config/environment';
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

export default class GroupController extends Controller {
  queryParams = ['page', 'limit'];

  @service router;
  @service('api') api;
  id = 0;
  @tracked group = {};
  @tracked addresses = [];
  @tracked addressesData = {};
  @tracked addressesBalancesBNB = {};
  @tracked addressesBalancesCHEEL = {};
  @tracked error = undefined;
  backendURL = config.backendURL;

  setBalanceCHEEL = async function (ctx, addr) {
    addr.balanceCHEEL = await ctx.api.balanceCHEEL(ctx, addr.value);
  };

  setBalanceBNB = async function (ctx, addr) {
    addr.balanceBNB = await ctx.api.balanceBNB(ctx, addr.value);
  };

  load = async function (ctx) {
    try {
      ctx.error = undefined;
      ctx.group = {};
      ctx.addressesData = {};
      ctx.addresses = [];
      ctx.addressesBalancesBNB = {};
      ctx.addressesBalancesCHEEL = {};
      ctx.groupData = await ctx.api.getGroup(ctx, ctx.id);
      ctx.group = ctx.groupData.group;

      ctx.addressesData = await ctx.api.getGroupAddresses(
        ctx,
        ctx.id,
        ctx.page,
        ctx.limit
      );
      ctx.addressesData.addresses.forEach(function (item) {
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

  deleteGroup = async function (ctx) {
    try {
      await ctx.api.deleteGroup(ctx, ctx.id);
      ctx.router.transitionTo('groups');
    } catch (error) {
      ctx.error = error;
    }
  };

  generateAddresses = async function (ctx, count) {
    try {
      await ctx.api.generateAddresses(ctx, ctx.id, count);
      ctx.load(ctx);
    } catch (error) {
      ctx.error = error;
    }
  };

  actions = {
    deleteGroup: async function () {
      var confirm = window.confirm('Are you sure?');
      if (!confirm) {
        return;
      }
      this.deleteGroup(this);
    },
    load: async function () {
      this.load(this);
    },
    generateAddresses: async function () {
      var input = prompt('Number of addresses:', '0');
      if (input != null) {
        var count = parseInt(input);
        if (!isNaN(count)) {
          if (count > 0 && count < 100000) {
            this.generateAddresses(this, count);
          } else {
            alert('Enter a number between 1 and 100,000!');
          }
        } else {
          alert('Enter a valid number!');
        }
      }
    },
    deleteAddress: async function () {},
    gotoPrevPage: async function () {
      var pageTo = this.addressesData.page - 1;
      if (pageTo <= 0) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.load(this);
    },
    gotoNextPage: async function () {
      var pageTo = this.addressesData.page + 1;
      if (pageTo * this.addressesData.limit > this.addressesData.total) {
        return;
      }
      this.router.transitionTo({ queryParams: { page: pageTo } });
      this.load(this);
    },
  };
}
