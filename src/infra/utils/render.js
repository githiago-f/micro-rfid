export function render(page, options) {
    return (_, res) => res.render(page, options);
}
