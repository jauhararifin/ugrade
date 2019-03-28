import { LanguageEntity } from './LanguageEntity'
import { PermissionEntity } from './PermissionEntity'
import { ContestEntity } from './ContestEntity'
import { Contest } from '../contest/Contest'
import { of } from 'zen-observable'

export const languages = [
  {
    id: 1,
    name: 'C',
    extensions: ['c', 'cc'],
  },
  {
    id: 2,
    name: 'C++11',
    extensions: ['cpp', 'c++', 'cxx'],
  },
  {
    id: 3,
    name: 'Java',
    extensions: ['java'],
  },
  {
    id: 4,
    name: 'Python 2',
    extensions: ['py', 'py2'],
  },
  {
    id: 5,
    name: 'Python 3',
    extensions: ['py', 'py3'],
  },
]

export const permissions = [
  {
    id: 1,
    code: 'update:info',
    description: 'User can update info',
  },
  {
    id: 2,
    code: 'create:announcement',
    description: 'User can create announcement',
  },
  {
    id: 3,
    code: 'read:announcement',
    description: 'User can read announcement',
  },
  {
    id: 4,
    code: 'read:clarifications',
    description: 'User can read clarifications',
  },
  {
    id: 5,
    code: 'create:clarifications',
    description: 'User can create clarifications',
  },
  {
    id: 6,
    code: 'reply:clarification',
    description: 'User can reply clarification',
  },
  {
    id: 7,
    code: 'create:problems',
    description: 'User can create problems',
  },
  {
    id: 8,
    code: 'read:problems',
    description: 'User can read problems',
  },
  {
    id: 9,
    code: 'read:disabledProblems',
    description: 'User can read disabled problems',
  },
  {
    id: 10,
    code: 'update:problems',
    description: 'User can update problems',
  },
  {
    id: 11,
    code: 'delete:problems',
    description: 'User can delete problems',
  },
  {
    id: 12,
    code: 'invite:users',
    description: 'User can invite users',
  },
  {
    id: 13,
    code: 'update:usersPermissions',
    description: "User can update user's permissions",
  },
  {
    id: 14,
    code: 'delete:users',
    description: 'User can delete users',
  },
  {
    id: 15,
    code: 'read:profiles',
    description: 'User can read profiles',
  },
  {
    id: 16,
    code: 'read:submissions',
    description: 'User can read submissions',
  },
  {
    id: 17,
    code: 'create:submissions',
    description: 'User can create submissions',
  },
]

export const contests = [
  {
    id: 1,
    name: 'Penyisihan Competitive Programming Arkavidia 4.0',
    shortId: 'arkavidia-40-qualification',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description:
      "# Arkavidia\r\n\r\nKompetisi merupakan salah satu main event pada Arkavidia Informatics & IT Festival yang diselenggarakan untuk menggali dan mengasah potensipotensi yang ada untuk berani unjuk diri berinovasi dan menghasilkan karya terbaik dalam bidang teknologi informasi yang diharapkan dapat menjadi jawaban dalam permasalahan perekonomian di Indonesia. Terdapat empat kompetisi yang diselenggarakan dalam Arkavidia Informatics & IT Festival, yakni Programming Contest, Capture The Flag, Technovation, serta Arkalogica.\r\n\r\nCompetitive Programming merupakan kompetisi pemrograman yang dibuka untuk tingkat senior (mahasiswa S1/sederajat) dan junior (siswa SMA/sederajat). Kompetisi ini bertujuan untuk menguji kemampuan berpikir logis dan komputasional. Peserta akan diberikan persoalan yang harus diselesaikan dengan menuliskan kode program dalam bahasa yang diizinkan, yaitu C, C++, Java, dan Python. Peserta akan dituntut untuk menggunakan algoritma atau struktur data yang tepat untuk menyelesaikan setiap persoalan. Jawaban peserta akan dikumpulkan dan dinilai dengan menggunakan grading system. Ketepatan dan kecepatan dalam menyelesaikan persoalan merupakan kunci dalam kompetisi ini. Kompetisi akan dibagi menjadi dua babak, yaitu penyisihan dan \uf001nal. Penyisihan dilakukan secara online dan \uf001nal akan diadakan secara onsite di Institut Teknologi Bandung.\r\n\r\n## Tema\r\n\r\n> Awakening Future Generation's Potential Through IT\r\n\r\n## Penghargaan\r\n\r\n### Senior\r\n\r\n- Juara 1. Rp7.000.000,00\r\n- Juara 2. Rp7.000.000,00\r\n- Juara 3. Rp7.000.000,00\r\n\r\n### Junior\r\n\r\n- Juara 1. Rp2.000.000,00\r\n- Juara 2. Rp1.500.000,00\r\n- Juara 3. Rp1.000.000,00\r\n\r\n## Syarat Dan Ketentuan\r\n\r\n1. Peserta adalah pihak yang telah mengikuti mekanisme pendaftaran pada situs resmi Arkavidia 5.0.\r\n2. Peserta melengkapi berkas pendaftaran dengan data yang benar dan legal secara hukum dan melakukan pembayaran sesuai dengan kategori masing-masing lomba.\r\n3. Peserta yang tidak memenuhi persyaratan pendaftaran sampai waktu yang ditentukan akan dinyatakan gugur.\r\n4. Peserta tidak diperbolehkan untuk mengubah anggota tim setelah pendaftaran telah diveri\uf001kasi.\r\n5. Setiap peserta hanya boleh terdaftar pada tepat satu tim pada cabang kompetisi yang sama.\r\n6. Setiap peserta hanya boleh menjadi ketua tim pada maksimal 1 (satu) cabang kompetisi.\r\n7. Peserta menyetujui apabila sewaktu-waktu dihubungi oleh panitia.\r\n8. Hak kekayaan intelektual dari karya peserta pada kompetisi akan tetap menjadi hak dari peserta.\r\n9. Panitia berhak untuk mempublikasikan karya peserta yang diikutsertakan pada kompetisi.\r\n10. Peserta yang tidak mengkon\uf001rmasi kehadiran acara Final hingga 27 Januari 2019 pukul 23:59 WIB akan didiskuali\uf001kasi.\r\n11. Panitia berhak mendiskuali\uf001kasi tim yang melakukan tindak kecurangan maupun pelanggaran terhadap aturan kompetisi.\r\n12. Panitia berhak untuk mencabut gelar juara dari pemenang jika ditemukan kecurangan atau pelanggaran hukum dalam karya yang dilombakan ataupun dalam proses pelaksanaan perlombaan.\r\n13. Peserta dilarang bekerjasama dengan peserta/tim lain dalam bentuk apapun.",
    startTime: new Date('2019-03-25T13:01:49Z'),
    freezed: true,
    finishTime: new Date('2019-03-31T13:01:54Z'),
    permittedLanguages: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    name: 'Final Competitive Programming Arkavidia 4.0',
    shortId: 'arkavidia-40-final',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description:
      "# Arkavidia\r\n\r\nKompetisi merupakan salah satu main event pada Arkavidia Informatics & IT Festival yang diselenggarakan untuk menggali dan mengasah potensipotensi yang ada untuk berani unjuk diri berinovasi dan menghasilkan karya terbaik dalam bidang teknologi informasi yang diharapkan dapat menjadi jawaban dalam permasalahan perekonomian di Indonesia. Terdapat empat kompetisi yang diselenggarakan dalam Arkavidia Informatics & IT Festival, yakni Programming Contest, Capture The Flag, Technovation, serta Arkalogica.\r\n\r\nCompetitive Programming merupakan kompetisi pemrograman yang dibuka untuk tingkat senior (mahasiswa S1/sederajat) dan junior (siswa SMA/sederajat). Kompetisi ini bertujuan untuk menguji kemampuan berpikir logis dan komputasional. Peserta akan diberikan persoalan yang harus diselesaikan dengan menuliskan kode program dalam bahasa yang diizinkan, yaitu C, C++, Java, dan Python. Peserta akan dituntut untuk menggunakan algoritma atau struktur data yang tepat untuk menyelesaikan setiap persoalan. Jawaban peserta akan dikumpulkan dan dinilai dengan menggunakan grading system. Ketepatan dan kecepatan dalam menyelesaikan persoalan merupakan kunci dalam kompetisi ini. Kompetisi akan dibagi menjadi dua babak, yaitu penyisihan dan \uf001nal. Penyisihan dilakukan secara online dan \uf001nal akan diadakan secara onsite di Institut Teknologi Bandung.\r\n\r\n## Tema\r\n\r\n> Awakening Future Generation's Potential Through IT\r\n\r\n## Penghargaan\r\n\r\n### Senior\r\n\r\n- Juara 1. Rp7.000.000,00\r\n- Juara 2. Rp7.000.000,00\r\n- Juara 3. Rp7.000.000,00\r\n\r\n### Junior\r\n\r\n- Juara 1. Rp2.000.000,00\r\n- Juara 2. Rp1.500.000,00\r\n- Juara 3. Rp1.000.000,00\r\n\r\n## Syarat Dan Ketentuan\r\n\r\n1. Peserta adalah pihak yang telah mengikuti mekanisme pendaftaran pada situs resmi Arkavidia 5.0.\r\n2. Peserta melengkapi berkas pendaftaran dengan data yang benar dan legal secara hukum dan melakukan pembayaran sesuai dengan kategori masing-masing lomba.\r\n3. Peserta yang tidak memenuhi persyaratan pendaftaran sampai waktu yang ditentukan akan dinyatakan gugur.\r\n4. Peserta tidak diperbolehkan untuk mengubah anggota tim setelah pendaftaran telah diveri\uf001kasi.\r\n5. Setiap peserta hanya boleh terdaftar pada tepat satu tim pada cabang kompetisi yang sama.\r\n6. Setiap peserta hanya boleh menjadi ketua tim pada maksimal 1 (satu) cabang kompetisi.\r\n7. Peserta menyetujui apabila sewaktu-waktu dihubungi oleh panitia.\r\n8. Hak kekayaan intelektual dari karya peserta pada kompetisi akan tetap menjadi hak dari peserta.\r\n9. Panitia berhak untuk mempublikasikan karya peserta yang diikutsertakan pada kompetisi.\r\n10. Peserta yang tidak mengkon\uf001rmasi kehadiran acara Final hingga 27 Januari 2019 pukul 23:59 WIB akan didiskuali\uf001kasi.\r\n11. Panitia berhak mendiskuali\uf001kasi tim yang melakukan tindak kecurangan maupun pelanggaran terhadap aturan kompetisi.\r\n12. Panitia berhak untuk mencabut gelar juara dari pemenang jika ditemukan kecurangan atau pelanggaran hukum dalam karya yang dilombakan ataupun dalam proses pelaksanaan perlombaan.\r\n13. Peserta dilarang bekerjasama dengan peserta/tim lain dalam bentuk apapun.",
    startTime: new Date('2019-03-31T13:03:59Z'),
    freezed: false,
    finishTime: new Date('2019-04-06T13:04:05Z'),
    permittedLanguages: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    name: 'Penyisihan Competitive Programming Arkavidia 5.0',
    shortId: 'arkavidia-50-qualification',
    shortDescription:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit... Lorem ipsum dos color sit amet and something i dont know what to write',
    description:
      "# Arkavidia\r\n\r\nKompetisi merupakan salah satu main event pada Arkavidia Informatics & IT Festival yang diselenggarakan untuk menggali dan mengasah potensipotensi yang ada untuk berani unjuk diri berinovasi dan menghasilkan karya terbaik dalam bidang teknologi informasi yang diharapkan dapat menjadi jawaban dalam permasalahan perekonomian di Indonesia. Terdapat empat kompetisi yang diselenggarakan dalam Arkavidia Informatics & IT Festival, yakni Programming Contest, Capture The Flag, Technovation, serta Arkalogica.\r\n\r\nCompetitive Programming merupakan kompetisi pemrograman yang dibuka untuk tingkat senior (mahasiswa S1/sederajat) dan junior (siswa SMA/sederajat). Kompetisi ini bertujuan untuk menguji kemampuan berpikir logis dan komputasional. Peserta akan diberikan persoalan yang harus diselesaikan dengan menuliskan kode program dalam bahasa yang diizinkan, yaitu C, C++, Java, dan Python. Peserta akan dituntut untuk menggunakan algoritma atau struktur data yang tepat untuk menyelesaikan setiap persoalan. Jawaban peserta akan dikumpulkan dan dinilai dengan menggunakan grading system. Ketepatan dan kecepatan dalam menyelesaikan persoalan merupakan kunci dalam kompetisi ini. Kompetisi akan dibagi menjadi dua babak, yaitu penyisihan dan \uf001nal. Penyisihan dilakukan secara online dan \uf001nal akan diadakan secara onsite di Institut Teknologi Bandung.\r\n\r\n## Tema\r\n\r\n> Awakening Future Generation's Potential Through IT\r\n\r\n## Penghargaan\r\n\r\n### Senior\r\n\r\n- Juara 1. Rp7.000.000,00\r\n- Juara 2. Rp7.000.000,00\r\n- Juara 3. Rp7.000.000,00\r\n\r\n### Junior\r\n\r\n- Juara 1. Rp2.000.000,00\r\n- Juara 2. Rp1.500.000,00\r\n- Juara 3. Rp1.000.000,00\r\n\r\n## Syarat Dan Ketentuan\r\n\r\n1. Peserta adalah pihak yang telah mengikuti mekanisme pendaftaran pada situs resmi Arkavidia 5.0.\r\n2. Peserta melengkapi berkas pendaftaran dengan data yang benar dan legal secara hukum dan melakukan pembayaran sesuai dengan kategori masing-masing lomba.\r\n3. Peserta yang tidak memenuhi persyaratan pendaftaran sampai waktu yang ditentukan akan dinyatakan gugur.\r\n4. Peserta tidak diperbolehkan untuk mengubah anggota tim setelah pendaftaran telah diveri\uf001kasi.\r\n5. Setiap peserta hanya boleh terdaftar pada tepat satu tim pada cabang kompetisi yang sama.\r\n6. Setiap peserta hanya boleh menjadi ketua tim pada maksimal 1 (satu) cabang kompetisi.\r\n7. Peserta menyetujui apabila sewaktu-waktu dihubungi oleh panitia.\r\n8. Hak kekayaan intelektual dari karya peserta pada kompetisi akan tetap menjadi hak dari peserta.\r\n9. Panitia berhak untuk mempublikasikan karya peserta yang diikutsertakan pada kompetisi.\r\n10. Peserta yang tidak mengkon\uf001rmasi kehadiran acara Final hingga 27 Januari 2019 pukul 23:59 WIB akan didiskuali\uf001kasi.\r\n11. Panitia berhak mendiskuali\uf001kasi tim yang melakukan tindak kecurangan maupun pelanggaran terhadap aturan kompetisi.\r\n12. Panitia berhak untuk mencabut gelar juara dari pemenang jika ditemukan kecurangan atau pelanggaran hukum dalam karya yang dilombakan ataupun dalam proses pelaksanaan perlombaan.\r\n13. Peserta dilarang bekerjasama dengan peserta/tim lain dalam bentuk apapun.",
    startTime: new Date('2019-03-25T13:04:52Z'),
    freezed: false,
    finishTime: new Date('2019-03-28T13:04:57Z'),
    permittedLanguages: [1, 2, 3, 4, 5],
  },
  {
    id: 4,
    name: 'Final Competitive Programming Arkavidia 5.0',
    shortId: 'arkavidia-50-final',
    shortDescription: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    description:
      "# Arkavidia\r\n\r\nKompetisi merupakan salah satu main event pada Arkavidia Informatics & IT Festival yang diselenggarakan untuk menggali dan mengasah potensipotensi yang ada untuk berani unjuk diri berinovasi dan menghasilkan karya terbaik dalam bidang teknologi informasi yang diharapkan dapat menjadi jawaban dalam permasalahan perekonomian di Indonesia. Terdapat empat kompetisi yang diselenggarakan dalam Arkavidia Informatics & IT Festival, yakni Programming Contest, Capture The Flag, Technovation, serta Arkalogica.\r\n\r\nCompetitive Programming merupakan kompetisi pemrograman yang dibuka untuk tingkat senior (mahasiswa S1/sederajat) dan junior (siswa SMA/sederajat). Kompetisi ini bertujuan untuk menguji kemampuan berpikir logis dan komputasional. Peserta akan diberikan persoalan yang harus diselesaikan dengan menuliskan kode program dalam bahasa yang diizinkan, yaitu C, C++, Java, dan Python. Peserta akan dituntut untuk menggunakan algoritma atau struktur data yang tepat untuk menyelesaikan setiap persoalan. Jawaban peserta akan dikumpulkan dan dinilai dengan menggunakan grading system. Ketepatan dan kecepatan dalam menyelesaikan persoalan merupakan kunci dalam kompetisi ini. Kompetisi akan dibagi menjadi dua babak, yaitu penyisihan dan \uf001nal. Penyisihan dilakukan secara online dan \uf001nal akan diadakan secara onsite di Institut Teknologi Bandung.\r\n\r\n## Tema\r\n\r\n> Awakening Future Generation's Potential Through IT\r\n\r\n## Penghargaan\r\n\r\n### Senior\r\n\r\n- Juara 1. Rp7.000.000,00\r\n- Juara 2. Rp7.000.000,00\r\n- Juara 3. Rp7.000.000,00\r\n\r\n### Junior\r\n\r\n- Juara 1. Rp2.000.000,00\r\n- Juara 2. Rp1.500.000,00\r\n- Juara 3. Rp1.000.000,00\r\n\r\n## Syarat Dan Ketentuan\r\n\r\n1. Peserta adalah pihak yang telah mengikuti mekanisme pendaftaran pada situs resmi Arkavidia 5.0.\r\n2. Peserta melengkapi berkas pendaftaran dengan data yang benar dan legal secara hukum dan melakukan pembayaran sesuai dengan kategori masing-masing lomba.\r\n3. Peserta yang tidak memenuhi persyaratan pendaftaran sampai waktu yang ditentukan akan dinyatakan gugur.\r\n4. Peserta tidak diperbolehkan untuk mengubah anggota tim setelah pendaftaran telah diveri\uf001kasi.\r\n5. Setiap peserta hanya boleh terdaftar pada tepat satu tim pada cabang kompetisi yang sama.\r\n6. Setiap peserta hanya boleh menjadi ketua tim pada maksimal 1 (satu) cabang kompetisi.\r\n7. Peserta menyetujui apabila sewaktu-waktu dihubungi oleh panitia.\r\n8. Hak kekayaan intelektual dari karya peserta pada kompetisi akan tetap menjadi hak dari peserta.\r\n9. Panitia berhak untuk mempublikasikan karya peserta yang diikutsertakan pada kompetisi.\r\n10. Peserta yang tidak mengkon\uf001rmasi kehadiran acara Final hingga 27 Januari 2019 pukul 23:59 WIB akan didiskuali\uf001kasi.\r\n11. Panitia berhak mendiskuali\uf001kasi tim yang melakukan tindak kecurangan maupun pelanggaran terhadap aturan kompetisi.\r\n12. Panitia berhak untuk mencabut gelar juara dari pemenang jika ditemukan kecurangan atau pelanggaran hukum dalam karya yang dilombakan ataupun dalam proses pelaksanaan perlombaan.\r\n13. Peserta dilarang bekerjasama dengan peserta/tim lain dalam bentuk apapun.",
    startTime: new Date('2019-03-21T13:05:37Z'),
    freezed: true,
    finishTime: new Date('2019-03-22T13:05:40Z'),
    permittedLanguages: [1, 2, 3, 4, 5],
  },
]

export const loadFixture = async () => {
  await Promise.all(languages.map(lang => LanguageEntity.create(lang).save()))
  await Promise.all(permissions.map(perm => PermissionEntity.create(perm).save()))

  await Promise.all(
    contests.map(async contest => {
      const permittedLanguages = LanguageEntity.findByIds(contest.permittedLanguages)
      const inserted = await ContestEntity.create({ ...contest, permittedLanguages }).save()
      inserted.permittedLanguages = permittedLanguages
      inserted.save()
    })
  )
}
