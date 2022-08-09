/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.util.BusyIndicator
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
		 * This method is used to Reset Busy Indicator Count
		 * @name resetBusyIndicator
		 */
		resetBusyIndicator: function() {
			this._iBusyCounter = 0;
		},
		/**
		 * This method is to Show Busy Indicator
		 * @name showBusyIndicator
		 * @param oContext - calling method i.e this operator from calling method
		 */
		showBusyIndicator: function(oContext) {
			// increment the busy counter
			this._iBusyCounter++;
			// show the busy indicator	
			if (this._iBusyCounter === 1) {
				sap.ui.core.BusyIndicator.show(0);
			}
		},
		/**
		 * This method is to Hide Busy Indicator Count
		 * @name hideBusyIndicator
		 * @param oContext - calling method i.e this operator from calling method
		 */
		hideBusyIndicator: function(oContext) {
			var self = this;
			// hide the busy indicator (hide it after a timeout
			// to give enough time for the next operation to increase the busy counter
			// before the busy indicator disappears, if needed)
			if (oContext) {
				var oView = $("#" + oContext.getView().sId);
				oView.find(".sapUiBusy").css("display", "none");
				oView.find(".sapUiBlyBusy").css("display", "none");
			} else {
				window.setTimeout(function() {
					self._iBusyCounter--;
					if (self._iBusyCounter <= 0) {
						self._iBusyCounter = 0;
						sap.ui.core.BusyIndicator.hide();
					}
				}, 0);
			}
		},
	};
});