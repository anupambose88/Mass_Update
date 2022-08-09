/**  
* @class
* @public
* @author X0115030
* @since 10 March 2022
* @extends 
* @name com.amat.crm.svcmupdate.util.IdHelper
*
**********************************************************************************
* Modifications.                                                                 *
****************                                                                 *
* Date           Author         PCR No.           Description of change    	     *
**********************************************************************************
* 10/03/2022     X0115030       PCR038711         Initial version            	 *
**********************************************************************************
*/
jQuery.sap.declare("com.amat.crm.svcmupdate.util.IdHelper");
//******************************************************************************//
// ID Declaration																//
//******************************************************************************//
com.amat.crm.svcmupdate.Ids = {
		//**********************************************************************//
		// Common ID's															//
		//**********************************************************************//
		DASHBOARD_VIEW_NAME					: "Dashboard",
		ROUTER_PARAMETER					: "name",
		DASHBOARD_VIEW						: "idDashboard",
		DASH								: "--",
		ITEMS								: "items",
		FILES								: "files",
		//**********************************************************************//
		// Dashboard Footer Button								 				//
		//**********************************************************************//
		HOME_FOOTER_CLEAR_BUTTON			: "idHomeFooterClearBtn",
		HOME_FOOTER_NEXT_BUTTON				: "idHomeFooterNextBtn",
		//**********************************************************************//
		// Search Panel Id's Dashboard							 				//
		//**********************************************************************//
		HOME_SEARCH_PANEL 					: "idHomeSearchPanel",
		HOME_PANEL_CLEAR_BUTTON				: "idHomeClearPnlLink",
	 	HOME_PANEL_SEARCH_BUTTON			: "idHomeSearchPnlBtn",
	 	HOME_PANEL_SEARCH_INP_PSL_NO		: "idHomeSearchPnlInpPSLNo",
	 	HOME_PANEL_SEARCH_INP_CUST_NAME		: "idHomeSearchPnlInpCustName",
	 	HOME_PANEL_SEARCH_INP_FAB_NAME		: "idHomeSearchPnlInpFabName",
	 	HOME_PANEL_SEARCH_INP_FUNC_LOC		: "idHomeSearchPnlInpFuncLoc",
	 	HOME_PANEL_SEARCH_CB_Region			: "idHomeSearchPnlCBRegion",
	 	//**********************************************************************//
		// Dashboard Table										 				//
		//**********************************************************************//
	 	DASHBOARD_TABLE						: "idDashboardTableDetail",
	 	DASHBOARD_TBL_CO_SERVICE_CASE		: "idHomeTCSVC",
	 	DASHBOARD_TBL_CO_STATUS				: "idHomeTCStatus",
	 	DASHBOARD_TBL_CO_TOOL_SERIAL		: "idHomeTCToolSerial",
	 	DASHBOARD_TBL_CO_FL_ID				: "idHomeTCFlId",
	 	DASHBOARD_TBL_CO_FAB_NAME			: "idHomeTCFabName",
	 	DASHBOARD_TBL_CO_CUST_NAME			: "idHomeTCCustName",
	 	DASHBOARD_TBL_CO_CUSTOMER_TOOL		: "idHomeTCCustomerTool",
	 	DASHBOARD_TBL_CO_FILTER				: "idInpTabSerData",
	 	DASHBOARD_TBL_TOOLBAR				: "idHomeHeaderTool",
	 	DASHBOARD_TBL_REGION				: "idHomeTCRegion",
	 	DASHBOARD_TBL_CUST_DECI				: "idHomeTCCustDeci",
	 	DASHBOARD_TBL_WAIVE_REJECT			: "idHomeTCReason",
	 	//**********************************************************************//
	 	// Mass Update Fragment													//
	 	//**********************************************************************//
	 	MASS_UPDATE_FRAGMENT				: "idfragMassUpdate",
	 	MASS_UPDT_ATTACHMENT_TEXT			: "id_MUpdt_Txt_Attachment",
	 	MASS_UPDT_CUST_DECISION_CB			: "id_MUpdt_CB_Cust_Deci",
	 	MASS_UPDT_RE_WAIVE_REJ_CB			: "id_MUpdt_CB_Res_Wav_Rej",
	 	MASS_UPDT_FILE_UPLOADER				: "id_MUpdt_File_Upload",
	 	MASS_UPDT_UPDATE_BTN				: "id_MUpdt_Btn_Update",

},
//******************************************************************************//
//Fragments Declaration																//
//******************************************************************************//
com.amat.crm.svcmupdate.Fragments = {
		DASHBOARD_TABLE_FILTER_FRAGMENT		: "com.amat.crm.svcmupdate.view.fragments.TableSortSearch",
		MASS_UPDATE_FRAGMENT				: "com.amat.crm.svcmupdate.view.fragments.MassUpdate",
		CUSTOMER_FRAGMENT					: "com.amat.crm.svcmupdate.view.fragments.Customer",
		MASS_UPDT_RESULT_FRAGMENT			: "com.amat.crm.svcmupdate.view.fragments.MUpdtResult",
},
//******************************************************************************//
//All Model Declaration																//
//******************************************************************************//
com.amat.crm.svcmupdate.Models = {
		I18N								: "i18n",
		SVO_HOME_TABLE_MODEL				: "SVO",
		REGION_MODEL						: "REGION",
		CUSTOMER_MODEL						: "Customer",
		ATTACHMENT_MODEL					: "AttachModel",
		MASS_UPDATE_RESULTS					: "MUResults",
		CUST_DECISION						: "CustDeci",
		REASON_WAIVE_REJECT					: "RejWaive",
		INPUT_SEARCH						: "InpSer",
}