const { User, HistorySendMail } = require("../../models/index");
const { string } = require("yup");
const bcrypt = require("bcrypt");

module.exports = {
    index: async (req, res, next) => {
        if (req.user) {
            return res.redirect("/")
        }
        const token = req.params.token;
        try {
            const history = await HistorySendMail.findOne({ 
                where: {
                    token
                }
            });
            if (!history || (history && Date.parse(history?.token_expiration) < Date.now())) {
                return res.status(400).send('<h1 class="text-center" style="text-align: center; margin-top: 100px;">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</h1>');
            } 
            req.session.historySendMailData = history;
            req.session.user_id = history.user_id;
        } catch (error) {
            return next(error)
        }
        res.render("auth/resetPassword", { req });
    },
    handleResetPassword: async (req, res, next) => {
        const token = req.params.token;
        try {
            if (Date.parse(req.session.historySendMailData?.token_expiration) < Date.now()) {
                return res.status(400).send('<h1 class="text-center" style="text-align: center; margin-top: 100px;">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</h1>');
            } 
            const validate = await req.validate(req.body, {
                password: string()
                    .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                    .required("Mật khẩu bắt buộc phải nhập")
                    .test("check-password", "Mật khẩu phải có ít nhất 1 ký tự đặc biệt, 1 ký tự viết hoa và 1 số!", async (value) => {
                        if (value === "" || value.length < 8) {
                            return true;
                        }
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                        if (passwordRegex.test(value)) {
                            return true;
                        }
                        return false;
                    }),
                rePassword: string()
                        .min(8, 'Mật khẩu phải tối thiếu 8 ký tự')
                        .required("Mật khẩu bắt buộc phải nhập")
                        .test("check-password", "Mật khẩu không khớp, vui lòng kiểm tra lại!", async (value) => {
                            if (value === "" || value.length < 8) {
                                return true;
                            }
                            if (value === req.body.password) {
                                return true;
                            }
                            return false;
                        }),
            });
            if (validate) {
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(validate.password, salt);
                const result = await User.update(
                    {
                        password: hashedPassword
                    },
                    {
                        where: {
                            id: req.session.user_id
                        }
                    }
                );
                if (result) {
                    const update = await HistorySendMail.update(
                        {
                            token_expiration: new Date()
                        },
                        {
                            where: {
                                id: req.session.historySendMailData?.id
                            }
                        }
                    )
                    req.flash("msg", "Đặt lại mật khẩu thành công!");
                    req.flash("old", { email: update?.email });
                    return res.redirect(`/auth/login`);
                }
                req.flash("error", "Đã xảy ra lỗi, vui lòng thử lại sau ít phút!");
            }
        } catch (error) {
            return next(error)
        }
        res.redirect(`/auth/reset-password/${token}`)
    }
}