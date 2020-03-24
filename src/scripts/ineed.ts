// Description:
//   Points you to the right contact for the skill you're looking for
//
// Commands:
//   hubot ineed - list all registered skills
//   hubot ineed <skill> - who can I talk if I need this skill?

import * as _ from 'lodash';
import { google } from 'googleapis';
import Redis from 'redis';
import { promisify } from 'util';

import { reply } from '../slack';

const redis = Redis.createClient({ url: process.env.REDIS_URL });
const redisGet = promisify(redis.get);
const scopes = 'https://www.googleapis.com/auth/spreadsheets';
const jwt = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: _.replace(
    process.env.GOOGLE_PRIVATE_KEY!,
    new RegExp('\\\\n', 'g'),
    '\n'
  ),
  scopes,
});
const INeedSheet = 'Bot (ineed)';
const SpreadsheetID = '1rJqTqH-QpFGlHWdyXhRX1Oe5_5NI9Dts5uESzQk7r7I';

const googleClient = google.sheets({ version: 'v4', auth: jwt });

const getSkills = async () => {
  const res: any = await googleClient.spreadsheets.values.get({
    spreadsheetId: SpreadsheetID,
    range: `${INeedSheet}!A2:D500`,
  });

  return res.data.values;
};

module.exports = (robot: any) => {
  robot.respond(/ineed$/i, async (res: any) => {
    const skills = await getSkills();

    const list = _.map(skills, ([keywords, description, person, _action]) => {
      const parenthesis = person ? `(ask ${person.replace(/@/, '')})` : '';
      return `- \`${keywords}\`: ${description} ${parenthesis}`;
    });

    reply(
      res,
      [
        `Type \`ineed <keyword>\` to get info on a particular skill (keywords on the left side, \`in code block\`)`,
        `Listed skills:`,
        ...list,
      ].join('\n')
    );
  });

  robot.respond(/ineed (\w+)/i, async (res: any) => {
    const skill = res.match[1].toLowerCase();
    console.log(skill);

    const skills = await getSkills();

    const [, description, person, action] = _.find(
      skills,
      ([keywords, ...rest]) => keywords.match(skill)
    );

    const personId = await redisGet(`username:${person.replace(/^@/, '')}`);

    const personSection = personId
      ? `https://tech4covid19.slack.com/team/${personId}`
      : '';

    const response = [description, action, personSection].join('\n');

    reply(res, response);
  });
};
