import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaYoutube } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="top">
          <div className="social-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>

          {/* <div className="nav-links">
            <Link to="/advertise">Liên hệ quảng cáo</Link>
            <Link to="/contact">Liên hệ với chúng tôi</Link>
            <Link to="/admin">Quản trị viên</Link>
            <Link to="/media">Media sales</Link>
            <Link to="/legal">Pháp lý</Link>
            <Link to="/privacy-settings">Cài đặt riêng tư</Link>
            <Link to="/privacy">Trung tâm bảo mật</Link>
            <Link to="/sitemap">Site map</Link>
            <Link to="/careers">Careers</Link>
          </div> */}
        </div>

        <div className="bottom">
          <div className="sites">
            <h4>Bất động sản khu vực quốc tế</h4>
            <div className="site-links">
              <a href="#">Ấn Độ</a>
              <span>|</span>
              <a href="#">Hoa kỳ</a>
              <span>|</span>
              <a href="#">Bất động sản quốc tế khác</a>
            </div>
          </div>

          <div className="sites">
            <h4>Đối tác</h4>
            <div className="site-links">
              <a href="#">news.com.au</a>
              <span>|</span>
              <a href="#">foxsports.com.au</a>
              <span>|</span>
              <a href="#">Mansion Global</a>
              <span>|</span>
              <a href="#">askizzy.org.au</a>
              <span>|</span>
              <a href="#">makaan.com</a>
              <span>|</span>
              <a href="#">proptiger.com</a>
            </div>
          </div>

        </div>

        <div className="branches">
          <h3>Chi nhánh của LuxuryEstateApp</h3>

          <div className="branch-list">
            <div className="branch">
              <h4>Chi nhánh TP. Hồ Chí Minh</h4>
              <p>Tầng 1, toà B, Đại học Công nghệ Thông tin, ĐHQG TP.HCM, Đường Hàn Thuyên, khu phố 6, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh</p>
              <p>Hotline: 1900 6969 - Mobile: 0904 6969 69</p>
            </div>

            <div className="branch">
              <h4>Chi nhánh Hà Nội</h4>
              <p>Tầng 4, tòa nhà ACB, số 12 Hoàng Hoa Thám, Hà Nội</p>
              <p>Hotline: 1900 1881 - Mobile: 0904 509 293</p>
            </div>


          </div>

          <div className="legal">
            <p>Giấy ĐKKD số 0104630479 do Sở KHĐT TP Hà Nội cấp lần đầu ngày 02/06/2010</p>
            <p>Giấy phép thiết lập trang thông tin điện tử tổng hợp trên mạng số 191/GP-TTĐT do Sở TTTT Hà Nội cấp ngày 31/08/2023</p>
            <p>Quy chế, quy định giao dịch có hiệu lực từ 08/08/2023</p>
            <p>Ghi rõ nguồn "LuxuryEstateApp.com" khi phát hành lại thông tin từ website này.</p>
            <p>LuxuryEstateApp thuộc quyền sở hữu và vận hành bởi Nhom4 Team Ltd © Nhom4 Team Ltd.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;