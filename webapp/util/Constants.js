/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.util.Constants
 *
 **********************************************************************************
 * Modifications.                                                                 *
 ****************                                                                 *
 * Date           Author         PCR No.           Description of change    	     *
 **********************************************************************************
 * 10/03/2022     X0115030       PCR038711         Initial version            	 *
 * 06/22/2022     Vimal Pandu    PCR040232         Hypercare changes           	 *
 **********************************************************************************
 */
jQuery.sap.declare("com.amat.crm.svcmupdate.util.Constants");
//******************************************************************************//
// All Constant Declaration														//
//******************************************************************************//
com.amat.crm.svcmupdate.Constants = {
	VALUE_STATE_ERROR: "Error", //Value State Error
	VALUE_STATE_NONE: "None", //Value State None
	OMODEL: "oModel", //Main Model
	START_BRACKET: " (",
	END_BRACKET: ")",
	CUSTOM_MESSAGE: "Custom",
	STANDARD_MESSAGE: "Standard",
	ODATA_ERROR: "Service",
	VALUE: "value",
	SELECTED_ITEM: "selectedItem",
	LIST_ITEM: "listItem",
	BASE64: "base64,",
	FILE_NAME: "fileName",
	ZERO: 0,
	BACKSLASH: "/",
	MODEL_ID: "ID",
	MODEL_ENABLED: "Enabled",
	REGION_ATT_LIMIT: "RegionAttLimit",
	SVO_UPDATE_LIMIT: "SVOUpdateLimit",

	// Start of PCR040232++ changes
	PSL_SAFETY: "SAFETY",
	MDL_DASHBOARD_VIEW: "dashboardView",
	// End of PCR040232++ changes

	//**********************************************************************//
	// ServiceCaseListSet Entity Fileds For Filter							//
	//**********************************************************************//
	SERVICECASELISTSET_ENTITYSET: "/ServiceCaseListSet", //ServiceCaseList Entity Set
	SERVICECASELISTSET_PSLRETROFITNUMBER: "PslRetrofitNumber", //PSL Or Retrofit Number
	SERVICECASELISTSET_CUSTOMERID: "CustomerId", //Customer ID
	SERVICECASELISTSET_CUSTOMERNAME: "CustomerName", //Customer Name
	SERVICECASELISTSET_FABNAME: "Fabname", //Fab Name
	SERVICECASELISTSET_REGION: "Region", //Region
	SERVICECASELISTSET_SERVICECASENO: "Servicecaseno", //Service Case Number
	SERVICECASELISTSET_STATUS: "Status", //Status
	SERVICECASELISTSET_STATUSTEXT: "StatusText", //Status Text
	SERVICECASELISTSET_SERIALNUMBER: "Serialnumber", //Serial Number
	SERVICECASELISTSET_CUSTOMERTOOL: "CustomerTool", //Customer Tool
	SERVICECASELISTSET_FABID: "FabId", //Fab Id		
	SERVICECASELISTSET_REGION: "Region", //Region
	SERVICECASELISTSET_CUSTOMER_DECISION: "CustomerDecision", //Customer Decision
	SERVICECASELISTSET_WAIVE_REJECT: "ReasonForWaive", //ReasonForWaive and reject
	//**********************************************************************//
	// MasterListSet Data Load (Region, Customer) 							//
	//**********************************************************************//
	MASTERLISTSET_ENTITYSET: "/MasterListSet", //MasterListSet EntitySet
	MASTERLISTSET_IVCUSTOMERNAME: "IvCustomerName", //Customer Name
	MASTERLISTSET_IVFABNAM: "IvFabname", //Fab Name
	MASTERLISTSET_IVFABID: "IvFabid", //Functional Loc ID
	MASTERLISTSET_KEYVALUE1: "KeyValue1",
	MASTERLISTSET_CUSTOMER_NAME: "CUSTOMER_NAME", //Customer Name
	MASTERLISTSET_FAB_DETAILS: "FAB_DETAILS", //Customer Name
	MASTERLISTSET_REGION: "REGION", //Region
	MASTERLISTSET_CUSTOMER_ID: "GuidKey", //Customer ID
	MASTERLISTSET_CUSTOMER_DECISION: "CUSTOMER_DECISION", //Customer Decision
	MASTERLISTSET_REASON_FOR_WAIVE: "REASON_FOR_WAIVE", //Reason for Waive and Reject
	//**********************************************************************//
	// Mass Update Create Deep Entity Details	 							//
	//**********************************************************************//
	HEADER_MASSUPDATEHEADER: "/MassUpdateHeaderSet", //Header Set
	ITEM_SERVICE_CASE: "ToServiceCases", //Service Case Items
	ITEM_SERVICE_CASE_ERROR: "ToErrorDetails", //Service Case Errors
	//**********************************************************************//
	// ErrorDetails EntitySet Fields for Excel Download						//
	//**********************************************************************//
	EXCEL_ENTITYSET_SERVICECASENO: "Servicecaseno", //Field Property
	EXCEL_ENTITYSET_MESSAGE: "Longtext", //Field property
	//**********************************************************************//
	// CSS Classes															//
	//**********************************************************************//
	TEXT_COLOR_RED: "classRedColorText", //Red Color Text
	TEXT_COLOR_BLACK: "classBlackColorText", //Black Color Text
	//**********************************************************************//
	// Attachment Size Set						 							//
	//**********************************************************************//
	BULKUPDFILELIMITSET_ENTITYSET: "/BulkUpdFileLimitSet", //Attachment Limit Set
	TVARV_Z_PSL_SC_BULK_UPD_FILE_LIMIT: "Z_PSL_SC_BULK_UPD_FILE_LIMIT",
	TVARV_Z_PSL_SC_BULK_UPD_RECORD_SPLIT: "Z_PSL_SC_BULK_UPD_RECORD_SPLIT",
	BULKUPDFILELIMITSET_IVFIELDGROUP: "IvFieldGroup",
}