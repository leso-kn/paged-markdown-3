/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

// Source: https://stackoverflow.com/a/9083076
function romanize (num)
{
    if (isNaN(num))
    { return ''; }

    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;

    while (i--) { roman = (key[+digits.pop() + (i * 10)] || "") + roman; }
    return Array(+digits.join("") + 1).join("M") + roman;
}

function formatNumber(num: number, style: string)
{
    switch (style)
    {
        case 'none':
        return '';

        case 'upper-roman':
        return romanize(num);

        case 'lower-roman':
        return romanize(num).toLowerCase();

        default:
        return num.toString();
    }
}

export { formatNumber }
