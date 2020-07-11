export const fatorial = function(num: number) {
    if(num === 0) {
        return 1;
    }

    if(num < 0) {
        return 0;
    }

    return num * fatorial(num-1);
};