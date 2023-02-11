import type { Feed } from "instagram-private-api";
import PQueue from "p-queue";

const queue = new PQueue({
  concurrency: 2,
  interval: 100,
  intervalCap: 1,
  autoStart: true,
});

export const getAllItemsFromFeed = async <T>(
  feed: Feed<any, T>,
  label = "items"
): Promise<T[]> => {
  let items: T[] = [];

  do {
    console.log(`Fetched ${items.length} ${label}...`);
    const res = (await queue.add(() => feed.items())) as T[];
    items = items.concat(res);
  } while (feed.isMoreAvailable());

  return items;
};
