import * as sourceMapSupport from 'source-map-support'
sourceMapSupport.install()

import { ExportFirestore } from './export_firestore'
import { LoadFirestoreBackup } from './load_firestore_backup'

exports.ExportFirestore = ExportFirestore
exports.LoadFirestoreBackup = LoadFirestoreBackup
