import { BigQuery } from '@google-cloud/bigquery'
import * as dotenv from 'dotenv'
import { bigquery_v2 } from 'googleapis'
import Schema$JobConfigurationLoad = bigquery_v2.Schema$JobConfigurationLoad
dotenv.config()

export const LoadFirestoreBackup = async (event: any) => {
  try {
    const object = event.data || event
    const objectName: string = object.name

    const matched = objectName.match(/_kind_(.*?).export_metadata$/)
    if (!matched) {
      console.log(`not a target object: ${objectName}`)
      return Promise.resolve('not a target object')
    }

    const collectionName = matched[1]
    console.log(`collection_name: ${collectionName}`)

    const bigquery = new BigQuery()
    const configuration: Schema$JobConfigurationLoad = {
      destinationTable: {
        datasetId: `${process.env.DATASET_ID}`,
        projectId: `${process.env.GCP_PROJECT_ID}`,
        tableId: `${collectionName}`
      },
      sourceFormat: 'DATASTORE_BACKUP',
      sourceUris: [`gs://${object.bucket}/${objectName}`],
      writeDisposition: 'WRITE_TRUNCATE'
    }
    await bigquery.createJob({
      configuration: { load: configuration }
    })

    return Promise.resolve('success')
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}
