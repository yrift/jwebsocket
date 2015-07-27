/* global jws */

//	---------------------------------------------------------------------------
//	jWebSocket jQuery dialog widget (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2015 Innotrade GmbH (jWebSocket.org)
//  Alexander Schulze, Germany (NRW)
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//	http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//	---------------------------------------------------------------------------

/*
 * @author vbarzana
 */
/**
 * @function jwsDialog
 * @example
 *	jwsDialog( "Are you sure?", "title", true, "error", 
 *			function( ) {alert( "closing" )}, lButtons );
 * @param aTitle
 * @param aMessage
 * @param aIsModal
 * @param aIconType 
 *	 Optional, { error|information|alert|important|warning }
 * @param aCloseFunction
 * @param aMoreButtons
 *   var lButtons = [{
 *		id: "buttonYes",
 *		text: "Yes",
 *		aFunction: function( ) {
 *			alert( "you clicked YES button" );
 *		}
 *	},{
 *		id: "buttonNo",
 *		text: "No",
 *		aFunction: function( ) {
 *			alert( "you clicked button NO" );
 *		}
 *	}];
 * This is an example of how to use this function:
 * @param aWidth Optional, the width of the dialog window
 */

jwsDialogs = {
	showBootstrapDialog: function (aTitle, aBody, aButtons) {
		// TODO: optimize this here to not remove the dialog, but instead hide 
		// it every time, this condition checks if there is no dialog to remove, 
		// then we create a new Id
		if (!this.hideBootstrapDialog('#' + jwsDialogs.mSavedId)) {
			jwsDialogs.mSavedId = jws.tools.createUUID();
		}

		var lBody = '<div class="modal-body">' + aBody + '</div>',
				lFooter = '<div class="modal-footer">' +
				'<button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>' +
//				'<button type="button" class="btn btn-primary">Save changes</button>' +
				'</div>',
				lModalHeader = '<div class="modal-header">' +
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				'<h4 class="modal-title">' + aTitle + '</h4>' +
				'</div>',
				lModal = $('<div class="modal fade"  id="' + jwsDialogs.mSavedId + '">' +
						'<div class="modal-dialog">' +
						'<div class="modal-content">' +
						lModalHeader +
						lBody +
						lFooter +
						'</div>' +
						'</div>' +
						'</div>');
		lModal.appendTo($('body')).modal('show');
	},
	hideBootstrapDialog: function (aDialogSelector) {
		if (aDialogSelector) {
			var lExistingDialog = $(aDialogSelector);
			if (lExistingDialog.get(0)) {
				// then we remove it
				lExistingDialog.modal('hide').data('bs.modal', null);
				$('body').removeClass("modal-open");
				$('.modal-backdrop').remove();
				lExistingDialog.detach();
				lExistingDialog.remove();
				return true;
			}
		}
		return false;
	},
	showJwsDialog: jwsDialog,
	closeJwsDialog: closeDialog
};
/**
 * This function is deprecated and will be removed in the next release of jWebSocket
 * @param {type} aMessage
 * @param {type} aTitle
 * @param {type} aIsModal
 * @param {type} aIconType
 * @param {type} aCloseFunction
 * @param {type} aMoreButtons
 * @param {type} aWidth
 * @returns {undefined}
 */
function jwsDialog(aMessage, aTitle, aIsModal, aIconType, aCloseFunction, aMoreButtons, aWidth) {
	var lDialog = $("<div id='dialog'></div>").css({overflow: 'hidden'}),
			lContentWidth = aIconType ? "80%" : "99%",
			lContent = $("<div><p>" + aMessage + "</p></div>").css({
		"width": lContentWidth,
		"float": "left"
	}),
			lButtonsArea = $("<div class='ui-dialog-buttonpane " +
					"ui-widget-content ui-helper-clearfix'></div>"),
			lButton = $('<div style="float: right;" ' +
					'class="button onmouseup" ' +
					'onmouseover="this.className=\'button onmouseover\'" ' +
					'onmousedown="this.className=\'button onmousedown\'" ' +
					'onmouseup="this.className=\'button onmouseup\'"' +
					'onmouseout="this.className=\'button onmouseout\'" ' +
					'onclick="this.className=\'button onmouseover\'">');

	if (aMoreButtons) {
		$(aMoreButtons).each(function (aIndex, aElement) {
			var lText = aElement.text || "aButton";
			var lFunction = aElement.aFunction;
			var lNewButton = lButton.clone( )

					.click(function ( ) {
						lFunction( );
						lDialog.dialog("close");
						$(this).parent( ).parent( ).remove( );
					});
			if (aElement.id) {
				lNewButton.attr("id", aElement.id);
			}

			lNewButton.append($('<div class="btn_left"></div>'))
					.append($('<div class="btn_center">' + lText + '</div>'))
					.append($('<div class="btn_right"></div>'));
			lButtonsArea.prepend(lNewButton);
		});
	} else {
		lButton.append($('<div class="btn_left"></div>'))
				.append($('<div class="btn_center">Ok</div>'))
				.append($('<div class="btn_right"></div>'));
		lButton.click(function ( ) {
			if (aCloseFunction) {
				aCloseFunction( );
			}
			lDialog.dialog("close");
			$(this).parent( ).parent( ).remove( );
		});
		lButtonsArea.append(lButton);
	}
	if (aIconType) {
		if (aIconType === "error" || aIconType === "information" ||
				aIconType === "warning" || aIconType === "alert" ||
				aIconType === "important") {
			var lIcon = $("<div id='icon' class='" + "icon_" +
					aIconType + "'></div>");
			lDialog.append(lIcon);
		}
		else {
			console.log("Unrecognized type of icon '" + aIconType +
					"', the allowed types are { error|information|warning|alert }");
		}
	}
	lDialog.append(lContent);
	lDialog.prependTo("body");

	lDialog.dialog({
		autoOpen: true,
		resizable: false,
		modal: aIsModal || false,
		width: aWidth || 300,
		title: aTitle || "jWebSocket Message"
	});
	lDialog.append(lButtonsArea);
}
/**
 * Deprecated, will be removed in the next jwebsocket release
 * @returns {undefined}
 */
function closeDialog( ) {
	var lDialog = $('<div id="dialog"></div>');
	lDialog.dialog("close");
	$(".ui-dialog").remove( );
}
