import lodash from 'lodash'
import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from 'ugrade/services/contest/InMemoryContestService'
import { Problem, ProblemType } from '../Problem'

export const problem1: Problem = {
  id: '1',
  shortId: 'A',
  name: 'Potongan Kue',
  statement:
    '# Deskripsi\n\nPak Ansah memiliki kue yang akan dibagikan menjadi N potong. Setiap potongan dapat memiliki besaran yang berbeda-beda. Potongan ke-$i$ memiliki besaran $A_i$ unit. Pak Ansah juga mempunyai $N$ anak (kebetulan sekali!) sehingga ia ingin membagikan kue ke anak-anaknya dengan aturan sebagai berikut:\n\n1. Anak ke-$i$ mendapatkan potongan kue ke-$i$.\n2. Setiap anak tidak boleh makan kue dengan besaran lebih banyak dari yang saudara-saudaranya.\n3. Setiap anak boleh makan sebagian dari potongan kue yang dimiliki. Dengan kata lain, boleh saja tidak memakan potongan kue secara utuh. \n4. Setiap anak tidak boleh membagikan kue ke saudaranya. \n\nTentukan banyaknya total besaran minimum yang tersisa setelah anak-anaknya memakan kue sesuai dengan aturan diatas.\n\n# Format Masukan\n\nBaris pertama berisi sebuah bilangan bulat $T$, yaitu banyaknya kasus uji.\nUntuk setiap kasus uji, berisi sebuah bilangan bulat $N$, diikuti dengan $N$ bilangan bulat. Bilangan ke-$i$ menyatakan $A_i$, yaitu besarnya potongan kue ke-$i$.  \n\n# Format Keluaran\n\nUntuk setiap kasus uji, keluarkan satu baris yang berisi jawaban untuk kasus uji yang bersangkutan.\n\n# Contoh Masukan\n\n```\n3\n5 1 2 3 4 5\n3 7 2 5\n10 7 7 7 7 7 7 7 7 7 7\n```\n\n# Contoh Keluaran\n\n```\n10\n8\n0\n```\n\n# Penjelasan\n\nUntuk kasus ketiga, total besaran kue = $70$ unit. Seluruh anak mendapatkan potongan dengan besaran yang sama, sehingga setiap anak mendapatkan $7$ unit, dan total kue yang tersisa = $70 - 7 * 10 = 0$ unit tersisa.\n\n# Batasan\n\n- $1 \u2264 T \u2264 100$\n- $1 \u2264 N \u2264 10^5$\n- $1 \u2264 A_i \u2264 10^6$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 1,
  disabled: true,
}

export const problem2: Problem = {
  id: '2',
  shortId: 'B',
  name: 'XOR',
  statement:
    '# Deskripsi\n\nTurfa baru belajar tentang operasi bitwise XOR (Exclusive-OR). Operasi bitwise XOR ditandai dengan simbol $\u2295$. Turfa juga mempunyai 2 buah bilangan $l$ dan $r$. Turfa ingin mengetahui nilai dari $l \u2295 (l + 1) \u2295 (l + 2) \u2295 \\dots  \u2295 (r - 1) \u2295 r$. Bantulah Turfa!\n\n# Format Masukan\nBaris pertama berisi sebuah bilangan bulat $T$, yaitu banyaknya kasus uji.\nSetiap kasus uji terdiri atas sebuah baris yang berisi 2 bilangan bulat $l$ dan $r$ yang dipisahkan oleh spasi.\n\n# Format Keluaran\nUntuk setiap kasus uji, keluarkan sebuah baris yang berisi jawaban sesuai deskripsi diatas. \n\n# Contoh Masukan\n\n```\n4\n1 1\n1 2\n7 10\n100 101\n```\n\n# Contoh Keluaran\n\n```\n1\n3\n12\n1\n```\n\n# Batasan\n- $1 \u2264 T \u2264 200.000$\n- $1 \u2264 l \u2264 r \u2264 10^{18}$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 2,
  disabled: true,
}

export const problem3: Problem = {
  id: '3',
  shortId: 'C',
  name: 'AND',
  statement:
    '# Deskripsi\n\nSetelah belajar XOR, Turfa kemudian belajar tentang operasi *bitwise* AND ([https://en.wikipedia.org/wiki/Bitwise_operation#AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND)). Operasi *bitwise* AND ditandai dengan simbol $\\land$. Turfa mempunyai sebuah array $A$ berisi $N$ buah bilangan bulat. $A_{i}$ menyatakan elemen $A$ ke-$i$ dengan $1 \\leq i \\leq N$.\n\nSelain itu, Turfa mempunyaai $Q$ *query*. Setiap *query* diberikan dua buah bilangan bulat $L$ dan $R$. Turfa ingin mengetahui nilai dari $A_{L} \\land A_{L+1} \\land \\dots \\land A_{R-1} \\land A_{R}$. Bantulah Turfa!\n\n# Format Masukan\n\nBaris pertama berisi sebuah bilangan $T$ yang menyatakan banyaknya kasus. Setiap kasus uji memiliki format sebagai berikut:\n\n- Baris pertama berisi sebuah bilangan bulat: $N$ sebagai panjang array $A$.\n- Baris kedua berisi $N$ buah bilangan bulat. Bilangan ke-$i$ menyatakan nilai $A_{i}$.\n- Baris ketiga berisi sebuah bilangan bulat $Q$ yang menyatakan banyak *query*.\n- $Q$ baris berikutnya berisi dua buah bilangan bulat $L$ dan $R$ seperti yang dijelaskan pada deskripsi soal.\n\n# Format Keluaran\n\nUntuk setiap kasus uji, keluarkan $Q$ baris yang berisi jawaban sesuai deskripsi di atas. \n\n# Contoh Masukan\n\n```\n1\n7\n7 4 5 6 31 58 1\n4\n1 5\n3 4\n1 7\n4 6\n```\n\n# Contoh Keluaran\n\n```\n4\n4\n0\n2\n```\n\n# Batasan\n\n- $1 \\leq T\\leq 10$\n- $1 \\leq N,\\space Q\\leq 200.000$\n- $0 \\leq A_{i} \\leq 10^9$\n- $1 \\leq L \\leq R \\leq N$\n- Jumlah $N$ dalam satu file tidak lebih dari $200.000$. Jumlah $Q$ dalam satu file tidak lebih dari $200.000$.',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 3,
  disabled: false,
}

export const problem4: Problem = {
  id: '4',
  shortId: 'D',
  name: 'Fahar Jundi Dan Kotak',
  statement:
    '# Deskripsi\n\nFahar dan Jundi adalah teman yang sangat akrab. Mereka juga suka bermain dengan angka. Mereka mempunyai teka-teki untuk anda. Beginilah teka-tekinya... \n\nFahar mempunyai $N$ bilangan bulat. Bilangan ke-$i$ bernilai $A_i$. Jundi mempunyai kotak yang banyaknya tak berhingga. Mereka ingin memasukkan bilangan-bilangan ke dalam kotak-kotak tersebut dengan konfigurasi sebagai berikut:\n\n1. Sebuah bilangan hanya dapat dimasukkan tepat ke satu kotak.\n2. Setiap kotak terdiri atas minimal $K$ angka.\n\nTerdapat fungsi $F$ yang menghitung selisih bilangan terbesar dan terkecil dalam suatu kotak. Terdapat pula fungsi $G$ yang menghitung total dari $F$ untuk semua kotak yang terisi oleh bilangan. Fahar dan Jundi penasaran, dari semua konfigurasi yang mungkin, berapakah nilai $G$ minimum yang mungkin? Karena kemungkinannya sangat banyak, mereka kewalahan. Bantulah mereka mencari nilai $G$ minimum yang mungkin!\n\n# Format Masukan\n\nBaris pertama berisi sebuah bilangan bulat $T$, yaitu banyaknya kasus uji.\nSetiap kasus uji terdiri dari $2$ baris.\nBaris pertama setiap kasus uji berisi $2$ bilangan bulat $N$ dan $K$.\nBaris kedua setiap kasus uji berisi $N$ bilangan bulat $A_i$.\n\n# Format Keluaran\n\nUntuk setiap kasus uji, keluarkan sebuah baris yang berisi nilai $G$ minimum yang mungkin untuk kasus uji yang bersangkutan.\n\n# Contoh Masukan\n\n```\n3\n5 3\n1 1 2 1 2\n5 2\n1 1 2 1 2\n10 3\n1 2098 2145 35 25 23 2112 23 2123 13\n```\n\n# Contoh Keluaran\n\n```\n1\n0\n81\n```\n\n# Penjelasan\n\nPada kasus uji pertama, jumlah tidak mungkin untuk membagi bilangan ke lebih dari $1$ kotak, sehingga nilai $G = 2 - 1 = 1$.\n\nPada kasus uji kedua, salah satu olusi optimal yang mungkin adalah:\n- Kotak 1 : $[1, 1, 1]$, $F = 1 - 1 = 0$\n- Kotak 2 : $[2, 2]$, $F = 2 - 2 = 0$\n\nMaka nilai $G$ untuk konfigurasi di atas adalah $0 + 0 = 0$.\n\nBerikut adalah konfigurasi yang kurang optimal untuk kasus uji kedua:\n- Kotak 1 : $[1, 1]$, $F = 1 - 1 = 0$\n- Kotak 2 : $[2, 1, 2]$, $F = 2 - 1 = 1$\n\nNilai $G$ untuk konfigurasi diatas adalah $0 + 1 = 1$, sehingga bukan merupakan solusi optimal.\n\n# Batasan\n\n- $1 \u2264 T \u2264 20$\n- $1 \u2264 K \u2264 N \u2264 100.000$\n- $1 \u2264 A_i \u2264 10^9$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 4,
  disabled: true,
}

export const problem5: Problem = {
  id: '5',
  shortId: 'E',
  name: 'Sisa Yang Dikuadratkan',
  statement:
    '# Deskripsi\nDiberikan sebuah array $A$ berisi $N$ bilangan bulat. $A_i$ menandakan elemen $A$ ke-$i$ untuk $1 \u2264 i \u2264 N$. Terdapat $Q$ buah query. Setiap query diberikan sebuah bilangan bulat $X$. Hitunglah nilai dari:\n\n$$(A_{1} \\bmod X)^2 + (A_{2} \\bmod X)^2 + \\dots + (A_{N} \\bmod X)^2$$\n\n# Format Masukan\n\nBaris pertama berisi sebuah bilangan $T$ yang menyatakan banyaknya kasus.\nBaris pertama setiap kasus berisi dua bilangan bulat: $N$ dan $Q$.\nBaris kedua setiap kasus berisi $N$ bilangan bulat. Bilangan ke-$i$ menyatakan nilai $A_i$.\n$Q$ baris berikutnya dari setiap kasus berisi sebuah bilangan bulat $X$ seperti yang dijelaskan pada deskripsi soal.\n\n# Format Keluaran\n\nUntuk setiap kasus, keluarkan $Q$ baris bilangan bulat yang menyatakan jawaban tiap *query*.\n\n# Contoh Masukan\n```\n1\n5 3\n1 100 7 33 20\n1\n5\n123456789\n```\n# Contoh Keluaran\n```\n0\n14\n11539\n```\n# Penjelasan\n\nTerdapat satu kasus uji. Dalam kasus uji tersebut, $N = 5$ dan $Q = 3$. Pada query kedua dari kasus uji tersebut, hasilnya adalah:\n$$(1 \\bmod 5)^2 + (100 \\bmod 5)^2 + (7 \\bmod 5)^2 + (33 \\bmod 5)^2 + (20 \\bmod 5)^2 = 1^2 + 0^2 + 2^2 + 3^2 + 0^2 = 14$$\n\n# Batasan\n- $1 \u2264 T \u2264 10$\n- $1 \u2264 N \u2264 2 \\times 10^5$\n- $1 \u2264 Q \u2264 2 \\times 10^5$\n- $1 \u2264 A_i \u2264 2 \\times 10^5$\n- $1 \u2264 X \u2264 10^9$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 5,
  disabled: false,
}

export const problem6: Problem = {
  id: '6',
  shortId: 'F',
  name: 'Hashing',
  statement:
    '# Deskripsi\n\nHashing adalah suatu teknik yang dapat digunakan untuk mengubah data yang memiliki ukuran berapapun menjadi data yang berukuran tetap. Fungsi hash akan memetakan data menjadi suatu data baru yang memiliki ukuran konstan. Untuk memudahkan persoalan, fungsi hash $f(x)$ adalah fungsi yang memetakan array of byte $(x)$ menjadi sebuah integer 32 bit. Nilai yang dihasilkan oleh fungsi hash ini disebut dengan *hash value* atau *digest*. Hashing digunakan pada banyak aplikasi seperti struktur data hash map, string matching, digital signature dan masih banyak lagi. Sekarang sudah banyak algoritma hash yang ditemukan, beberapa diantaranya adalah: MD5, SHA-1, CRC, dan lain sebagainya. Membuat fungsi hash adalah hal yang mudah, salah satu contoh fungsi hash yang valid adalah menjumlahkan seluruh byte pada $x$. Akan tetapi menjumlahkan seluruh byte pada $x$ tidak memberikan algoritma hash yang kuat. Dengan menggunakan algoritma tersebut array of byte $[1,2,3]$ dan $[1,5]$ akan memberikan hash value yang sama yaitu $6$, hal ini disebut dengan *collision*. Nilai kekuatan algoritma hash didefinisikan dengan seberapa jarang collision terjadi. Selain itu, tentu saja algoritma hash juga memiliki kompleksitas waktu, algoritma hash yang kuat bisa saja membutuhkan waktu yang lama.\n\nTerdapat $N$ algoritma hash yang dapat dinomori dari $1$ hingga $N$. Algoritma hash ke-$i$ memiliki nilai kekuatan sebesar $A_i$ dan kompleksitas waktu sebesar $B_i$. Dengan kekuatan magic-nya, Turpa dapat menggabungkan algoritma $i$ dan $j$ (nilai $i$ dan $j$ mungkin saja sama) menjadi algoritma baru bernama **super-$i$-$j$** dengan kekuatan sebesar $A_i$ dan kompleksitas waktu sebesar $B_j$. Setiap algoritma baru yang dihasilkan oleh Turpa memiliki nilai keindahan. Nilai keindahan sebuah algoritma yang digabungkan dari algoritma $i$ dan $j$ adalah $A_i + B_j$. Perhatikan bahwa menggabungkan algoritma $i$ dengan $j$ berbeda dengan menggabungkan algoritma $j$ dengan $i$. Menggabungkan algoritma $i$ dengan $j$ akan menghasilkan algoritma **super-$i$-$j$**, sedangkan menggabungkan algoritma $j$ dan $j$ menghasilkan algoritma **super-$j$-$i$**.\n\nTerdapat $Q$ query yang berisi sebuah bilangan bulat $x$. Untuk setiap query, tentukan banyaknya algoritma berbeda yang dapat dihasilkan dengan menggabungkan dua buah algoritma sehingga memiliki nilai keindahan sebesar $x$. Dua algoritma dikatakan berbeda jika memiliki nama yang berbeda.\n\n# Format Masukan\n\n- Baris pertama berisi sebuah bilangan $T$ yang menyatakan banyaknya kasus\n- Untuk setiap kasus, baris pertama berisi sebuah bilangan bulat $N$ yang menyatakan banyaknya algoritma hash yang ada.\n- Baris kedua berisi $N$ buah bilangan bulat yang menyatakan nilai $A$.\n- Baris ketiga berisi $N$ buah bilangan bulat yang menyatakan nilai $B$.\n- Baris keempat berisi sebuah bilangan bulat $Q$ yang menyatakan banyaknya query pada kasus yang bersangkutan.\n- $Q$ baris berikutnya berisi sebuah bilangan bulat $x$ seperti yang dijelaskan pada deskripsi soal.\n\n# Format Keluaran\n\nUntuk setiap kasus, keluarkan $Q$ baris yang berisi sebuah bilangan bulat yaitu jawaban tiap query.\n\n# Contoh Masukan\n```\n1\n5\n1 6 2 3 4\n8 2 4 5 7\n3\n3\n6\n5\n```\n\n# Contoh Keluaran\n\n```\n1\n3\n2\n```\n\n# Penjelasan\n\n- Pada query pertama Turpa hanya dapat membuat algoritma dengan keindahan 3 dengan menggabungkan algoritma pertama dengan kedua.\n- Pada query kedua Turpa dapat membuat algoritma dengan keindahan 6 dengan menggabungkan algoritma pertama dengan keempat, ketiga dengan ketiga, dan kelima dengan kedua.\n- Pada query terakhir, Turpa dapat membuat algoritma dengan nilai keindahan 5 dengan menggabungkan algoritma pertama dan ketiga atau keempat dan kedua.\n\n# Batasan\n\nTerdapat paling banyak $20$ kasus ($1 \\leq T \\leq 20$). Untuk setiap kasus, berlaku batasan sebagai berikut:\n- $1 \\leq N \\leq 5\\times 10^4$\n- $1 \\leq Q \\leq 10^5$\n- $0 \\leq A_i,B_i \\leq 5\\times 10^4$\n- $0 \\leq x$',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 6,
  disabled: false,
}

export const problem7: Problem = {
  id: '7',
  shortId: 'G',
  name: 'Mengurutkan Bilangan',
  statement:
    '# Deskripsi\n\nDiberikan suatu array $A$ yang berisi $N$ elemen. Elemen ke-$i$ pada $A$ dinyatakan dengan $A_i$. Setiap $A_i$ terdiri dari $2$ bilangan bulat $X_i$ dan $Y_i.$ \n\nTerdapat fungsi $F(a, b)$ yang mengembalikan hasil perkalian dari $a$ dan $b$. Sebagai contoh, $F(2, 3)$ mengembalikan nilai $6$, sedangkan $F(7, 3)$ mengembalikan nilai $21$.\n\nTerdapat juga array $B$ yang berisi elemen-elemen array $A$ yang telah diurutkan. $A_i$ memiliki posisi lebih awal dari $A_j$ pada $B$ apabila salah satu hal berikut terpenuhi:\n1. $F(X_i, Y_i) > F(X_j, Y_j)$.\n2. $F(X_i, Y_i) = F(X_j, Y_j) dan i < j$.\n\nTerdapat juga fungsi $G(i)$ yang mengembalikan posisi $A_i$ pada $B$. Hitung nilai dari $G(1), G(2), \\dots , G(N)$. \n\n# Format Input\n\nBaris pertama berisi sebuah bilangan bulat $N$.\n$N$ baris berikutnya masing-masing berisi dua buah bilangan bulat yang menyatakan nilai $X_i$ dan $Y_i$.\n\n# Format Output\n\nKeluarkan $N$ baris. Baris ke-$i$ menyatakan nilai $G(i)$.\n\n# Contoh Input\n```\n5\n1 5\n2 4\n3 3\n4 2\n5 1\n```\n\n# Contoh Output\n```\n4\n2\n1\n3\n5\n```\n\n# Penjelasan\nArray $B$ pada contoh input diatas:\n```\n3 3\n2 4\n4 2\n1 5\n5 1\n```\n\n# Batasan\n- $1 \u2264 N \u2264 5000$\n- $0 \u2264 X_i, Y_i \u2264 10^{5000}$\n- Terdapat suatu bilangan $C$ sehingga untuk setiap $i$, $X_i + Y_i = C$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 7,
  disabled: true,
}

export const problem8: Problem = {
  id: '8',
  shortId: 'H',
  name: 'Snake Cube',
  statement:
    '# Deskripsi\r\n\r\nAmalia, seorang perancang puzzle terkenal, sedang merancang puzzle baru yang ia namakan Snake Cube. Berikut adalah detail tentang puzzle yang ia buat:\r\n\r\n- Terdapat 27 kubus kecil yang memiliki ukuran yang sama.\r\n- Kubus-kubus kecil tersebut akan dirangkai sedemikian sehingga setiap kubus kecil akan menempel dengan dua kubus kecil lain, kecuali dua kubus kecil yang hanya menempel dengan satu kubus kecil lain. Kedua kubus kecil tersebut disebut sebagai ujung rangkaian.\r\n- Setiap kubus kecil dapat diputar terhadap kubus kecil yang menempel dengan kubus tersebut. Untuk lebih jelasnya, silakan lihat contoh putaran di bawah ini.\r\n\r\n![Contoh Putaran](putaran.jpg)\r\n\r\n- Tidak boleh ada lebih dari tiga kubus dalam satu jajaran. Jajaran didefinisikan sebagai subrangkaian yang diawali dan diakhiri oleh ujung jajaran. Ujung jajaran dapat berupa ujung rangkaian atau sendi. Sendi didefinisikan sebagai kubus kecil yang menempel kepada dua kubus kecil lain dan bersama dua kubus kecil tersebut membentuk sudut 90 derajat. Pada gambar di bawah ini, sendi adalah kubus yang ditunjuk oleh panah berwarna merah sedangkan jajaran adalah yang berwarna biru.\r\n\r\n![https://www.jedicreations.com/wholesale-games-puzzles/snake-cube.php](contoh1.jpg)\r\n\r\nAdapun tujuan dari puzzle ini adalah merangkai rangkaian kubus-kubus kecil tersebut menjadi sebuah kubus besar berukuran 3x3x3.\r\n\r\nAgar puzzle ini terjual banyak, Amalia ingin membuat banyak versi rangkaian puzzle yang berbeda. Namun, ada rangkaian-rangkaian yang memenuhi syarat di atas, namun tidak mungkin dapat dirangkai menjadi kubus besar berukuran 3x3x3. Oleh karena itu, Amalia membutuhkan bantuan Anda untuk menentukan apakah suatu rangkaian dapat dibuat menjadi kubus besar atau tidak.\r\n\r\n# Format Masukan\r\n\r\nBaris pertama berisi sebuah bilangan bulat $N$ yang menyatakan banyaknya jajaran dalam suatu rangkaian. Baris kedua berisi $N$ buah bilangan $A_i$ yang menyatakan banyaknya kubus kecil pada jajaran ke-$i$. Kubus kecil terakhir dari jajaran ke-$i$ akan menjadi kubus kecil pertama dari jajaran ke-$i+1$ (kecuali untuk jajaran ke-$N$).\r\n\r\n# Format Keluaran\r\n\r\nKeluarkan "Ya" jika rangkaian tersebut dapat membentuk kubus besar berukuran 3x3x3, keluarkan "Tidak" jika tidak.\r\n\r\n# Contoh Masukan 1\r\n\r\n```\r\n21\r\n2 2 3 3 2 2 2 2 2 2 2 2 2 2 2 2 3 3 2 2 3\r\n```\r\n\r\n# Contoh Keluaran 1\r\n\r\n```\r\nYa\r\n```\r\n\r\n\r\n# Contoh Masukan 2\r\n\r\n```\r\n17\r\n3 2 2 3 2 3 2 2 3 3 2 2 2 3 3 3 3\r\n```\r\n\r\n# Contoh Keluaran 2\r\n\r\n```\r\nYa\r\n```\r\n\r\n# Contoh Masukan 3\r\n\r\n```\r\n15\r\n3 2 2 3 2 3 2 3 3 3 3 3 3 3 3\r\n```\r\n\r\n# Contoh Keluaran 3\r\n\r\n```\r\nTidak\r\n```\r\n\r\n\r\n# Penjelasan\r\n\r\nContoh masukan 1 merepresentasikan rangkaian seperti pada Gambar 2 di atas, dengan jajaran pertama adalah jajaran paling kiri. Ini adalah rangkaian standar yang dijual di pasaran dan dapat dibentuk menjadi kubus besar.\r\n\r\n# Batasan\r\n\r\n- $2 \\leq A_i \\leq 3$\r\n- $\\sum_{i=1}^{N} A_i = 27 + N - 1$',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 8,
  disabled: false,
}

export const problem9: Problem = {
  id: '9',
  shortId: 'I',
  name: 'Menutup Meriam',
  statement:
    '# Deskripsi\r\n\r\n\\Bocan sedang berperang melawan Turpa. Untuk mempertahankan bentengnya, Bocan membuat $N$ buah meriam yang diletakkan pada sebuah garis lurus. Meriam tersebut diletakkan secara berjejer-jejer sehingga meriam ke-$i$ terletak pada petak ke-$i$. Setiap meriam memiliki tinggi masing-masing, meriam ke-$i$ memiliki tinggi $H_i$. Berikut adalah contoh $5$ buah meriam yang memiliki tinggi $3, 5, 2, 1, 3$ secara berturut-turut.\r\n\r\n![Contoh Meriam 1](meriam1.png)\r\n\r\nKarena tidak ingin meriamnya dilihat oleh Turpa, Bocan berusaha menutup meriamnya dengan terpal. Karena uang Bocan sudah habis untuk membuat meriam, Ia ingin agar terpal yang digunakan untuk menutup meriam sependek mungkin. Akan tetapi, meriam yang dimiliki Bocan sangat sensitif sehingga bila tersentuh sedikit saja bisa membuatnya menjadi rusak dan akurasinya berkurang. Oleh karena itu Bocan meminta bantuan Anda untuk menjawab $Q$ buah pertanyaan. Setiap pertanyaan, Bocan akan memberikan dua buah bilangan yaitu $L$ dan $R$ kemudian menanyakan berapa banyak meriam yang akan rusak jika ia menutup meriam ke-$L$ hingga $R$ (inklusif) dengan terpal sependek mungkin.\r\n\r\nProses penutupan terpal pada meriam dilakukan dengan memasang terpal pada ujung-ujung meriam. Gambar dibawah ini menunjukkan cara penutupan meriam ke-$2$ hingga $5$.\r\n\r\n![Contoh Penutupan Meriam](meriam2.png)\r\n\r\n# Format Masukan\r\n\r\nBaris pertama dari masukan berisi sebuah bilangan bulat $N$ yang menyatakan banyaknya meriam yang dimiliki Bocan.\r\nBaris kedua berisi $N$ buah bilangan bulat. Bilangan ke-$i$ menyatakan nilai $H_i$ yaitu tinggi meriam ke-$i$.\r\nBaris ketiga berisi sebuah bilangan bulat $Q$ yang menyatakan banyaknya pertanyaan yang diajukan Bocan.\r\n$Q$ baris berikutnya berisi dua buah bilangan bulat $L$ dan $R$ seperti yang dijelaskan pada deskripsi soal.\r\n\r\n# Format Keluaran\r\n\r\nKeluaran berisi $Q$ baris. Baris ke-$i$ berisi sebuah bilangan bulat yang merupakan jawaban dari pertanyaan Bocan yang ke-$i$.\r\n\r\n# Contoh Masukan\r\n\r\n```\r\n7\r\n4 1 2 3 2 3 1\r\n2\r\n2 5\r\n1 7\r\n```\r\n\r\n# Contoh Keluaran\r\n\r\n```\r\n4\r\n3\r\n```\r\n\r\n# Penjelasan\r\n\r\nMeriam pada contoh tersebut dapat digambarkan seperti berikut:\r\n\r\n![Konfigurasi Meriam Pada Contoh](meriam_sample1.png)\r\n\r\nUntuk pertanyaan pertama, meriam ke-dua, tiga, empat dan lima akan terkena terpal.\r\nSedangkan untuk pertanyaan ke-dua, meriam pertama ke-enam dan ke-tujuh akan terkena terpal.\r\nPerhatikan gambar berikut:\r\n\r\n![Penutupan Meriam](meriam_sample2.png)\r\n\r\n# Batasan\r\n\r\n- $2 \\leq N \\leq 50.000$\r\n- $1 \\leq Q \\leq 50.000$\r\n- $1 \\leq H_i \\leq 100.000$\r\n- $1 \\leq L_i < R_i \\leq N$',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 9,
  disabled: true,
}

export const problem10: Problem = {
  id: '10',
  shortId: 'J',
  name: 'Hari Gajian',
  statement:
    '# Deskripsi\r\n\r\nBocan bekerja di PT. Humble dengan $N$ buah karyawan. Para karyawan dinomori dari $0$ sampai $N-1$. Perusahaan Bocan unik, karena semua karyawannya rendah hati, sampai-sampai seorang bos tidak mau gajinya lebih banyak dari gaji anak buahnya.\r\n\r\nDi bulan Februari ini, PT. Humble mendapat keuntungan $X$ gold, mata uang setempat. Keuntungan ini dibagi sepenuhnya pada seluruh karyawan di PT. Humble. Tentukan berapa kemungkinan pembagian gaji yang mungkin. Dua pembagian gaji dikatakan berbeda jika setidaknya ada satu orang yang mendapat gaji berbeda.\r\n\r\nMata uang gold berupa bilangan bulat dan tidak mengenal pecahan, sehingga $X$ beserta pembagiannya berupa bilangan bulat.\r\n\r\n# Format Masukan\r\n\r\nBaris pertama berisi bilangan $N$ dan $X$.\r\n$N-1$ baris berikutnya masing-masing terdiri dari sebuah bilangan bulat, yang mana baris ke-$i$ berisi $p_{i}$, yang menyatakan bos dari karyawan ke-$i$. Bos besar perusahaan PT. Humble dianggap sebagai karyawan nomor $0$.\r\n\r\n# Format Keluaran\r\n\r\nSatu baris berisi jumlah kemungkinan pembagian gaji yang mungkin, dimodulo $10^9+7$.\r\n\r\n# Contoh Masukan\r\n\r\n```\r\n3 3\r\n0\r\n0\r\n```\r\n\r\n# Contoh Keluaran\r\n\r\n```\r\n5\r\n```\r\n\r\n# Batasan\r\n\r\n- $1 \\leq N, X \\leq 5.000$\r\n- $0 \\leq p_{i} < i$, untuk $1 \\leq i < N$\r\n\r\n# Penjelasan\r\n\r\nSemua kemungkinan pembagian gaji yang mungkin:\r\n\r\n![](sample1.jpg)',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 10,
  disabled: true,
}

export const problem11: Problem = {
  id: '11',
  shortId: 'K',
  name: 'Meretas Password Wifi',
  statement:
    '# Deskripsi\n\nBocan sedang mencoba meretas password wifi temannya dengan *bruteforce*. Agar dapat melakukan percobaan password secara paralel, Bocan menggunakan $N$ buah laptop yang dinomori dari $1$ sampai $N$. Program di tiap laptop tidak dijalankan pada waktu yang bersamaan. Kecepatan masing-masing laptop berbeda. Tepatnya, laptop ke-$i$ dapat mencoba $d_i$ password tiap detik.\n\nSetelah beberapa waktu, Bocan sadar dia tidak mencatat waktu eksekusi yang sudah dilalui masing-masing laptop. Karena itu, Ia mereset stopwatchnya, kemudian mencatat jumlah password yang sudah dicoba oleh masing-masing laptop. Jumlah password yang telah dicoba pada laptop ke-$i$ dinyatakan sebagai $s_i$. Dengan kata lain, $s_i$ menyatakan jumlah password yang telah dicoba oleh laptop ke-$i$ pada detik ke-$0$. \n\nBocan memiliki $Q$ buah pertanyaan. Pada pertanyaan ke-$i$, Ia ingin tahu berapakah jumlah password terbanyak yang telah dicoba oleh masing-masing laptop, untuk laptop bernomor $l_i$ sampai $r_i$ (inklusif) pada detik ke-$t_i$. Diasumsikan program Bocan belum selesai pada $t_i$ untuk tiap $i$.\n\n# Format Masukan\n\nBaris pertama berisi sebuah bilangan bulat $N$.\n$N$ baris berikutnya berisi dua buah bilangan bulat dengan baris ke-$i$ menyatakan nilai $s_i$ dan $d_i$.\nPada baris berikutnya terdapat bilangan $Q$ menyatakan jumlah pertanyaan.\n$Q$ baris berikutnya berisi pertanyaan, dengan setiap baris berisi tiga buah bilangan bulat $l_i$, $r_i$, dan $t_i$ seperti yang dijelaskan pada deskripsi soal.\n\n# Format Keluaran\n\nKeluarkan $Q$ baris dengan baris ke-$i$ berisi jawaban pertanyaan ke-$i$ menyatakan jumlah password terbanyak yang sudah dicoba laptop bernomor antara $l_i$ sampai $r_i$ (inklusif) pada detik ke-$t_i$.\n\n# Contoh Masukan\n\n```\n4\n30 2\n15 4\n10 4\n1 5\n3\n1 4 1\n2 4 1\n1 4 20\n```\n\n# Contoh Keluaran\n\n```\n32\n19\n101\n```\n\n# Batasan\n\n- $1 \\leq N, Q \\leq 10^5$\n- $1 \\leq l_i \\leq r_i \\leq N$\n- $1 \\leq s_i, d_i, t_i \\leq 10^9$\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 11,
  disabled: true,
}

export const problem12: Problem = {
  id: '12',
  shortId: 'L',
  name: 'Jomblo Dan Taken',
  statement:
    '# Deskripsi\r\n\r\nAda dua tipe orang di dunia ini, yang *taken* dan yang *jomblo*. Bocan yang *jomblo* sangat kesal jika melihat orang yang *taken*. Karena tidak mau Bocan sedih, Turpa ingin membunuh semua orang *taken* dengan bom. Namun, Turpa hanya mempunyai satu bom.\r\n\r\nDi ITB, ada $N$ orang *taken* dan $M$ orang *jomblo*. Mereka semua berada di kampus ITB yang dipetakan ke titik koordinat kartesian. Meskipun semua orang *taken* harus musnah, Turpa tidak mau menumpahkan darah orang *jomblo*. Untuk itu, ia dapat memaksa beberapa orang pindah ke koordinat lain. Namun agar tidak dicurigai, ia ingin memindahkan orang sesedikit mungkin.\r\n\r\nTurpa ingin tahu berapa jumlah orang minimum yang perlu dipindahkan supaya terdapat lokasi bom dan semua orang *taken* tidak berada di luar radius bom, serta semua orang *jomblo* tidak berada di dalam radius bom. Orang yang ada tepat di radius bom hanya akan terbunuh bila ia *taken*. Ingat jika radius bom Turpa sangat fleksibel dan dapat ia ubah sesuka hati. Sebelum Turpa melakukan pemindahan, tidak ada dua orang yang berada pada posisi yang sama. Setiap orang dapat dipindahkan ke posisi manapun, posisi pemindahan tidak harus bilangan bulat dan setelah pemindahan bisa saja terdapat dua orang dengan posisi yang sama.\r\n\r\n# Format Masukan\r\n\r\nBaris pertama berisi dua buah bilangan bulat $N$ dan $M$.\r\n$N$ baris selanjutnya berisi 2 bilangan bulat $x$ dan $y$, yang menyatakan koordinat orang \\textit{taken}.\r\n$M$ baris selanjutnya berisi 2 bilangan bulat $x$ dan $y$, yang menyatakan koordinat orang \\textit{jomblo}.\r\n\r\n# Format Keluaran\r\n\r\nSebuah baris berisi bilangan, jumlah orang minimum yang dipindahkan supaya memenuhi kriteria Turpa.\r\n\r\n# Contoh Masukan 1\r\n\r\n```\r\n3 1\r\n0 0\r\n10 0\r\n5 10\r\n5 5\r\n```\r\n\r\n# Contoh Keluaran 1\r\n\r\n```\r\n1\r\n```\r\n\r\n# Contoh Masukan 2\r\n\r\n```\r\n2 2\r\n0 1\r\n0 -1\r\n1 0\r\n-1 0\r\n```\r\n\r\n# Contoh Keluaran 2\r\n\r\n```\r\n0\r\n```\r\n\r\n# Batasan\r\n\r\n- $0 \\leq N,M \\leq 200$\r\n- $-10^3 \\leq x, y \\leq 10^3$\r\n- Pada awalnya tidak ada dua orang yang berada pada posisi yang sama.\r\n\r\n# Penjelasan\r\n\r\nContoh letak bom untuk contoh masukan 1:\r\n\r\n![](sample1.jpg)\r\n\r\nKita dapat menaruh bom supaya memiliki ledakan seperti gambar (lingkaran abu-abu) dan memindahkan titik di $(10,0)$ ke titik berwarna hijau.\r\nAda beberapa cara lain, namun semuanya butuh memindahkan tidak kurang dari $1$ titik.\r\n\r\nContoh letak bom untuk contoh masukan 2:\r\n\r\n![](sample2.jpg)\r\n\r\nKita hanya dapat menaruh bom di $(0,0)$ dengan radius $1$ satuan. Perhatikan bahwa orang yang ada di garis radius boleh *jomblo* dan boleh *taken*.',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 12,
  disabled: false,
}

export const problem13: Problem = {
  id: '13',
  shortId: 'M',
  name: 'Random Generator',
  statement:
    '# Deskripsi\n\nBocan iseng membuat formula untuk random generator buatannya, yakni menggunakan relasi rekurens:\n$$\na_n=\\begin{cases}\n    (p \\times a_{n-1} + q) \\mod m, & \\text{jika $n>0$}.\\\\\n    c, & \\text{jika $n=0$}.\n\\end{cases}\n$$\n\nKini, Bocan memiliki bilangan bulat $x$. Ia penasaran, berapakah nilai $n$ terkecil agar $a_n = x$?\n\n# Format Masukan\n\nBaris pertama berisi tiga bilangan bulat $p$, $q$, dan $c$ dipisahkan dengan spasi.\nBaris kedua berisi dua bilangan bulat $m$ dan $x$.\n\n# Format Keluaran\n\nKeluarkan satu baris berisi bilangan bulat $n$ terkecil yang mungkin. Jika tidak ada n yang memenuhi, keluarkan $-1$.\n\n# Contoh Masukan 1\n\n```\n2 1 5\n7 2\n```\n\n# Contoh Keluaran 1\n\n```\n2\n```\n\n# Contoh Masukan 2\n\n```\n2 0 2\n7 3\n```\n\n# Contoh Keluaran 2\n\n```\n-1\n```\n\n# Contoh Masukan 3\n\n```\n7 9 5\n11 5\n```\n\n# Contoh Keluaran 3\n\n```\n0\n```\n\n# Batasan\n\n- $2 \\leq m \\leq 2 \\times {10}^9$\n - $0 \\leq p, q, c, x < m$\n - $m$ dijamin merupakan bilangan prima\n\n# Penjelasan\n\nPada contoh pertama, barisan yang terbentuk adalah $5, 4, 2, 5, 4,$ dst. Pada $n = 2$, $a_n = 2$. Tidak ada nilai $n$ lebih kecil yang memenuhi.\nPada contoh kedua, tidak ada $n$ yang memenuhi.\nPada contoh ketiga, nilai $c$ sudah memenuhi.\n',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 13,
  disabled: true,
}

export const problem14: Problem = {
  id: '14',
  shortId: 'N',
  name: 'Kotak Cokelat',
  statement:
    '# Deskripsi\r\n\r\n![http://www.lazybite.com/82-large_default/signature-wooden-chocolate-box.jpg](box-of-chocolate.jpg)\r\n\r\nBocan suka cokelat. Turpa, sebagai fans berat Bocan, memberi hadiah sekotak cokelat berukuran $N \\times N$. Tiap cokelat berada pada koordinat $(x,y)$ yang berbeda. Supaya tidak cepat habis, Bocan ingin bermain-main terlebih dahulu dengan cokelatnya.\r\n\r\nBocan melakukan $Q$ aksi. Tiap aksi, ia dapat:\r\n\r\n- mengambil cokelat di koordinat $(x,y)$.\r\n- menaruh cokelat di koordinat $(x,y)$.\r\n- menghitung cokelat di segiempat yang kedua ujungnya koordinat $(x_1,y_1)$ dan $(x_2,y_2)$\r\n\r\nSetiap koordinat di kotak cokelat hanya dapat menampung $1$ buah cokelat.\r\n\r\n# Format Masukan\r\n\r\nBaris pertama berisi dua buah bilangan bulat $N$ dan $Q$.\r\n$Q$ baris berikutnya berisi salah satu dari:\r\n\r\n- 1 $x$ $y$, menaruh cokelat di $(x,y)$\r\n- 2 $x$ $y$, mengambil cokelat di $(x,y)$\r\n- 3 $x_{1}$ $y_{1}$ $x_{2}$ $y_{2}$, menghitung cokelat di segiempat $(x_1,y_1)$ hingga $(x_2,y_2)$\r\n\r\nUntuk setiap aksi ambil ``x y``, dijamin ada cokelat di koordinat $(x,y)$. Begitu pula untuk setiap aksi taruh ``x y``, dijamin tidak ada cokelat di koordinat $(x,y)$.\r\n\r\n# Format Keluaran\r\n\r\nUntuk tiap query hitung, keluarkan sebuah baris berisi jumlah cokelat di segiempat yang kedua ujungnya $(x_1,y_1)$ dan $(x_2,y_2)$.\r\n\r\n# Contoh Masukan\r\n\r\n```\r\n10 7\r\n1 1 1\r\n1 2 1\r\n1 3 3\r\n1 6 5\r\n3 1 1 5 4\r\n2 2 1\r\n3 1 1 4 5\r\n```\r\n\r\n# Contoh Keluaran\r\n\r\n```\r\n3\r\n2\r\n```\r\n\r\n# Batasan\r\n\r\n- $1 \\leq N \\leq 10^9$\r\n- $1 \\leq Q \\leq 10^5$\r\n- $1 \\leq x, y, x_1, y_1, x_2, y_2 \\leq N$\r\n- $x_1 \\leq x_2$ dan $y_1 \\leq y_2$\r\n\r\n# Penjelasan\r\n\r\nSebelum aksi hitung pertama, sudah ada $4$ cokelat, di $(1,1)$, $(2,1)$, dan $(3,3)$, dan $(6,5)$. Tiga cokelat pertama berada di dalam segiempat yang ujungnya $(1,1)$ dan $(5,4)$, sehingga dikeluarkan $3$.\r\n\r\nSebelum aksi hitung kedua, cokelat pada koordinat $(2,1)$ diambil sehingga tersisa $2$ cokelat pada hasil perhitungan.',
  type: ProblemType.PROBLEM_TYPE_BATCH,
  timeLimit: 10000.0,
  tolerance: 0.75,
  memoryLimit: 536870912.0,
  outputLimit: 536870912.0,
  order: 14,
  disabled: false,
}

export const problems = [
  problem1,
  problem2,
  problem3,
  problem4,
  problem5,
  problem6,
  problem7,
  problem8,
  problem10,
  problem11,
  problem12,
  problem13,
  problem14,
]

export const problemsMap: { [contestId: string]: Problem[] } = {
  [ContestArkav4Qual.id]: lodash.cloneDeep(problems.slice(0, 6)),
  [ContestArkav4Final.id]: lodash.cloneDeep(problems.slice(6)),
  [ContestArkav5Qual.id]: lodash.cloneDeep(problems.slice(0, 6)),
  [ContestArkav5Final.id]: lodash.cloneDeep(problems.slice(6)),
}
