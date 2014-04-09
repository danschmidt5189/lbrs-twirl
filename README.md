lbrs-twirl
==========

Find a Twitter user's recent tweets, or find friends shared by two users.

An exercise using Perl, Dancer, Redis, and the Twitter API.

Check it out at http://twirl-lbrs.rhcloud.com/.

## NOTE

Both Redis (on RedisToGo) and Twitter are subject to rate limiting. If you receive a "Woops..." error, rate limiting is the most likely cause. The application log can be used to confirm that.
