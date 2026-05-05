/**
 * @file master-calcform.js
 * @description Master Electrical Calculation Library for GitHub
 * @version 2.0.0
 * @author MR.SAN
 */

/**
 * Master Calculator JS - Modern Version (ES6+)
 */

const Calculator = {
    // កំណត់ Focus ទៅកាន់ Input x
    setFocus: () => {
        const inputX = document.querySelector('input[name="x"]');
        if (inputX) inputX.focus();
    },

    // មុខងារគណនាទូទៅ
    calculate: (type = 'calc3') => {
        const form = document.forms['calcform'];
        if (!form) return;

        let result;
        const x1 = parseFloat(form.x1?.value) || 0;
        const x2 = parseFloat(form.x2?.value) || 0;
        const x3 = parseFloat(form.x3?.value) || 0;

        // ជ្រើសរើសប្រភេទគណនាតាម Argument
        switch (type) {
            case 'calc3':
                result = convert(x1, x2);
                break;
            case 'calc4':
                result = convert(x1, x2, x3);
                break;
            default:
                const x = parseFloat(form.x?.value) || 0;
                result = convert(x);
        }

        // បង្ហាញលទ្ធផល និងធ្វើការបង្គត់
        if (form.y) {
            form.y.value = Calculator.roundResult(result);
        }
    },

    // មុខងារបង្គត់លេខទំនើប (ជំនួសឱ្យមុខងារ removeAt ស្មុគស្មាញ)
    roundResult: (val) => {
        if (isNaN(val)) return "0";
        const num = parseFloat(val);
        // បង្គត់យក ១០ ខ្ទង់ និងលុបលេខ ០ ដែលមិនចាំបាច់នៅខាងចុង
        return Number(num.toPrecision(10)).toString();
    }
};

// បង្កើត Alias ដើម្បីឱ្យត្រូវជាមួយកូដចាស់ (Backward Compatibility)
const calc3 = () => Calculator.calculate('calc3');
const calc4 = () => Calculator.calculate('calc4');
const setfocus = () => Calculator.setFocus();