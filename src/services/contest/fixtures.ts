import { Contest } from "./Contest"

const ContestArkav4Qual: Contest = {
    id: 1,
    slug: 'arkavidia-40-qualification',
    name: 'Penyisihan Competitive Programming Arkavidia 4.0',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description: '',
    registered: true,
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10 - 1000 * 60 * 60 * 5),
    freezed: false,
    finishTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
}

const ContestArkav4Final: Contest = {
    id: 2,
    slug: 'arkavidia-40-qualification',
    name: 'Final Competitive Programming Arkavidia 4.0',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description: '',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 - 1000 * 60 * 60 * 5),
    freezed: false,
    registered: false,
    finishTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
}

const ContestArkav5Qual: Contest = {
    id: 3,
    slug: 'arkavidia-50-qualification',
    name: 'Penyisihan Competitive Programming Arkavidia 5.0',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description: '',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    freezed: true,
    registered: true,
    finishTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 1000 * 60 * 60 * 5)
}

const ContestArkav5Final: Contest = {
    id: 4,
    slug: 'arkavidia-50-final',
    name: 'Final Competitive Programming Arkavidia 5.0',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description: '',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    freezed: false,
    registered: false,
    finishTime: new Date(Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 60 * 24 * 5)
}

export const contests: Contest[] = [
    ContestArkav4Qual,
    ContestArkav4Final,
    ContestArkav5Qual,
    ContestArkav5Final
]