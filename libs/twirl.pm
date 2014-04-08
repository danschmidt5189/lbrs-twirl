#
#  Twirl.pm Application Class File
#
package Twirl;

use Dancer ':syntax';
use API;

our $VERSION = '0.1';

# Content-type negotiation
set serializer => 'Mutable';

# Home page template
get '/' => sub {
	template 'home';
};

# API Method 1: Returns most recent tweets from a user
get '/tweets/:username' => sub {
	return Twirl::API::RecentTweets( params->{username} );
};

# API Method 2: Returns list of friends that two users have in common
get '/friends/:username_1/:username_2' => sub {
	return Twirl::API::SharedFriends( params->{username_1}, params->{username_2} );
};

true;