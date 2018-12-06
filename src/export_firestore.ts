import { firestore_v1beta2, google } from 'googleapis'
import Schema$GoogleFirestoreAdminV1beta2ExportDocumentsRequest = firestore_v1beta2.Schema$GoogleFirestoreAdminV1beta2ExportDocumentsRequest
import Params$Resource$Projects$Databases$Exportdocuments = firestore_v1beta2.Params$Resource$Projects$Databases$Exportdocuments
import Firestore = firestore_v1beta2.Firestore

import * as dotenv from 'dotenv'
dotenv.config()
const projectId = process.env.GCP_PROJECT_ID
const exportBucket = `gs://${projectId}-firestore`
const exportCollections = ['users', 'groups']

export const ExportFirestore = async () => {
  try {
    // Cloud Functions のデフォルトのCredentialを利用する
    // See Also: https://cloud.google.com/functions/docs/concepts/services#using_services_with_cloud_functions
    const auth = await google.auth.getClient({
      projectId,
      scopes: [
        'https://www.googleapis.com/auth/datastore',
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    })
    const request: Schema$GoogleFirestoreAdminV1beta2ExportDocumentsRequest = {
      collectionIds: exportCollections,
      outputUriPrefix: exportBucket
    }
    const params: Params$Resource$Projects$Databases$Exportdocuments = {
      auth,
      name: `projects/${projectId}/databases/(default)`,
      requestBody: request
    }

    const firestore = new Firestore({})
    const result = await firestore.projects.databases.exportDocuments(params)
    console.log(result)

    return Promise.resolve('success')
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}
