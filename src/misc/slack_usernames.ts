import _ from 'lodash';
import { WebClient } from '@slack/web-api';

console.log(`ID,email,name`);

(async () => {
  const api = new WebClient(process.env.SLACK_API_TOKEN);

  const iterator: any = api.paginate('users.list');
  for await (const page of iterator) {
    _.each(page.members, u => {
      const name = u.profile.real_name ===  '' ? u.profile.display_name : u.profile.display_name;
      // if (u.profile.email == 'orlando.lopes@eattasty.com') {
      //   console.log(u)
      // }
      console.log(`${u.id},${u.profile.email},${name}`);
    })
  }
})()
