// Description:
//   Lists skills/projects/prospects/etc available in this Slack
//
// Commands:
//   hubot list <prefix> - lists existing skills/projects/prospects on this Slack

import * as _ from "lodash";

import { reply, getChannels } from '../slack';

module.exports = (robot: any) => {
  robot.respond(/list (\w+)/i, async (res: any) => {
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
