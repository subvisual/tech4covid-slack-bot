import _ from 'lodash';
import Redis from 'redis';
import { WebClient } from '@slack/web-api';

const redis = Redis.createClient({ url: process.env.REDIS_URL });
const slack = new WebClient(process.env.HUBOT_SLACK_TOKEN);

(async () => {
  const iterator: any = slack.paginate('users.list');

  for await (const page of iterator) {
    _.each(page.members, (user: any) => {
      redis.set(`user:${user.id}`, JSON.stringify(user.profile));

      const {
        display_name,
        display_name_normalized,
        real_name,
        real_name_normalized,
      } = user.profile;

      if (display_name !== '') {
        redis.set(`username:${display_name}`, user.id);
      }
      if (display_name_normalized !== '') {
        redis.set(`username:${display_name_normalized}`, user.id);
      }
      if (real_name !== '') {
        redis.set(`username:${real_name_normalized}`, user.id);
      }
      if (real_name_normalized !== '') {
        redis.set(`username:${real_name_normalized}`, user.id);
      }
    });
  }

  redis.quit();
})();
