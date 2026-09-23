// Copyright © 2026 Manolo Remiddi · SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'https://github.com/ManoloRemiddi/augmentor-agent';
const release = 'https://github.com/ManoloRemiddi/augmentor-agent-app/releases/download/v0.2.10-complete-preview.1/';
const pages = readdirSync(root).filter(name => name.endsWith('.html'));
const read = name => readFileSync(path.join(root, name), 'utf8');

test('current source, license contact and installation guides use the canonical repository', () => {
  for (const name of pages) {
    const html = read(name);
    assert.ok(!html.includes('href="https://github.com/ManoloRemiddi/augmentor-dsh-extension-plugin"'), `${name}: generic project links must use the canonical repository`);
    assert.ok(!html.includes(repo + '-source'), `${name}: obsolete source repository URL`);
    assert.ok(!html.includes(repo + '-history'), `${name}: private history is not a public destination`);
    assert.ok(!html.includes(repo + '-app/blob/main/docs/COMPLETE-INSTALL.md'), `${name}: use the current install guide`);
  }
  assert.ok(read('docs.html').includes(`project is ${repo}.`));
  const html = read('index.html');
  assert.ok(html.includes(`href="${repo}"`));
  assert.ok(html.includes(`href="${repo}/blob/main/docs/COMPLETE-INSTALL.md"`));
  assert.ok(read('licensing.html').includes(`${repo}/issues/new?title=Augmentor%20resale%20permission%20request`));
});

test('copy button selects the updated prompt and exact existing release assets', () => {
  const html = read('index.html');
  const prompt = html.match(/<textarea\b[^>]*id="desktop-install-prompt"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];
  assert.ok(prompt, 'installation prompt exists');
  assert.ok(prompt.includes(`project is ${repo}.`));
  assert.ok(prompt.includes(`${repo}/blob/main/docs/COMPLETE-INSTALL.md`));
  assert.ok(prompt.includes(`${release}augmentor-0.2.10-complete-preview.1.tar.gz`));
  assert.ok(prompt.includes(`${release}SHA256SUMS`));
  assert.ok(prompt.includes('archived distribution repository'));
  assert.match(html, /class="[^"]*copy-install[^"]*" data-copy="desktop-install-prompt"/);
  assert.match(read('assets/redesign.js'), /navigator\.clipboard\.writeText\(source\.value\)/);
});

test('every local page link, fragment and static asset resolves in the deployed tree', () => {
  for (const name of pages) {
    const html = read(name);
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (/^(?:[a-z]+:|\/\/)/i.test(raw)) continue;
      const url = new URL(raw, `https://augmentoragent.com/${name}`);
      const file = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
      assert.ok(existsSync(path.join(root, file)), `${name}: missing ${raw}`);
      if (url.hash && file.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(read(file).includes(`id="${id}"`), `${name}: missing fragment ${raw}`);
      }
    }
  }
});

test('plugins use the current brand and homepage links to the full catalogue', () => {
  const html = read('plugins.html');
  assert.match(read('index.html'), /href="plugins\.html">DSH plugins/);
  assert.match(read('index.html'), /href="plugins\.html">Browse plugins/);
  for (const asset of ['assets/redesign.css', 'assets/brand-orb.css', 'assets/redesign-icon.svg', 'assets/browser-full-chromium.png']) assert.ok(html.includes(asset));
  assert.ok(!html.includes('assets/style.css'));
  assert.ok(!html.includes('assets/shot-panel.png'));
  assert.ok(html.includes(`href="${repo}"`));
  assert.ok(html.includes('href="index.html#installation"'));
  for (const id of ['metafolder', 'model-picker', 'adaptive-reasoning', 'prompt-library', 'steering']) assert.ok(html.includes(`id="${id}"`));
});

test('dated collection and current standalone releases remain distinct', () => {
  for (const name of ['index.html', 'plugins.html']) {
    const html = read(name);
    assert.ok(html.includes('collection-2026.09.14/augmentor-plugins-2026.09.14.zip'));
    assert.ok(!html.includes('collection-2026.09.13/'));
    assert.ok(html.includes('Browser 0.1.32'));
    assert.ok(html.includes('Adaptive Reasoning 0.2.0'));
    assert.ok(html.includes('Steering'));
  }
  const html = read('plugins.html');
  assert.ok(html.includes('/v0.2.3/dsh-adaptive-reasoning-0.2.3.tgz'));
  assert.ok(html.includes('/blob/v0.2.3/docs/SETUP.md'));
  assert.ok(html.includes('/v0.1.0/dsh-steering-0.1.0.tgz'));
  assert.ok(html.includes('augmentor-plugins-2026.09.14-SHA256SUMS'));
  assert.ok(html.includes('reselling Augmentor requires written permission'));
  assert.ok(html.includes('Earlier MIT releases retain their original terms'));
});
