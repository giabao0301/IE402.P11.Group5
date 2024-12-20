import { useState } from "react";
import "./Contact.scss";

function ContactPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        telephone: "",
        email: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <div className="contactPage">
            <div className="left">
                <h1>Chúng tôi rất mong nhận được phản hồi từ bạn, dù bạn đang có nhu cầu bán hay mua bất động sản, hay đơn giản chỉ cần lời khuyên!</h1>
                <p>Hãy sử dụng biểu mẫu này để yêu cầu thông tin chi tiết về bất động sản hoặc đăng ký để được gọi lại. Liên hệ với chúng tôi ngay hôm nay!</p>

                <div className="contactInfo">
                    <div className="item">
                        <img src="/phone.png" alt="" />
                        <span>01506 637553</span>
                    </div>
                    <div className="item">
                        <img src="/email.png" alt="" />
                        <span>LuxuryEstates@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="formCard">
                    <p>Vui lòng điền thông tin và yêu cầu của bạn vào biểu mẫu bên dưới.</p>

                    <form onSubmit={handleNext}>
                        <div className="formRow">
                            <div className="formGroup">
                                <label>TÊN *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Vui lòng nhập tên của bạn"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="formGroup">
                                <label>HỌ *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Vui lòng nhập họ của bạn"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="formGroup">
                            <label>SỐ ĐIỆN THOẠI *</label>
                            <input
                                type="tel"
                                name="telephone"
                                placeholder="Vui lòng nhập số điện thoại"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label>EMAIL *</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Vui lòng nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label>MESSAGE</label>
                            <textarea
                                name="message"
                                placeholder="Vui lòng nhập nội dung"
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                required
                            />
                        </div>
                        <button type="submit">GỬI</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;