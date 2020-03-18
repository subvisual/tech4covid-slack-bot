// Description:
//   Work in progress
//
// Commands:
//   hubot hey - test command, work in progress

import * as _ from "lodash";

import { react, reply } from '../slack';

module.exports = (robot: any) => {
  robot.respond(/hey/i, async (res: any) => {
    react(res, 'wave');
    reply(res, `Hey you. This bot is a work in progress`);
  });

};
