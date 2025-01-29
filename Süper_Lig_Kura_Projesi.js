// Takımlar
const superLigTeams = [
    "Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor", "Başakşehir",
    "Adana Demirspor", "Konyaspor", "Kayserispor", "Antalyaspor",
    "Gaziantep FK", "Alanyaspor", "Hatayspor", "Sivasspor",
    "Ankaragücü", "İstanbulspor", "Pendikspor", "Samsunspor",
    "Kasımpaşa", "Fatih Karagümrük"
];

// takımları karan fonksiyon
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

//takımların karılmış hali
const mixedTeams = shuffleArray(superLigTeams)

// Tüm kombinasyonlar
let combinations = [];

// 342 kombinasyon
for (let i = 0; i < superLigTeams.length; i++) {
    for (let j = 0; j < superLigTeams.length; j++) {
        if (i != j) {
            combinations.push(superLigTeams[i] + " vs " + superLigTeams[j]);
        }

    }
}

// Array'den kurada çekilen maçı çıkarmak
function removeNumber(arr, n) {
    arr.splice(n, 1);
    return arr;
}

// Tek bir haftalık kura çekme
function tek_kura(availableCombinations, oynayanTakimlar, mixedTeams, i) {
    let den = 0;
    let selectedMatch = false;

    while (den < 500) {
        den++;
        let num = Math.floor(Math.random() * availableCombinations.length);

        const match = availableCombinations[num];
        const teams = match.split(" vs ");

        const team1 = teams[0];
        const team2 = teams[1];

        // Eğer her iki takım da bu hafta daha önce eşleşmemişse
        if (!oynayanTakimlar.has(team1) && !oynayanTakimlar.has(team2) && !(team1 == mixedTeams[i]) && !(team2 == mixedTeams[i])) {
            oynayanTakimlar.add(team1);
            oynayanTakimlar.add(team2);
            selectedMatch = match;
            availableCombinations = removeNumber(availableCombinations, num);
            for (let i = 0; i < availableCombinations.length; i++) {
                if (availableCombinations[i] == team2 + " vs " + team1) {
                    availableCombinations = removeNumber(availableCombinations, i)
                }
            }
            return match;
        }
    }

    return selectedMatch;
}

// Haftalık kura oluşturma
function haftalik_kura(n) {

    const haftalikKuralar = [];
    const oynayanTakimlar = new Set();

    const backupCombinations = [...combinations];  // Yedekleme

    for (let i = 0; i < 9; i++) {
        const match = tek_kura(combinations, oynayanTakimlar, superLigTeams, n);


        if (match) {
            haftalikKuralar.push(match);
        } else {
            combinations = backupCombinations;  // Başarısız durumda kombinasyonları geri yükle
            return haftalik_kura(n);  // Haftayı yeniden çek
        }
    }

    return haftalikKuralar;
}

// Fikstür oluşturma
function fikstur_olustur() {
    const fullKura = [];

    for (let i = 0; i < 19; i++) {  // 19 hafta

        const weeklyKura = haftalik_kura(i);
        fullKura.push(weeklyKura);

    }

    return fullKura;
}

// Fikstürün oluşturulması
const fikstur = fikstur_olustur();

// fikstürün print edilmesi
fikstur.forEach((hafta, index) => {
    console.log(`Hafta ${index + 1}:`);
    console.log("Bay Geçen Takım:", superLigTeams[index])
    hafta.forEach(match => console.log(match));
    console.log('');

    //eğer index 18 ise ilk yarıyı bitirmişizdir, ilk yarıki maçların simetriği yapılacak
    if (index == 18) {
        fikstur.forEach((hafta, index) => {
            console.log(`Hafta ${index + 20}:`);
            console.log("Bay Geçen Takım:", superLigTeams[index])
            for (let i in hafta) {
                const reversed_match = hafta[i];
                const teams = reversed_match.split(" vs ");

                const team1 = teams[0];
                const team2 = teams[1];
                console.log(team2, "vs", team1)
            }
            //hafta.forEach(match => console.log(match));
            console.log('');
        })
    }
});

