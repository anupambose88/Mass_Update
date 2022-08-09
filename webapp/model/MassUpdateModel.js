/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.model.MassUpdateModel
 *
 **********************************************************************************
 * Modifications.                                                                 *
 ****************                                                                 *
 * Date           Author         PCR No.           Description of change    	     *
 **********************************************************************************
 * 10/03/2022     X0115030       PCR038711         Initial version            	 *
 **********************************************************************************
 */
sap.ui.define([], function() {
	"use strict";
	return {
		/**
		 * This method is used to Set Success Data for GetEntitySet
		 * @name fnSetSuccessDataGetEntitySet
		 * @param oViewName - View name of the controller it is getting called
		 * @param oTotalData - Data that need to be set
		 * @param oModelName - Model Name that need to set for the Data  i.e model alies name 
		 */
		fnSetSuccessDataGetEntitySet: function(oViewName, oTotalData, oModelName) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oTotalData);
			oViewName.setModel(oModel, oModelName);
		},
		/**
		 * This method is used to Set Error Data for GetEntitySet
		 * @name fnSetErrorDataGetEntitySet
		 * @param oViewName - View name of the controller it is getting called
		 * @param oModelName - Model Name that need to set for the Data  i.e model alies name 
		 */
		fnSetErrorDataGetEntitySet: function(oViewName, oModelName) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData();
			oViewName.setModel(oModel, oModelName);
		},
	};
});