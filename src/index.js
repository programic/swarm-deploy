const dotenv = require('dotenv');
const fs = require('fs');
const core = require('@actions/core');

async function main() {
  const url = new URL(core.getInput('webhook_url'));
  const env = {};

  if (core.getInput('dotenv_path')) {
    Object.assign(env, dotenv.parse(fs.readFileSync(core.getInput('dotenv_path'))));
  }

  for (const key in env) {
    core.debug(`Setting ${key} to ${env[key]}`);
    url.searchParams.append(key, env[key]);
  }

  const response = await fetch(url.toString(), { method: 'POST' });

  if (!response.ok) {
    core.error(`Failed to send webhook: ${response.status} ${response.statusText}`);
    core.debug(await response.text());
    core.setFailed('Failed to send webhook');
  }

  core.info('Webhook sent successfully');
}

main();