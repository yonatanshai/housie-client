import cc from 'currency-codes';

export const useCurrency = () => {
    const generateCurrencyCodes = (locale) => {
        return cc.codes().map(c => {
            const code = cc.code(c);
            return {
                code: code.code,
                currency: code.currency,
                number: code.number,
                formattedCurrency: Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: code.code
                }).formatToParts().find(part => part.type === 'currency')
            }
        }).sort((a, b) => {
            if (a.currency < b.currency) {
                return -1;
            } else if (a.currency > b.currency) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    return {
        generateCurrencyCodes
    }
}