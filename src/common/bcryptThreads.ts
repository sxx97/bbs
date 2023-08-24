import * as bcrypt from 'bcrypt';

export default async ({ event, password, hash, salt }) => {
  const eventMap = {
    hash: () => bcrypt.hash(password, salt),
    compare: () => bcrypt.compare(password, hash),
  };

  const eventFunc = eventMap[event];

  if (eventFunc === undefined) {
    throw new Error(`Unknown event: ${event}`);
  }
  return await eventFunc();
};
