(function ($, window, document, undefined) {
    "use strict";

    $.widget('twirl.tweets', {
        // The current Ajax request. This is null if no request is active.
        _request: null,

        // HTML template for individual tweets. Placeholders are replaced with tweet attrs.
        _tweetTemplateHTML: null,

        // Fetches tweets from the Twitter API and updates the UI.
        _update: function () {
            var base      = this,
                actionURL = base._getActionURL(),
                progressBar;

            if ( null === base._request && base._validate() ) {
                progressBar = base.element.find( '.progress' );

                base._request = $.ajax({
                    url: actionURL,
                    type: 'GET',
                    dataType: 'JSON',
                    beforeSend: function () {
                        base._reset();
                        progressBar.removeClass( 'hidden' );
                    },
                });

                base._request.done(function ( tweets ) {
                    base._showTweets( tweets );
                });

                base._request.fail(function ( res, text, err ) {
                    base._showError( res.responseText );
                });

                base._request.always(function () {
                    base._request = null;
                    progressBar.addClass( 'hidden' );
                });
            }

            return base;
        },

        _showTweets: function ( tweets ) {
            var base      = this,
                tweetList = base.element.find( '.tweets' ),
                tweetTpl;

            base.element.find( '.progress' ).addClass( 'hidden' );
            base.element.find( '.error-message' ).addClass( 'hidden' );

            $.each( tweets, function ( i, tweet ) {
                tweetTpl = base._tweetTemplateHTML;
                tweetTpl = tweetTpl.replace( '{text}', tweet.text );
                tweetTpl = tweetTpl.replace( '{created_at}', tweet.created_at );

                tweetList.append( tweetTpl );
            });
        },

        _showError: function ( errorText ) {
            this.element.find( '.error-message' )
                .html( errorText )
                .removeClass( 'hidden' );
        },

        _reset: function () {
            if ( this._request !== null ) {
                this._request.abort();
                this._request = null;
            }

            this.element.find( '.progress' ).addClass( 'hidden' );
            this.element.find( '.error-message' ).html( null ).addClass( 'hidden' );
            this.element.find( '.tweets' ).html( null ).removeClass( 'hidden' );
            this.element.find( '.has-error' ).removeClass( 'has-error' );
            this.element.find( 'input:text' ).first().focus();
        },

        // Binds form submit/reset event handlers.
        _create: function () {
            var base = this;

            this._tweetTemplateHTML = $( '#tweet-tpl' ).html();

            base.element.submit(function ( e ) {
                e.preventDefault();
                base._update();
            });

            base.element.bind('reset', function ( e ) {
                base._reset();
            });

            base._reset();

            return base;
        },

        // Validates the 'username' input
        _validate: function () {
            var username = this.element.find( 'input#username' );

            if ( !username.val().length ) {
                username.closest( '.form-group' ).addClass( 'has-error' );
                return false;
            } else {
                return true;
            }
        },

        // Returns the action url based on the username entered
        _getActionURL: function () {
            var url              = this.element.attr( 'action' ),
                username         = this.element.find( 'input#username' ).val(),
                hasTrailingSlash = url.substring( url.length - 1 ) === '/';

            return url + (hasTrailingSlash ? '' : '/') + username;
        },

    });

    // Self-initialize
    $('form.twirl-tweets').tweets();

})(jQuery, window, document);