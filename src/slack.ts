import * as _ from "lodash";

import { WebClient } from "@slack/client";

export const react = (res: any, reaction: string) => {
  const web = new WebClient(process.env.HUBOT_SLACK_TOKEN!);

  web.reactions.add({
    name: reaction,
    channel: res.message.rawMessage.channel,
    timestamp: res.message.rawMessage.ts
  });
};

export const unreact = (res: any, reaction: string) => {
  const web = new WebClient(process.env.HUBOT_SLACK_TOKEN!);

  web.reactions.remove({
    name: reaction,
    channel: res.message.rawMessage.channel,
    timestamp: res.message.rawMessage.ts
  });
};

const replyDefaults = { link_names: true, reply_broadcast: true };

export const reply = (res: any, msg: string, opts?: any) => {
  const fullOpts = _.merge(replyDefaults, opts || {});

  res.message.thread_ts = res.message.thread_ts || res.message.id;
  res.message.reply_broadcast = fullOpts.reply_broadcast;
  res.message.link_names = fullOpts.link_names;

  res.send(msg);
};