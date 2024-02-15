const passport = require("passport");
const { string } = require("yup");
module.exports = {
    index: (req, res, next) => {
        if (req.user) {
            return res.redirect("/")
        }
        const error = req.flash("error");
        res.render("auth/login", { error, req });
    },
    handleLogin: async (req, res, next) => {
        const validate = await req.validate(req.body, {
            email: string()
                    .required("Mật khẩu không được để trống!")
                    .test("email-regex", "Email không đúng định dạng!", (value) => {
                        const emailRegex = /^(([^<>()[\]\.,;:\s@"]+(.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
                        if (value === process.env.USER_ADMIN && req.body.password === process.env.PASSWORD_ADMIN) {
                            return true
                        } else if (emailRegex.test(value)) {
                            return true
                        }
                        return false;
                    }),
            password: string()
                    .required("Mật khẩu không được để trống!")
                    .test("password-check", "Mật khẩu phải có ít nhất 8 ký tự", (value) => {
                        if (req.body.email === process.env.USER_ADMIN && value === process.env.PASSWORD_ADMIN) {
                            return true
                        } else if (value.toString() && value.length > 7) {
                            return true
                        }
                        return false
                    })
        }) 
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!validate) {
                req.flash('old', { email: req.body.email });
                return res.redirect('/auth/login');
            }
            if (!user) {
                // Xác thực thất bại, lưu trữ giá trị email đã nhập và thông báo lỗi
                req.flash('error', info?.message);
                req.flash('old', { email: req.body.email }); // Lưu lại giá trị email đã nhập
                return res.redirect('/auth/login');
            }
            // Xác thực thành công, đăng nhập người dùng và chuyển hướng đến trang thành công
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },
    handleLoginGoogle: (req, res, next) => {
        passport.authenticate("google", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                // Xác thực thất bại, lưu trữ giá trị email đã nhập và thông báo lỗi
                req.flash('error', info.message);
                req.flash('old', { email: req.body.email }); // Lưu lại giá trị email đã nhập
                return res.redirect('/auth/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }
}