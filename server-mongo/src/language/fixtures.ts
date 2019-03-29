import { LanguageModel } from './model'

export const languages = [
  {
    _id: '5c9de8c0716fbb04f12b18ca',
    name: 'C',
    extensions: ['c', 'cc'],
  },
  {
    _id: '5c9de8c0716fbb04f12b18cb',
    name: 'C++11',
    extensions: ['cpp', 'c++', 'cxx'],
  },
  {
    _id: '5c9de8c0716fbb04f12b18cc',
    name: 'Java',
    extensions: ['java'],
  },
  {
    _id: '5c9de8c0716fbb04f12b18cd',
    name: 'Python 2',
    extensions: ['py', 'py2'],
  },
  {
    _id: '5c9de8c0716fbb04f12b18ce',
    name: 'Python 3',
    extensions: ['py', 'py3'],
  },
]

export async function resetLanguages() {
  await LanguageModel.deleteMany({}).exec()
  await LanguageModel.insertMany(languages)
}
