import { gql } from 'apollo-server-express'
import fs from 'fs'
import path from 'path'

export const schemaStr = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')

export const schema = gql(schemaStr)
