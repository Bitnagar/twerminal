/* eslint-disable quotes */
"use strict";
const chalk = require("chalk");

function showAllOptions() {
  const text = `
  ______                             _             __
 /_  __/      _____  _________ ___  (_)___  ____ _/ /
  / / | | /| / / _ \\/ ___/ __ .__ \\/ / __ \\/ __ ./ / 
 / /  | |/ |/ /  __/ /  / / / / / / / / / / /_/ / /  
/_/   |__/|__/\\___/_/  /_/ /_/ /_/_/_/ /_/\\__,_/_/   
                                                     
`;
  const usage = chalk.bold.keyword("violet")(
    "\n✨ Welcome to Twerminal!" +
      `${chalk.italic.keyword("skyblue")(" Tweet")}` +
      " from your terminal 🐤."
  );
  const tip = chalk.keyword("orange")(
    `\n On your terminal, write ${chalk.keyword("yellow")(
      "tweet"
    )}${chalk.keyword("skyblue")(
      " <your tweet text>"
    )} and that's it. Hit that enter!`
  );
  console.log(text);
  console.log(usage);
  console.log(tip);
  console.log(
    "\nChoose from any options below, to delete a tweet or to ask for help!"
  );

  console.log("\nOptions:\r");
  console.log(
    "    -d, --delete\t" +
      "Delete a tweet with Tweet ID." +
      "\t\t\t" +
      "[boolean]\r"
  );
  console.log(
    "    -p, --poll\t\t" +
      "Create a Tweet with Poll." +
      "\n\t\t\tWrite <number of options> <duration> <heading>." +
      "\t" +
      "[boolean]\r"
  );
  console.log(
    "    -srch, --search\t" +
      "Search tweets on a topic of your choice." +
      "\t" +
      "[boolean]\r"
  );
  console.log(
    "    -th, --thread\t" +
      "Create a thread of tweets." +
      "\t\t\t" +
      "[boolean]\r"
  );
  console.log(
    "    -tl, --timeline\t" +
      "Get the most recent tweets of your home \n\t\t\ttimeline." +
      "\t\t\t\t\t" +
      "[boolean]\r"
  );
  console.log(
    "\t--version\t" + "Show version number." + "\t\t\t\t" + "[boolean]\r"
  );
  console.log("\t--help\t\t" + "Show help." + "\t\t\t\t\t" + "[boolean]\n");
}

const MAX_CHAR_LIMIT = 280;
const MAX_POLL_CHAR_LIMIT = 25;

module.exports = {
  showAllOptions: showAllOptions,
  MAX_CHAR_LIMIT: MAX_CHAR_LIMIT,
  MAX_POLL_CHAR_LIMIT: MAX_POLL_CHAR_LIMIT,
};
