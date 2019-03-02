import {
  problem1,
  problem10,
  problem11,
  problem12,
  problem13,
  problem14,
  problem2,
  problem3,
  problem4,
  problem5,
  problem6,
  problem7,
  problem8,
  problem9,
} from 'ugrade/services/problem/InMemoryProblemService/fixtures'
import { Announcement } from '../Announcement'
import { Contest, Language } from '../Contest'

export const Language1: Language = { id: '1', name: 'C++11' }
export const Language2: Language = { id: '2', name: 'C' }
export const Language3: Language = { id: '3', name: 'Java' }
export const Language4: Language = { id: '4', name: 'Python2' }
export const Language5: Language = { id: '5', name: 'Python3' }

export const availableLanguages: Language[] = [
  Language1,
  Language2,
  Language3,
  Language4,
  Language5,
]

export const AnnouncementExample1: Announcement = {
  id: '1',
  title: `Term and Condition`,
  content: `By competing in TLX contests, you agree that:

- You will not collaborate with any other contestants.
- You will not use fake or multiple TLX accounts, other than your own account.
- You will not try to hack or attack the contest system in any way.

Failure to comply with the above rules can result to a disqualification or ban.
    
Enjoy the contest!`,
  issuedTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  read: true,
}

export const AnnouncementExample2: Announcement = {
  id: '2',
  title: `Scoreboard`,
  content: `Ada masalah dengan scoreboard sehingga untuk sementara scoreboard tidak dapat ditampilkan. Kami sedang berusaha memperbaikinya, mohon maaf atas ketidaknyamanannya. Terima kasih.`,
  issuedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: true,
}

export const AnnouncementExample3: Announcement = {
  id: '3',
  title: `Scoreboard Sudah Muncul`,
  content: `Scoreboard sudah bisa ditampilkan. Terima kasih atas kesabarannya!`,
  issuedTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  read: false,
}

export const annoucements: Announcement[] = [
  AnnouncementExample1,
  AnnouncementExample2,
  AnnouncementExample3,
]

export const ContestArkav4Qual: Contest = {
  id: '1',
  shortId: 'arkavidia-40-qualification',
  name: 'Penyisihan Competitive Programming Arkavidia 4.0',
  shortDescription:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  description: `# Arkavidia

Kompetisi merupakan salah satu main event pada Arkavidia Informatics & IT Festival yang diselenggarakan untuk menggali dan mengasah potensipotensi yang ada untuk berani unjuk diri berinovasi dan menghasilkan karya terbaik dalam bidang teknologi informasi yang diharapkan dapat menjadi jawaban dalam permasalahan perekonomian di Indonesia. Terdapat empat kompetisi yang diselenggarakan dalam Arkavidia Informatics & IT Festival, yakni Programming Contest, Capture The Flag, Technovation, serta Arkalogica.

Competitive Programming merupakan kompetisi pemrograman yang dibuka untuk tingkat senior (mahasiswa S1/sederajat) dan junior (siswa SMA/sederajat). Kompetisi ini bertujuan untuk menguji kemampuan berpikir logis dan komputasional. Peserta akan diberikan persoalan yang harus diselesaikan dengan menuliskan kode program dalam bahasa yang diizinkan, yaitu C, C++, Java, dan Python. Peserta akan dituntut untuk menggunakan algoritma atau struktur data yang tepat untuk menyelesaikan setiap persoalan. Jawaban peserta akan dikumpulkan dan dinilai dengan menggunakan grading system. Ketepatan dan kecepatan dalam menyelesaikan persoalan merupakan kunci dalam kompetisi ini. Kompetisi akan dibagi menjadi dua babak, yaitu penyisihan dan nal. Penyisihan dilakukan secara online dan nal akan diadakan secara onsite di Institut Teknologi Bandung.

## Tema

> Awakening Future Generation's Potential Through IT

## Penghargaan

### Senior

- Juara 1. Rp7.000.000,00
- Juara 2. Rp7.000.000,00
- Juara 3. Rp7.000.000,00

### Junior

- Juara 1. Rp2.000.000,00
- Juara 2. Rp1.500.000,00
- Juara 3. Rp1.000.000,00

## Syarat Dan Ketentuan

1. Peserta adalah pihak yang telah mengikuti mekanisme pendaftaran pada situs resmi Arkavidia 5.0.
2. Peserta melengkapi berkas pendaftaran dengan data yang benar dan legal secara hukum dan melakukan pembayaran sesuai dengan kategori masing-masing lomba.
3. Peserta yang tidak memenuhi persyaratan pendaftaran sampai waktu yang ditentukan akan dinyatakan gugur.
4. Peserta tidak diperbolehkan untuk mengubah anggota tim setelah pendaftaran telah diverikasi.
5. Setiap peserta hanya boleh terdaftar pada tepat satu tim pada cabang kompetisi yang sama.
6. Setiap peserta hanya boleh menjadi ketua tim pada maksimal 1 (satu) cabang kompetisi.
7. Peserta menyetujui apabila sewaktu-waktu dihubungi oleh panitia.
8. Hak kekayaan intelektual dari karya peserta pada kompetisi akan tetap menjadi hak dari peserta.
9. Panitia berhak untuk mempublikasikan karya peserta yang diikutsertakan pada kompetisi.
10. Peserta yang tidak mengkonrmasi kehadiran acara Final hingga 27 Januari 2019 pukul 23:59 WIB akan didiskualikasi.
11. Panitia berhak mendiskualikasi tim yang melakukan tindak kecurangan maupun pelanggaran terhadap aturan kompetisi.
12. Panitia berhak untuk mencabut gelar juara dari pemenang jika ditemukan kecurangan atau pelanggaran hukum dalam karya yang dilombakan ataupun dalam proses pelaksanaan perlombaan.
13. Peserta dilarang bekerjasama dengan peserta/tim lain dalam bentuk apapun.`,
  startTime: new Date(
    Date.now() - 1000 * 60 * 60 * 24 * 10 - 1000 * 60 * 60 * 5
  ),
  freezed: false,
  finishTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  permittedLanguages: availableLanguages.slice(),
}

export const ContestArkav4QualAnnouncements = annoucements.slice()

export const ContestArkav4QualProblems = [
  problem1.id,
  problem2.id,
  problem3.id,
  problem4.id,
  problem5.id,
  problem6.id,
]

export const ContestArkav4Final: Contest = {
  id: '2',
  shortId: 'arkavidia-40-qualification',
  name: 'Final Competitive Programming Arkavidia 4.0',
  shortDescription:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  description: ContestArkav4Qual.description,
  startTime: new Date(
    Date.now() - 1000 * 60 * 60 * 24 * 5 - 1000 * 60 * 60 * 5
  ),
  freezed: false,
  finishTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  permittedLanguages: availableLanguages.slice(),
}

export const ContestArkav4FinalAnnouncements = annoucements.slice()

export const ContestArkav4FinalProblems = [
  problem7.id,
  problem8.id,
  problem9.id,
  problem10.id,
  problem11.id,
  problem12.id,
  problem13.id,
  problem14.id,
]

export const ContestArkav5Qual: Contest = {
  id: '3',
  shortId: 'arkavidia-50-qualification',
  name: 'Penyisihan Competitive Programming Arkavidia 5.0',
  shortDescription:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit... Lorem ipsum dos color sit amet and something i dont know what to write',
  description: ContestArkav4Qual.description,
  startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  freezed: true,
  finishTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 1000 * 60 * 60 * 5),
  permittedLanguages: availableLanguages.slice(),
}

export const ContestArkav5QualAnnouncements = annoucements.slice()

export const ContestArkav5QualProblems = [
  problem1.id,
  problem2.id,
  problem3.id,
  problem4.id,
  problem5.id,
  problem6.id,
]

export const ContestArkav5Final: Contest = {
  id: '4',
  shortId: 'arkavidia-50-final',
  name: 'Final Competitive Programming Arkavidia 5.0',
  shortDescription:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
  description: ContestArkav4Qual.description,
  startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
  freezed: false,
  finishTime: new Date(
    Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 60 * 24 * 5
  ),
  permittedLanguages: availableLanguages.slice(),
}

export const ContestArkav5FinalAnnouncements = annoucements.slice()

export const ContestArkav5FinalProblems = [
  problem7.id,
  problem8.id,
  problem9.id,
  problem10.id,
  problem11.id,
  problem12.id,
  problem13.id,
  problem14.id,
]

export const contests: Contest[] = [
  ContestArkav4Qual,
  ContestArkav4Final,
  ContestArkav5Qual,
  ContestArkav5Final,
]

export const contestAnnouncementsMap = {
  [ContestArkav4Qual.id]: ContestArkav4QualAnnouncements,
  [ContestArkav4Final.id]: ContestArkav4FinalAnnouncements,
  [ContestArkav5Qual.id]: ContestArkav5QualAnnouncements,
  [ContestArkav5Final.id]: ContestArkav5FinalAnnouncements,
}

export const contestProblemsMap = {
  [ContestArkav4Qual.id]: ContestArkav4QualProblems,
  [ContestArkav4Final.id]: ContestArkav4FinalProblems,
  [ContestArkav5Qual.id]: ContestArkav5QualProblems,
  [ContestArkav5Final.id]: ContestArkav5FinalProblems,
}

export const languages = {
  [Language1.id]: Language1,
  [Language2.id]: Language2,
  [Language3.id]: Language3,
  [Language4.id]: Language4,
  [Language5.id]: Language5,
}
