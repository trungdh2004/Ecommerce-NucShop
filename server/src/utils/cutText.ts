import cheerio from "cheerio"

export const truncateSentence = (sentence: string, maxLength: number) => {
    let words = sentence.split(' ');
    let truncatedSentence = '';
    for (let word of words) {
        if (truncatedSentence.length + word.length + 1 <= maxLength) {
            if (truncatedSentence.length > 0) {
                truncatedSentence += ' ';
            }
            truncatedSentence += word;
        } else {
            break;
        }
    }

    return truncatedSentence;
}

export const trunTextHtmlConvers = (sentence:string, maxLength:number) => {
    const $ = cheerio.load(sentence || "");
    const content = $.text();
    let words = content.split(' ');
    let truncatedSentence = '';
    for (let word of words) {
        if (truncatedSentence.length + word.length + 1 <= maxLength) {
            if (truncatedSentence.length > 0) {
                truncatedSentence += ' ';
            }
            truncatedSentence += word;
        } else {
            break;
        }
    }

    return truncatedSentence;
}