// Description:
//   Check the status of Utrust deployments
//
// Commands:
//   hubot status of <env> - list all services of a given env, and their statuses
//   hubot status - list status for production services

import * as _ from "lodash";
import * as moment from "moment";

module.exports = (robot: any) => {
  robot.respond(/hey/i, async (res: any) => {
    react(res, 'wave');
    reply(res, `Hey you`);
  });

};
