export function formatPrice (price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
}
export function formatPriceInput (price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + `, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };