/**
* @class
* @public
* @author X0115030
* @since 10 March 2022
* @extends
* @name com.amat.crm.massupdate.Component                                                    	  *
**********************************************************************************
* Modifications.                                                                 *
****************                                                                 *
*  Date           Author          PCR No.           Description of change        *
**********************************************************************************
* 10/03/2022      X0115030        PCR038711         Initial version              *
**********************************************************************************
*/

var oRouter;
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/amat/crm/svcmupdate/util/IdHelper",
    "com/amat/crm/svcmupdate/util/Constants",
    "com/amat/crm/svcmupdate/util/formatter",
], function(UIComponent, Device, oIdHelper, oConstants, oFormatter){
	"use strict";
	
	return UIComponent.extend("com.amat.crm.svcmupdate.Component",{
		metadata: {
			manifest: "json"
		},
		
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init : function(){
			//Call the base component's init function
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			
			//Set Device Model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: jQuery.device.is.phone ? true : false,
				isNoPhone: !jQuery.device.is.phone,
				listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Navigation" : "Active",

			});
			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");
			
			//Enable Routing
			var router = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
			router.initialize();

		}
	});
});