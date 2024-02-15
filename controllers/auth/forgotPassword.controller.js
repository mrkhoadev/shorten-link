const { string } = require("yup");
const { User, HistorySendMail } = require("../../models/index");
const sendMail = require("../../utils/mail");
const md5 = require('md5');

module.exports = {
    index: (req, res, next) => {
        if (req.user) {
            return res.redirect("/")
        }
        res.render("auth/forgotPassword", { req });
    },
    handleForgotPassword: async (req, res, next) => {
        try {
            const validate = await req.validate(req.body, {
                email: string()
                    .required("Email không được để trống!")
                    .email("Email không đúng định dạng!")
            })
            if (validate) {
                const data = await User.findOne({
                    where: { email: validate.email }
                })
                if (data) {
                    await HistorySendMail.destroy({
                        where: { user_id: data.id }
                    })
                    const currentTime = new Date();
                    const hashedData = md5(currentTime.getTime() + Math.random());
                    const body = {
                        to_email: validate.email,
                        title: "Lấy lại mật khẩu",
                        content: `Reset mật khẩu: <a href="${process.env.HOSTING}/auth/reset-password/${hashedData}">${process.env.HOSTING}/auth/reset-password/${hashedData}</a>`,
                        token: hashedData,
                        user_id: data.id,
                        token_expiration: new Date(currentTime.getTime() + 15 * 60000),
                    }
                    const result = await HistorySendMail.create(body);
                    if (result) {
                        const info = await sendMail(
                            body.to_email,
                            body.title,
                            body.content,
                        )
                        if (info) {
                            req.flash("msg", "Thành công! Hãy kiểm tra hòm thư của bạn trước khi thư hết hiệu lực (15 phút)!");
                        } else {
                            req.flash("error", "Lỗi!!! vui lòng thử lại sau ít phút!");
                        }
                    }
                } else {
                    req.flash("error", "Email không tồn tại!");
                }
            }
        } catch (error) {
            return next(error)
        }
        return res.redirect("/auth/forgot-password")    
    }
}