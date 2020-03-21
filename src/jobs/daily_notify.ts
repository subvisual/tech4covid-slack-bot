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

const getSlackIds = async () => {
  const res: any = await googleClient.spreadsheets.values.get({
    spreadsheetId: SheetID,
    range: 'Ideias e Projectos!P3:P500',
  });

  console.log(res.data);
  return _.chain(res.data.values)
    .map(row => row[0])
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

(async () => {
  try {
    const api = new WebClient(process.env.HUBOT_SLACK_TOKEN);
    const msg = await getMessage();

    const slackUserIds: any = await getSlackIds();

    console.log(slackUserIds);

    _.map(slackUserIds, async (userId: any) => {
      if (userId != null) {
        try {
          console.log(`Sending daily reminder to ${userId}`);

          const dm: any = await api.conversations.open({ users: `${userId}` });
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
