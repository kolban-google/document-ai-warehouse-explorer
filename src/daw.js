import _ from 'lodash';

let gapi = window.gapi;
let currentProjectId = ""
let currentProjectNumber = ""
let currentLocation = "us"
let currentUser = ""
/**
 * Get the current parent value.
 * @returns The current parent value.
 */
function getParent() {
  return `projects/${currentProjectNumber}/locations/${currentLocation}`
} // getParent

function setProjectId(projectId) {
  currentProjectId = projectId
} // setProjectId

function setProjectNumber(projectNumber) {
  currentProjectNumber = projectNumber
} // setProjectNumber

function setUser(user) {
  currentUser = user
} // setUser

/**
 * Add the request metadata to an object
 * @param {*} obj 
 */
function addRequestMetadata(obj) {
  obj.requestMetadata = {
    "user_info": {
      "id": `user:${currentUser}`,
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
    "parent": getParent()
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

/**
 * Retrieve the named schema
 * @param {*} schemaName 
 * @returns 
 */
async function getSchema(schemaName) {
  const params = {
    "name": schemaName
  }
  const response = await gapi.client.contentwarehouse.projects.locations.documentSchemas.get(params);
  return response.result
} // getSchema

async function createSchema(documentSchema) {
  const newDocumentSchema = _.cloneDeep(documentSchema)
  delete newDocumentSchema.updateTime
  delete newDocumentSchema.createTime
  delete newDocumentSchema.name
  newDocumentSchema.parent = getParent()
  const response = await gapi.client.contentwarehouse.projects.locations.documentSchemas.create(newDocumentSchema);
  return response.result
}

async function deleteSchema(documentSchemaName) {
  const params = {
    "name": documentSchemaName
  }
  await gapi.client.contentwarehouse.projects.locations.documentSchemas.delete(params);
}

async function patchSchema(documentSchema) {
  const newDocumentSchema = _.cloneDeep(documentSchema)
  delete newDocumentSchema.updateTime
  delete newDocumentSchema.createTime
  const params = {
    name: documentSchema.name,
    documentSchema: documentSchema
  }
  const response = await gapi.client.contentwarehouse.projects.locations.documentSchemas.patch(params);
  return response.result
}

//
// DOCUMENTS
//

/**
 * Patch (update) the specified document
 * @param {*} document 
 */
async function patchDocument(document) {
  const params = {
    "name": document.name,
    "document": document
  }
  addRequestMetadata(params)
  await gapi.client.contentwarehouse.projects.locations.documents.patch(params);
} // patchDocument

async function createDocument(document) {
  const params = {
    "parent": getParent(),
    "document": document
  }
  addRequestMetadata(params)
  await gapi.client.contentwarehouse.projects.locations.documents.create(params);
} // createDocument

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
    "parent": getParent(),
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

/**
 * Find the property value in the given document
 * @param {*} propertyName 
 * @param {*} document 
 * @returns 
 */
function getPropertyValue(propertyName, document) {
  const value = _.find(document.properties, { "name": propertyName })
  if (value === undefined) {
    return value
  }
  if (value.hasOwnProperty("textValues")) {
    return value.textValues.values[0]
  }
  debugger
  return value
}

/**
 * Set the property value of the document.  The newValue is the value to be set.
 * The passed in propertyDefinition is the propertyDefinition in the schema
 * that describes what the structure of the document property should be.
 * @param {*} propertyDefinition 
 * @param {*} document 
 * @param {*} newValue 
 */
function setPropertyValue(propertyDefinition, document, newValue) {
  // It may be that this is the first property we are setting on the document so
  // create an empty document.properties.
  if (!document.hasOwnProperty("properties")) {
    document.properties = []
  }
  // Find the existing document property entry for the name ( if it exists)
  let value = _.find(document.properties, { "name": propertyDefinition.name })

  // If it doesn't exist, add a new property to the list of properties of the document.
  if (value === undefined) {
    value = {
      "name": propertyDefinition.name
    }
    document.properties.push(value)
  }

  // Set the value of the property.
  if (propertyDefinition.hasOwnProperty("textTypeOptions")) {
    value.textValues = { "values": [newValue] }
  } else {
    // Type not yet handled
    debugger
  }
}

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
    "parent": getParent()
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
  ruleSet.parent = getParent()
  const response = await gapi.client.contentwarehouse.projects.locations.ruleSets.create(ruleSet);
  debugger;
  return response.result;
} // rulesCreate

//
// Exports
//
const exports = {
  setProjectId, setProjectNumber, setUser,
  listRules, getRuleSetId, getRuleSet, deleteRuleSet, rulesCreate,
  getSchemaId, getSchema, createSchema, deleteSchema, patchSchema, listSchemas,
  getDocumentId, queryDocuments, createDocument, deleteDocument, getDocument, patchDocument, getPropertyValue, setPropertyValue
}
export default exports;