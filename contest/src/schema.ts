import fs from 'fs'
import path from 'path'
import { gql } from 'apollo-server-express'

export const schemaStr = fs.readFileSync(
  path.join(__dirname, 'schema.gql'),
  'utf8'
)

export const schema = gql(schemaStr)
