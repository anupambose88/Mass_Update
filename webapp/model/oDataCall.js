/**  
 * @class
 * @public
 * @author X0115030
 * @since 10 March 2022
 * @extends 
 * @name com.amat.crm.svcmupdate.model.oDataCall
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
		 * This method is used for call oData GetEntitySet with Filter
		 * @name fnLoadDataWithFilter
		 * @param oModel - oData Model
		 * @param oEntity - oData EntitySet
		 * @param oFilter - Filter details for EntitySet
		 * @returns oData Success and Error Details from Promise
		 */
		fnLoadDataWithFilter: function(oModel, oEntity, oFilter) {
			return new Promise(function(resolve, reject) {
				//Calling oData Model
				oModel.read(oEntity, {
					filters: oFilter,
					success: function(oData) {
						resolve(oData);
					},
					error: function(oResponse) {
						reject(oResponse);
					}
				});
			});
		},
		/**
		 * This method is used for Batch Multi Call based on TVARV Variable for Mass Update
		 * @name fnCreateentity
		 * @param oModel - oData Model
		 * @param sGroupId - Group Id for Batch Call
		 * @param oEntitySet - oData EntitySet
		 * @param oPayload - oData Create Deep Entity Payload
		 * @returns oData Success and Error Details from Promise
		 */
		fnCreateentity: function(oModel, sGroupId, oEntitySet, oPayload) {
			var that = this;
			var vLength = oPayload.length;
			//Creating Output Structure
			var oErrorRecord = [];
			var oServiceCase = [];
			var oTotalData = {
				"CustomerDecision": oPayload[0].CustomerDecision,
				"Reason": oPayload[0].Reason,
				"ToAttachments": oPayload[0].ToAttachments,
				"ToErrorDetails": [],
				"ToServiceCases": [],
			};
			var oErrorRecord = [];
			var vCount = 0;
			//defining batch but nus as false for parallel call
			oModel.setUseBatch(false);
			var aDeferedBatchGroup = oModel.getDeferredBatchGroups();
			if (aDeferedBatchGroup.indexOf(sGroupId) === -1)
				aDeferedBatchGroup.push(sGroupId);
			oModel.setDeferredBatchGroups(aDeferedBatchGroup);

			//Use Promise to call oData
			return new Promise(function(resolve, reject) {
				for (var i = 0; i < oPayload.length; i++) {
					//Create Batch Call for Each loop baded on TVARV
					oModel.create(oEntitySet,
						oPayload[i], {
							batchGroupId: sGroupId,
							success: function(oData) {
								//Creating Output Structure
								//Converting All calles data to single output structure
								vCount++;
								if (vCount === vLength) {
									oErrorRecord.push(oData.ToErrorDetails);
									oServiceCase.push(oData.ToServiceCases);

									for (var i = 0; i < oServiceCase.length; i++) {
										for (var j = 0; j < oServiceCase[i].results.length; j++) {
											oTotalData.ToServiceCases.push(oServiceCase[i].results[j]);
										}
									}
									for (var i = 0; i < oErrorRecord.length; i++) {
										for (var j = 0; j < oErrorRecord[i].results.length; j++) {
											oTotalData.ToErrorDetails.push(oErrorRecord[i].results[j]);
										}
									}
									oModel.setUseBatch(true);
									//Call back to calling method with all oData success Data
									resolve(oTotalData);
								} else {
									oErrorRecord.push(oData.ToErrorDetails);
									oServiceCase.push(oData.ToServiceCases);
								}

							},
							error: function(oResponse) {
								reject(oResponse);
							}
						});
				}

				//Calling oData Model
				oModel.submitChanges({
					batchGroupId: sGroupId,
				});
			});
		},
		/**
		 * This method is used to Load Multiple EntitySet Batch Multi Call
		 * @name fnLoadBatchMulti
		 * @param oModel - oData Model
		 * @param sGroupId - Group Id for Batch Call
		 * @param vEntitySet - oData EntitySet
		 * @param vAllFilters - Filter details for EntitySet
		 * @returns oData Success and Error Details from Promise
		 */
		fnLoadBatchMulti: function(oModel, sGroupId, vEntitySet, vAllFilters) {
			oModel.setUseBatch(true);
			var aDeferedBatchGroup = oModel.getDeferredBatchGroups();
			if (aDeferedBatchGroup.indexOf(sGroupId) === -1)
				aDeferedBatchGroup.push(sGroupId);
			oModel.setDeferredBatchGroups(aDeferedBatchGroup);

			for (var i = 0; i < vEntitySet.length; i++) {
				oModel.read(vEntitySet[i], {
					filters: vAllFilters[i],
					batchGroupId: sGroupId
				});
			}

			return new Promise(function(resolve, reject) {
				//Calling oData Model
				oModel.submitChanges({
					batchGroupId: sGroupId,
					success: function(oData) {
						resolve(oData);
					},
					error: function(oResponse) {
						reject(oResponse);
					}
				});
			});
		},
	};
});