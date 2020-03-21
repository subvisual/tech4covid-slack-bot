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
    .filter(handle => !!handle)
    .uniq()
    .value();
};

const getMessage = async () => {
  const res: any = await googleClient.spreadsheets.values.get({
    spreadsheetId: SheetID,
    range: 'Bots!B1:B1',
  });

  return res.data.values[0][0];
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
      u.profile.display_name == name ||
      u.profile.display_name_normalized == name ||
      u.profile.real_name == name ||
      u.profile.real_name_normalized == name ||
      u.name == name
    ) {
      return u.id;
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
    const msg = await getMessage();
    const slackUsers = await allSlackUsers(api);

    const realUsers: any = await Promise.all(
      _.chain(await getUsernames())
        .map((name: string) => name.replace(/^@/, '').trim())
        .map((name: string) => findSlackUserId(name, slackUsers))
        .value()
    );

    console.log(_.map(realUsers, u => u && u.id));

    // const users = await Promise.all(
    //   _.chain(usernames).
    //     map((name: string) => name.replace(/^@/, '')).
    //     map((name: string) => findSlackUserId(name, slackUsers)).
    //     value()
    // );

    // console.log(users)

    _.map(realUsers, async (user: any) => {
      if (user != null) {
        try {
          const dm: any = await api.conversations.open({ users: `${user.id}` });
          await api.chat.postMessage({ text: msg, channel: dm.channel.id });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
