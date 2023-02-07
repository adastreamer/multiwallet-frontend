import { module, test } from 'qunit';
import { setupTest } from 'multiwallet-frontend/tests/helpers';

module('Unit | Route | groups_new', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:groups-new');
    assert.ok(route);
  });
});
