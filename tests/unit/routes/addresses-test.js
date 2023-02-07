import { module, test } from 'qunit';
import { setupTest } from 'multiwallet-frontend/tests/helpers';

module('Unit | Route | addresses', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:addresses');
    assert.ok(route);
  });
});
