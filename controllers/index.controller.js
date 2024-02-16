const { string } = require("yup");
const { nanoid } = require("nanoid");
const { ShortenedLink } = require("../models/index");
const getTime = require("../helper/getTime");
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');

module.exports = {
    index: async (req, res, next) => {
        const data = await ShortenedLink.findAll({
            where: {
                user_id: req.user.id,
            },
            order: [
                ["id", "desc"],
                ["created_at", "desc"]
            ],
        })
        res.render("index", { req, user: req.user, data, hosting: process.env.HOSTING, getTime })
    },
    logout: (req, res, next) => {
        req.logout((err) => {});
        return res.redirect("/auth/login");
    },
    handleSubmit: async (req, res, next) => {
        try {
            const isValidate = await req.validate(req.body, {
                link: string()
                    .required("Dume phải có link mới rút gọn được chứ!")
                    .test("link-check", "Đường link không đúng định dạng!", (value) => {
                            if (!value) {
                                return true;
                            }
                            const regex = /^(https?:\/\/)?(www\.)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-?-]*)*\/?$/;
                            return regex.test(value);
                        }),
            })  
            if (isValidate) {
                const {
                    link,
                    password,
                    safeRedirectUrl,
                    customLinkID
                } = req.body;
                const url_id = customLinkID ? customLinkID : nanoid(8);

                const [shortened_links, created] = await ShortenedLink.findOrCreate({
                    where: { url_id: url_id },
                    defaults: {
                        url_id: url_id,
                        original_url: link,
                        password: password,
                        safe_redirect_url: safeRedirectUrl === "on" ? true : false,
                        user_id: req.user.id,
                    }
                  });
                if (created) {
                    req.flash("msg", "Đã thêm thành thành công!")
                } else {
                    req.flash("error", "ID đã tồn tại, vui lòng thử lại!")
                }
            }
            return res.redirect("/");
        } catch (error) {
            return next(error);
        }
    },
    handleDelete: async (req, res, next) => {
        const id = req.body.id;
        try {
            const deleted = await ShortenedLink.destroy({
                where: { id }
              });
              if (!deleted) {
                throw new Error("Lỗi không tìm thấy data cần xóa!")
              }
              req.flash("msg", "Xóa thành công!")
              return res.redirect("/");
        } catch (error) {
            return next(error);
        }
    },
    handleEdit: async (req, res, next) => {
        try {
            if (!req.body.password) {
                req.flash("error", "Lưu thất bại! Mật khẩu không được để trống")
            } else if (req.body.password?.length < 4) {
                req.flash("error", "Lưu thất bại! Mật khẩu phải tối thiểu 4 ký tự!")
            } else {
                const edit = await ShortenedLink.update({ 
                    password: req.body.password
                 }, {
                    where: {
                      id: req.body.id
                    }
                  });
                  if (!edit) {
                    throw new Error("Lỗi không tìm thấy data cần sửa!")
                  }
                  req.flash("msg", "Sửa thành công!")
            }
            
              return res.redirect("/");
        } catch (error) {
            return next(error);
        }
    },
    navigation: async (req, res, next) => {
        const url_id = req.params.id;
        const token = req.cookies[url_id]; 
        try {
            const data = await ShortenedLink.findOne({
                where: { url_id }
            })
            if (data) {
                req.session.shortLinkData = data;
                await ShortenedLink.update({
                    visit_count: +data.visit_count + 1,
                }, {
                    where: { id: data.id }
                });
                if (!data.safe_redirect_url) {
                    return res.redirect(data.original_url);
                }
                const qrCode = await QRCode.toString(data.original_url,{type:'svg'});
                if (data.safe_redirect_url && !data.password) {
                    req.isUnlock = true;
                } else if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const { url_id: decoded_url_id, exp } = decoded;
                    if (Date.now() <= exp * 1000 && decoded_url_id === url_id) {
                        req.isUnlock = true;
                    } else {
                        req.isUnlock = false;
                    }
                } else {
                    req.isUnlock = false;
                }
                return res.render("navigation", { req, user: req.user, hosting: process.env.HOSTING, data, qrCode })
            } 
            return res.status(404).send("<h1 style='text-align: center;'>Đường dẫn không tồn tại</h1>")
        } catch (error) {
            return next(error);
        }
    },
    handleNavigationLogin: async (req, res, next) => {
        const { url_id, password } = req.session.shortLinkData;
        try {
            const isValidate = await req.validate(req.body, {
                password: string()
                    .min(4, "Mật khẩu phải có tối thiểu 4 ký tự")
                    .required("Không được bỏ trống trường mật khẩu!"),
            });
            if (isValidate && req.body.password === password) {
                const newToken = jwt.sign({ url_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
                res.cookie(url_id, newToken, { maxAge: 900000, httpOnly: true }); 
            } else {
                req.flash("error", "Sai mật khẩu. Vui lòng thử lại!")
            }
            return res.redirect(`/${url_id}`);
        } catch (error) {
            return next(error)
        }
    }
}