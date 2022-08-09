/**
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends
 * @name com.amat.crm.svcmupdate.controller.Dashboard
 *
 **********************************************************************************
 * Modifications.                                                                 *
 ****************                                                                 *
 * Date        	Author    		PCR No.           Description of change        	  *
 **********************************************************************************
 * 10/03/2022    X0115030   		PCR038711         Initial version             *
 * 06/22/2022    Vimal Pandu  		PCR040232         Hypercare changes        	  *
 **********************************************************************************
 **/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/amat/crm/svcmupdate/util/IdHelper",
	"com/amat/crm/svcmupdate/model/oDataCall",
	"com/amat/crm/svcmupdate/model/MassUpdateModel",
	"com/amat/crm/svcmupdate/util/MessageManager",
	"com/amat/crm/svcmupdate/util/BusyIndicator",
	"com/amat/crm/svcmupdate/util/formatter",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
], function (oController, IDHelper, oDataCall, oMassUpdateModel, oMessageManager, oBusyIndicator, oFormatter, exportLibrary, Spreadsheet,
	Device, JSONModel) {
	"use strict";
	return oController.extend("com.amat.crm.svcmupdate.controller.Dashboard", {
		/**
		 * This method is Called when a controller is instantiated
		 * @name onInit
		 */
		onInit: function () {
			oRouter.attachRoutePatternMatched(this.fnHandleRouteMatchedDashboard, this);
		},
		/**
		 * This method is used If Router pattern Matched with Dashboard this method will get execute
		 * @name fnHandleRouteMatchedDashboard
		 * @param {sap.ui.base.Event} oEvent Router Pattern match
		 */
		fnHandleRouteMatchedDashboard: function (oEvent) {
			let oParameters = oEvent.getParameter(com.amat.crm.svcmupdate.Ids.ROUTER_PARAMETER);
			if (oParameters === com.amat.crm.svcmupdate.Ids.DASHBOARD_VIEW_NAME) {
				//All Common declaration
				this.onCommonDeclaration();
				//Clear Search Data
				this.onPressHomePnlClear();
				//Load Region Data
				this.onLoadRegionData();
				//Enabled Input And Combobox Search Model
				this.fnSetInpSearchModel();
			}
		},
		/**
		 * This method is used for Common Variable Declaration
		 * @name onCommonDeclaration
		 */
		onCommonDeclaration: function () {
			//Upload Multi Call Limit
			this.vServiceCaseUploadLimit = "0";
			//Fragment ID Declaration
			this.oFragment = com.amat.crm.svcmupdate.Fragments;
			//ID Declaration
			this.oID = com.amat.crm.svcmupdate.Ids;
			//Model Decalaration
			this.oAllModel = com.amat.crm.svcmupdate.Models;
			//Constant declaration
			this.oConstants = com.amat.crm.svcmupdate.Constants;
			//i18n Model
			this.oI18N = this.getOwnerComponent().getModel(this.oAllModel.I18N).getResourceBundle();

			// Start of PCR040232++ changes
			var oViewModel = new JSONModel({
				EvType: ""
			});
			this.getView().setModel(oViewModel, this.oConstants.MDL_DASHBOARD_VIEW);
			// End of PCR040232++ changes

			//Table Column ID's
			this.aTabIds = [
				//Service Case TAB
				[this.oID.DASHBOARD_TBL_CO_SERVICE_CASE,
					this.oConstants.SERVICECASELISTSET_SERVICECASENO
				],
				//Status Tab
				[this.oID.DASHBOARD_TBL_CO_STATUS,
					this.oConstants.SERVICECASELISTSET_STATUSTEXT
				],
				//Tool Serial Tab
				[this.oID.DASHBOARD_TBL_CO_TOOL_SERIAL,
					this.oConstants.SERVICECASELISTSET_SERIALNUMBER
				],
				//FL ID Tab
				[this.oID.DASHBOARD_TBL_CO_FL_ID,
					this.oConstants.SERVICECASELISTSET_FABID
				],
				//Fab Name Tab
				[this.oID.DASHBOARD_TBL_CO_FAB_NAME,
					this.oConstants.SERVICECASELISTSET_FABNAME
				],
				//Customer Name Tab
				[this.oID.DASHBOARD_TBL_CO_CUST_NAME,
					this.oConstants.SERVICECASELISTSET_CUSTOMERNAME
				],
				//Cust Tool Tab
				[this.oID.DASHBOARD_TBL_CO_CUSTOMER_TOOL,
					this.oConstants.SERVICECASELISTSET_CUSTOMERTOOL
				],
				//Region
				[this.oID.DASHBOARD_TBL_REGION,
					this.oConstants.SERVICECASELISTSET_REGION
				],
				//Customer Decision
				[this.oID.DASHBOARD_TBL_CUST_DECI,
					this.oConstants.SERVICECASELISTSET_CUSTOMER_DECISION
				],
				//Reason for Waive and Reject
				[this.oID.DASHBOARD_TBL_WAIVE_REJECT,
					this.oConstants.SERVICECASELISTSET_WAIVE_REJECT
				],
			];
		},
		/**
		 * This method is used On Live Change PSL Number Check Value State
		 * @name onLiveChangePSLNo
		 * @param {sap.ui.base.Event} oEvent PSL Number 
		 */
		onLiveChangePSLNo: function (oEvent) {
			var oView = this.getView();
			var vPSL = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_PSL_NO); //PSL Number			
			if (vPSL.getValue().length > 0) {
				oEvent.getSource().setValueState(this.oConstants.VALUE_STATE_NONE);
				vPSL.setValueStateText("");
			} else {
				vPSL.setValueState(this.oConstants.VALUE_STATE_ERROR);
				vPSL.setValueStateText(this.oI18N.getText("HOME_ENTER_PSL"));
			}
		},
		/**
		 * This method is used to Open PopUp for Table Sort and Filter	
		 * @name onPressHomeTableColumFilter
		 * @param {sap.ui.base.Event} oEvent Mass Update Table Header 
		 */
		onPressHomeTableColumFilter: function (oEvent) {
			var oButton = oEvent.getSource();
			var vDashboard = this.oID.DASHBOARD_VIEW; //Dashboard
			var vDash = this.oID.DASH;
			var that = this;

			//Selected Button ID From Table Column
			var vID = oEvent.getSource().getId();
			//selecting Selected Index
			$.each(this.aTabIds, function (i, oItem) {
				if (vID.indexOf(oItem[0]) > 0) {
					that.vSelIndex = i;
					return false;
				}
			});

			//Open Popup for Table Search and Sort
			if (!this._HTCSearchSort) {
				this._HTCSearchSort = sap.ui.xmlfragment(this.oFragment.DASHBOARD_TABLE_FILTER_FRAGMENT, this);
				this.getView().addDependent(this._HTCSearchSort);
			}

			if (this.TabFilterValues[this.vSelIndex] !== "") {
				//For Customer Decision
				if (vID.indexOf(this.oID.DASHBOARD_TBL_CUST_DECI) > 0) {
					var vSelValue = "";
					var oCustModel = this.getView().getModel(this.oAllModel.CUST_DECISION).getData();
					$.each(oCustModel, function (i, oItem) {
						if (that.TabFilterValues[that.vSelIndex] === oItem.GuidKey) {
							vSelValue = oItem.KeyValue1;
							return false;
						}
					});
					sap.ui.getCore().byId(this.oID.DASHBOARD_TBL_CO_FILTER).setValue(vSelValue);
				} else {
					//For Other
					sap.ui.getCore().byId(this.oID.DASHBOARD_TBL_CO_FILTER).setValue(this.TabFilterValues[this.vSelIndex]);
				}
			} else {
				sap.ui.getCore().byId(this.oID.DASHBOARD_TBL_CO_FILTER).setValue("");
			}

			this._HTCSearchSort.openBy(oButton);
		},
		/**
		 * This method is used for Apply Ascending Sort for the Table Column Value
		 * @name onPressTableSortAscending
		 * @param {sap.ui.base.Event} oevent Ascending Sort Button 
		 */
		onPressTableSortAscending: function (oevent) {
			var oView = this.getView();
			var vTable = oView.byId(this.oID.DASHBOARD_TABLE);
			var oBinding = vTable.getBinding(this.oID.ITEMS);
			var DESCENDING = false;
			var GROUP = false;
			var aSorter = [];
			var SORTKEY = this.aTabIds[this.vSelIndex][1];

			aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);

			this._HTCSearchSort.close();
		},
		/**
		 * This method is used for Apply Descending Sort for the Table Column Value
		 * @name onPressTableSortDescending
		 * @param {sap.ui.base.Event} oevent Descending Sort Button 
		 */
		onPressTableSortDescending: function (oevent) {
			var oView = this.getView();
			var vTable = oView.byId(this.oID.DASHBOARD_TABLE);
			var oBinding = vTable.getBinding(this.oID.ITEMS);
			var DESCENDING = true;
			var GROUP = false;
			var aSorter = [];
			var SORTKEY = this.aTabIds[this.vSelIndex][1];

			aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);

			this._HTCSearchSort.close();
		},
		/**
		 * This method is used for Apply Filter for the Table Column Value
		 * @name onPressTableFilter
		 * @param {sap.ui.base.Event} oEvent Table Header Filter value
		 */
		onPressTableFilter: function (oEvent) {
			var oView = this.getView();
			var vValue = oEvent.getSource().getValue();
			var vTable = oView.byId(this.oID.DASHBOARD_TABLE);
			var oBinding = vTable.getBinding(this.oID.ITEMS);
			var aFilter = [];
			var vFilterKey = this.aTabIds[this.vSelIndex][1];
			var that = this;

			//For Customer Decision Take the Value From Model
			if (vFilterKey === this.oConstants.SERVICECASELISTSET_CUSTOMER_DECISION) {
				if (vValue) {
					var oCustModel = this.getView().getModel(this.oAllModel.CUST_DECISION).getData();
					$.each(oCustModel, function (i, oItem) {
						if (vValue === oItem.KeyValue1) {
							that.TabFilterValues[that.vSelIndex] = oItem.GuidKey;
							return false;
						}
					});
				} else {
					this.TabFilterValues[this.vSelIndex] = vValue;
				}
			} else {
				//For other take value from Input
				this.TabFilterValues[this.vSelIndex] = vValue;
			}

			//Filtering Entered Data
			$.each(this.TabFilterValues, function (i, oItem) {
				if (oItem) {
					aFilter.push(
						new sap.ui.model.Filter(
							that.aTabIds[i][1], sap.ui.model.FilterOperator.Contains, oItem
						)
					);
				}
			});
			//Update Binding
			oBinding.filter(aFilter);
			//Close Sort Filter Dialog
			this._HTCSearchSort.close();
		},
		/**
		 * This method is used for clear Table Filter Values
		 * @name onFilterTableValues
		 */
		onFilterTableValues: function () {
			this.TabFilterValues = ["", "", "", "", "", "", "", "", "", ""];
		},
		/**
		 * This method is used clean the table selected records
		 * @name onPressHomeFooterClearBtn
		 * @param {sap.ui.base.Event} oEvent On Press Clear from Footer Button
		 */
		onPressHomeFooterClearBtn: function (oEvent) {
			var oView = this.getView();
			var vTable = oView.byId(this.oID.DASHBOARD_TABLE);
			var oBinding = vTable.getBinding(this.oID.ITEMS);
			var aFilter = [];
			var aSorter = [];

			//Remove table seleted Data
			vTable.removeSelections(true);

			//Clear Table Header Filter Value
			this.onFilterTableValues();

			//Clear Table Filter
			oBinding.filter(aFilter);

			//Clear Table Sorter
			oBinding.sort(aSorter);
		},
		/**
		 * This method is used to clear all search records
		 * @name onPressHomePnlClear
		 * @param {sap.ui.base.Event} oEvent On Press Clear Search
		 */
		onPressHomePnlClear: function (oEvent) {
			var oView = this.getView();
			var vPSL = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_PSL_NO); //PSL Number
			var vCustName = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME); //Cust Name
			var vFabName = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME); //Fab Name
			var vFuncLocId = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC); //Func Loc
			var vReg = oView.byId(this.oID.HOME_PANEL_SEARCH_CB_Region); //Region
			var vSearchPanel = oView.byId(this.oID.HOME_SEARCH_PANEL); //Search Panel
			var oTableTool = oView.byId(this.oID.DASHBOARD_TBL_TOOLBAR); //Table ToolBar 
			var vNoOfRecords = this.oI18N.getText("HOME_TABLE_NO_OF_RECORDS");
			var vZero = this.oI18N.getText("ZERO");
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;

			//Footer Button
			oView.byId(this.oID.HOME_FOOTER_CLEAR_BUTTON).setEnabled(false);
			oView.byId(this.oID.HOME_FOOTER_NEXT_BUTTON).setEnabled(false);

			//PSL or Retrofit Number
			vPSL.setValue("");
			vPSL.setValueState(this.oConstants.VALUE_STATE_ERROR);
			vPSL.setValueStateText(this.oI18N.getText("HOME_ENTER_PSL"));
			//Customer Name
			vCustName.setValue("");
			//Fab Name
			vFabName.setValue("");
			//Functional Location Id
			vFuncLocId.setValue("");
			//Region
			vReg.setSelectedKey("");
			//Open Search Panel
			vSearchPanel.setExpanded(true);

			//Clear Search Fab Name ID and Customer Name ID
			this.vSearchCustId = "";
			this.vSearchFabName = "";

			//Set Model Data
			oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.SVO_HOME_TABLE_MODEL);

			//Clear Table Title Data
			oTableTool.setText(vNoOfRecords + vSB + vZero + vEB);

			//Clear Table Filter Data
			this.onFilterTableValues();

			//Clear Input ComboBox Search Model
			this.fnSetInpSearchModel();
		},
		/**
		 * This method is used Load data based on search panel
		 * @name onPressHomePnlSearch
		 * @param {sap.ui.base.Event} oEvent On Press Search
		 */
		onPressHomePnlSearch: function (oEvent) {
			var oView = this.getView();
			var that = this;
			var vPSL = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_PSL_NO); //PSL Number
			var vCustName = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME); //Cust Name
			var vFabName = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME); //Fab Name
			var vFuncLocId = oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC); //Func Loc
			var vReg = oView.byId(this.oID.HOME_PANEL_SEARCH_CB_Region); //Region
			var vSearchPanel = oView.byId(this.oID.HOME_SEARCH_PANEL); //Search Panel
			var vAllFilters = [];
			var oModel = this.getOwnerComponent().getModel(this.oConstants.OMODEL); //Main oData Model
			var vEntitySet = this.oConstants.SERVICECASELISTSET_ENTITYSET;

			if (!vSearchPanel.getExpanded()) {
				vSearchPanel.setExpanded(true);
			}

			if (vPSL.getValue() !== "") {
				//PSL Number
				vAllFilters.push(
					new sap.ui.model.Filter(
						this.oConstants.SERVICECASELISTSET_PSLRETROFITNUMBER, sap.ui.model.FilterOperator.EQ, vPSL.getValue()
					));
				//Customer Name
				if (vCustName.getValue() !== "") {
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.SERVICECASELISTSET_CUSTOMERNAME, sap.ui.model.FilterOperator.EQ, vCustName.getValue()
						));

					//Customer Id
					if (this.vSearchCustId) {
						vAllFilters.push(
							new sap.ui.model.Filter(
								this.oConstants.SERVICECASELISTSET_CUSTOMERID, sap.ui.model.FilterOperator.EQ, this.vSearchCustId
							));
					}
				}
				//Fab Name
				if (vFabName.getValue() !== "") {
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.SERVICECASELISTSET_FABNAME, sap.ui.model.FilterOperator.EQ, vFabName.getValue()
						));

					//Fab Id
					if (this.vSearchFabName) {
						vAllFilters.push(
							new sap.ui.model.Filter(
								this.oConstants.SERVICECASELISTSET_FABID, sap.ui.model.FilterOperator.EQ, this.vSearchFabName
							));
					}
				}
				//Func Loc
				if (vFuncLocId.getValue() !== "") {
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.SERVICECASELISTSET_FABID, sap.ui.model.FilterOperator.EQ, vFuncLocId.getValue()
						));
				}

				//Region
				if (vReg.getSelectedKey() !== "") {
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.SERVICECASELISTSET_REGION, sap.ui.model.FilterOperator.EQ, vReg.getSelectedKey()
						));
				}

				//Opening Busy Indicator
				oBusyIndicator.resetBusyIndicator();
				oBusyIndicator.showBusyIndicator();

				//Call oData to Load Service Case Details
				oDataCall.fnLoadDataWithFilter(oModel, vEntitySet, vAllFilters)
					.then(function (oData) {
						//Call Succsess Method
						that.onSuccessSVODataLoad(oData);
					})
					.catch(function (oResponse) {
						//Call Error Method
						that.onErrorSVODataLoad(oResponse);
					})
			} else {
				vPSL.setValue("");
				vPSL.setValueState(this.oConstants.VALUE_STATE_ERROR);
				vPSL.setValueStateText(this.oI18N.getText("HOME_ENTER_PSL"));
			}
		},
		/**
		 * This method is used for On Success Service Case Search Load oData Call
		 * @name onSuccessSVODataLoad
		 * @param oData - oData Success Data
		 */
		onSuccessSVODataLoad: function (oData) {
			var oView = this.getView();
			var vSearchPanel = oView.byId(this.oID.HOME_SEARCH_PANEL); //Search Panel
			var oTableTool = oView.byId(this.oID.DASHBOARD_TBL_TOOLBAR); //Table ToolBar
			var vNoOfRecords = this.oI18N.getText("HOME_TABLE_NO_OF_RECORDS");
			var vNoValue = this.oI18N.getText("NO_VALUE_FOUND"); //No value Found
			var vZero = this.oI18N.getText("ZERO");
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var oTable = oView.byId(this.oID.DASHBOARD_TABLE);

			if (oData.results.length > 0) {
				if (oData.results[0].EvError) {
					//Clear Table Title Data
					oTableTool.setText(vNoOfRecords + vSB + vZero + vEB);

					//Set Growing Threshold
					oTable.setGrowingThreshold(parseInt(this.oConstants.ZERO));

					//Set Model Data
					oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.SVO_HOME_TABLE_MODEL);

					//Show Error Message
					var vType = this.oConstants.CUSTOM_MESSAGE;
					oMessageManager.onShowErrorMessage(oData.results[0].EvError, vType, this);

					//Footer Button
					oView.byId(this.oID.HOME_FOOTER_CLEAR_BUTTON).setEnabled(false);
					oView.byId(this.oID.HOME_FOOTER_NEXT_BUTTON).setEnabled(false);

					//Open Search Panel
					vSearchPanel.setExpanded(true);

					//Clear Table Filter Data
					this.onFilterTableValues();
				} else if (oData.results.length === 1 && oData.results[0].EvError === "") {
					//Clear Table Title Data
					oTableTool.setText(vNoOfRecords + vSB + vZero + vEB);

					//Set Growing Threshold
					oTable.setGrowingThreshold(parseInt(this.oConstants.ZERO));

					//Set Model Data
					oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.SVO_HOME_TABLE_MODEL);

					//Shoe Error Message 
					oMessageManager.onShowErrorMessage(vNoValue, this.oConstants.CUSTOM_MESSAGE, this);
				} else {
					//Set Table Total Record
					oTableTool.setText(vNoOfRecords + vSB + oData.results.length + vEB);

					//Set Growing Threshold
					oTable.setGrowingThreshold(oData.results.length);

					//Set Model Data
					oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oData.results, this.oAllModel.SVO_HOME_TABLE_MODEL);

					//Footer Button
					oView.byId(this.oID.HOME_FOOTER_CLEAR_BUTTON).setEnabled(true);
					oView.byId(this.oID.HOME_FOOTER_NEXT_BUTTON).setEnabled(true);

					//Close Search Panel
					vSearchPanel.setExpanded(false);

					// Start of PCR040232++ changes
					var oViewModel = this.getView().getModel(this.oConstants.MDL_DASHBOARD_VIEW);

					if (oData.results.length) {
						oViewModel.setProperty("/EvType", oData.results[0].EvRetrofitType);
					}
					// End of PCR040232++ changes
				}
			} else {
				//Clear Table Title Data
				oTableTool.setText(vNoOfRecords + vSB + vZero + vEB);

				//Set Growing Threshold
				oTable.setGrowingThreshold(parseInt(this.oConstants.ZERO));

				//Set Model Data
				oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.SVO_HOME_TABLE_MODEL);

				//Footer Button
				oView.byId(this.oID.HOME_FOOTER_CLEAR_BUTTON).setEnabled(false);
				oView.byId(this.oID.HOME_FOOTER_NEXT_BUTTON).setEnabled(false);

				//Open Search Panel
				vSearchPanel.setExpanded(true);

				//Clear Table Filter Data
				this.onFilterTableValues();
			}

			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();
		},
		/**
		 * This method is used for on Error Service Case Search Load oData Call
		 * @name onErrorSVODataLoad
		 * @param oResponse - oData Error Response
		 */
		onErrorSVODataLoad: function (oResponse) {
			var oView = this.getView();
			var vSearchPanel = oView.byId(this.oID.HOME_SEARCH_PANEL); //Search Panel
			var oTableTool = oView.byId(this.oID.DASHBOARD_TBL_TOOLBAR); //Table ToolBar 
			var vNoOfRecords = this.oI18N.getText("HOME_TABLE_NO_OF_RECORDS");
			var vZero = this.oI18N.getText("ZERO");
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var oTable = oView.byId(this.oID.DASHBOARD_TABLE);

			//Clear Table Title Data
			oTableTool.setText(vNoOfRecords + vSB + vZero + vEB);

			//Footer Button
			oView.byId(this.oID.HOME_FOOTER_CLEAR_BUTTON).setEnabled(false);
			oView.byId(this.oID.HOME_FOOTER_NEXT_BUTTON).setEnabled(false);

			//Set Growing Threshold
			oTable.setGrowingThreshold(parseInt(this.oConstants.ZERO));

			//Set Model Data
			oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.SVO_HOME_TABLE_MODEL);

			//Clear Table Filter Data
			this.onFilterTableValues();

			//open Search Panel
			vSearchPanel.setExpanded(true);

			//Show Error Message
			oMessageManager.onShowErrorMessage(oResponse, this.oConstants.STANDARD_MESSAGE, this);

			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();
		},
		/**
		 * This method is On Click on Next button open Popup for Mass Update
		 * @name onPressHomeNextBtn
		 * @param {sap.ui.base.Event} oEvent On Press Next Button in Footer
		 */
		onPressHomeNextBtn: function (oEvent) {
			var oView = this.getView();
			var oTable = this.getView().byId(this.oID.DASHBOARD_TABLE); //Mass Update Table
			var that = this;
			var vMessage = this.oI18N.getText("HOME_TABLE_SELECT_ONE_ITEM");
			var vType = this.oConstants.CUSTOM_MESSAGE;

			if (oTable.getSelectedItems().length === 0) {
				oMessageManager.onShowErrorMessage(vMessage, vType, this);
			} else {
				//Opening Busy Indicator
				oBusyIndicator.resetBusyIndicator();
				oBusyIndicator.showBusyIndicator();

				if (!this.MassUpdate) {
					//Initialize Mass Update Dialog
					this.MassUpdate = sap.ui.xmlfragment(this.oID.MASS_UPDATE_FRAGMENT, this.oFragment.MASS_UPDATE_FRAGMENT, this);
					oView.addDependent(this.MassUpdate);
				}
				this.MassUpdate.setTitle(oTable.getSelectedItems().length + " " + this.oI18N.getText("HOME_TABLE_SVO_SELECTED"));

				//Set Size Limit for Attachment
				sap.ui.getCore().byId(this.oID.MASS_UPDATE_FRAGMENT + "--" + this.oID.MASS_UPDT_FILE_UPLOADER).setMaximumFileSize(parseInt(this.vAttachmentLimit));

				//Clear Mass Update Dialog
				this.onClearMassUpdateDialog();

				//Open Mass Update Dialog
				this.MassUpdate.open();

				//Closing Busy Indicator
				oBusyIndicator.hideBusyIndicator();
			}
		},
		/**
		 * This method is used load the initial data after screen load
		 * @name onLoadRegionData
		 * @param {sap.ui.base.Event} oEvent On Press Clear from Footer Button
		 */
		onLoadRegionData: function () {
			var oView = this.getView();
			var that = this;
			var oModel = this.getOwnerComponent().getModel(this.oConstants.OMODEL); //Main oData Model
			var vEntitySet = [this.oConstants.MASTERLISTSET_ENTITYSET,
				this.oConstants.BULKUPDFILELIMITSET_ENTITYSET,
				this.oConstants.BULKUPDFILELIMITSET_ENTITYSET
			];
			var vAllFilters1 = [];
			var vAllFilters2 = [];
			var vAllFilters3 = [];

			//Attachment File Size
			vAllFilters2.push(
				new sap.ui.model.Filter(
					this.oConstants.BULKUPDFILELIMITSET_IVFIELDGROUP, sap.ui.model.FilterOperator.EQ, this.oConstants.TVARV_Z_PSL_SC_BULK_UPD_FILE_LIMIT
				));

			//Update Service Case Limit
			vAllFilters3.push(
				new sap.ui.model.Filter(
					this.oConstants.BULKUPDFILELIMITSET_IVFIELDGROUP, sap.ui.model.FilterOperator.EQ, this.oConstants.TVARV_Z_PSL_SC_BULK_UPD_RECORD_SPLIT
				));

			var vAllFilters = [vAllFilters1, vAllFilters2, vAllFilters3];

			//Creating Group For Batch Call
			var sGroupId = this.oConstants.REGION_ATT_LIMIT;

			//Opening Busy Indicator
			oBusyIndicator.resetBusyIndicator();
			oBusyIndicator.showBusyIndicator();

			//Call oData
			oDataCall.fnLoadBatchMulti(oModel, sGroupId, vEntitySet, vAllFilters)
				.then(function (oData) {
					//Call Success Method
					//Load Region Data
					that.onSuccessLoadRegionData(oData.__batchResponses[0].data);
					//Load Attachment Limit Data
					that.onSuccessLoadAttachLimitData(oData.__batchResponses[1].data);
					//Load Service Case Limit
					that.onSuccessLoadServiceCaseLimit(oData.__batchResponses[2].data);
				})
				.catch(function (oResponse) {
					//Call oData Method
					that.onErrorLoadRegionData(oResponse);
				})
		},
		/**
		 * This method is used for oData Success Call for screen initial load data
		 * @name onSuccessLoadAttachLimitData
		 * @param oData - Success Data of oData Call
		 */
		onSuccessLoadAttachLimitData: function (oData) {
			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();
			if (oData.results.length > 0) {
				this.vAttachmentLimit = oData.results[0].KeyValue1;
			} else {
				var vType = this.oConstants.CUSTOM_MESSAGE;
				var vMessage = this.oI18N.getText("NO_ATTACHMENT_LIMIT_FOUND");
				//Show Error Message
				oMessageManager.onShowErrorMessage(vMessage, this.oConstants.CUSTOM_MESSAGE, this);
			}

		},
		/**
		 * This method is used for oData Success Call for screen initial load data
		 * @name onSuccessLoadServiceCaseLimit
		 * @param oData - Success Data of oData Call
		 */
		onSuccessLoadServiceCaseLimit: function (oData) {
			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();
			if (oData.results.length > 0) {
				this.vServiceCaseUploadLimit = oData.results[0].KeyValue1;
			} else {
				var vType = this.oConstants.CUSTOM_MESSAGE;
				var vMessage = this.oI18N.getText("NO_SVO_UPDATE_LIMIT_FOUND");
				//Show Error Message
				oMessageManager.onShowErrorMessage(vMessage, this.oConstants.CUSTOM_MESSAGE, this);
			}

		},
		/**
		 * This method is used for oData Success Call for screen initial load data
		 * @name onSuccessLoadRegionData
		 * @param oData - Success Data of oData Call
		 */
		onSuccessLoadRegionData: function (oData) {
			var oView = this.getView();
			var oFinalData = [];
			var that = this;
			var flag = false;
			var vMessage = "";

			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();

			//Segregate Region Data
			$.each(oData.results, function (i, oItem) {
				if (oItem.FieldGroup === that.oConstants.MASTERLISTSET_REGION) {
					if (oItem.GuidKey === "") {
						flag = true;
					}
					oFinalData.push(oItem);
				}
			});
			//Adding Black Record if not available
			if (!flag) {
				oFinalData.unshift({
					FieldGroup: this.oConstants.MASTERLISTSET_REGION,
					GuidKey: "",
					IvCustomerName: "",
					IvFabid: "",
					IvFabname: "",
					KeyValue1: "",
					KeyValue2: "",
					KeyValue3: "",
					ParentGuidKey: "",
					ParentGuidKey2: "",
				});
			}

			//Set Model Data
			if (oFinalData.length > 1) {
				oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oFinalData, this.oAllModel.REGION_MODEL);
			} else {
				vMessage = vMessage + this.oI18N.getText("NO_REGION_DATA");
				//Set Model Data
				oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.REGION_MODEL);
			}

			//Set Data for Customer Decision Dropdown
			oFinalData = [];
			$.each(oData.results, function (i, oItem) {
				if (oItem.FieldGroup === that.oConstants.MASTERLISTSET_CUSTOMER_DECISION) {
					oFinalData.push(oItem);
				}
			});

			if (oFinalData.length > 0) {
				//Set Model Data
				oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oFinalData, this.oAllModel.CUST_DECISION);
			} else {
				vMessage = vMessage + this.oI18N.getText("NO_CUSTOMER_REGION_DATA");
				//Set Model Data
				oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.CUST_DECISION);
			}

			//Set Data For Reason for Waive And Reject
			oFinalData = [];
			$.each(oData.results, function (i, oItem) {
				if (oItem.FieldGroup === that.oConstants.MASTERLISTSET_REASON_FOR_WAIVE) {
					oFinalData.push(oItem);
				}
			});

			if (oFinalData.length > 0) {
				//Set Model Data
				oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oFinalData, this.oAllModel.REASON_WAIVE_REJECT);
			} else {
				vMessage = vMessage + this.oI18N.getText("NO_WAIVE_REJECT_DATA");
				//Set Model Data
				oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.REASON_WAIVE_REJECT);
			}

			if (vMessage !== "") {
				vMessage = vMessage + this.oI18N.getText("PLEASE_CONTACT_ADMIN");
				//Show Error Message
				oMessageManager.onShowErrorMessage(vMessage, this.oConstants.CUSTOM_MESSAGE, this);
			}
		},
		/**
		 * This method is used for oData Error Call for screen initial load data
		 * @name onErrorLoadRegionData
		 * @param oResponse - oData Call Error response Data
		 */
		onErrorLoadRegionData: function (oResponse) {
			var oView = this.getView();

			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();

			//Set Model Data
			oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.REGION_MODEL);

			//Set Model Data
			oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.CUST_DECISION);

			//Show Error Message
			oMessageManager.onShowErrorMessage(oResponse, this.oConstants.STANDARD_MESSAGE, this);

		},
		/**
		 * This method is used for On Changing Search Input Clear Customer Name Id and Fab name ID
		 * @name onLiveChangeSearchInput
		 * @param {sap.ui.base.Event} oEvent i.e Input for Customer Name and Fab Id
		 */
		onLiveChangeSearchInput: function (oEvent) {
			var oView = this.getView();
			var vCustNameId = this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME; //Customer Name
			var vFabNameId = this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME; //Fab Name

			if (oEvent.getSource().getId().indexOf(vCustNameId) > 0) {
				this.vSearchCustId = "";
			} else if (oEvent.getSource().getId().indexOf(vFabNameId) > 0) {
				this.vSearchFabName = "";
			}

			this.onActiveInputComboSearch(oEvent.getSource().getId(), oEvent.getSource().getValue().length);
		},
		/**
		 * This method is used for On Changing Region
		 * @name onSelectionChangeRegion
		 * @param {sap.ui.base.Event} oEvent i.e Region Dropdown
		 */
		onSelectionChangeRegion: function (oEvent) {
			this.onActiveInputComboSearch(oEvent.getSource().getId(), oEvent.getSource().getSelectedKey().length);
		},
		/**
		 * This method is used for Active and InActive Customer Name, Fab Name, Functional Location and Region
		 * @name onActiveInputComboSearch
		 * @param vSelectItem - selected Item of dropdown
		 * @param vLength - vLength of the selected value
		 */
		onActiveInputComboSearch: function (vSelectItem, vLength) {
			var oView = this.getView();
			var that = this;
			var vBackSlash = this.oConstants.BACKSLASH;
			var vEnabled = this.oConstants.BACKSLASH + this.oConstants.MODEL_ENABLED;
			if (vLength === 0) {
				this.fnSetInpSearchModel();
			} else {
				var oInpModel = oView.getModel(this.oAllModel.INPUT_SEARCH);
				$.each(oInpModel.getData(), function (i, oItem) {
					if (vSelectItem === oItem.ID.getId()) {
						oInpModel.setProperty(vBackSlash + i + vEnabled, true);
					} else {
						oInpModel.setProperty(vBackSlash + i + vEnabled, false);
					}
				});
			}
		},
		/**
		 * This method is used for On Entering Customer Name Load Customer Data
		 * @name onSubmitSearchInput
		 * @param {sap.ui.base.Event} oEvent On Press Clear from Footer Button
		 */
		onSubmitSearchInput: function (oEvent) {
			var oView = this.getView();
			var that = this;
			var oModel = this.getOwnerComponent().getModel(this.oConstants.OMODEL); //Main oData Model
			var vEntitySet = this.oConstants.MASTERLISTSET_ENTITYSET;
			var vAllFilters = [];
			var vCustNameId = this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME; //Customer Name
			var vFabNameId = this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME; //Fab Name
			var vFucnLocId = this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC; //Functional Location
			this.vSelect = ""

			if (oEvent.getSource().getValue().length > 0) {
				if (oEvent.getSource().getId().indexOf(vCustNameId) > 0) {
					this.vSelect = vCustNameId;
					//Filter Data Customer Name
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.MASTERLISTSET_IVCUSTOMERNAME, sap.ui.model.FilterOperator.EQ, oEvent.getSource().getValue()
						));
				} else if (oEvent.getSource().getId().indexOf(vFabNameId) > 0) {
					this.vSelect = vFabNameId;
					//Filter Data Fab Name
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.MASTERLISTSET_IVFABNAM, sap.ui.model.FilterOperator.EQ, oEvent.getSource().getValue()
						));
				} else if (oEvent.getSource().getId().indexOf(vFucnLocId) > 0) {
					this.vSelect = vFucnLocId;
					//Filter Data Functional Loc ID
					vAllFilters.push(
						new sap.ui.model.Filter(
							this.oConstants.MASTERLISTSET_IVFABID, sap.ui.model.FilterOperator.EQ, oEvent.getSource().getValue()
						));
				}

				//Opening Busy Indicator
				oBusyIndicator.resetBusyIndicator();
				oBusyIndicator.showBusyIndicator();

				//Call oData to Load Service Case Details
				oDataCall.fnLoadDataWithFilter(oModel, vEntitySet, vAllFilters)
					.then(function (oData) {
						//Call Success Mathod
						that.onSuccessLoadCustomerData(oData);
					})
					.catch(function (oResponse) {
						//Call Error Method
						that.onErrorLoadCustomerData(oResponse);
					})
			}
		},
		/**
		 * This method is used on Success Load Customer Data oData Call
		 * @name onSuccessLoadCustomerData
		 * @param oData - oData Success Call Data
		 */
		onSuccessLoadCustomerData: function (oData) {
			var oView = this.getView();
			var that = this;
			var oFinalData = [];
			var vCustNameId = this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME; //Customer Name
			var vFabNameId = this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME; //Fab Name
			var vFucnLocId = this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC; //Functional Location
			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();

			if (this.vSelect === vCustNameId) {
				//Segregate Customer Data
				$.each(oData.results, function (i, oItem) {
					if (oItem.FieldGroup === that.oConstants.MASTERLISTSET_CUSTOMER_NAME) {
						oFinalData.push(oItem);
					}
				});
				var vTitle = this.oI18N.getText("Home_Pnl_Customer_Name");
			} else if (this.vSelect === vFabNameId || this.vSelect === vFucnLocId) {
				//Segregate Fab Name and Func Loc Id
				$.each(oData.results, function (i, oItem) {
					if (oItem.FieldGroup === that.oConstants.MASTERLISTSET_FAB_DETAILS) {
						oFinalData.push(oItem);
					}
				});

				var vTitle = this.vSelect === vFabNameId ? this.oI18N.getText("Home_Pnl_Fab_Name") : this.oI18N.getText("Home_Pnl_Func_Loc");
			}
			//Showing Customer Data to Customer Fragment
			if (oFinalData.length > 0) {
				//Open Popup to Show the Customer Data
				if (!this._CustomerDialog) {
					this._CustomerDialog = sap.ui.xmlfragment(this.oFragment.CUSTOMER_FRAGMENT, this);
					oView.addDependent(this._CustomerDialog);
				}
				this._CustomerDialog.open();
				this._CustomerDialog.setTitle(vTitle);
				//Set Model Data
				oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oFinalData, this.oAllModel.CUSTOMER_MODEL);
			} else {
				var vType = this.oConstants.CUSTOM_MESSAGE;
				var vMessage = this.oI18N.getText("NO_VALUE_FOUND");
				//Show Error Message
				oMessageManager.onShowErrorMessage(vMessage, vType, this);
			}

		},
		/**
		 * This method is used on Error Load Customer Data oData Call
		 * @name onErrorLoadCustomerData
		 * @param oResponse - oData Error Call Response Data
		 */
		onErrorLoadCustomerData: function (oResponse) {
			var oView = this.getView();

			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();

			//Set Model Data
			oMassUpdateModel.fnSetErrorDataGetEntitySet(oView, this.oAllModel.CUSTOMER_MODEL);

			//Show Error Message
			oMessageManager.onShowErrorMessage(oResponse, this.oConstants.STANDARD_MESSAGE, this);
		},
		/**
		 * This method is used on Search Customer Data from Customer Dialog
		 * @name handleCustomerDiagsearch
		 * @param {sap.ui.base.Event} oEvent Search Customer
		 */
		handleCustomerDiagsearch: function (oEvent) {
			//Get Selected Value for Filter
			var sValue = oEvent.getParameter(this.oConstants.VALUE);
			//Filter with Customer Name
			var oFilter = new sap.ui.model.Filter(this.oConstants.MASTERLISTSET_KEYVALUE1, sap.ui.model.FilterOperator.Contains, sValue);
			//Get Bindng Context of the List and Apply Filter
			var oBinding = oEvent.getSource().getBinding(this.oID.ITEMS);
			oBinding.filter([oFilter]);

			//Filter With Customer ID
			if (oBinding.aIndices.length === 0) {
				var oFilter = new sap.ui.model.Filter(this.oConstants.MASTERLISTSET_CUSTOMER_ID, sap.ui.model.FilterOperator.Contains, sValue);
				oBinding.filter(oFilter);
			}
		},
		/**
		 * This method is used on Close Customer Data from Customer Dialog
		 * @name handleCustomerDiaClose
		 * @param {sap.ui.base.Event} oEvent On Press close customer dialog
		 */
		handleCustomerDiaClose: function (oEvent) {
			var vCustNameId = this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME; //Customer Name
			var vFabNameId = this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME; //Fab Name
			var vFucnLocId = this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC; //Functional Location

			//Get selected Value
			var vSelectedTitle = oEvent.getParameter(this.oConstants.SELECTED_ITEM).getTitle();
			if (vSelectedTitle) {
				if (this.vSelect === vCustNameId || this.vSelect === vFabNameId) {
					this.getView().byId(this.vSelect).setValue(vSelectedTitle);
					if (this.vSelect === vCustNameId) {
						//Customer Id
						this.vSearchCustId = oEvent.getParameter(this.oConstants.SELECTED_ITEM).getDescription();
					}

					if (this.vSelect === vFabNameId) {
						//Fab Name
						this.vSearchFabName = oEvent.getParameter(this.oConstants.SELECTED_ITEM).getDescription();
					}
				} else if (this.vSelect === vFucnLocId) {
					this.getView().byId(this.vSelect).setValue(oEvent.getParameter(this.oConstants.SELECTED_ITEM).getDescription());
				}
			}
		},
		/**
		 * This method is used  On Changing File or Uploading file	
		 * @name onFileUploadChange
		 * @param {sap.ui.base.Event} oEvent On Press File Upload Change
		 */
		onFileUploadChange: function (oEvent) {
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel(this.oConstants.OMODEL);
			//All Files
			var oFiles = oEvent.getParameter("files");
			var vCount = oEvent.getParameter("files").length; //Number of File
			var reader = [];
			var oFileContent = []; //Array of File Content
			var oDocFile = []; //Array of File Name
			var oMimeType = []; //Array of Mime Type
			var oFileExtension = []; //Array of File Extension
			var oFileURL = []; //Array of File URL
			var oFileSize = []; //Array of File Size
			var that = this;
			var oAllData = [];
			var vAttach = this.oI18N.getText("MASS_UPDT_ATTACHMENT_TEXT");
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var vTextId = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;

			//Opening Busy Indicator
			oBusyIndicator.resetBusyIndicator();
			oBusyIndicator.showBusyIndicator();

			//Converting File into Base64
			for (var i = 0; i < oFiles.length; i++) {
				reader.push(new FileReader());
				//File Content
				reader[i].readAsDataURL(oEvent.getParameter(this.oID.FILES)[i]);
				//File Name
				oDocFile.push(oEvent.getParameter(this.oID.FILES)[i].name);
				//Mime Type
				oMimeType.push(oEvent.getParameter(this.oID.FILES)[i].type);
				//File Extension
				oFileExtension.push(oEvent.getParameter(this.oID.FILES)[i].name.split(".").pop());
				//File URL
				oFileURL.push(URL.createObjectURL(oEvent.getParameter(this.oID.FILES)[i]));
				//File Size
				oFileSize.push(oEvent.getParameter(this.oID.FILES)[i].size);
			}

			var vSizeCalculation = this.fnCalculateAllFileSize(oFileSize);
			if (vSizeCalculation) {
				setTimeout(function () {
					for (var k = 0; k < vCount; k++) {
						try {
							oFileContent.push(reader[k].result.split(that.oConstants.BASE64)[1]);
							//Update Attachment Model 
							oView.getModel(that.oAllModel.ATTACHMENT_MODEL).getData().push({
								"DocumentFile": oDocFile[k],
								"FileExtension": oFileExtension[k],
								"MimeType": oMimeType[k],
								"Value": reader[k].result.split(that.oConstants.BASE64)[1],
								"URL": oFileURL[k],
								"FileSize": oFileSize[k],
							});
							//Refresh Attachment Model;
							oView.getModel(that.oAllModel.ATTACHMENT_MODEL).refresh();
							//Set Attachment Text
							var vLength = oView.getModel(that.oAllModel.ATTACHMENT_MODEL).getData().length;
							sap.ui.getCore().byId(vTextId).setText(vAttach + vSB + vLength + vEB);
						} catch (error) {
							var vMessage = oDocFile[k] + " " + that.oI18N.getText("FILE_UPLOAD_ERROR");
							//Show Error Message
							oMessageManager.onShowErrorMessage(vMessage, that.oConstants.CUSTOM_MESSAGE, that);
						}
					}
					//Check Validation
					that.handleChangeMUpdtCB();
					//Close BusyIndicator
					oBusyIndicator.hideBusyIndicator();
				}, 500);
			} else {
				//Close BusyIndicator
				oBusyIndicator.hideBusyIndicator();
				//Show Error Message
				var vType = this.oConstants.CUSTOM_MESSAGE;
				var vMessage = this.oI18N.getText("ALL_EXCEED_FILE_SIZE");
				vMessage = vMessage + " " + this.vAttachmentLimit + this.oI18N.getText("FILE_SIZE_MB")
				//Show Error Message
				oMessageManager.onShowErrorMessage(vMessage, vType, this);
			}

		},
		/**
		 * This method is used  to Calculate Total File Size	
		 * @name fnCalculateAllFileSize
		 * @param oFile - Uploaded File
		 */
		fnCalculateAllFileSize: function (oFile) {
			var oView = this.getView();
			var oAttachModel = oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData();
			var vAttachFileLen = 0;
			var vUpldSize = 0;
			var vTotalSize = 0;

			//Calculate Attachment Model File Length
			$.each(oAttachModel, function (i, oItem) {
				vAttachFileLen = vAttachFileLen + oItem.FileSize;
			});

			//Upload File Size
			$.each(oFile, function (i, oItem) {
				vUpldSize = vUpldSize + oItem;
			});

			vTotalSize = (vAttachFileLen + vUpldSize) / 1024;

			//SIZE Limit from TVARV
			var vSizeLimit = parseInt(this.vAttachmentLimit) * 1000;

			if (vTotalSize > parseInt(vSizeLimit)) {
				//All File Size Should be less attachment limit
				return false;
			} else {
				return true;
			}
		},
		/**
		 * This method is used  to check Uploaded file size exceed
		 * @name onExceedFileSize
		 * @param {sap.ui.base.Event} oEvent File Uploader
		 */
		onExceedFileSize: function (oEvent) {
			var vFileName = oEvent.getParameter(this.oConstants.FILE_NAME);
			//Show Error Message
			var vType = this.oConstants.CUSTOM_MESSAGE;
			var vMessage = vFileName + this.oI18N.getText("EXCEED_FILE_SIZE1")
			vMessage = vMessage + " " + this.vAttachmentLimit + this.oI18N.getText("FILE_SIZE_MB");
			vMessage = vMessage + this.oI18N.getText("EXCEED_FILE_SIZE2") + " " + this.vAttachmentLimit + this.oI18N.getText("FILE_SIZE_MB");
			//Show Error Message
			oMessageManager.onShowErrorMessage(vMessage, vType, this);
		},
		/**
		 * This method is used  to Delete Attachment From The List
		 * @name onFileDeleted
		 * @param {sap.ui.base.Event} oEvent To Delete Attachment
		 */
		onFileDeleted: function (oEvent) {
			var oView = this.getView();
			var oAttachModel = oView.getModel(this.oAllModel.ATTACHMENT_MODEL);
			var vAttach = this.oI18N.getText("MASS_UPDT_ATTACHMENT_TEXT");
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var vTextId = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;

			//Opening Busy Indicator
			oBusyIndicator.resetBusyIndicator();
			oBusyIndicator.showBusyIndicator();

			//Get Selected Path
			var vPath = oEvent.getParameter(this.oConstants.LIST_ITEM).getBindingContext(this.oAllModel.ATTACHMENT_MODEL).getPath();
			vPath = vPath.split("/")[1];
			//Delete Selected File from Model
			oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData().splice(parseInt(vPath), 1);
			//Refresh Attachment Model
			oView.getModel(this.oAllModel.ATTACHMENT_MODEL).refresh();

			//Set Attachment Text
			var vLength = oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData().length;
			sap.ui.getCore().byId(vTextId).setText(vAttach + vSB + vLength + vEB);

			//Close BusyIndicator
			oBusyIndicator.hideBusyIndicator();
		},
		/**
		 * This method is used to Clear Mass Update Dialog Fields
		 * @name onClearMassUpdateDialog
		 */
		onClearMassUpdateDialog: function () {
			var oView = this.getView();
			var vData = []; //Set Blank Data for Attachment Model
			var vAttach = this.oI18N.getText("MASS_UPDT_ATTACHMENT_TEXT"); //Attachment Text
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var vZero = this.oI18N.getText("ZERO");
			var vTextId = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;
			var vCDId = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_CUST_DECISION_CB
			var vReason = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_RE_WAIVE_REJ_CB;

			//Attachment Text
			sap.ui.getCore().byId(vTextId).setText(vAttach + vSB + vZero + vEB);
			//Clear Customer Decision
			sap.ui.getCore().byId(vCDId).setSelectedKey("");
			sap.ui.getCore().byId(vCDId).setValueState(this.oConstants.VALUE_STATE_ERROR);
			sap.ui.getCore().byId(vCDId).setValueStateText(this.oI18N.getText("PLEASE_ENTER_CUST_DECI"));

			//Clear Reason For Waive and Reject
			sap.ui.getCore().byId(vReason).setSelectedKey("");

			//Clear Attachment 
			oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, vData, this.oAllModel.ATTACHMENT_MODEL);
		},
		/**
		 * This method is used to set Customer Decision Change and Reason for Waive and Reject
		 * @name handleChangeMUpdtCB
		 * @param {sap.ui.base.Event} oEvent Customer Decision or Reason for Waive
		 */
		handleChangeMUpdtCB: function (oEvent) {
			var oView = this.getView();
			//Customer Decision
			var vCustDeci = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_CUST_DECISION_CB;
			vCustDeci = sap.ui.getCore().byId(vCustDeci);
			//Reason for Waive and Reject
			var vReason = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_RE_WAIVE_REJ_CB;
			vReason = sap.ui.getCore().byId(vReason);
			//Attachments
			var vAttachments = oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData();
			//Attachment Text
			var vAttachText = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;
			vAttachText = sap.ui.getCore().byId(vAttachText);
			//Validate Mass Update Dialog
			this.onValidateMassUpdate(oEvent, vCustDeci, vReason, vAttachments, vAttachText);
		},
		/**
		 * This method is used to close Mass Update Dialog Press Cancel Button
		 * @name onPressMassUpdtCancelBtn
		 * @param {sap.ui.base.Event} oEvent On Press Cancel Button Mass Update Dialog
		 */
		onPressMassUpdtCancelBtn: function (oEvent) {
			this.MassUpdate.close();
		},
		/**
		 * This method is used to Update Mass Update Data
		 * @name onPressMassUpdate
		 * @param {sap.ui.base.Event} oEvent On Press Mass Update Update Button
		 */
		onPressMassUpdate: function (oEvent) {
			var oView = this.getView();
			var that = this;
			//Customer Decision
			var vCustDeci = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_CUST_DECISION_CB;
			vCustDeci = sap.ui.getCore().byId(vCustDeci);
			//Reason for Waive and Reject
			var vReason = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_RE_WAIVE_REJ_CB;
			vReason = sap.ui.getCore().byId(vReason);
			//Attachments
			var vAttachments = oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData();
			//Attachment Text
			var vAttachText = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;
			vAttachText = sap.ui.getCore().byId(vAttachText);

			var oModel = this.getOwnerComponent().getModel(this.oConstants.OMODEL); //Main oData Model
			var vEntitySet = this.oConstants.HEADER_MASSUPDATEHEADER;

			var vReturn = this.onValidateMassUpdate(oEvent, vCustDeci, vReason, vAttachments, vAttachText);

			if (vReturn) {
				var oPayload = this.onCreatePayloadMassUpdate(vCustDeci, vReason);
				//Opening Busy Indicator
				oBusyIndicator.resetBusyIndicator();
				oBusyIndicator.showBusyIndicator();

				//Creating Group For Batch Call
				var sGroupId = this.oConstants.SVO_UPDATE_LIMIT;

				//Call oData to Load Service Case Details
				oDataCall.fnCreateentity(oModel, sGroupId, vEntitySet, oPayload)
					.then(function (oData) {
						//Call Succsess Method
						that.onSuccessMassServiceCaseUpdate(oData);
					})
					.catch(function (oResponse) {
						//Closing Busy Indicator
						oBusyIndicator.hideBusyIndicator();

						//Show Error Message
						oMessageManager.onShowErrorMessage(oResponse, that.oConstants.STANDARD_MESSAGE, that);
					})
			}
		},
		/**
		 * This method is used for Mass Update oData Success Call after Mass Update	
		 * @name onSuccessMassServiceCaseUpdate
		 * @param oData - Success Data of oData Call
		 */
		onSuccessMassServiceCaseUpdate: function (oData) {
			var oView = this.getView();
			//Set Model Data
			oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oData.ToErrorDetails, this.oAllModel.MASS_UPDATE_RESULTS);
			this.fnShowDetailsAfterUpdate();
		},
		/**
		 * This method is used for Mass Update Dialog Validation	
		 * @name onValidateMassUpdate
		 * @param {sap.ui.base.Event} oEvent On Press Mass Update Update Button
		 * @param vCustDeci - Customer Decision
		 * @param vReason - Reason for Waive and Reject
		 * @param vAttachments - Attachments
		 * @param vAttachText - Attachment Text
		 * @returns true or false i.e validated ot not
		 */
		onValidateMassUpdate: function (oEvent, vCustDeci, vReason, vAttachments, vAttachText) {
			var oView = this.getView();
			var vMassUpdtBtn = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_UPDATE_BTN;
			var vMassage = "";
			var vCount = 0;
			var vUpload = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_FILE_UPLOADER;
			vUpload = sap.ui.getCore().byId(vUpload);
			var vData = []; //Set Blank Data for Attachment Model
			var vAttach = this.oI18N.getText("MASS_UPDT_ATTACHMENT_TEXT"); //Attachment Text
			var vSB = this.oConstants.START_BRACKET;
			var vEB = this.oConstants.END_BRACKET;
			var vZero = this.oI18N.getText("ZERO");
			var vTextId = this.oID.MASS_UPDATE_FRAGMENT + this.oID.DASH + this.oID.MASS_UPDT_ATTACHMENT_TEXT;

			// Start of PCR040232++ changes
			var oViewModel = this.getView().getModel(this.oConstants.MDL_DASHBOARD_VIEW),
				bSafetyPsl = oViewModel.getProperty("/EvType") && oViewModel.getProperty("/EvType") === this.oConstants.PSL_SAFETY;
			// End of PCR040232++ changes

			if (vCustDeci.getSelectedKey() === "") {
				//Customer Decision Not Selected
				vCustDeci.setValueState(this.oConstants.VALUE_STATE_ERROR);
				vCustDeci.setValueStateText(this.oI18N.getText("PLEASE_ENTER_CUST_DECI"));

				//Reason for Waive and Reject
				vReason.setEnabled(true);

				//Attachments
				vAttachText.addStyleClass(this.oConstants.TEXT_COLOR_BLACK);

				vMassage = vMassage + this.oI18N.getText("NEW_LINE") + this.oI18N.getText("PLEASE_ENTER_CUST_DECI");
				vCount++
			} else {
				if (vCustDeci.getSelectedKey() === this.oI18N.getText("MASS_UPDT_DIA_ACPT_KEY")) {
					//Customer Decision Selected as Accept
					//Customer Decision
					vCustDeci.setValueState(this.oConstants.VALUE_STATE_NONE);
					vCustDeci.setValueStateText("");
					//Reason for Waive and Reject
					vReason.setEnabled(false);
					vReason.setValueState(this.oConstants.VALUE_STATE_NONE);
					vReason.setValueStateText("");
					vReason.setSelectedKey("");

					//Attachments
					vAttachText.removeStyleClass(this.oConstants.TEXT_COLOR_RED);
					vAttachText.addStyleClass(this.oConstants.TEXT_COLOR_BLACK);

					vMassage = "";
					vCount++
				} else {
					//Customer Decision
					vCustDeci.setValueState(this.oConstants.VALUE_STATE_NONE);
					vCustDeci.setValueStateText("");

					//Customer Decision Selected as Reject
					//Reason for Waive and Reject
					vReason.setEnabled(true);
					if (vReason.getSelectedKey() === "") {
						vReason.setValueState(this.oConstants.VALUE_STATE_ERROR);
						vReason.setValueStateText(this.oI18N.getText("PLEASE_ENTER_REASON_WA_REJ"));
						vMassage = vMassage + this.oI18N.getText("NEW_LINE") + this.oI18N.getText("PLEASE_ENTER_REASON_WA_REJ");
					} else {
						vReason.setValueState(this.oConstants.VALUE_STATE_NONE);
						vReason.setValueStateText("");
						vMassage = "";
					}

					//Attachments
					if (bSafetyPsl && vAttachments.length < 1) { //PCR040232++; added bSafetyPsl
						vAttachText.removeStyleClass(this.oConstants.TEXT_COLOR_BLACK);
						vAttachText.addStyleClass(this.oConstants.TEXT_COLOR_RED);
					} else {
						vAttachText.removeStyleClass(this.oConstants.TEXT_COLOR_RED);
						vAttachText.addStyleClass(this.oConstants.TEXT_COLOR_BLACK);
					}
				}
			}
			try {
				//When we are clicking update button
				if (oEvent.getSource().getId() === vMassUpdtBtn) { //PCR040232++; added bSafetyPsl
					if (bSafetyPsl && vAttachments.length < 1 && vCount === 0) {
						vMassage = vMassage + this.oI18N.getText("NEW_LINE") + this.oI18N.getText("PLEASE_UPLOAD_ATTACHMENT");
					}
					if (vMassage !== "") {
						//Show Error Message
						var vType = this.oConstants.CUSTOM_MESSAGE;
						oMessageManager.onShowErrorMessage(vMassage, vType, this);
						return false;
					} else {
						return true;
					}
				}
			} catch (error) {
				if (vMassage !== "") {
					//Show Error Message
					var vType = this.oConstants.CUSTOM_MESSAGE;
					oMessageManager.onShowErrorMessage(vMassage, vType, this);
					return false;
				} else {
					return true;
				}
			}
		},
		/**
		 * This method is used to Create Payload For Mass Update
		 * @name onCreatePayloadMassUpdate
		 * @param vCustDeci - Customer Decision
		 * @param vReason - Reason for Waive and Reject
		 */
		onCreatePayloadMassUpdate: function (vCustDeci, vReason) {
			var oView = this.getView();
			var that = this;
			var oTable = this.getView().byId(this.oID.DASHBOARD_TABLE); //Mass Update Table
			var ToServiceCases = [];
			var ToAttachments = [];
			var vTableItemsCount = oTable.getSelectedItems().length;
			var oPayload = [];
			var vLowCount = 0;
			var vHighCount = 0;
			var vTotalLoop = 0;

			if (this.vServiceCaseUploadLimit === "0") {
				this.vServiceCaseUploadLimit = vTableItemsCount;
			}

			$.each(oTable.getSelectedItems(), function (i, oItem) {
				var vPath = oItem.getBindingContext(that.oAllModel.SVO_HOME_TABLE_MODEL).getPath();
				var vProperty = oView.getModel(that.oAllModel.SVO_HOME_TABLE_MODEL).getProperty(vPath);
				ToServiceCases.push({
					"Servicecaseno": vProperty.Servicecaseno,
					"Status": vProperty.Status,
					"StatusText": vProperty.StatusText,
					"Serialnumber": vProperty.Serialnumber,
					"FabId": vProperty.FabId,
					"Fabname": vProperty.Fabname,
					"CustomerId": vProperty.CustomerId,
					"CustomerName": vProperty.CustomerName,
					"CustomerTool": vProperty.CustomerTool,
					"CustomerDecision": vProperty.CustomerDecision,
					"ReasonForWaive": vProperty.ReasonForWaive,
				});
			});

			//Attachments
			var oAttchModel = oView.getModel(this.oAllModel.ATTACHMENT_MODEL).getData();
			if (oAttchModel.length > 0) {
				$.each(oAttchModel, function (i, oItem) {
					ToAttachments.push({
						"FileContentXstring": oItem.Value,
						"FileName": oItem.DocumentFile,
					});
				});
			}

			//Reason for Waive and Reject Text
			try {
				var vRes = vReason.getSelectedItem().getText();
			} catch (error) {
				var vRes = "";
			}

			//creating payload
			if (vTableItemsCount < this.vServiceCaseUploadLimit) {
				var oCreatePayload = {
					"CustomerDecision": vCustDeci.getSelectedItem().getKey(), //Customer Decision
					"Reason": vRes, //Reason for Waive and Reject
					"ToServiceCases": ToServiceCases, //Selected Service Cases
					"ToAttachments": ToAttachments, //Attachments				
					"ToErrorDetails": [], //Error Details
				}
				oPayload.push(oCreatePayload);
			} else {
				vTotalLoop = vTableItemsCount / this.vServiceCaseUploadLimit;
				vTotalLoop = vTotalLoop + 1;

				vLowCount = 0;
				vHighCount = this.vServiceCaseUploadLimit;
				for (var i = 0; i < vTotalLoop; i++) {
					var vArrServiceCae = [];
					for (var j = vLowCount; j < vHighCount; j++) {
						if (vLowCount === oTable.getSelectedItems().length) {
							break;
						} else {
							vArrServiceCae.push(ToServiceCases[j]);
							vLowCount++;
						}
					}
					vHighCount = parseInt(vHighCount) + parseInt(this.vServiceCaseUploadLimit);

					var oCreatePayload = {
						"CustomerDecision": vCustDeci.getSelectedItem().getKey(), //Customer Decision
						"Reason": vRes, //Reason for Waive and Reject
						"ToServiceCases": vArrServiceCae, //Selected Service Cases
						"ToAttachments": ToAttachments, //Attachments				
						"ToErrorDetails": [], //Error Details
					}
					oPayload.push(oCreatePayload);

					if (vLowCount === oTable.getSelectedItems().length) {
						break;
					}
				}

			}

			return oPayload;
		},
		/**
		 * This method is used for Show Message After Mass Update
		 * @name fnShowDetailsAfterUpdate
		 */
		fnShowDetailsAfterUpdate: function () {
			var oView = this.getView();
			var vSuccModel = oView.getModel(this.oAllModel.MASS_UPDATE_RESULTS).getData();
			if (vSuccModel.length > 0) {
				if (!this._ResultDialog) {
					this._ResultDialog = sap.ui.xmlfragment(this.oFragment.MASS_UPDT_RESULT_FRAGMENT, this);
					oView.addDependent(this._ResultDialog);
				}
				this._ResultDialog.open();
			} else {
				//Show Success Message
				var vMessage = this.oI18N.getText("SVO_UPDATED_SUCCESS");
				oMessageManager.onShowSuccessMessageOK(vMessage, this);
				//Clear Search Data
				this.onPressHomePnlClear()
			}

			//Close Mass Update Dialog
			this.MassUpdate.close();
			//Closing Busy Indicator
			oBusyIndicator.hideBusyIndicator();

		},
		/**
		 * This method is used for On Close Update Result Button
		 * @name onPressUpdateResultBtnClose
		 * @param {sap.ui.base.Event} oEvent On Press Button after update
		 */
		onPressUpdateResultBtnClose: function (oEvent) {
			//Close Mass Update Result Dialog
			this._ResultDialog.close();
			//Clear Search Data
			this.onPressHomePnlClear();
		},
		/**
		 * This method is used for Service Case Mass Update Resultant Data Excel Download
		 * @name onPressMassUpdtResExcel
		 * @param {sap.ui.base.Event} oEvent On Press Excel Download
		 */
		onPressMassUpdtResExcel: function (oEvent) {
			var oView = this.getView();
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = oView.getModel(this.oAllModel.MASS_UPDATE_RESULTS).getProperty('/');

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts
			};

			oSheet = new sap.ui.export.Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {})
				.finally(oSheet.destroy);

		},
		/**
		 * This method is used for Generate Column for Excel Download
		 * @name createColumnConfig
		 */
		createColumnConfig: function () {
			return [{
				label: this.oI18N.getText("EXCEL_SERVICECASENO"),
				property: this.oConstants.EXCEL_ENTITYSET_SERVICECASENO,
				type: exportLibrary.String
			}, {
				label: this.oI18N.getText("EXCEL_MESSAGE"),
				property: this.oConstants.EXCEL_ENTITYSET_MESSAGE,
				type: exportLibrary.String
			}];
		},
		/**
		 * This method is used for Select Table Item on clicking on Table Item
		 * @name onPressHomeTableColumn
		 * @param {sap.ui.base.Event} oEvent On Press Mass Update table item
		 */
		onPressHomeTableColumn: function (oEvent) {
			var vSelected = oEvent.getSource().getSelected();
			oEvent.getSource().setSelected(vSelected === true ? false : true);
		},
		/**
		 * This method is used to Set Editable Model for search Panel
		 * @name fnSetInpSearchModel
		 */
		fnSetInpSearchModel: function () {
			var oView = this.getView();
			var oArrayEditable = [{
				"ID": oView.byId(this.oID.HOME_PANEL_SEARCH_INP_CUST_NAME),
				"Enabled": true,
			}, {
				"ID": oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FAB_NAME),
				"Enabled": true,
			}, {
				"ID": oView.byId(this.oID.HOME_PANEL_SEARCH_INP_FUNC_LOC),
				"Enabled": true,
			}, {
				"ID": oView.byId(this.oID.HOME_PANEL_SEARCH_CB_Region),
				"Enabled": true,
			}, ];
			//Set Model Data
			oMassUpdateModel.fnSetSuccessDataGetEntitySet(oView, oArrayEditable, this.oAllModel.INPUT_SEARCH);
		},
	});
});