#
# Twirl API Package
#
package Twirl::API;

require Net::Twitter;
require JSON::PP;
require Redis;

use Dancer ':syntax';

#
# Client (Redis / Twitter API) factories
#
sub _createRedisClient {
	return Redis->new(
		server   => config->{redis_server},
		password => config->{redis_password} || undef,
	);
};
sub _createTwitterClient {
	return Net::Twitter->new(
		ssl    => 1,
		traits => [qw/API::RESTv1_1/],
		consumer_key        => config->{twitter_consumer_key},
		consumer_secret     => config->{twitter_consumer_secret},
		access_token        => config->{twitter_access_token},
		access_token_secret => config->{twitter_access_token_secret},
	);
};

#
# Returns the 5 most recent tweets for a Twitter user
#
# API response is returned as-is with no custom formatting.
#
sub RecentTweets {
	return _createTwitterClient()->user_timeline({
		screen_name => $_[0],
		count       => 5,
	});
};

#
# Finds friends shared by a given set of Twitter users
#
# Returns an array of user IDs.
#
sub SharedFriends {
	# Only one client
	my $twitter  = _createTwitterClient();
	my $redis    = _createRedisClient();
	my $keyspace = $redis->incr( 'friends_list' );
	my @set_keys;
	my @friend_ids;
	my @friends;

	# Find friends of all given users
	for my $screen_name ( @_ ) {
		# Store user's friends in an isolated keyspace
		my $set_key = $keyspace . ':' . $screen_name;
		push( @set_keys, $set_key );

		# Loop through all pages of friends using 'next_cursor'
		for ( my $cursor = -1, my $response; $cursor; $cursor = $response->{next_cursor} ) {
			# Fetch next page of friends
			$response = $twitter->friends_ids({
				screen_name => $screen_name,
				cursor      => $cursor,
			});

			# Store this page of friends in redis
			$redis->sadd( $set_key, @{ $response->{ids} } );
		}
	}

	# Set intersection gives shared friends
	@friend_ids = $redis->sinter( @set_keys );

	# Cleanup Redis keys
	$redis->del( @set_keys );

	# Fetch the actual user data. Twitter allows only 100 at a time so we have to loop.
	while ( my @batch_ids = splice( @friend_ids, 0 , 100 ) ) {
		push @friends, $twitter->lookup_users({
			user_id          => \@batch_ids,
			include_entities => 0,
		});
	}

	# Return reference otherwise array eval'd in scalar context
	return \@friends;
};
