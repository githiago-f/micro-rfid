export function render(page, options) {
    return (req, res) => res.render(page, {...options, ...req.query});
}
