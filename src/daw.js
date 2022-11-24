let gapi = window.gapi;
let currentProjectId = ""
let currentProjectNumber = ""

function setProjectId(projectId) {
  currentProjectId = projectId
} // End of setProjectId

function setProjectNumber(projectNumber) {
  currentProjectNumber = projectNumber
} // setProjectNumber

function addRequestMetadata(obj) {
  obj.requestMetadata = {
    "user_info": {
      "id": "user:kolban@kolban.altostrat.com",
      "group_ids": []
    }
  }
} // addRequestMetadata

//
// SCHEMAS
//

function getSchemaId(parent) {
  const result = parent.match(/^projects\/.*\/locations\/.*\/documentSchemas\/(.*)$/)
  if (result.length === 2) {
    return result[1]
  }
  debugger;
  return "Error";
} // getSchemaId


/**
 * List all the schemas
 * @param {*} options 
 * @returns A list of schemas
 */
async function listSchemas(options) {
  const params = {
    "parent": `projects/${currentProjectNumber}/locations/us`
  }
  const response = await gapi.client.contentwarehouse.projects.locations.documentSchemas.list(params);
  const result = response.result;
  if (!options || !options.makeMap === true) {
    return result
  }
  const map = new Map();
  result.documentSchemas.forEach((schema) => {
    map.set(schema.name, schema);
  });
  return map
} // listSchemas

async function getSchema(schemaName) {
  const params = {
    "name": schemaName
  }
  const response = await gapi.client.contentwarehouse.projects.locations.documentSchemas.get(params);
  return response.result
} // getSchema

//
// DOCUMENTS
//

async function deleteDocument(document) {
  const params = {
    "name": document
  }
  addRequestMetadata(params)
  await gapi.client.contentwarehouse.projects.locations.documents.delete(params);
} // deleteDocument

function getDocumentId(parent) {
  // projects/221249563454/locations/us/documents/2j6r2h90u7euo
  const result = parent.match(/^projects\/.*\/locations\/.*\/documents\/(.*)$/)
  if (result.length === 2) {
    return result[1]
  }
  debugger;
  return "Error";
} // getDocumentId

async function queryDocuments(documentQuery) {
  // https://cloud.google.com/document-warehouse/docs/reference/rest/v1/projects.locations.ruleSets/list
  const query = {
    "parent": `projects/${currentProjectNumber}/locations/us`,
    "documentQuery": documentQuery
  }
  addRequestMetadata(query);
  const response = await gapi.client.contentwarehouse.projects.locations.documents.search(query);
  //debugger;
  return response.result;
} // listDocuments

async function getDocument(document) {
  const params = {
    "name": document
  }
  addRequestMetadata(params)
  const response = await gapi.client.contentwarehouse.projects.locations.documents.get(params);
  return response.result;
} // getDocument

// RULES
// projects/221249563454/locations/us/ruleSets/2905bf251f1p8
function getRuleSetId(parent) {
  const result = parent.match(/^projects\/.*\/locations\/.*\/ruleSets\/(.*)$/)
  if (result.length === 2) {
    return result[1]
  }
  debugger;
  return "Error";
} // getRuleSetId

/**
 * List the rules
 * @param {*} projectId 
 * @returns The rules returned from the list rules request
 */
 async function listRules(projectId) {
  if (projectId === null || projectId === undefined) {
    projectId = currentProjectId;
  }
  // https://cloud.google.com/document-warehouse/docs/reference/rest/v1/projects.locations.ruleSets/list
  const query = {
    "parent": `projects/${currentProjectNumber}/locations/us`
  }
  const response = await gapi.client.contentwarehouse.projects.locations.ruleSets.list(query);
  return response.result;
} // listRules

async function getRuleSet(ruleset) {
  const params = {
    "name": ruleset
  }
  const response = await gapi.client.contentwarehouse.projects.locations.ruleSets.get(params);
  return response.result;
} // getRuleSet

async function deleteRuleSet(document) {
  const params = {
    "name": document
  }
  await gapi.client.contentwarehouse.projects.locations.ruleSets.delete(params);
} // deleteRuleSet

/**
 * 
 * @param {*} ruleSet 
 * @returns 
 * 
 * RuleSet:
 * {
 *   "name": string"
 *   "description": string
 *   "source": string
 *   "rules": [
 *     {
 *       <Rule>
 *     }
 *   ]
 * }
 */
async function rulesCreate(ruleSet) {
  ruleSet.parent = `projects/${currentProjectNumber}/locations/us`;
  const response = await gapi.client.contentwarehouse.projects.locations.ruleSets.create(ruleSet);
  debugger;
  return response.result;
} // rulesCreate

//
// Exports
//
const exports = { setProjectId, listRules, queryDocuments, getDocumentId, getSchemaId, getRuleSetId, getSchema, listSchemas, deleteDocument, getDocument, getRuleSet, deleteRuleSet, setProjectNumber }
export default exports;