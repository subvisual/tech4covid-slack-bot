// Description:
//   Work in progress
//
// Commands:
//   hubot hey - test command, work in progress

import * as _ from "lodash";
import titleize from 'titleize';
const pluralize = require('pluralize');

import { react, reply, getChannels } from '../slack';

const prefixes = ['project', 'prospect', 'skill'];


module.exports = (robot: any) => {
  robot.respond(/projects/i, async (res: any) => {
    const resp: any = await getChannels();

    const groups = _.reduce(resp.channels, (accum: any, channel: any) => {
      if (!channel.name) { return accum; }

      const prefix = _.find(prefixes, (p: string) => channel.name.match(new RegExp(`^${p}s?`)));

      if (!prefix) { return accum; }

      const key = prefix.toString();

      accum[key] = accum[key] || [];
      accum[key].push(channel.name);

      return accum;
    }, {});

    const msg = _.map(_.keys(groups), (group: any) => {
      const projects = _.map(groups[group], project => `#${project}`).join("\n");

      return `*${titleize(pluralize(group))}*:\n${projects}`
    }).join("\n");

    react(res, 'wave');
    reply(res, msg);
  });

};
