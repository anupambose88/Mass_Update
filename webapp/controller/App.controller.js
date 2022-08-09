/**
* @class
* @public
* @author X0115030
* @since 10 March 2022
* @extends
* @name com.amat.crm.svcmupdate.controller.App
*
***********************************************************************************
* Modifications.                                                                  *
****************                                                                  *
* Date        	Author    		PCR No.           Description of change        	  *
***********************************************************************************
* 10/03/2022    X0115030   		PCR038711         Initial version             	  *
***********************************************************************************
**/

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(oController){
	"use strict";
	
	return oController.extend("com.amat.crm.svcmupdate.controller.App",{
		onInit : function(){
			//Assigning Routing for the Application
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		}
	});
});