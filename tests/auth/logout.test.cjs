const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the production hook with isolated router, API and store dependencies.
function setup(failure) {
  const events = [];
  class ApiError extends Error {
    constructor(status) {
      super('Request failed');
      this.status = status;
    }
  }
  const queryClient = {
    cancelQueries: async () => events.push('cancel queries'),
    clear: () => events.push('clear cache'),
  };
  const dependencies = {
    '@tanstack/react-query': { useMutation: (options) => options, useQueryClient: () => queryClient },
    'react-router': { useNavigate: () => (path, options) => events.push(['navigate', path, options.replace]) },
    sonner: { toast: { error: () => events.push('error toast') } },
    '@/core/auth/use-auth-store': { useAuthStore: { getState: () => ({ clearAuth: () => events.push('clear auth') }) } },
    '@/core/error/api-error': { ApiError },
    '@/shared/store/use-overlay-store': { useOverlayStore: { getState: () => ({ closeAll: () => events.push('close overlays') }) } },
    '../api/auth-api': {
      authApi: {
        logout: async () => {
          events.push('logout request');
          if (failure) throw failure === 'expired' ? new ApiError(401) : new Error('Network unavailable');
        },
      },
    },
  };
  const source = fs.readFileSync('app/features/auth/hooks/use-logout.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require: (id) => {
      assert.ok(dependencies[id], `Unexpected dependency: ${id}`);
      return dependencies[id];
    },
  });
  return { logout: exports.useLogout(), events };
}

test('successful logout clears account data and replaces the route with login', async () => {
  const { logout, events } = setup();
  await logout.mutationFn();
  assert.deepEqual(events, [
    'logout request',
    'cancel queries',
    'close overlays',
    'clear auth',
    'clear cache',
    ['navigate', '/auth/login', true],
  ]);
  assert.equal(logout.retry, false);
});

test('an expired session can still leave the dashboard', async () => {
  const { logout, events } = setup('expired');
  await logout.mutationFn();
  assert.ok(events.includes('clear auth'));
  assert.deepEqual(events.at(-1), ['navigate', '/auth/login', true]);
});

test('network failures retain the session and allow retry with an error message', async () => {
  const { logout, events } = setup('network');
  await assert.rejects(logout.mutationFn(), /Network unavailable/);
  logout.onError();
  assert.deepEqual(events, ['logout request', 'error toast']);
});
