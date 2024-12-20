import { useState } from "react";
import "./Agent.scss";

function AgentsPage() {
  const [featuredAgents] = useState({
    hcm: [
      {
        id: 1,
        name: "Nguyễn Hồng Hạnh",
        category: "Quận 1, TP.Hồ Chí Minh",
        image: "/agents/hong_hanh.jpg",
      },
      {
        id: 2,
        name: "Cao Thế Thành",
        category: "Quận 2, TP.Hồ Chí Minh",
        image: "/agents/the_thanh.jpg",
      },
      {
        id: 3,
        name: "Nguyễn Công Phương",
        category: "Quận 3, TP.Hồ Chí Minh",
        image: "/agents/cong_phuong.jpg",
      },
    ],
    hanoi: [
      {
        id: 1,
        name: "Trịnh Yến Nhi",
        category: "Đống Đa, Hà Nội",
        image: "/agents/hong_hanh.jpg",
      },
      {
        id: 2,
        name: "Nguyễn Cao Cường",
        category: "Cầu Giấy, Hà Nội",
        image: "/agents/hong_hanh.jpg",
      },
      {
        id: 3,
        name: "Đỗ Như Yên",
        category: "Hoàng Mai, Hà Nội",
        image: "/agents/cong_phuong.jpg",
      },
    ],
    danang: [
      {
        id: 1,
        name: "Châu Vĩnh Phát",
        category: "Hải Châu, TP. Đà Nẵng",
        image: "/agents/hong_hanh.jpg",
      },
      {
        id: 2,
        name: "Nguyễn Thị Tố Minh",
        category: "Sơn Trà. TP. Đà Nẵng",
        image: "/agents/hong_hanh.jpg",
      },
      {
        id: 3,
        name: "Đinh Văn Tài",
        category: "Ngũ Hành Sơn, TP. Đà Nẵng",
        image: "/agents/cong_phuong.jpg",
      },
    ],
  });

  return (
    <div className="agentsPage">
      <div className="hero">
        <h1>Môi giới bất động sản</h1>
        <p>
          Chọn từ hơn 1000+ môi giới bất động sản tại để mua, bán hoặc cho thuê
          nhanh hơn và dễ dàng hơn.
        </p>
      </div>

      <div className="featuredAgents">
        <h2>Các môi giới bất động sản nổi bật của chúng tôi</h2>

        <div className="agentCategory">
          <div className="categoryHeader">
            <h3>Khu vực Hồ Chí Minh</h3>
            <button className="viewAll">View All</button>
          </div>
          <div className="agentGrid">
            {featuredAgents.hcm.map((agent) => (
              <div className="agentCard" key={agent.id}>
                <div className="agentInfo">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="agentPhoto"
                  />
                  <img
                    src={agent.logo}
                    alt={agent.company}
                    className="companyLogo"
                  />
                  <h4>{agent.name}</h4>
                  <p>{agent.company}</p>
                  <p className="category">{agent.category}</p>
                  {agent.subtext && <p className="subtext">{agent.subtext}</p>}
                </div>
                <button className="viewProfile">View Profile</button>
              </div>
            ))}
          </div>
        </div>

        <div className="agentCategory">
          <div className="categoryHeader">
            <h3>Khu vực Hà Nội</h3>
            <button className="viewAll">View All</button>
          </div>
          <div className="agentGrid">
            {featuredAgents.hanoi.map((agent) => (
              <div className="agentCard" key={agent.id}>
                <div className="agentInfo">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="agentPhoto"
                  />
                  <img
                    src={agent.logo}
                    alt={agent.company}
                    className="companyLogo"
                  />
                  <h4>{agent.name}</h4>
                  <p>{agent.company}</p>
                  <p className="category">{agent.category}</p>
                  {agent.subtext && <p className="subtext">{agent.subtext}</p>}
                </div>
                <button className="viewProfile">View Profile</button>
              </div>
            ))}
          </div>
        </div>

        <div className="agentCategory">
          <div className="categoryHeader">
            <h3>Khu vực Đà Nẵng</h3>
            <button className="viewAll">View All</button>
          </div>
          <div className="agentGrid">
            {featuredAgents.hcm.map((agent) => (
              <div className="agentCard" key={agent.id}>
                <div className="agentInfo">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="agentPhoto"
                  />
                  <img
                    src={agent.logo}
                    alt={agent.company}
                    className="companyLogo"
                  />
                  <h4>{agent.name}</h4>
                  <p>{agent.company}</p>
                  <p className="category">{agent.category}</p>
                  {agent.subtext && <p className="subtext">{agent.subtext}</p>}
                </div>
                <button className="viewProfile">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
