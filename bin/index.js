#! /usr/bin/env node
/* eslint-disable no-undef */
"use strict";
const chalk = require("chalk");
const utils = require("./utils");
const { userClient } = require("./client");
const { program } = require("commander");
const inquirer = require("inquirer");

//currently available features or flags
program
  .option("-d, --delete")
  .option("-p, --poll")
  .option("-th, --thread")
  .option("-srch, --search")
  .option("-tl, --timeline");

program.usage("tweet <your tweet text here in quotation marks.>");
program.parse();

const options = program.opts();
const optionSize = Object.keys(options).length;

if (program.args[0] === undefined && optionSize <= 0) {
  utils.showAllOptions();
}

//create a tweet
if (optionSize <= 0 && program.args[0] != undefined) {
  const tweetText = program.args.join(" ");
  if (tweetText.length > utils.MAX_CHAR_LIMIT) {
    console.log("Character limit exceeded. Try a shorter tweet?!");
    process.exit();
  }
  (async () => {
    try {
      const { data: createdTweet } = await userClient.v2.tweet(tweetText);
      console.log(
        chalk.keyword("green")("Tweet created successfully🎉.") +
          "\n\n" +
          chalk.keyword("orange")("Tweet ID: ") +
          chalk.keyword("green")(createdTweet.id) +
          "\n" +
          chalk.keyword("orange")("Your Tweet: "),
        chalk.keyword("green")(createdTweet.text)
      );
    } catch (error) {
      console.log(
        chalk.keyword("red")(error.data.detail + " Please try again.")
      );
    }
  })();
}

//delete the tweet
if (options.delete) {
  const tweetID = program.args[0];
  (async () => {
    try {
      const { data: returnedData } = await userClient.v2.deleteTweet(tweetID);
      if (returnedData.deleted) {
        console.log(chalk.keyword("green")("Tweet deleted successfully!"));
      }
    } catch (error) {
      console.log(
        chalk.keyword("red")(
          error.data.detail + " Please enter a valid Tweet Id."
        )
      );
    }
  })();
}

//creating a poll
if (options.poll) {
  let args = program.args;
  if (args.length < 2) {
    console.log("Need more than 2 arguments. Please try again.");
    process.exit();
  }
  let pollCount = parseInt(args[0]);
  if (pollCount < 2 || pollCount > 4) {
    console.log("You can only make min 2 and max 4 options. Try again.");
    process.exit();
  }
  let duration = parseInt(args[1]);
  let heading = args[2];
  let optionsArray = [];
  (async () => {
    for (let i = 0; i < pollCount; i++) {
      await inquirer
        .prompt([
          {
            type: "input",
            name: "option",
            message: `Please enter poll option ${i + 1}:`,
            validate: function (input) {
              if (input.length > utils.MAX_POLL_CHAR_LIMIT || input === "") {
                console.log(
                  " Your option should contain atleast 1 and max of 25 characters. Try again."
                );
                return false;
              } else {
                return true;
              }
            },
          },
        ])
        .then((result) => {
          optionsArray.push(result.option);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    try {
      const { data: createdTweet } = await userClient.v2.tweet(heading, {
        poll: { duration_minutes: duration, options: optionsArray },
      });
      console.log(
        chalk.keyword("green")("Tweet created successfully🎉.") +
          "\n\n" +
          chalk.keyword("orange")("Tweet ID: ") +
          chalk.keyword("green")(createdTweet.id) +
          "\n" +
          chalk.keyword("orange")("Your Tweet: "),
        chalk.keyword("green")(createdTweet.text)
      );
    } catch (error) {
      console.log(chalk.keyword("red")(error.data.detail));
    }
  })();
}

// creating a thread
if (options.thread) {
  let threadsArray = [];
  let threadNumber = 0;
  (async () => {
    let wantToPutInput = true;
    while (wantToPutInput) {
      await inquirer
        .prompt([
          {
            type: "input",
            name: "thread",
            // eslint-disable-next-line quotes
            message: `Write your ${threadNumber}/n thread: `,
            validate: function (input) {
              if (input.length > utils.MAX_CHAR_LIMIT || input === "") {
                console.log(
                  " Your tweet should contain atleast 1 and max of 250 characters. Try again."
                );
                return false;
              } else {
                return true;
              }
            },
          },
          {
            type: "confirm",
            name: "wantToPutInput",
            message: "Do you want to add another tweet?",
            default: true,
          },
        ])
        .then((answer) => {
          threadsArray.push(answer.thread);
          threadNumber++;
          wantToPutInput = answer.wantToPutInput;
        });
    }
    try {
      const [createdTweet] = await userClient.v2.tweetThread(threadsArray);
      console.log(
        chalk.keyword("green")("Tweet created successfully🎉.") +
          "\n\n" +
          chalk.keyword("orange")("Tweet ID: ") +
          chalk.keyword("green")(createdTweet.data.id) +
          "\n" +
          chalk.keyword("orange")("Your Tweet: "),
        chalk.keyword("green")(createdTweet.data.text)
      );
    } catch (error) {
      console.log(chalk.keyword("red")(error.data));
    }
  })();
}

//search tweets for a particular topic
if (options.search) {
  const search = program.args[0];
  (async () => {
    try {
      const jsTweets = await userClient.v2.search(search, {
        "tweet.fields": "referenced_tweets",
        "expansions": "referenced_tweets.id",
      });
      for (const tweet of jsTweets) {
        console.log(tweet);
      }
    } catch (error) {
      console.log(chalk.keyword("red")(error));
    }
  })();
}

if (options.timeline) {
  (async () => {
    try {
      const homeTimeline = await userClient.v2.homeTimeline({
        exclude: "replies",
        max_results: 10,
        expansions: "author_id",
      });
      homeTimeline.data.data.forEach((data, key) =>
        console.log(
          chalk.keyword("skyblue")(key + 1 + "). " + data.text) + "\n"
        )
      );
      // homeTimeline.data.includes.users.forEach((user) => console.log(user));
      // console.log(homeTimeline.data);
      // console.log(homeTimeline.data.includes.users);

      //write a function that can show timeline tweet and its author
      //for that we need a way to relate the tweet and author, that is, author id.
    } catch (error) {
      console.log(chalk.keyword("red")(error));
    }
  })();
}
