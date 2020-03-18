// Description:
//   Tells you how to contribute to this bot
//
// Commands:
//   hubot can I add commands to this bot?

import * as _ from "lodash";

import { react, reply, getChannels } from '../slack';

module.exports = (robot: any) => {
  robot.respond(/can I contribute to this bot?/i, async (res: any) => {
    react(res, 'heavy_check_mark');
    reply(res, "Sure thing!\nSource code is at https://github.com/subvisual/tech4covid-slack-bot\nPing Miguel Palhas in this Slack, he'll give you access.")
    const prefix = res.match[1].replace(/s$/, '');

    const resp: any = await getChannels();

    const msg = _.chain(resp.channels).
      map('name').
      filter(name => name.match(new RegExp(`^${prefix}s?_`))).
      map(name => `#${name}`).
      value().
      join('\n');

    if (msg === '') {
    reply(res, `No channels found with prefix ${prefix}`);
    } else {
      reply(res, msg);
    }
  });

};
