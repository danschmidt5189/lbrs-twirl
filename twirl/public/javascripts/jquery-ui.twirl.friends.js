(function ($, window, document, undefined) {
    "use strict";

    $.widget('twirl.friends', {
        // HTML template for users returned by the db
        _userTemplateHTML: null,

        _create: function () {
            var base = this;

            base._userTemplateHTML = this.element.find( '#friend-template' ).html();

            base.element.bind( 'reset', function ( e ) {
                base._clear();
            });

            base.element.submit(function ( e ) {
                e.preventDefault();
                base._update();
            });
        },

        _clear: function () {
            this._clearErrors();
            this.element.find( 'input' ).first().focus();
        },

        _update: function () {
            var base      = this,
                actionURL = base._getActionURL(),
                req, progress, friendList, remaining, last;

            if ( base._validate() ) {
                progress   = this.element.find( '.progress' );
                friendList = this.element.find( '.friends' );

                req = $.ajax(actionURL, { type: 'GET', dataType: 'JSON', beforeSend: function () {
                    progress.removeClass( 'hidden' );
                    friendList.html( null );

                    console.log( 'Preparing Request...' );
                }});

                req.done(function ( response ) {
                    var friends = response[0];

                    for ( var i = 0; i < 10 && i < friends.length; i++ ) {
                        var user = friends[i];
                        base._addUser( user );
                    }

                    remaining = friends.length - i;
                    if ( remaining > 0 ) {
                        last = {};
                        last.screen_name = '<em>And ' + remaining + ' more... (Showing ' + 10 + ' of ' + friends.length + ')</em>';
                        base._addUser( last );
                    }

                    console.log( 'Request Succeeded:', friends );
                });

                req.fail(function ( res, text, err ) {
                    var message;
                    if ( res.responseJSON.error.match( /redis/gi ) ) {
                        message = "<strong>Redis Error:</strong> Couldn't connect to redis. Check configuration settings.";
                    } else if ( res.responseJSON.error.match( /Twitter/gi ) ) {
                        message = "<strong>Rate Limited:</strong> Twitter wants us to chill out. Try again in a few minutes.";
                    } else {
                        message = "<strong>Woops...</strong> An error occurred. Try again later."
                    }

                    base._addError( message );

                    console.log( 'Request Failed:', text, err, res );
                });

                req.always(function () {
                    progress.addClass( 'hidden' );

                    console.log( 'Request Complete.' );
                });
            }

            return base;
        },

        _addUser: function ( user ) {
            var userHTML   = this._userTemplateHTML,
                friendList = this.element.find( '.friends' );

            userHTML = userHTML.replace( '{screen_name}', user.screen_name );

            friendList.append( userHTML );
        },

        _getActionURL: function () {
            var url       = this.element.attr( 'action' ),
                usernames = [];

            this.element.find( 'input' ).each(function ( i, username ) {
                usernames.push( $( username ).val() );
            });

            return url + '/' + usernames.join( '/' );
        },

        _validate: function () {
            var base      = this,
                usernames = [],
                isValid   = true;

            base._clearErrors();
            base.element.find( 'input' ).each(function ( i, field ) {
                var el = $( field );

                if ( ! el.val() ) {
                    base._addError( 'You must select two usernames for comparison.' );
                    el.focus().effect( 'highlight' );
                    return (isValid = false);
                }
            });

            console.log( 'Validation Complete:', isValid );
            return isValid;
        },

        _clearErrors: function () {
            this.element.find( '.errors' )
                .addClass( 'hidden' )
                .html( null );
        },

        _addError: function ( errorText ) {
            this.element.find( '.errors' )
                .html( errorText )
                .removeClass( 'hidden' )
                .effect( 'highlight' );
        },
    });

    // Self-initialize
    $('form.twirl-friends').friends();

})(jQuery, window, document);