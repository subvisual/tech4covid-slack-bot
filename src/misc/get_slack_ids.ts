import _ from 'lodash';
import { WebClient } from '@slack/web-api';
import { google } from 'googleapis';

// const usernames = ["@naps62_Dev-DevOps_Subvisual", "@André Francisco CTO HypeLabs"];

const SheetID = '1rJqTqH-QpFGlHWdyXhRX1Oe5_5NI9Dts5uESzQk7r7I';
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

const googleClient = google.sheets({ version: 'v4', auth: jwt });

const getUsernames = async () => {
  const res: any = await googleClient.spreadsheets.values.get({
    spreadsheetId: SheetID,
    range: 'Ideias e Projectos!E3:E500',
  });

  return _.chain(res.data.values)
    .map(row => row[0])
    .value();
};

const allSlackUsers = async (api: any) => {
  let users: any[] = [];

  const iterator: any = api.paginate('users.list');
  for await (const page of iterator) {
    users = users.concat(page.members);
  }

  return users;
};

const findSlackUserId = async (
  name: string,
  slackUsers: any[]
): Promise<any> => {
  const r = _.find(slackUsers, u => {
    if (
      u.profile.display_name === name ||
      u.profile.display_name_normalized === name ||
      u.profile.real_name === name ||
      u.profile.real_name_normalized === name ||
      u.name === name
    ) {
      return u;
    }
  });

  if (r) {
    return r;
  }

  console.log(`Slack Handle not found for ${name}`);
  return null;
};

(async () => {
  try {
    const api = new WebClient(process.env.HUBOT_SLACK_TOKEN);
    const slackUsers = await allSlackUsers(api);

    const realUsers: any = await Promise.all(
      _.chain(await getUsernames())
        .map((name: string) => name && name.replace(/^@/, '').trim())
        .map((name: string) => findSlackUserId(name, slackUsers))
        .value()
    );

    console.log(_.map(realUsers, u => (u ? u.id : '')).join('\n'));
  } catch (err) {
    console.log(err);
  }
})();
