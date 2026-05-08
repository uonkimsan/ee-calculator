/**
 * @master-calcform
 * @V3.1
 * បន្ថែមមុខងារ Validation ដើម្បីទប់ស្កាត់ការគណនាពេលបញ្ចូលលេខខុសលក្ខខណ្ឌ
 */

const Calculator = {
    setFocus: () => {
        const resCard = document.getElementById('result-card');
        if (resCard) resCard.style.display = 'none';

        setTimeout(() => {
            const inputX1 = document.getElementById('x1');
            if (inputX1) inputX1.focus();
            if (typeof OnPhaseChange === "function") OnPhaseChange();
        }, 10);
    },

    roundResult: (val) => {
        if (isNaN(val) || !isFinite(val)) return "0.00";
        return parseFloat(val).toFixed(2);
    },

    calc3: () => {
        const form = document.forms['calcform'];
        if (!form) return;

        const x1 = parseFloat(form.x1.value);
        const x2 = parseFloat(form.x2.value);

        // ១. ត្រួតពិនិត្យតម្លៃ Current និង Voltage
        if (isNaN(x1) || isNaN(x2)) {
            alert("សូមបញ្ចូលលេខឱ្យបានត្រឹមត្រូវ!");
            return;
        }

        // ២. ហៅមុខងារ convert និងចាប់យកតម្លៃត្រឡប់មកវិញ
        // ប្រសិនបើ convert() បញ្ជូនតម្លៃ null មកវិញ មានន័យថាទិន្នន័យបញ្ចូលខុស (ដូចជា PF > 1)
        let rawResult = 0;
        if (typeof convert === "function") {
            rawResult = convert(x1, x2);
            if (rawResult === null) return; // បញ្ឈប់ការគណនាភ្លាមៗ
        } else {
            rawResult = (x1 * x2) / 1000;
        }

        // ៣. បង្ហាញលទ្ធផល
        const finalResult = Calculator.roundResult(rawResult);
        const resCard = document.getElementById('result-card');
        const resVal = document.getElementById('res-val');

        if (resCard && resVal) {
            resCard.style.display = 'block';
            resVal.innerText = finalResult;
            resCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
};

const calc3 = () => Calculator.calc3();
const setfocus = () => Calculator.setFocus();

window.onload = () => {
    if (typeof OnPhaseChange === "function") OnPhaseChange();
};