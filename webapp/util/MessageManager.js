/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.util.MessageManager
 *
 **********************************************************************************
 * Modifications.                                                                 *
 ****************                                                                 *
 * Date           Author         PCR No.           Description of change    	     *
 **********************************************************************************
 * 10/03/2022     X0115030       PCR038711         Initial version            	 *
 **********************************************************************************
 */

sap.ui.define([
	"sap/m/MessageBox",
], function(oMessageBox) {
	"use strict";
	return {
		/**
		 * This method is to show the Success Message
		 * @name onShowSuccessMessageOK
		 * @param vMessage - Message that need to be shown
		 * @param oContext - calling method i.e this operator from calling method
		 */
		onShowSuccessMessageOK: function(vMessage, oContext) {
			oMessageBox.show(vMessage, {
				icon: sap.m.MessageBox.Icon.SUCCESS,
				title: oContext.oI18N.getText("MESSAGEBOX_SUCCESS"),
				actions: [sap.m.MessageBox.Action.OK, ]
			});
		},
		/**
		 * This method is to show the Error Message
		 * @name onShowErrorMessage
		 * @param vMessage - Message that need to be shown
		 * @param vType - Standard or Custom Message
		 * @param oContext - calling method i.e this operator from calling method
		 */
		onShowErrorMessage: function(vMessage, vType, oContext) {
			if (vType !== oContext.oConstants.CUSTOM_MESSAGE) {
				try {
					vMessage = JSON.parse(vMessage.responseText);
					vMessage = vMessage.error.message.value;
				} catch (error) {
					vMessage = vMessage.message;
				}

			}
			oMessageBox.show(vMessage, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: oContext.oI18N.getText("MESSAGEBOX_ERROR"),
				actions: [sap.m.MessageBox.Action.OK, ],
			});
		},
	};
});