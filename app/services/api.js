import config from '../config/environment';
import Service from '@ember/service';

export default class ApiService extends Service {
  async balanceCHEEL(ctx, address) {
    var res = await this.get(ctx, '/api/v1/balance/cheel?address=' + address);
    var bal = res.balance;
    return (bal / 10 ** 18).toFixed(4);
  }

  async balanceBNB(ctx, address) {
    var res = await this.get(ctx, '/api/v1/balance/bnb?address=' + address);
    var bal = res.balance;
    return (bal / 10 ** 18).toFixed(4);
  }

  async generateAddresses(ctx, id, count) {
    var cnt = parseInt(count);
    var data = {
      count: cnt,
    };
    var res = await this.post(ctx, '/api/v1/groups/' + id + '/addresses', data);
    return res;
  }

  async getGroupAddresses(ctx, id, page, limit) {
    if (page === undefined) page = 1;
    if (limit === undefined) limit = 50;
    var res = await this.get(
      ctx,
      '/api/v1/groups/' + id + '/addresses?page=' + page + '&limit=' + limit
    );
    return res;
  }

  async getAddresses(ctx, group, page, limit) {
    if (page === undefined) page = 1;
    if (limit === undefined) limit = 50;
    var url = '/api/v1/addresses?page=' + page + '&limit=' + limit;
    if (group != undefined) {
      url += '&group=' + group;
    }
    var res = await this.get(ctx, url);
    return res;
  }

  async unassignAddressGroup(ctx, id) {
    var res = await this.get(
      ctx,
      '/api/v1/addresses/' + id + '/unassign_group'
    );
    return res;
  }

  async assignAddressGroup(ctx, id, group_id) {
    var data = {
      group_id: parseInt(group_id),
    };
    var res = await this.post(
      ctx,
      '/api/v1/addresses/' + id + '/assign_group',
      data
    );
    return res;
  }

  async getAddress(ctx, id) {
    var res = await this.get(ctx, '/api/v1/addresses/' + id);
    return res;
  }

  async getGroup(ctx, id) {
    var res = await this.get(ctx, '/api/v1/groups/' + id);
    return res;
  }

  async createGroup(ctx, data) {
    var res = await this.post(ctx, '/api/v1/groups', data);
    return res;
  }

  async deleteGroup(ctx, id) {
    var res = await this.del(ctx, '/api/v1/groups/' + id);
    return res;
  }

  async groups(ctx, page, limit) {
    if (page === undefined) page = 1;
    if (limit === undefined) limit = 50;
    var res = await this.get(
      ctx,
      '/api/v1/groups?page=' + page + '&limit=' + limit
    );
    return res;
  }

  async info(ctx) {
    var res = await this.get(ctx, '/api/v1/info');
    return res;
  }

  async logout(ctx) {
    var res = await fetch('/logout');
    return res;
  }

  async del(ctx, endpoint) {
    var data = await this.req(ctx, 'DELETE', endpoint);
    return data;
  }

  async get(ctx, endpoint) {
    var data = await this.req(ctx, 'GET', endpoint);
    return data;
  }

  async post(ctx, endpoint, data) {
    var data = await this.req(ctx, 'POST', endpoint, data);
    return data;
  }

  async req(ctx, method, endpoint, data) {
    var r = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      r.body = JSON.stringify(data);
    }
    var response = await fetch(config.backendURL + endpoint, r);
    var parsed = await response.json();
    if (parsed.c != 'SUC000') {
      ctx.error = parsed.m;
    }
    return parsed.d;
  }
}
