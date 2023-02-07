import { module, test } from 'qunit';
import { setupTest } from 'multiwallet-frontend/tests/helpers';

module('Unit | Controller | address', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:address');
    assert.ok(controller);
  });
});
