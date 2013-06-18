var request_archives = [];
$(function(){
	$('#view_wrapper').on( 'click', 'input:submit', function(e) {
		e.preventDefault();
		$form = $(this).parents('form');

		var method = 'GET';
		if ( 'method' == $(this).attr('name') )
			method = $(this).val();
		else if ( $form.find('.request_method').length )
			method = $form.find('.request_method').val();
		var url = $form.find('.request_url').val();
		var body = $form.find('.request_body').val();

		var req_history = {
			method: method,
			url:    url,
			body:   body
		};

		if ( 'GET' == method && body.length )
			body = $.parseJSON( body );

		if ( -1 != url.indexOf('?') )
			url = url + '&';
		else
			url = url + '?';
		url = url + 'pretty=1';

		$.ajax({
			type: method,
			url: url,
			data: body,
			success: function( data ) {
				$('#'+$form.data('response')+'').html( _escape( data.replace(/\\/g,'') ) ).fadeIn();
				add_history( req_history );
			},
			error: function( jqXHR ) {
				$('#'+$form.data('response')+'').html( jqXHR.responseText.replace(/\\n/g,"\n").replace(/\\/g,'') ).fadeIn();
			},
			dataType: 'text'
		});
	});

	$('#request_history').on('click', '.history', function(e) {
		e.preventDefault();
		var id = $(this).data('id');
		if ( request_archives && request_archives[id] ) {
			$('#request_url').val( request_archives[id].url );
			editor.setValue( request_archives[id].body );
		}
	});

	$( '.show_toggle' ).click(function(event) {
		event.preventDefault();
		$this = $( this );
		$el = $( $this.attr( 'href' ) );
		if ( $el.is( ':visible' ) ) {
			$el.slideUp();
			$this.html( $this.html().replace( 'Hide ', 'Show ' ) );
			$this.find( '.caret' ).removeClass( 'caret-up' );
		} else {
			$el.slideDown();
			$this.html( $this.html().replace( 'Show ', 'Hide ' ) );
			$this.find( '.caret' ).addClass( 'caret-up' );
		}
	});

	function add_history( data ) {
		var id = request_archives.length;
		request_archives.push(data);
		body = data.body ? data.body.replace(/[\s+]/g,' ') : '';
		if ( body.length > 78 )
			body = body.substr(0,75) + '&hellip;'
		$('#request_history ul .nav-header').after( $( '<li><a class="history" href="#" data-id="' + id + '">' + data.method + ' ' + data.url + '<br />&nbsp; &nbsp; &nbsp; &nbsp; ' + body + '</a></li>' ) );
	}
});

/* From Underscore.js */
// List of HTML entities for escaping.
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

// Regex containing the keys listed immediately above.
var htmlEscaper = /[&<>"'\/]/g;

// Escape a string for HTML interpolation.
_escape = function(string) {
  return ('' + string).replace(htmlEscaper, function(match) {
    return htmlEscapes[match];
  });
};