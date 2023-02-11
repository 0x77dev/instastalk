import { writeFile } from "fs/promises";
import { IgApiClient } from "instagram-private-api";
import { join } from "path";
import prompts from "prompts";
import { getAllItemsFromFeed } from "./utils";

const DATA_DIR = process.env["DATA_DIR"] || ".";

const ig = new IgApiClient();

ig.state.generateDevice(process.env["IG_USERNAME"]!);

if (process.env["IG_PROXY"]) {
  ig.state.proxyUrl = process.env["IG_PROXY"];
}

console.log("Simulating pre-login flow...");
await ig.simulate.preLoginFlow();

console.log("Logging in...");
const user = await ig.account.login(
  process.env["IG_USERNAME"]!,
  process.env["IG_PASSWORD"]!
);
console.log("Logged in as", user.username);

const [followers, following] = await Promise.all([
  getAllItemsFromFeed(
    ig.feed.accountFollowers(ig.state.cookieUserId),
    "followers"
  ),
  getAllItemsFromFeed(
    ig.feed.accountFollowing(ig.state.cookieUserId),
    "following"
  ),
]);

const notFollowingBack = followers.filter(
  (follower) => !following.some((following) => following.pk === follower.pk)
);

console.log(
  "Not following back:",
  notFollowingBack.map((user) => user.username).join("\n")
);

const { ack } = await prompts({
  type: "confirm",
  name: "ack",
  message: `Unfollow ${notFollowingBack.length} users?`,
});

if (!ack) {
  console.log("Aborting...");
  process.exit(0);
}

await writeFile(
  join(DATA_DIR, "result.json"),
  JSON.stringify(notFollowingBack, null, 2),
  "utf8"
);

console.log("Unfollowing...");
for (const user of notFollowingBack) {
  await ig.friendship.removeFollower(user.pk);
  console.log(`Removed follower ${user.username}`);
}
