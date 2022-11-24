let gapi = window.gapi;
let currentProjectId = ""

function setProjectId(projectId) {
    currentProjectId = projectId
} // End of setProjectId

async function listDatasets(projectId) {
    if (projectId === null || projectId === undefined) {
        projectId = currentProjectId;
    }
    const response = await gapi.client.bigquery.datasets.list({projectId});
    console.log(response)
    if (response.result.datasets === undefined) {
        return [];
    }
    return response.result.datasets;
} // End of listDatasets

async function listTables(projectId, datasetId) {
    if (projectId === null || projectId === undefined) {
        projectId = currentProjectId;
    }
    const response = await gapi.client.bigquery.tables.list({projectId, datasetId});
    return response.result;
} // End of listTables

async function jobsList(projectId) {
    if (projectId === null || projectId === undefined) {
        projectId = currentProjectId;
    }
    const response = await gapi.client.bigquery.jobs.list({projectId});
    console.log(response)
    return response.result.jobs
} // End of jobsList


/**
 * Get the details of a BigQuery job by id.
 * @param {*} projectId 
 * @param {*} jobId 
 * @returns 
 */
async function jobsGet(projectId, jobId) {
    if (jobId === null || jobId === undefined) {
        throw new Error("jobId not supplied")
    }
    if (projectId === null || projectId === undefined) {
        projectId = currentProjectId;
    }
    const response = await gapi.client.bigquery.jobs.get({projectId, jobId});
    console.log(response)
    return response.result
} // End of jobsGet

async function query(projectId, query) {
    if (projectId === null || projectId === undefined) {
        projectId = currentProjectId;
    }
    if (!query) {
        throw new Error("No query supplied")
    }
    const queryRequest = {
        "projectId": projectId,
        "maxResults": 1000,
        "query": query,
        "useLegacySql": false
    }
    const response = await gapi.client.bigquery.jobs.query(queryRequest);
    return response.result;
} // End of query

const exports = { listDatasets, jobsList, jobsGet, setProjectId, query, listTables }
export default exports;