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

export default class AddressController extends Controller {
  @service router;
  @service('api') api;
  id = 0;
  @tracked address = {};
  @tracked groups = [];
  @tracked copied = false;
  @tracked error = undefined;
  @tracked setGroupState = false;
  newGroupID = undefined;

  setBalanceCHEEL = async function (ctx) {
    ctx.address.balanceCHEEL = await ctx.api.balanceCHEEL(
      ctx,
      ctx.address.value
    );
  };

  setBalanceBNB = async function (ctx) {
    ctx.address.balanceBNB = await ctx.api.balanceBNB(ctx, ctx.address.value);
  };

  load = async function (ctx) {
    try {
      ctx.error = undefined;
      ctx.address = {};
      var data = await ctx.api.getAddress(ctx, ctx.id);
      var addr = new Address();
      addr.id = data.address.id;
      addr.value = data.address.value;
      addr.group_id = data.address.group_id;
      addr.group_name = data.address.group_name;
      ctx.address = addr;
      ctx.setBalanceBNB(ctx);
      ctx.setBalanceCHEEL(ctx);
    } catch (error) {
      ctx.error = error;
    }
  };

  unassignAddressGroup = async function (ctx) {
    var res = await ctx.api.unassignAddressGroup(ctx, ctx.address.id);
    await ctx.load(ctx);
  };

  copy = function (ctx) {
    navigator.clipboard.writeText(ctx.address.value);
    ctx.copied = true;
    setTimeout(function () {
      ctx.copied = false;
    }, 1000);
  };

  actions = {
    load: async function () {
      this.load(this);
    },
    copy: function () {
      this.copy(this);
    },
    deleteAddress: async function () {},
    unassignAddressGroup: async function () {
      this.unassignAddressGroup(this);
    },
    startAssignAddressGroup: async function () {
      this.setGroupState = true;
      var data = await this.api.groups(this);
      this.groups = data.groups;
    },
    stopAssignAddressGroup: async function () {
      this.setGroupState = false;
      this.groups = [];
    },
    selectGroup: async function (new_group_id) {
      this.newGroupID = new_group_id;
    },
    assignAddressGroup: async function () {
      var res = await this.api.assignAddressGroup(
        this,
        this.address.id,
        this.newGroupID
      );
      await this.load(this);
    },
  };
}
