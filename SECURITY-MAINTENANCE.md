# Dependency security review — 2026-11-17

Scope: the npm dependency graph and the existing static-site build. This branch is not a deployment and is not a general application penetration test.

| Control | Evidence and result | Remaining action |
| --- | --- | --- |
| Known dependency vulnerabilities | `npm audit --json`: 54 affected package records (5 critical) before; 7 high records after, all caused by the single unpatched picomatch advisory below. No critical, moderate, or low records remain. | Keep the unpatched finding visible; do not use `audit fix --force` to downgrade browser-sync. |
| Production dependencies | `npm audit --omit=dev`: zero known vulnerabilities. | Recheck when dependencies change; this does not cover CDN scripts or PHP application security. |
| Reproducible installation | `npm ci --ignore-scripts` and `npm run test:build` on Node 24.22.1 / npm 12.2.2. | Use an up-to-date Node 22 or 24 release satisfying `engines`. |
| Build compatibility | Pug generation, Bootstrap 4.6.2 CSS/JS, assets, scripts, preserved footer/social links, and the build regression test pass. Native Node filesystem operations replace shelljs; the old Windows build could skip Pug files. | Bootstrap 4 and the theme still emit Sass deprecation warnings; a Bootstrap 5 redesign is separate work. |
| Browser/development behavior | Local Chromium smoke: mobile menu, portfolio modal and JS watch rebuild pass, without page errors. BrowserSync binds to 127.0.0.1 with its UI disabled. | Do not expose development servers or accept untrusted build/glob configuration. |
| Ongoing updates | Weekly Dependabot updates and an explicit `npm run audit:security` command. | Review and test PRs before merging. No auto-merge or new Actions workflow is enabled. |

## Unpatched upstream finding

[GHSA-fc5q-39xc-vjpf / CVE-2026-112366](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) affects picomatch through 4.0.7. The advisory and registry were checked on 2026-11-17; no patched version was available. This is a regular-expression denial of service when an attacker supplies malicious repeated-extglob patterns.

Here it is reached through development/build tooling (BrowserSync, watchers and globbing), not the static site's production dependency graph. Project glob patterns are maintainer-controlled. Loopback binding reduces network exposure but does not repair the library: build only reviewed sources/configuration, do not run these tools as a production service, and do not feed user-supplied glob patterns into them. The full audit deliberately continues to exit nonzero; no advisory is suppressed or dismissed. Upgrade the parent packages/lockfile and rerun the full audit and smoke checks when an upstream fix is published.

## Verification commands

```sh
npm ci --ignore-scripts
npm run test:build
npm audit --omit=dev
npm run audit:security
```

`test:build` performs a clean build and checks generated HTML, compiled JavaScript, CSS and preservation of hand-maintained `dist/assets` files absent from `src/assets`. Legacy assets and original personal content must not be lost during regeneration. The current content in `dist/index.html` is reflected in its Pug source.

The email's suggested minimum versions are historical; this update refreshes the parent dependencies and transitive lock entries instead of individually pinning those old minimums. The older Dependabot PRs remain open for the owner to reconcile after this branch is reviewed. Alerts on `master` remain until a reviewed remediation reaches that branch. No live form submission or deployment was performed.
