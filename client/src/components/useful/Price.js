export const getPriceDiscounted = (price, percentage) => {
    let discount = (price * percentage) / 100;
    return (price - discount);
}

export const addIVA = (price, tax) => {
    let IVA = (price * tax) / 100;
    return (price + IVA);
}

export const RemoveIVA = (price, tax) => {
    let IVA = (price * tax) / 100;
    return (price - IVA);
}