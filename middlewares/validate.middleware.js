const { object } = require("yup")
module.exports = (req, res, next) => {
    req.validate = async (data, rules = {}) => {
        const schema = object(rules);
        try {
            const body = await schema.validate(data, {
                abortEarly: false,
            });
            return body;
        } catch (e) {
            const errors = Object.fromEntries(
                e.inner.map((item) => [item.path, item.message]),
            );
            req.flash("errors", errors);
            req.flash("old", data);
        }
    }
    const errors = req.flash("errors");
    req.errors = errors.length ? errors[0] : {};
    const old = req.flash("old");
    const msg = req.flash("msg");
    const error = req.flash("error");
    req.old = old.length ? old[0] : {};
    req.msg = msg.length ? msg[0] : '';
    req.error = error.length ? error[0] : '';
    next();
}