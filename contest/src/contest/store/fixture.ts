import {
  availableLanguages,
  Language1,
  Language2,
  Language3,
  Language4,
  Language5,
} from 'ugrade/language/inmemory'
import { ContestModel } from '.'

const padTo32 = (s: string) => `${'0'.repeat(32 - s.length)}${s}`

export const ContestArkav4Qual: ContestModel = {
  id: padTo32('1'),
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
  permittedLanguageIds: availableLanguages.map(lang => lang.id).slice(),
}

export const ContestArkav4Final: ContestModel = {
  id: padTo32('2'),
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
  permittedLanguageIds: availableLanguages.map(lang => lang.id).slice(),
}

export const ContestArkav5Qual: ContestModel = {
  id: padTo32('3'),
  shortId: 'arkavidia-50-qualification',
  name: 'Penyisihan Competitive Programming Arkavidia 5.0',
  shortDescription:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit... Lorem ipsum dos color sit amet and something i dont know what to write',
  description: ContestArkav4Qual.description,
  startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  freezed: true,
  finishTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 1000 * 60 * 60 * 5),
  permittedLanguageIds: availableLanguages.map(lang => lang.id).slice(),
}

export const ContestArkav5Final: ContestModel = {
  id: padTo32('4'),
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
  permittedLanguageIds: availableLanguages.map(lang => lang.id).slice(),
}

export const contests: ContestModel[] = [
  ContestArkav4Qual,
  ContestArkav4Final,
  ContestArkav5Qual,
  ContestArkav5Final,
]

export const languages = {
  [Language1.id]: Language1,
  [Language2.id]: Language2,
  [Language3.id]: Language3,
  [Language4.id]: Language4,
  [Language5.id]: Language5,
}
