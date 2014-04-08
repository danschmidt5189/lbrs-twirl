lbrs-twirl
==========

A Perl exercise using the Twitter API. Built with Dancer, jQuery, Bootstrap 3.1, and Net::Twitter.

Allows you to fetch a user's most recent tweets or find friends in common among different users.

## Setup

On top of Perl / Dancer, this requires access to the Twitter API and a Redis server.

Whip up an `environments/development.yml` file with the following information:

```yaml
# Twitter API config
twitter_consumer_key: "YOUR_KEY"
twitter_consumer_secret: "YOUR_SECRET"
twitter_access_token: "YOUR_TOKEN"
twitter_access_token_secret: "YOUR_TOKEN_SECRET"

# Redis client config
redis_server: "localhost:6379"
redis_name: "twirl"
```

## Screenshots

![Recent Tweets](/public/images/screenshot-recent-tweets.png)
