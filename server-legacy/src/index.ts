import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Language } from './entity/Language'

createConnection()
  .then(async connection => {
    console.log('Inserting a new language into the database...')
    const language = new Language()
    language.name = 'C++11'
    language.extensions = 'cpp,cxx,c++,cc'
    await connection.manager.save(language)
    console.log('Saved a new language with id: ' + language.id)

    console.log('Loading languages from the database...')
    const languages = await connection.manager.find(Language)
    console.log('Loaded languages: ', languages)

    console.log('Here you can setup and run express/koa/any other framework.')
  })
  .catch(error => console.log(error))
