/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.util.formatter
 *
 **********************************************************************************
 * Modifications.                                                                 *
 ****************                                                                 *
 * Date           Author         PCR No.           Description of change    	     *
 **********************************************************************************
 * 10/03/2022     X0115030       PCR038711         Initial version            	 *
 **********************************************************************************
 */

sap.ui.define(function() {
	"use strict";
	var formatter = {
		/**
		 * This method is to set Remove Leading Zero 
		 * @name onRemoveLeadingZero
		 * @param vValue - Value of Customer Numebr
		 * @returns formatted vValue i.e Removed Leading Zero Value
		 */
		onRemoveLeadingZero: function(vValue) {
			if (vValue) {
				vValue = parseInt(vValue);
				return vValue;
			} else {
				return;
			}
		},
		/**
		 * This method is to set Icon for Attachment List 
		 * @name fnIconAttachment
		 * @param vType - Type of the Icon
		 * @returns formatted vType i.e Icon
		 */
		fnIconAttachment: function(vType) {
			if (vType) {
				return sap.ui.core.IconPool.getIconForMimeType(vType);
			} else {
				return;
			}
		},
		/**
		 * This method is to used for Format Customer Decision Value From MasterSet Customer Decision value
		 * @name fnCustDeciValue
		 * @param vValue - Key for Customer Decision
		 * @returns formatted vValue i.e Description of Customer Decision
		 */
		fnCustDeciValue: function(vValue) {
			if (vValue) {
				try {
					var oCustModel = this.oPropagatedProperties.oModels.CustDeci.getData();
					for (var i = 0; i < oCustModel.length; i++) {
						if (oCustModel[i].GuidKey === vValue) {
							return oCustModel[i].KeyValue1;
						}
					}
				} catch (error) {
					return vValue;
				}
			} else {
				return vValue;
			}
		}
	};
	return formatter;
}, true);